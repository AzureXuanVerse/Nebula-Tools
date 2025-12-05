import { splitProps, type JSX } from 'solid-js';

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent';
}

export function Button(props: ButtonProps) {
  const [local, others] = splitProps(props, ['variant', 'class', 'children']);
  const variant = local.variant || 'primary';

  const variantClasses = {
    primary: 'btn-custom-primary',
    secondary: 'btn-custom-secondary',
    accent: 'btn-custom-accent',
  };

  return (
    <button
      class={`${variantClasses[variant]} ${local.class || ''}`}
      style="display: inline-flex; align-items: center; gap: var(--spacing-sm); text-decoration: none;"
      {...others}
    >
      {local.children}
    </button>
  );
}

