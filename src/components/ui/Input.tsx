import { splitProps, type JSX } from 'solid-js';

interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input(props: InputProps) {
  const [local, others] = splitProps(props, ['label', 'class']);

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
      />
    </div>
  );
}

