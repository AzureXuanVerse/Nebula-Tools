import { createSignal, Show, Match, Switch, onMount, createEffect } from 'solid-js';
import { Navbar } from './Navbar';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Toast } from './ui/Toast';
import { CharacterPanel } from './panels/CharacterPanel';
import { DiscPanel } from './panels/DiscPanel';
import { GivePanel } from './panels/GivePanel';
import { GiveAllPanel } from './panels/GiveAllPanel';
import { LevelPanel } from './panels/LevelPanel';
import { BuildPanel } from './panels/BuildPanel';
import { MailPanel } from './panels/MailPanel';
import { CleanPanel } from './panels/CleanPanel';
import { ConnectionPanel } from './panels/ConnectionPanel';
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

export function App() {
  // 状态管理
  const [currentCommand, setCurrentCommand] = createSignal<CommandType>('character');
  const [language, setLanguage] = createSignal<Language>('zh_CN');
  const [connectionStatus, setConnectionStatus] = createSignal<ConnectionStatus>('disconnected');
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

  // 加载数据
  onMount(async () => {
    const [chars, discsData] = await Promise.all([
      loadCharacters(),
      loadDiscs(),
    ]);
    setCharacters(chars);
    setDiscs(discsData);
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

  // 移除通知
  const removeToast = (id: string) => {
    if (toastTimer) {
      clearTimeout(toastTimer);
      toastTimer = undefined;
    }
    setToasts([]);
  };

  // 复制命令
  const copyCommand = async () => {
    try {
      const base = generatedCommand().trim();
      const withSlash = base ? (base.startsWith('/') ? base : `/${base}`) : '';
      const suffix = targetUid().trim() ? ` @${targetUid().trim()}` : '';
      await navigator.clipboard.writeText(`${withSlash}${suffix}`);
      addToast('success', '命令已复制到剪贴板');
    } catch (error) {
      addToast('error', '复制失败');
    }
  };

  // 执行命令
  const runCommand = async () => {
    if (!generatedCommand().trim()) {
      addToast('warning', '请先生成命令');
      return;
    }

    if (!serverUrl().trim() || !token().trim()) {
      addToast('warning', '请先配置服务器地址和Token，点击"连接"菜单进行配置');
      return;
    }

    setConnectionStatus('connecting');
    addToast('info', '正在执行命令...');

    // 如果指定了UID，在命令后添加 @UID
    let finalCommand = generatedCommand();
    if (targetUid().trim()) {
      finalCommand += ` @${targetUid().trim()}`;
    }

    const config: ConnectionConfig = {
      serverUrl: serverUrl() + '/api/command',
      token: token(),
    };

    const response = await executeCommand(config, finalCommand);

    if (response.Code === 200) {
      setConnectionStatus('connected');
      addToast('success', '命令执行成功');
    } else {
      setConnectionStatus('disconnected');
      addToast('error', `命令执行失败: ${response.Msg}`);
    }
  };

  // 测试连接
  const handleTestConnection = async () => {
    if (!serverUrl().trim() || !token().trim()) {
      addToast('warning', '请填写服务器地址和Token');
      return;
    }
    
    setConnectionStatus('connecting');
    addToast('info', '正在测试连接...');
    
    const config: ConnectionConfig = {
      serverUrl: serverUrl() + '/api/command',
      token: token(),
    };
    
    const response = await executeCommand(config, 'help');

    if (response.Code === 200) {
      setConnectionStatus('connected');
      addToast('success', '连接成功');
    } else {
      setConnectionStatus('disconnected');
      addToast('error', `连接失败: ${response.Msg}`);
    }
  };

  return (
    <div style="min-height: 100vh; position: relative; z-index: 1;">
      <Navbar
        currentCommand={currentCommand()}
        onCommandChange={setCurrentCommand}
        language={language()}
        onLanguageChange={setLanguage}
        connectionStatus={connectionStatus()}
        onConnectionClick={() => {}}
      />

      <div style="max-width: 1400px; margin: 0 auto; padding: var(--spacing-xl); position: relative; z-index: 1;">

        {/* 命令预览框 */}
        <div style="background: var(--bg-secondary); border: 2px solid var(--border-primary); border-radius: var(--radius-lg); padding: var(--spacing-lg); box-shadow: var(--shadow-lg), var(--glow-primary); margin-bottom: var(--spacing-lg);">
          <h3 style="font-size: 20px; font-weight: 600; color: var(--text-primary); margin-bottom: var(--spacing-md); display: flex; align-items: center; gap: var(--spacing-sm);">
            <div style="width: 4px; height: 20px; background: var(--primary-gradient); border-radius: var(--radius-full); box-shadow: 0 0 8px rgba(0, 188, 212, 0.4);" />
            命令预览
          </h3>
          <div style="display: flex; align-items: stretch; gap: var(--spacing-md);">
            <div 
              onClick={copyCommand}
              style="flex: 1; background: linear-gradient(135deg, rgba(0, 188, 212, 0.05) 0%, rgba(0, 188, 212, 0.1) 100%); border: 1px solid var(--border-primary); border-radius: var(--radius-md); padding: var(--spacing-md); font-family: 'JetBrains Mono', monospace; font-size: 14px; color: var(--accent); word-break: break-all; line-height: 1.6; cursor: pointer; transition: all 0.2s; display: flex; align-items: center;"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 188, 212, 0.1) 0%, rgba(0, 188, 212, 0.15) 100%)';
                e.currentTarget.style.borderColor = 'var(--primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 188, 212, 0.05) 0%, rgba(0, 188, 212, 0.1) 100%)';
                e.currentTarget.style.borderColor = 'var(--border-primary)';
              }}
              title="点击复制命令"
            >
              {(() => {
                const base = generatedCommand().trim();
                if (!base) return '点击复制';
                const withSlash = base.startsWith('/') ? base : `/${base}`;
                const suffix = targetUid().trim() ? ` @${targetUid().trim()}` : '';
                return `${withSlash}${suffix}`;
              })()}
            </div>
            <Button variant="accent" onClick={runCommand} style="flex-shrink: 0; align-self: stretch;">
              执行命令
            </Button>
          </div>
        </div>

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
          <Match when={currentCommand() === 'giveall'}>
            <GiveAllPanel language={language()} onCommandChange={setGeneratedCommand} />
          </Match>
          <Match when={currentCommand() === 'level'}>
            <LevelPanel language={language()} onCommandChange={setGeneratedCommand} />
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
      <Toast messages={toasts()} onClose={removeToast} />
    </div>
  );
}
