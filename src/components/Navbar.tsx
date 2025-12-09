import { For, Show, onMount, createSignal } from 'solid-js';
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
  const [isMobile, setIsMobile] = createSignal(false);
  const [menuOpen, setMenuOpen] = createSignal(false);
  const [closing, setClosing] = createSignal(false);
  const [entered, setEntered] = createSignal(false);

  onMount(() => {
    const update = () => setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    update();
    window.addEventListener('resize', update);
  });
  const commands: Array<{ type: CommandType; icon: string }> = [
    { type: 'character' as CommandType, icon: '' },
    { type: 'disc' as CommandType, icon: '' },
    { type: 'give' as CommandType, icon: '' },
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
          {/* 左侧区域：移动端 */}
          <div style="display: flex; align-items: center; gap: 12px;">
            <Show when={isMobile()}>
              <button
                type="button"
                aria-label="menu"
                style="width: 34px; height: 34px; display: inline-flex; align-items: center; justify-content: center; border-radius: var(--radius-md); background: transparent; overflow: hidden; animation: subtle-bounce 3.2s ease-in-out infinite;"
                onClick={() => { setClosing(false); setEntered(false); setMenuOpen(true); requestAnimationFrame(() => setEntered(true)); }}
              >
                <img src="/start.png" alt="menu" style="width: 100%; height: 100%; object-fit: cover;" />
              </button>
            </Show>
            <Show when={!isMobile()}>
              <div
                style="width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; animation: subtle-bounce 3.2s ease-in-out infinite; background: transparent;"
                onClick={() => props.onClearState && props.onClearState()}
                onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.05)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; }}
                title={t(props.language, 'navbar.command.clean')}
                aria-label={t(props.language, 'navbar.command.clean')}
              >
                <img src="/start.png" alt="start" style="width: 100%; height: 100%; object-fit: cover;" />
              </div>
            </Show>
            <Show when={!isMobile()}>
              <div style="font-size: 16px; font-weight: 700; color: var(--text-primary);">{t(props.language, 'navbar.title')}</div>
            </Show>
          </div>

          {/* 命令标签页：桌面显示，移动端抽屉 */}
          <Show when={!isMobile()}>
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
          </Show>

          {/* 右侧工具栏 */}
            <div style="display: flex; align-items: center; gap: var(--spacing-md);">
            {/* 语言选择*/}
            <Show
              when={!isMobile()}
              fallback={
                <div style="min-width: 92px">
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
              }
            >
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
            </Show>

            {/* 连接状态指示器 */}
            <div style={`display: flex; flex-direction: row; align-items: center; gap: var(--spacing-sm); padding: 7px 12px; ${getBadgeStyle()} border-radius: var(--radius-md); white-space: nowrap;`}>
              <div
                style={`width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; ${
                  props.connectionStatus === 'connected' ? 'animation: pulse 2s infinite;' : ''
                }`}
                class={getStatusColor()}
              />
              <Show when={!isMobile()}>
                <span style={`font-size: 13px; font-weight: 600; color: ${getStatusTextColor()};`}>
                  {getStatusText()}
                </span>
              </Show>
            </div>


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
              <Show when={!isMobile()}>
                <span>{t(props.language, 'navbar.github')}</span>
              </Show>
            </button>
          </div>
        </div>
        {/* 移动端菜单抽屉 */}
        <Show when={isMobile() && menuOpen()}>
          <div style={`position: fixed; inset: 0; z-index: 1001; transition: background 200ms ease; background: rgba(0,0,0,${entered() && !closing() ? '0.35' : '0'});`} onClick={() => { setClosing(true); setEntered(false); setTimeout(() => setMenuOpen(false), 250); }}>
            <div style={`position: absolute; top: 0; left: 0; width: 80%; max-width: 320px; height: 100%; background: var(--bg-secondary); border-right: 1px solid var(--border-secondary); box-shadow: var(--shadow-lg); padding: var(--spacing-md); transform: ${closing() ? 'translateX(-100%)' : entered() ? 'translateX(0)' : 'translateX(-100%)'}; transition: transform 250ms cubic-bezier(0.4,0,0.2,1);`} onClick={(e) => e.stopPropagation()}>
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--spacing-md);">
                <div style="font-weight: 700; color: var(--text-primary);">{t(props.language, 'navbar.title')}</div>
                <button type="button" style="width: 34px; height: 34px; display: inline-flex; align-items: center; justify-content: center; border-radius: var(--radius-md); border: 1px solid var(--border-secondary); background: var(--bg-secondary); color: var(--text-secondary);" onClick={() => { setClosing(true); setEntered(false); setTimeout(() => setMenuOpen(false), 250); }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6 6l12 12M6 18L18 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <For each={commands}>
                  {(cmd) => (
                    <button
                      style={`width: 100%; display: flex; align-items: center; justify-content: flex-start; padding: 10px 12px; border-radius: var(--radius-md); border: 1px solid var(--border-secondary); ${props.currentCommand === cmd.type ? 'background: rgba(0,188,212,0.12); color: var(--primary);' : 'background: var(--bg-secondary); color: var(--text-secondary);'} `}
                      onClick={() => { setClosing(true); setEntered(false); setTimeout(() => { props.onCommandChange(cmd.type); setMenuOpen(false); }, 250); }}
                    >
                      <span style="font-size: 13px;">{t(props.language, `navbar.command.${cmd.type}`)}</span>
                    </button>
                  )}
                </For>

              </div>
            </div>
          </div>
        </Show>
      </div>
    </nav>
  );
}
