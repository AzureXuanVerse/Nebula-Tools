import { Show, For } from 'solid-js';
import type { ToastMessage } from '../../types';

interface ToastProps {
  messages: ToastMessage[];
  onClose: (id: string) => void;
}

export function Toast(props: ToastProps) {
  const getIcon = (type: string) => {
    const icons: Record<string, string> = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
    return icons[type] || 'ℹ';
  };

  const getTitle = (type: string) => {
    const titles: Record<string, string> = { success: '操作成功', error: '错误', warning: '警告', info: '提示信息' };
    return titles[type] || '提示';
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'var(--success)';
      case 'error':
        return 'var(--error)';
      case 'warning':
        return 'var(--warning)';
      case 'info':
      default:
        return 'var(--primary)';
    }
  };

  return (
    <div class="fixed top-20 right-6 z-50 flex flex-col gap-3">
      <For each={props.messages}>
        {(message) => {
          const color = getColor(message.type);
          return (
            <div
              style={`
                background: linear-gradient(135deg, var(--bg-secondary), rgba(0, 188, 212, 0.08));
                border: 1px solid var(--border-secondary);
                border-left: 4px solid ${color};
                border-radius: var(--radius-lg);
                padding: 14px;
                box-shadow: var(--shadow-lg), 0 0 20px rgba(0, 188, 212, 0.12);
                backdrop-filter: blur(6px);
              `}
              class="min-w-[320px] max-w-[420px] toast-animate"
            >
              <div class="flex items-start gap-3">
                <div
                  style={`
                    width: 32px;
                    height: 32px;
                    border-radius: 9999px;
                    background: ${color};
                    color: white;
                    font-weight: 700;
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                  `}
                >
                  {getIcon(message.type)}
                </div>
                <div class="flex-1">
                  <div style={`font-weight: 600; font-size: 13px; color: ${color};`}>{getTitle(message.type)}</div>
                  <div style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">
                    {message.message}
                  </div>
                </div>
                <button
                  onClick={() => props.onClose(message.id)}
                  style="color: var(--text-tertiary); background: none; border: none; cursor: pointer; font-size: 14px; transition: opacity 0.2s;"
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  ✕
                </button>
              </div>
            </div>
          );
        }}
      </For>
    </div>
  );
}

