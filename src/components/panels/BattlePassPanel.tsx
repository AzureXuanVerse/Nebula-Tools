import { createSignal, createEffect } from 'solid-js';
import { Card } from '../ui/Card';
import { NumberInput } from '../ui/NumberInput';
import { Slider } from '../ui/Slider';
import { Segmented } from '../ui/Segmented';
import type { Language, BattlePassParams } from '../../types';
import { generateBattlePassCommand } from '../../utils/commandGenerator';

interface BattlePassPanelProps {
  language: Language;
  onCommandChange: (command: string) => void;
}

export function BattlePassPanel(props: BattlePassPanelProps) {
  const [mode, setMode] = createSignal<'free' | 'premium' | undefined>(undefined);
  const [level, setLevel] = createSignal<number>(50);

  try {
    const savedMode = localStorage.getItem('battlepass.mode');
    if (savedMode) setMode(JSON.parse(savedMode));
    const savedLevel = localStorage.getItem('battlepass.level');
    if (savedLevel) setLevel(JSON.parse(savedLevel));
  } catch {}

  createEffect(() => {
    const params: BattlePassParams = {
      mode: mode(),
      level: level(),
    };
    props.onCommandChange(generateBattlePassCommand(params));
  });

  return (
    <div style="display: flex; flex-direction: column; gap: var(--spacing-lg);">
      <Card title="基金设置">
        <div style="display: flex; flex-direction: column; gap: var(--spacing-lg);">
          {/* 模式选择 */}
          <div style="display: flex; flex-direction: column; gap: var(--spacing-sm);">
            <label style="font-size: 14px; font-weight: 500; color: var(--text-secondary);">
              基金补贴
            </label>
            <Segmented
              options={[
                { label: '无', value: '' },
                { label: '基础', value: 'free' },
                { label: '尊享', value: 'premium' },
              ]}
              value={mode() || ''}
              onChange={(e) => {
                const val = e.currentTarget.value;
                setMode(val ? (val as 'free' | 'premium') : undefined);
                try { localStorage.setItem('battlepass.mode', JSON.stringify(val ? (val as 'free' | 'premium') : undefined)); } catch {}
              }}
            />
          </div>

          {/* 等级设置 */}
          <div style="width: 100%;">
            <div style="display: flex; flex-direction: column; gap: var(--spacing-md);">
              <Slider
                label={`等级: ${level()}`}
                min={0}
                max={50}
                value={level()}
                onInput={(e) => {
                  const val = Number(e.currentTarget.value);
                  setLevel(val);
                  try { localStorage.setItem('battlepass.level', JSON.stringify(val)); } catch {}
                }}
              />
              <NumberInput
                label=""
                min={0}
                max={50}
                value={level()}
                onInput={(e) => {
                  const val = Number(e.currentTarget.value);
                  setLevel(val);
                  try { localStorage.setItem('battlepass.level', JSON.stringify(val)); } catch {}
                }}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
