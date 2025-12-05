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

  // 实时生成命令
  createEffect(() => {
    if (level() < 1 || level() > 40) {
      props.onCommandChange('');
      return;
    }
    props.onCommandChange(`level ${level()}`);
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
            onInput={(e) => setLevel(Number(e.currentTarget.value))}
          />
          
          {/* 数字输入框 */}
          <NumberInput
            label="精确输入"
            min={1}
            max={40}
            value={level()}
            onInput={(e) => setLevel(Number(e.currentTarget.value))}
          />
        </div>
      </Card>
    </div>
  );
}

