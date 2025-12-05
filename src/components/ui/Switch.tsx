import { splitProps } from 'solid-js';

interface SwitchProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Switch(props: SwitchProps) {
  const [local] = splitProps(props, ['label', 'checked', 'onChange']);

  return (
    <label class="flex items-center justify-between cursor-pointer">
      {local.label && (
        <span class="text-sm font-medium text-text-secondary">
          {local.label}
        </span>
      )}
      <div class="relative">
        <input
          type="checkbox"
          class="sr-only"
          checked={local.checked}
          onChange={(e) => local.onChange(e.currentTarget.checked)}
        />
        <div
          class={`w-12 h-6 rounded-full transition-colors duration-200 ${
            local.checked ? 'bg-gradient-to-r from-primary to-primary-light shadow-sm shadow-primary/40' : 'bg-gray-300'
          }`}
        >
          <div
            class={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${
              local.checked ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </div>
      </div>
    </label>
  );
}

