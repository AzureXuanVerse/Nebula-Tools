import { splitProps, type JSX } from 'solid-js';

interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  persistKey?: string;
}

export function Input(props: InputProps) {
  const [local, others] = splitProps(props, ['label', 'class', 'onInput', 'value', 'persistKey']);

  return (
    <div style="display: flex; flex-direction: column; gap: var(--spacing-sm);">
      {local.label && (
        <label style="font-size: 12px; font-weight: 500; color: var(--text-secondary);">
          {local.label}
        </label>
      )}
      <input
        class={`input-custom ${local.class || ''}`}
        {...others}
        value={(() => {
          if (!local.persistKey) return local.value as any;
          try {
            const v = localStorage.getItem(local.persistKey);
            if (v) return JSON.parse(v);
          } catch {}
          return local.value as any;
        })()}
        onInput={(e) => {
          if (local.onInput) (local.onInput as any)(e);
          if (local.persistKey) {
            try { localStorage.setItem(local.persistKey, JSON.stringify((e as any).currentTarget.value)); } catch {}
          }
        }}
      />
    </div>
  );
}
