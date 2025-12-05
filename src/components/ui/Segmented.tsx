import { For, splitProps, type JSX } from 'solid-js'

interface SegmentedOption {
  value: string
  label: string
}

interface SegmentedProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: SegmentedOption[]
  value: string
  onChange?: (e: { currentTarget: { value: string }; target: { value: string } }) => void
}

export function Segmented(props: SegmentedProps) {
  const [local, others] = splitProps(props, ['options', 'value', 'onChange', 'class'])

  const selectedIndex = () => Math.max(0, local.options.findIndex(o => o.value === local.value))

  const handleSelect = (val: string) => {
    local.onChange && local.onChange({ currentTarget: { value: val }, target: { value: val } })
  }

  return (
    <div
      class={`segmented ${local.class || ''}`}
      style={`--count: ${local.options.length}; --index: ${selectedIndex()};`}
      {...others}
    >
      <div class="segmented-track" />
      <div class="segmented-thumb" />
      <ul class="segmented-list">
        <For each={local.options}>
          {(opt, i) => (
            <li>
              <button
                type="button"
                class={`segmented-item ${i() === selectedIndex() ? 'is-active' : ''}`}
                onClick={() => handleSelect(opt.value)}
              >
                {opt.label}
              </button>
            </li>
          )}
        </For>
      </ul>
      <style>{`
        .segmented {
          position: relative;
          display: inline-block;
          width: 100%;
          height: 40px;
          --segmented-primary: var(--primary);
          --segmented-border: var(--border-secondary);
          --segmented-bg: var(--bg-secondary);
        }
        .segmented-track {
          position: absolute;
          inset: 0;
          background: var(--segmented-bg);
          border: 1px solid var(--segmented-border);
          border-radius: 9999px;
          box-shadow: var(--shadow-sm);
        }
        .segmented-thumb {
          position: absolute;
          top: 4px;
          bottom: 4px;
          left: 4px;
          width: calc((100% - 8px) / var(--count));
          transform: translateX(calc(var(--index) * 100%));
          background: var(--primary-gradient);
          border-radius: 9999px;
          box-shadow: 0 2px 10px rgba(0, 188, 212, 0.25);
          transition: transform 220ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        .segmented-list {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: repeat(var(--count), 1fr);
          height: 100%;
          margin: 0;
          padding: 0 10px;
          list-style: none;
          gap: 0;
        }
        .segmented-item {
          width: 100%;
          height: 100%;
          border: none;
          background: transparent;
          color: var(--text-primary);
          font-size: 13px;
          font-weight: 600;
          border-radius: 9999px;
          cursor: pointer;
          transition: color 160ms ease;
        }
        .segmented-item.is-active {
          color: white;
        }
      `}</style>
    </div>
  )
}
