import { splitProps, type JSX } from 'solid-js';

interface NumberInputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  min?: number;
  max?: number;
}

export function NumberInput(props: NumberInputProps) {
  const [local, others] = splitProps(props, ['label', 'class', 'min', 'max', 'onInput', 'onChange', 'value']);

  // 验证并限制输入值
  const handleInput = (e: InputEvent & { currentTarget: HTMLInputElement }) => {
    let value = Number(e.currentTarget.value);

    // 应用最小值限制
    if (local.min !== undefined && value < local.min) {
      value = local.min;
      e.currentTarget.value = String(value);
    }

    // 应用最大值限制
    if (local.max !== undefined && value > local.max) {
      value = local.max;
      e.currentTarget.value = String(value);
    }

    // 调用原始的onInput处理器
    if (local.onInput) {
      local.onInput(e);
    }
  };

  return (
    <div style="display: flex; flex-direction: column; gap: var(--spacing-sm);">
      {local.label && (
        <label style="font-size: 12px; font-weight: 500; color: var(--text-secondary);">
          {local.label}
        </label>
      )}
      <input
        type="number"
        min={local.min}
        max={local.max}
        value={local.value}
        class={`input-custom ${local.class || ''}`}
        onInput={handleInput}
        onChange={local.onChange}
        {...others}
      />
    </div>
  );
}

