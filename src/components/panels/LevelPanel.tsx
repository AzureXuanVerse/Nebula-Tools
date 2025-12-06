import { createSignal, createEffect } from 'solid-js';
import { Card } from '../ui/Card';
import { NumberInput } from '../ui/NumberInput';
import { Slider } from '../ui/Slider';
import type { Language } from '../../types';

interface LevelPanelProps {
  language: Language;
  onCommandChange: (command: string) => void;
}

export function LevelPanel(props: LevelPanelProps) {
  const [level, setLevel] = createSignal<number>(40);

  try {
    const v = localStorage.getItem('level.value');
    if (v) {
      const n = Number(JSON.parse(v));
      if (!Number.isNaN(n)) setLevel(n);
    }
  } catch {}

  // 实时生成命令
  createEffect(() => {
    if (level() < 1 || level() > 40) {
      props.onCommandChange('');
      return;
    }
    props.onCommandChange(`level ${level()}`);
    try { localStorage.setItem('level.value', JSON.stringify(level())); } catch {}
  });

  return (
    <div style="display: flex; flex-direction: column; gap: var(--spacing-lg);">
      <Card title="设置等级">
        <div style="display: flex; flex-direction: column; gap: var(--spacing-md);">
          {/* 滑动条 */}
          <Slider
            label="等级滑块 (1-40)"
            min={1}
            max={40}
            value={level()}
            onInput={(e) => {
              const n = Number(e.currentTarget.value);
              setLevel(n);
              try { localStorage.setItem('level.value', JSON.stringify(n)); } catch {}
            }}
          />
          
          {/* 数字输入框 */}
          <NumberInput
            label="精确输入"
            min={1}
            max={40}
            value={level()}
            onInput={(e) => {
              const n = Number(e.currentTarget.value);
              setLevel(n);
              try { localStorage.setItem('level.value', JSON.stringify(n)); } catch {}
            }}
            persistKey="level.value"
          />
        </div>
      </Card>
    </div>
  );
}
