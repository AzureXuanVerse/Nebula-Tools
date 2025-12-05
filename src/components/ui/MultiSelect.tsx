import { createSignal, For, Show } from 'solid-js';

interface MultiSelectOption {
  value: string | number;
  label: string;
  description?: string;
}

interface MultiSelectProps {
  label?: string;
  options: MultiSelectOption[];
  selected: (string | number)[];
  onChange: (selected: (string | number)[]) => void;
  placeholder?: string;
  searchable?: boolean;
  compact?: boolean;
  hideArrow?: boolean;
}

export function MultiSelect(props: MultiSelectProps) {
  const [isOpen, setIsOpen] = createSignal(false);
  const [searchText, setSearchText] = createSignal('');
  let inputEl: HTMLInputElement | undefined;

  const toggleOption = (value: string | number) => {
    const current = props.selected;
    if (current.includes(value)) {
      props.onChange(current.filter((v) => v !== value));
    } else {
      props.onChange([...current, value]);
    }
  };

  const getSelectedLabels = () => {
    return props.options
      .filter((opt) => props.selected.includes(opt.value))
      .map((opt) => opt.label)
      .join(', ');
  };

  // 过滤选项
  const filteredOptions = () => {
    const search = searchText().toLowerCase().trim();
    if (!search) return props.options;
    
    return props.options.filter((opt) => {
      const label = opt.label.toLowerCase();
      const desc = opt.description?.toLowerCase() || '';
      const value = String(opt.value).toLowerCase();
      return label.includes(search) || desc.includes(search) || value.includes(search);
    });
  };

  // 打开时重置搜索
  const handleOpen = () => {
    setIsOpen(true);
    setSearchText('');
  };

  return (
    <div style="display: flex; flex-direction: column; gap: var(--spacing-sm); position: relative;">
      {props.label && (
        <label style="font-size: 12px; font-weight: 500; color: var(--text-secondary);">
          {props.label}
        </label>
      )}
      
      <div style="position: relative;">
        <Show when={props.searchable !== false} fallback={
          <button
            type="button"
            class="select-custom"
            style={`width: 100%; text-align: left; display: flex; align-items: center; justify-content: space-between; ${props.compact ? 'padding: 6px 10px; font-size: 12px;' : ''}`}
            onClick={handleOpen}
          >
            <span style={`flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; ${props.compact ? 'font-size: 12px;' : ''}`}>
              {props.selected.length > 0 
                ? `已选择 ${props.selected.length} 项` 
                : (props.placeholder || '请选择...')}
            </span>
            <Show when={!props.hideArrow}>
              <svg
                width={14}
                height={14}
                viewBox="0 0 24 24"
                style={`margin-left: 8px; transition: transform 0.25s; transform: ${isOpen() ? 'rotate(180deg)' : 'rotate(0)'};`}
              >
                <path
                  d="M7 10l5 5 5-5"
                  fill="none"
                  stroke={isOpen() ? 'var(--primary)' : 'var(--text-tertiary)'}
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </Show>
          </button>
        }>
          <div
            class="select-custom"
            style={`display: flex; align-items: center; ${props.compact ? 'padding: 6px 10px;' : 'padding: 12px 16px;'} cursor: pointer;`}
            onClick={() => { setIsOpen(true); inputEl?.focus(); }}
          >
            <input
              type="text"
              value={searchText()}
              onInput={(e) => { setSearchText(e.currentTarget.value); setIsOpen(true); }}
              onFocus={handleOpen}
              placeholder={props.selected.length > 0 ? `已选择 ${props.selected.length} 项` : (props.placeholder || '请选择...')}
              class="input-custom"
              style={`border: none; box-shadow: none; padding: 0; height: auto; background: transparent; flex: 1; ${props.compact ? 'font-size: 12px;' : ''}`}
              ref={(el) => (inputEl = el)}
            />
            <Show when={!props.hideArrow}>
              <svg
                width={14}
                height={14}
                viewBox="0 0 24 24"
                style={`margin-left: 8px; transition: transform 0.25s; transform: ${isOpen() ? 'rotate(180deg)' : 'rotate(0)'};`}
              >
                <path
                  d="M7 10l5 5 5-5"
                  fill="none"
                  stroke={isOpen() ? 'var(--primary)' : 'var(--text-tertiary)'}
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </Show>
          </div>
        </Show>

        <Show when={isOpen()}>
          <div 
            style="position: absolute; top: calc(100% + 4px); left: 0; right: 0; background: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: var(--radius-md); box-shadow: var(--shadow-lg); z-index: 1000; overflow: hidden;"
            onClick={(e) => e.stopPropagation()}
          >

            {/* 选项列表 */}
            <div style="max-height: 280px; overflow-y: auto;">
              <Show when={filteredOptions().length > 0} fallback={
                <div style="padding: 20px; text-align: center; color: var(--text-tertiary); font-size: 14px;">
                  😕 未找到匹配项
                </div>
              }>
                <For each={filteredOptions()}>
              {(option) => (
                <button
                  type="button"
                  style={`width: 100%; padding: 10px 12px; text-align: left; border: none; background: ${
                    props.selected.includes(option.value) ? 'rgba(0, 188, 212, 0.minify-dist-data.mjs)' : 'transparent'
                  }; cursor: pointer; transition: background 0.25s; display: flex; align-items: center; gap: 8px;`}
                  onMouseEnter={(e) => {
                    if (!props.selected.includes(option.value)) {
                      e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!props.selected.includes(option.value)) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                  onClick={() => toggleOption(option.value)}
                >
                  <div style={`width: 18px; height: 18px; border: 2px solid ${
                    props.selected.includes(option.value) ? 'var(--primary)' : 'var(--border-secondary)'
                  }; border-radius: 4px; display: flex; align-items: center; justify-content: center; background: ${
                    props.selected.includes(option.value) ? 'var(--primary)' : 'transparent'
                  }; transition: all 0.25s;`}>
                    {props.selected.includes(option.value) && (
                      <span style="color: white; font-size: 12px; font-weight: bold;">✓</span>
                    )}
                  </div>
                  <div style="flex: 1;">
                    <div style="font-size: 14px; color: var(--text-primary); font-weight: 500;">{option.label}</div>
                    {option.description && (
                      <div style="font-size: 12px; color: var(--text-tertiary); margin-top: 2px;">{option.description}</div>
                    )}
                  </div>
                </button>
              )}
            </For>
              </Show>
            </div>
          </div>
        </Show>
      </div>

      {/* 点击外部关闭 */}
      <Show when={isOpen()}>
        <div
          style="position: fixed; inset: 0; z-index: 999;"
          onClick={() => setIsOpen(false)}
        />
      </Show>
    </div>
  );
}
