import { For } from 'solid-js';
import { SearchableSelect } from './ui/SearchableSelect';
import { t } from '../i18n';
import type { CommandType, Language, ConnectionStatus } from '../types';

interface NavbarProps {
  currentCommand: CommandType;
  onCommandChange: (command: CommandType) => void;
  language: Language;
  onLanguageChange: (language: Language) => void;
  connectionStatus: ConnectionStatus;
  onConnectionClick: () => void;
  onClearState?: () => void;
}

export function Navbar(props: NavbarProps) {
  const commands: Array<{ type: CommandType; icon: string }> = [
    { type: 'character' as CommandType, icon: '' },
    { type: 'disc' as CommandType, icon: '' },
    { type: 'give' as CommandType, icon: '' },
    { type: 'giveall' as CommandType, icon: '' },
    { type: 'level' as CommandType, icon: '' },
    { type: 'battlepass' as CommandType, icon: '' },
    { type: 'build' as CommandType, icon: '' },
    { type: 'mail' as CommandType, icon: '' },
    { type: 'clean' as CommandType, icon: '' },
    { type: 'connection' as CommandType, icon: '' },
  ];

  const languages = [
    { value: 'zh_CN' as Language, label: '简体中文' },
    { value: 'zh_TW' as Language, label: '繁體中文' },
    { value: 'en_US' as Language, label: 'English' },
    { value: 'ja_JP' as Language, label: '日本語' },
    { value: 'ko_KR' as Language, label: '한국어' },
  ];

  const getStatusColor = () => {
    switch (props.connectionStatus) {
      case 'connected':
        return 'bg-green-500';
      case 'connecting':
        return 'bg-yellow-500';
      case 'disconnected':
        return 'bg-red-500';
    }
  };

  const getStatusText = () => {
    switch (props.connectionStatus) {
      case 'connected':
        return t(props.language, 'navbar.status.connected');
      case 'connecting':
        return t(props.language, 'navbar.status.connecting');
      case 'disconnected':
        return t(props.language, 'navbar.status.disconnected');
    }
  };

  const getStatusTextColor = () => {
    switch (props.connectionStatus) {
      case 'connected':
        return 'var(--success)';
      case 'connecting':
        return 'var(--warning)';
      case 'disconnected':
        return 'var(--error)';
    }
  };

  const getBadgeStyle = () => {
    switch (props.connectionStatus) {
      case 'connected':
        return 'background: rgba(102, 187, 106, 0.15); border: 1px solid rgba(102, 187, 106, 0.3);';
      case 'connecting':
        return 'background: rgba(255, 167, 38, 0.15); border: 1px solid rgba(255, 167, 38, 0.3);';
      case 'disconnected':
        return 'background: rgba(239, 83, 80, 0.15); border: 1px solid rgba(239, 83, 80, 0.3);';
    }
  };

  return (
    <nav style="position: sticky; top: 0; width: 100%; background: var(--bg-secondary); border-bottom: 1px solid var(--border-secondary); box-shadow: var(--shadow-md); z-index: 1000;">
      <div style="max-width: 1600px; margin: 0 auto; padding: 0 var(--spacing-lg);">
        <div style="display: flex; align-items: center; justify-content: space-between; height: 64px; gap: var(--spacing-lg);">
          {/* Logo */}
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 36px; height: 36px; background: var(--primary-gradient); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 700; color: white; box-shadow: var(--shadow-sm), var(--glow-primary);">
              N
            </div>
            <div style="font-size: 16px; font-weight: 700; color: var(--text-primary);">{t(props.language, 'navbar.title')}</div>
          </div>

          {/* 命令标签页 */}
          <div class="scrollbar-hide" style="flex: 1; display: flex; align-items: center; gap: 4px; overflow-x: auto;">
            <For each={commands}>
              {(cmd) => (
                <button
                  style={`flex-shrink: 0; display: flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: var(--radius-md); transition: all 0.25s; font-weight: 600; ${
                    props.currentCommand === cmd.type
                      ? 'background: rgba(0, 188, 212, 0.minify-dist-data.mjs); color: var(--primary);'
                      : 'color: var(--text-secondary); background: transparent;'
                  }`}
                  onMouseEnter={(e) => {
                    if (props.currentCommand !== cmd.type) {
                      e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (props.currentCommand !== cmd.type) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                  onClick={() => props.onCommandChange(cmd.type)}
                >
                  <span style="font-size: 13px; white-space: nowrap;">{t(props.language, `navbar.command.${cmd.type}`)}</span>
                </button>
              )}
            </For>
          </div>

          {/* 右侧工具栏 */}
            <div style="display: flex; align-items: center; gap: var(--spacing-md);">
            {/* 语言选择*/}
            <div style="min-width: 120px">
              <SearchableSelect
                options={languages.map(l => ({ value: l.value, label: l.label }))}
                value={props.language}
                searchable={false}
                compact={true}
                hideArrow={true}
                persistKey="ui.language"
                language={props.language}
                onChange={(e) => props.onLanguageChange(e.currentTarget.value as Language)}
              />
            </div>

            {/* 连接状态指示器 */}
            <div style={`display: flex; flex-direction: row; align-items: center; gap: var(--spacing-sm); padding: 7px 12px; ${getBadgeStyle()} border-radius: var(--radius-md); white-space: nowrap;`}>
              <div
                style={`width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; ${
                  props.connectionStatus === 'connected' ? 'animation: pulse 2s infinite;' : ''
                }`}
                class={getStatusColor()}
              />
              <span style={`font-size: 13px; font-weight: 600; color: ${getStatusTextColor()};`}>
                {getStatusText()}
              </span>
            </div>

            <button
              type="button"
              title={t(props.language, 'navbar.clear')}
              style="width: 34px; height: 34px; display: inline-flex; align-items: center; justify-content: center; border-radius: 9999px; border: 1px solid var(--border-secondary); background: var(--bg-secondary); color: var(--text-tertiary); cursor: pointer;"
              onClick={() => props.onClearState && props.onClearState()}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-tertiary)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-secondary)'; e.currentTarget.style.color = 'var(--text-tertiary)'; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M3 6h18v2H3V6zm2 4h14l-2 8H7l-2-8zm5-6h4l1 2H9l1-2z"/>
              </svg>
            </button>

            <button
              type="button"
              title={t(props.language, 'navbar.github')}
              style="display: inline-flex; align-items: center; gap: 8px; height: 34px; padding: 0 12px; border-radius: var(--radius-md); border: 1px solid var(--border-secondary); background: var(--bg-secondary); color: var(--text-secondary); font-size: 13px; font-weight: 600; cursor: pointer;"
              onClick={async () => {
                const url = 'https://github.com/AzureXuanVerse/Nebula-Tools';
                try {
                  const core = await import('@tauri-apps/api/core');
                  await (core as any).invoke('open_external', { url });
                } catch {
                  window.open(url, '_blank', 'noopener,noreferrer');
                }
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-tertiary)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-secondary)'; e.currentTarget.style.borderColor = 'var(--border-secondary)'; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.53 2.87 8.37 6.84 9.73.5.09.68-.22.68-.49 0-.24-.01-.88-.01-1.72-2.78.61-3.37-1.2-3.37-1.2-.46-1.18-1.12-1.49-1.12-1.49-.92-.64.07-.63.07-.63 1.02.07 1.56 1.06 1.56 1.06.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.32.1-2.76 0 0 .84-.27 2.76 1.05.8-.23 1.66-.35 2.52-.35.86 0 1.72.12 2.52.35 1.92-1.33 2.76-1.05 2.76-1.05.55 1.44.2 2.5.1 2.76.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.69.95.69 1.91 0 1.38-.01 2.49-.01 2.83 0 .27.18.59.69.49 3.97-1.36 6.84-5.2 6.84-9.73C22 6.58 17.52 2 12 2z"/>
              </svg>
              {t(props.language, 'navbar.github')}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
