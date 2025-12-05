import { splitProps, For, createEffect, type JSX } from 'solid-js';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends JSX.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
}

export function Select(props: SelectProps) {
  const [local, others] = splitProps(props, ['label', 'options', 'class', 'value']);
  let selectRef: HTMLSelectElement | undefined;

  // 使用createEffect确保value在options渲染后正确设置
  createEffect(() => {
    if (selectRef && local.value !== undefined) {
      selectRef.value = String(local.value);
    }
  });

  return (
    <div style="display: flex; flex-direction: column; gap: var(--spacing-sm);">
      {local.label && (
        <label style="font-size: 12px; font-weight: 500; color: var(--text-secondary);">
          {local.label}
        </label>
      )}
      <select
        ref={selectRef}
        class={`select-custom ${local.class || ''}`}
        {...others}
      >
        <For each={local.options}>
          {(option) => (
            <option value={option.value}>{option.label}</option>
          )}
        </For>
      </select>
    </div>
  );
}

