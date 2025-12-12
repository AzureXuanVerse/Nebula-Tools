import { createSignal, Show, Match, Switch, onMount, createEffect } from 'solid-js';
import { Navbar } from './Navbar';
import { Button } from './ui/Button';
import { Toast } from './ui/Toast';
import { CharacterPanel } from './panels/CharacterPanel';
import { DiscPanel } from './panels/DiscPanel';
import { GivePanel } from './panels/GivePanel';
import { LevelPanel } from './panels/LevelPanel';
import { BattlePassPanel } from './panels/BattlePassPanel';
import { BuildPanel } from './panels/BuildPanel';
import { MailPanel } from './panels/MailPanel';
import { CleanPanel } from './panels/CleanPanel';
import { ConnectionPanel } from './panels/ConnectionPanel';
import { BanPanel } from './panels/BanPanel';
import {
  loadCharacters,
  loadDiscs,
} from '../utils/dataLoader';
import { executeCommand } from '../utils/api';
import type {
  CommandType,
  Language,
  ConnectionStatus,
  Character,
  Disc,
  ToastMessage,
  ConnectionConfig,
} from '../types';
import { t } from '../i18n';

function App() {
  const allowedCommands = ['character','disc','give','level','battlepass','build','mail','clean','ban','connection'] as CommandType[];
  const initialCmd = (() => {
    try {
      const savedCmd = localStorage.getItem('ui.currentCommand');
      if (savedCmd) {
        const val = JSON.parse(savedCmd) as CommandType;
        if (allowedCommands.includes(val)) return val;
      }
    } catch {}
    return 'character' as CommandType;
  })();
  const [currentCommand, setCurrentCommand] = createSignal<CommandType>(initialCmd);
  const [language, setLanguage] = createSignal<Language>('zh_CN');
  const initialConnStatus = (() => {
    return 'disconnected' as ConnectionStatus;
  })();
  const [connectionStatus, setConnectionStatus] = createSignal<ConnectionStatus>(initialConnStatus);
  const [generatedCommand, setGeneratedCommand] = createSignal<string>('');
  const [serverUrl, setServerUrl] = createSignal<string>('http://127.0.0.1:5210');
  const [token, setToken] = createSignal<string>('');
  const [targetUid, setTargetUid] = createSignal<string>('10001'); // 目标玩家UID
  const [connectionMode, setConnectionMode] = createSignal<'admin' | 'player'>('admin'); // 连接方式

  const ADMIN_DEFAULT = 'HJHASDPIIQWEASDHHAN';
  createEffect(() => {
    const mode = connectionMode();
    if (mode === 'admin') {
      if (!token().trim()) setToken(ADMIN_DEFAULT);
    } else {
      if (token().trim() === ADMIN_DEFAULT) setToken('');
    }
  });
  
  // 数据
  const [characters, setCharacters] = createSignal<Character[]>([]);
  const [discs, setDiscs] = createSignal<Disc[]>([]);
  
  // 通知
  const [toasts, setToasts] = createSignal<ToastMessage[]>([]);
  let toastTimer: number | undefined;
  let statusInitDone = false;
  createEffect(() => {
    const s = connectionStatus();
    if (!statusInitDone) { statusInitDone = true; return; }
    try { localStorage.setItem('conn.status', JSON.stringify(s)); } catch {}
  });

  const msgIndicatesError = (msg?: string) => {
    const m = (msg || '').trim();
    return /^error\b/i.test(m);
  };

  // 加载数据
  onMount(async () => {
    try {
      const saved = localStorage.getItem('conn.config');
      if (saved) {
        const cfg = JSON.parse(saved) as { serverUrl?: string; token?: string; targetUid?: string; connectionMode?: 'admin' | 'player' };
        if (cfg.serverUrl) setServerUrl(cfg.serverUrl);
        if (cfg.token) setToken(cfg.token);
        if (cfg.targetUid) setTargetUid(cfg.targetUid);
        if (cfg.connectionMode) setConnectionMode(cfg.connectionMode);
      }
      try {
        const m = localStorage.getItem('conn.mode');
        if (m) {
          const parsed = JSON.parse(m);
          if (parsed === 'admin' || parsed === 'player') setConnectionMode(parsed);
        }
      } catch {}
      try {
        const tk = localStorage.getItem('conn.token');
        if (tk) {
          const parsed = JSON.parse(tk);
          if (typeof parsed === 'string' && connectionMode() === 'admin') setToken(parsed);
        }
      } catch {}
      try {
        const uid = localStorage.getItem('conn.uid');
        if (uid) {
          const parsed = JSON.parse(uid);
          if (typeof parsed === 'string') setTargetUid(parsed);
        }
      } catch {}
      try {
        const st = localStorage.getItem('conn.status');
        if (st) {
          const parsed = JSON.parse(st);
          if (parsed === 'connected' || parsed === 'connecting' || parsed === 'disconnected') setConnectionStatus(parsed);
        }
      } catch {}
      
    } catch {}

    const [chars, discsData] = await Promise.all([
      loadCharacters(),
      loadDiscs(),
    ]);
    setCharacters(chars);
    setDiscs(discsData);
    

    try {
      const navEntry = (performance.getEntriesByType('navigation')[0] as any) || undefined;
      const navType = navEntry?.type as string | undefined;
      const isNavigate = navType === 'navigate' || navType === undefined;
      const urlOk = serverUrl().trim().length > 0;
      const tokenOk = token().trim().length > 0;
      const uidOk = connectionMode() === 'player' || (connectionMode() === 'admin' && targetUid().trim().length > 0);
      if (isNavigate && urlOk && tokenOk && uidOk) {
        await handleTestConnection();
      }
    } catch {}
  });

  // 添加通知
  const addToast = (type: ToastMessage['type'], message: string) => {
    const id = Date.now().toString();
    if (toastTimer) {
      clearTimeout(toastTimer);
      toastTimer = undefined;
    }
    setToasts([{ id, type, title: '', message }]);
    toastTimer = setTimeout(() => {
      setToasts([]);
      toastTimer = undefined;
    }, 3000) as unknown as number;
  };

  const clearState = () => {
    try {
      const keep = ['ui.currentCommand', 'ui.language', 'conn.config', 'conn.mode', 'conn.token', 'conn.uid', 'conn.status'];
      const saved: Record<string, string> = {};
      for (const k of keep) {
        try {
          const v = localStorage.getItem(k);
          if (v !== null) saved[k] = v;
        } catch {}
      }
      localStorage.clear();
      for (const k of Object.keys(saved)) {
        try { localStorage.setItem(k, saved[k]); } catch {}
      }
    } catch {}
    try {
      if (typeof window !== 'undefined' && window.location) {
        window.location.reload();
        return;
      }
    } catch {}
  };

  // 移除通知
  const removeToast = () => {
    if (toastTimer) {
      clearTimeout(toastTimer);
      toastTimer = undefined;
    }
    setToasts([]);
  };

  // 复制命令
  const copyCommand = async () => {
    try {
      if (!generatedCommand().trim()) {
        addToast('warning', t(language(), 'app.toastNeedCommand'));
        return;
      }
      const base = generatedCommand().trim();
      const withSlash = base ? (base.startsWith('/') ? base : `/${base}`) : '';
      const lower = withSlash.toLowerCase();
      const needsSuffix = !(lower.startsWith('/ban ') || lower.startsWith('/unban '));
      const suffix = needsSuffix && targetUid().trim() ? ` @${targetUid().trim()}` : '';
      await navigator.clipboard.writeText(`${withSlash}${suffix}`);
      addToast('success', t(language(), 'app.toastCopied'));
    } catch (error) {
      addToast('error', t(language(), 'app.toastCopyFailed'));
    }
  };

  // 执行命令
  const runCommand = async () => {
    if (!generatedCommand().trim()) {
      addToast('warning', t(language(), 'app.toastNeedCommand'));
      return;
    }

    if (!serverUrl().trim() || !token().trim()) {
      setCurrentCommand('connection');
      return;
    }

    if (connectionStatus() !== 'connected') {
      setCurrentCommand('connection');
      return;
    }

    setConnectionStatus('connecting');
    addToast('info', t(language(), 'app.toastExecuting'));

    // 如果指定了UID，在命令后添加 @UID
    let finalCommand = generatedCommand();
    const lower = finalCommand.trim().toLowerCase();
    const needsSuffix = !(lower.startsWith('ban ') || lower.startsWith('unban '));
    if (needsSuffix && targetUid().trim()) {
      finalCommand += ` @${targetUid().trim()}`;
    }

    const config: ConnectionConfig = {
      serverUrl: serverUrl() + '/api/command',
      token: token(),
    };

    const response = await executeCommand(config, finalCommand);

    if (response.Code === 200 && !msgIndicatesError(response.Msg)) {
      setConnectionStatus('connected');
      addToast('success', response.Msg && response.Msg.trim() ? `${t(language(), 'app.execSuccess')}${response.Msg}` : t(language(), 'app.execSuccessNoMsg'));
    } else {
      setConnectionStatus('disconnected');
      addToast('error', `${t(language(), 'app.execFailedPrefix')}${response.Msg}`);
    }
  };

  // 测试连接
  const handleTestConnection = async () => {
    if (!serverUrl().trim() || !token().trim()) {
      addToast('warning', t(language(), 'app.connectionFill'));
      return;
    }
    
    setConnectionStatus('connecting');
    addToast('info', t(language(), 'app.connectionTesting'));
    
    const config: ConnectionConfig = {
      serverUrl: serverUrl() + '/api/command',
      token: token(),
    };
    
    let final = 'status';
    if (targetUid().trim()) {
      final += ` @${targetUid().trim()}`;
    }
    const response = await executeCommand(config, final);

    if (response.Code === 200 && !msgIndicatesError(response.Msg)) {
      setConnectionStatus('connected');
      addToast('success', t(language(), 'app.connectionSuccess'));
    } else {
      setConnectionStatus('disconnected');
      addToast('error', `${t(language(), 'app.connectionFailedPrefix')}${response.Msg}`);
    }
  };

  return (
    <div style="min-height: 100vh; position: relative; z-index: 1;">
      <Navbar
        currentCommand={currentCommand()}
        onCommandChange={(cmd) => { setCurrentCommand(cmd); try { localStorage.setItem('ui.currentCommand', JSON.stringify(cmd)); } catch {} }}
        language={language()}
        onLanguageChange={setLanguage}
        connectionStatus={connectionStatus()}
        onConnectionClick={() => {}}
        onClearState={clearState}
      />

      <div style="max-width: 1400px; margin: 0 auto; padding: var(--spacing-xl); position: relative; z-index: 1;">

        <Show when={currentCommand() !== 'connection'}>
          <div style="background: var(--bg-secondary); border: 2px solid var(--border-primary); border-radius: var(--radius-lg); padding: var(--spacing-lg); box-shadow: var(--shadow-lg), var(--glow-primary); margin-bottom: var(--spacing-lg);">
            <h3 style="font-size: 20px; font-weight: 600; color: var(--text-primary); margin-bottom: var(--spacing-md); display: flex; align-items: center; gap: var(--spacing-sm);">
              <div style="width: 4px; height: 20px; background: var(--primary-gradient); border-radius: var(--radius-full); box-shadow: 0 0 8px rgba(0, 188, 212, 0.4);" />
              {t(language(), 'app.previewTitle')}
            </h3>
            <div style="display: flex; align-items: stretch; gap: var(--spacing-md);">
              <div 
                onClick={copyCommand}
              style="flex: 1; background: linear-gradient(135deg, rgba(0, 188, 212, 0.05) 0%, rgba(0, 188, 212, 0.1) 100%); border: 1px solid var(--border-primary); border-radius: var(--radius-md); padding: var(--spacing-md); font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, 'JetBrains Mono', monospace; font-size: 14px; color: var(--accent); word-break: break-all; line-height: 1.6; cursor: pointer; transition: all 0.2s; display: flex; align-items: center;"
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 188, 212, 0.1) 0%, rgba(0, 188, 212, 0.15) 100%)';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 188, 212, 0.05) 0%, rgba(0, 188, 212, 0.1) 100%)';
                  e.currentTarget.style.borderColor = 'var(--border-primary)';
                }}
                title={t(language(), 'app.copyTitle')}
              >
                {(() => {
                  const base = generatedCommand().trim();
                  if (!base) return t(language(), 'app.copyPlaceholder');
                  const withSlash = base.startsWith('/') ? base : `/${base}`;
                  const lower = withSlash.toLowerCase();
                  const needsSuffix = !(lower.startsWith('/ban ') || lower.startsWith('/unban '));
                  const suffix = needsSuffix && targetUid().trim() ? ` @${targetUid().trim()}` : '';
                  return `${withSlash}${suffix}`;
                })()}
              </div>
              <Button variant="accent" onClick={runCommand} style="flex-shrink: 0; align-self: stretch;">
                {t(language(), 'app.runButton')}
              </Button>
            </div>
          </div>
        </Show>

        {/* 主内容区 */}
        <Switch>
          <Match when={currentCommand() === 'character'}>
            <CharacterPanel
              characters={characters()}
              language={language()}
              onCommandChange={setGeneratedCommand}
            />
          </Match>
          <Match when={currentCommand() === 'disc'}>
            <DiscPanel
              discs={discs()}
              language={language()}
              onCommandChange={setGeneratedCommand}
            />
          </Match>
          <Match when={currentCommand() === 'give'}>
            <GivePanel language={language()} onCommandChange={setGeneratedCommand} />
          </Match>
          <Match when={currentCommand() === 'level'}>
            <LevelPanel language={language()} onCommandChange={setGeneratedCommand} />
          </Match>
          <Match when={currentCommand() === 'battlepass'}>
            <BattlePassPanel language={language()} onCommandChange={setGeneratedCommand} />
          </Match>
          <Match when={currentCommand() === 'build'}>
            <BuildPanel language={language()} onCommandChange={setGeneratedCommand} />
          </Match>
          <Match when={currentCommand() === 'mail'}>
            <MailPanel language={language()} onCommandChange={setGeneratedCommand} />
          </Match>
          <Match when={currentCommand() === 'clean'}>
            <CleanPanel language={language()} onCommandChange={setGeneratedCommand} />
          </Match>
          <Match when={currentCommand() === 'ban'}>
            <BanPanel language={language()} onCommandChange={setGeneratedCommand} connectionMode={connectionMode()} targetUid={targetUid()} />
          </Match>
          <Match when={currentCommand() === 'connection'}>
            <ConnectionPanel
              language={language()}
              serverUrl={serverUrl()}
              token={token()}
              targetUid={targetUid()}
              connectionMode={connectionMode()}
              connectionStatus={connectionStatus()}
              onServerUrlChange={setServerUrl}
              onTokenChange={setToken}
              onTargetUidChange={setTargetUid}
              onConnectionModeChange={setConnectionMode}
              onTestConnection={handleTestConnection}
            />
          </Match>
        </Switch>
      </div>

      {/* 通知 */}
      <Toast messages={toasts()} onClose={removeToast} language={language()} />
    </div>
  );
}

export default App
