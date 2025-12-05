import { splitProps, type JSX } from 'solid-js';

interface CardProps extends JSX.HTMLAttributes<HTMLDivElement> {
  title?: string;
  glow?: boolean;
}

export function Card(props: CardProps) {
  const [local, others] = splitProps(props, ['title', 'glow', 'class', 'children']);

  return (
    <div
      class={`${local.glow ? 'custom-card-glow' : 'custom-card'} ${local.class || ''}`}
      {...others}
    >
      {local.title && (
        <h3 style="font-size: 20px; font-weight: 600; color: var(--text-primary); margin-bottom: var(--spacing-md); display: flex; align-items: center; gap: var(--spacing-sm);">
          <div style="width: 4px; height: 20px; background: var(--primary-gradient); border-radius: var(--radius-full); box-shadow: 0 0 8px rgba(0, 188, 212, 0.4);" />
          {local.title}
        </h3>
      )}
      {local.children}
    </div>
  );
}

