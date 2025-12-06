import type {ApiResponse, ConnectionConfig, Language} from '../types';
import { t } from '../i18n';

/**
 * 执行远程命令（通过本地代理）
 */
let tauriInvoke: ((cmd: string, args?: any) => Promise<any>) | null = null;
async function tryTauriInvoke(cmd: string, args: any): Promise<string> {
    try {
        if (!tauriInvoke) {
            const mod = await import('@tauri-apps/api/core');
            if (mod && typeof (mod as any).invoke === 'function') {
                tauriInvoke = (mod as any).invoke as (c: string, a?: any) => Promise<any>;
            } else {
                throw new Error('invoke not available');
            }
        }
        const raw = await tauriInvoke!(cmd, args);
        return String(raw);
    } catch (e) {
        throw e;
    }
}

function isTauriRuntime(): boolean {
  const w: any = typeof window !== 'undefined' ? window : undefined;
  const origin = typeof location !== 'undefined' ? location.origin : '';
  return !!(w && (w.__TAURI__ || w.__TAURI_INTERNALS))
    || origin.includes('tauri.localhost')
    || origin.includes('ipc.localhost');
}

function parseApiResponse(raw: string): ApiResponse {
  let s = raw;
  s = s.trim();
  try {
    const direct = JSON.parse(s);
    if (typeof direct === 'string') {
      return parseApiResponse(direct);
    }
    if (direct && typeof direct === 'object' && 'Code' in direct) {
      return direct as ApiResponse;
    }
  } catch {}

  if (s.startsWith('"') && s.endsWith('"')) {
    try {
      const unquoted = s.slice(1, -1).replace(/\\"/g, '"');
      const obj = JSON.parse(unquoted);
      if (obj && typeof obj === 'object' && 'Code' in obj) {
        return obj as ApiResponse;
      }
    } catch {}
  }

  const start = s.indexOf('{');
  const end = s.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    try {
      const frag = s.slice(start, end + 1);
      const obj = JSON.parse(frag);
      if (obj && typeof obj === 'object' && 'Code' in obj) {
        return obj as ApiResponse;
      }
    } catch {}
  }

  const codeMatch = s.match(/"Code"\s*:\s*(\d+)/);
  if (codeMatch) {
    const codeNum = Number(codeMatch[1]);
    const msgMatch = s.match(/"Msg"\s*:\s*"([\s\S]*?)"/);
    return { Code: codeNum, Msg: msgMatch ? msgMatch[1] : '' } as ApiResponse;
  }

  return { Code: 500, Msg: 'Invalid JSON response' } as ApiResponse;
}

export async function executeCommand(
  config: ConnectionConfig,
  command: string
): Promise<ApiResponse> {
  try {
    if (isTauriRuntime()) {
      const raw = await tryTauriInvoke('remote_proxy', {
        serverUrl: config.serverUrl,
        token: config.token,
        command,
      });
      return parseApiResponse(raw);
    }
    const response = await fetch('/api/remote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Lang': (() => { try { const v = localStorage.getItem('ui.language'); if (v) return JSON.parse(v) as Language; } catch {} return 'zh_CN' as Language; })() },
      body: JSON.stringify({ serverUrl: config.serverUrl, token: config.token, command }),
    });
    return await response.json();
  } catch (error) {
    console.error('Failed to execute command:', error);
    return {
      Code: 500,
      Msg: t((() => { try { const v = localStorage.getItem('ui.language'); if (v) return JSON.parse(v) as Language; } catch {} return 'zh_CN' as Language; })(), 'remote.proxyFailedPrefix') + (error instanceof Error ? error.message : t((() => { try { const v = localStorage.getItem('ui.language'); if (v) return JSON.parse(v) as Language; } catch {} return 'zh_CN' as Language; })(), 'remote.unknownError')),
    };
  }
}

/**
 * 测试连接
 */
export async function testConnection(
  config: ConnectionConfig
): Promise<boolean> {
  try {
    if (isTauriRuntime()) {
      const raw = await tryTauriInvoke('remote_proxy', {
        serverUrl: config.serverUrl,
        token: config.token,
        command: 'help',
      });
      const data = parseApiResponse(raw);
      return data.Code === 200;
    }
    const response = await fetch('/api/remote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Lang': (() => { try { const v = localStorage.getItem('ui.language'); if (v) return JSON.parse(v) as Language; } catch {} return 'zh_CN' as Language; })() },
      body: JSON.stringify({ serverUrl: config.serverUrl, token: config.token, command: 'help' }),
    });
    const data = await response.json();
    return data.Code === 200;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
}
