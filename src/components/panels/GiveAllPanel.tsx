import { createSignal, createEffect } from 'solid-js';
import { Card } from '../ui/Card';
import { Segmented } from '../ui/Segmented';
import { NumberInput } from '../ui/NumberInput';
import { Button } from '../ui/Button';
import type { Language } from '../../types';

interface GiveAllPanelProps {
  language: Language;
  onCommandChange: (command: string) => void;
}

export function GiveAllPanel(props: GiveAllPanelProps) {
  const [type, setType] = createSignal<string>('characters');
  const [level, setLevel] = createSignal<number>(90);
  const [skill, setSkill] = createSignal<number>(10);
  const [talent, setTalent] = createSignal<number>(5);
  const [crescendo, setCrescendo] = createSignal<number>(5);

  const typeOptions = [
    { value: 'characters', label: '所有角色' },
    { value: 'discs', label: '所有秘纹' },
    { value: 'materials', label: '所有材料' },
  ];

  // 实时生成命令
  createEffect(() => {
    const parts: string[] = ['giveall', type()];

    if (type() === 'characters') {
      if (level()) parts.push(`lv${level()}`);
      if (skill()) parts.push(`s${skill()}`);
      if (talent()) parts.push(`t${talent()}`);
    } else if (type() === 'discs') {
      if (level()) parts.push(`lv${level()}`);
      if (crescendo()) parts.push(`c${crescendo()}`);
    }

    props.onCommandChange(parts.join(' '));
  });

  return (
    <div style="display: flex; flex-direction: column; gap: var(--spacing-lg);">
      <Card title="批量类型">
        <Segmented
          options={typeOptions}
          value={type()}
          onChange={(e) => setType(e.currentTarget.value)}
        />
      </Card>

      {type() === 'characters' && (
        <Card title="角色属性">
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--spacing-md);">
            <style>{`
              @media (min-width: 768px) {
                .giveall-char-grid {
                  grid-template-columns: repeat(3, 1fr);
                }
              }
            `}</style>
            <div class="giveall-char-grid" style="display: contents;">
            <NumberInput
              label="等级 (1-90)"
              min={1}
              max={90}
              value={level()}
              onInput={(e) => setLevel(Number(e.currentTarget.value))}
            />
            <NumberInput
              label="技能 (1-10)"
              min={1}
              max={10}
              value={skill()}
              onInput={(e) => setSkill(Number(e.currentTarget.value))}
            />
            <NumberInput
              label="天赋 (0-5)"
              min={0}
              max={5}
              value={talent()}
              onInput={(e) => setTalent(Number(e.currentTarget.value))}
            />
            </div>
          </div>
        </Card>
      )}

      {type() === 'discs' && (
        <Card title="秘纹属性">
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--spacing-md);">
            <NumberInput
              label="等级 (1-90)"
              min={1}
              max={90}
              value={level()}
              onInput={(e) => setLevel(Number(e.currentTarget.value))}
            />
            <NumberInput
              label="Crescendo (0-5)"
              min={0}
              max={5}
              value={crescendo()}
              onInput={(e) => setCrescendo(Number(e.currentTarget.value))}
            />
          </div>
        </Card>
      )}
    </div>
  );
}
