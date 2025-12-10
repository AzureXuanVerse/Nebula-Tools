import { splitProps, type JSX } from 'solid-js';

interface NumberInputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  min?: number;
  max?: number;
  persistKey?: string;
}

export function NumberInput(props: NumberInputProps) {
  const [local, others] = splitProps(props, ['label', 'class', 'min', 'max', 'onInput', 'onChange', 'value', 'persistKey']);

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

    // 调用原始的 onInput 处理器
    if (local.onInput) {
      (local.onInput as unknown as (ev: any) => void)(e as any);
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
        value={(() => {
          if (!local.persistKey) return local.value as any;
          try {
            const v = localStorage.getItem(local.persistKey);
            if (v) return JSON.parse(v);
          } catch {}
          return local.value as any;
        })()}
        class={`input-custom ${local.class || ''}`}
        onInput={(e) => {
          handleInput(e as any);
          if (local.persistKey) {
            try { localStorage.setItem(local.persistKey, JSON.stringify((e as any).currentTarget.value)); } catch {}
          }
        }}
        onChange={local.onChange}
        {...others}
      />
    </div>
  );
}
