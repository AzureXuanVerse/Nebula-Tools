import { For } from 'solid-js';
import { SearchableSelect } from './ui/SearchableSelect';
import type { CommandType, Language, ConnectionStatus } from '../types';

interface NavbarProps {
  currentCommand: CommandType;
  onCommandChange: (command: CommandType) => void;
  language: Language;
  onLanguageChange: (language: Language) => void;
  connectionStatus: ConnectionStatus;
  onConnectionClick: () => void;
}

export function Navbar(props: NavbarProps) {
  const commands = [
    { type: 'character' as CommandType, icon: '', label: '角色' },
    { type: 'disc' as CommandType, icon: '', label: '秘纹' },
    { type: 'give' as CommandType, icon: '', label: '物品' },
    { type: 'giveall' as CommandType, icon: '', label: '批量' },
    { type: 'level' as CommandType, icon: '', label: '等级' },
    { type: 'build' as CommandType, icon: '', label: '星塔' },
    { type: 'mail' as CommandType, icon: '', label: '邮件' },
    { type: 'clean' as CommandType, icon: '', label: '清除' },
    { type: 'connection' as CommandType, icon: '', label: '连接' },
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
        return '已连接';
      case 'connecting':
        return '连接中';
      case 'disconnected':
        return '未连接';
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
            <div style="font-size: 16px; font-weight: 700; color: var(--text-primary);">Nebula Command</div>
          </div>

          {/* 命令标签页 */}
          <div class="scrollbar-hide" style="flex: 1; display: flex; align-items: center; gap: 4px; overflow-x: auto;">
            <For each={commands}>
              {(cmd) => (
                <button
                  style={`flex-shrink: 0; display: flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: var(--radius-md); transition: all 0.25s; ${
                    props.currentCommand === cmd.type
                      ? 'background: rgba(0, 188, 212, 0.minify-dist-data.mjs); color: var(--primary); font-weight: 600;'
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
                  <span style="font-size: 13px; white-space: nowrap;">{cmd.label}</span>
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
          </div>
        </div>
      </div>
    </nav>
  );
}
