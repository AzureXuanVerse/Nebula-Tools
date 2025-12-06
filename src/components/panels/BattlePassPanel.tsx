import { createSignal, createEffect } from 'solid-js';
import { Card } from '../ui/Card';
import { NumberInput } from '../ui/NumberInput';
import { Slider } from '../ui/Slider';
import { Segmented } from '../ui/Segmented';
import { t } from '../../i18n';
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
      <Card title={t(props.language, 'battlepass.title')}>
        <div style="display: flex; flex-direction: column; gap: var(--spacing-lg);">
          {/* 模式选择 */}
          <div style="display: flex; flex-direction: column; gap: var(--spacing-sm);">
            <label style="font-size: 14px; font-weight: 500; color: var(--text-secondary);">
              {t(props.language, 'battlepass.modeLabel')}
            </label>
            <Segmented
              options={[
                { label: t(props.language, 'battlepass.mode.keep'), value: '' },
                { label: t(props.language, 'battlepass.mode.free'), value: 'free' },
                { label: t(props.language, 'battlepass.mode.premium'), value: 'premium' },
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
                label={`${t(props.language, 'battlepass.levelPrefix')}${level()}`}
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
