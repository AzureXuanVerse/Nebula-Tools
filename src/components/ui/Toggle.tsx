import { splitProps, type JSX } from 'solid-js'

interface ToggleProps extends Omit<JSX.HTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked: boolean
  onChange?: (checked: boolean) => void
  persistKey?: string
}

export function Toggle(props: ToggleProps) {
  const [local, others] = splitProps(props, ['checked', 'onChange', 'class', 'persistKey'])

  const handleClick = () => {
    const next = !local.checked
    local.onChange && local.onChange(next)
    if (local.persistKey) {
      try { localStorage.setItem(local.persistKey, JSON.stringify(next)) } catch {}
    }
  }

  try {
    if (local.persistKey) {
      const v = localStorage.getItem(local.persistKey)
      if (v) {
        const parsed = JSON.parse(v)
        if (typeof parsed === 'boolean' && parsed !== local.checked) {
          local.onChange && local.onChange(parsed)
        }
      }
    }
  } catch {}

  return (
    <button
      type="button"
      class={local.class || ''}
      onClick={handleClick}
      style={`position: relative; width: 52px; height: 28px; border-radius: 9999px; border: 1px solid var(--border-primary); background: ${local.checked ? 'var(--primary-gradient)' : 'var(--bg-secondary)'}; box-shadow: ${local.checked ? 'var(--glow-primary)' : 'var(--shadow-sm)'}; transition: background 200ms ease, box-shadow 200ms ease;`}
      {...others}
    >
      <span
        style={`position: absolute; top: 50%; left: ${local.checked ? 'calc(100% - 23px)' : '3px'}; width: 20px; height: 20px; border-radius: 50%; background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.18); transform: translateY(-50%); transition: left 200ms cubic-bezier(0.4,0,0.2,1);`}
      />
    </button>
  )
}

