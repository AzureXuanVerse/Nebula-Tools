import type {ApiResponse, ConnectionConfig} from '../types';

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

export async function executeCommand(
  config: ConnectionConfig,
  command: string
): Promise<ApiResponse> {
  try {
    try {
      const raw = await tryTauriInvoke('remote_proxy', {
        serverUrl: config.serverUrl,
        token: config.token,
        command,
      });
      return JSON.parse(raw);
    } catch (_) {}
    const response = await fetch('/api/remote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serverUrl: config.serverUrl, token: config.token, command }),
    });
    return await response.json();
  } catch (error) {
    console.error('Failed to execute command:', error);
    return {
      Code: 500,
      Msg: '网络请求失败',
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
    try {
      const raw = await tryTauriInvoke('remote_proxy', {
        serverUrl: config.serverUrl,
        token: config.token,
        command: 'help',
      });
      const data = JSON.parse(raw);
      return data.Code === 200;
    } catch (_) {}
    const response = await fetch('/api/remote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serverUrl: config.serverUrl, token: config.token, command: 'help' }),
    });
    const data = await response.json();
    return data.Code === 200;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
}
