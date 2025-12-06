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
  const [discAscension, setDiscAscension] = createSignal<number>(8);

  try {
    const t = localStorage.getItem('giveall.type');
    if (t) setType(JSON.parse(t));
    const lv = localStorage.getItem('giveall.level');
    if (lv) setLevel(Number(JSON.parse(lv)) || 90);
    const sk = localStorage.getItem('giveall.skill');
    if (sk) setSkill(Number(JSON.parse(sk)) || 10);
    const tl = localStorage.getItem('giveall.talent');
    if (tl) setTalent(Number(JSON.parse(tl)) || 5);
    const cr = localStorage.getItem('giveall.crescendo');
    if (cr) setCrescendo(Number(JSON.parse(cr)) || 5);
    const as = localStorage.getItem('giveall.discAscension');
    if (as) setDiscAscension(Number(JSON.parse(as)) || 8);
  } catch {}

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
      if (discAscension() !== undefined) parts.push(`a${discAscension()}`);
      if (crescendo()) parts.push(`c${crescendo()}`);
    }

    props.onCommandChange(parts.join(' '));
    try {
      localStorage.setItem('giveall.type', JSON.stringify(type()));
      localStorage.setItem('giveall.level', JSON.stringify(level()));
      localStorage.setItem('giveall.skill', JSON.stringify(skill()));
      localStorage.setItem('giveall.talent', JSON.stringify(talent()));
      localStorage.setItem('giveall.crescendo', JSON.stringify(crescendo()));
      localStorage.setItem('giveall.discAscension', JSON.stringify(discAscension()));
    } catch {}
  });

  return (
    <div style="display: flex; flex-direction: column; gap: var(--spacing-lg);">
      <Card title="批量类型">
        <Segmented
          options={typeOptions}
          value={type()}
          onChange={(e) => {
            setType(e.currentTarget.value);
            try { localStorage.setItem('giveall.type', JSON.stringify(e.currentTarget.value)); } catch {}
          }}
          persistKey="giveall.type"
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
              onInput={(e) => {
                const n = Number(e.currentTarget.value);
                setLevel(n);
                try { localStorage.setItem('giveall.level', JSON.stringify(n)); } catch {}
              }}
              persistKey="giveall.level"
            />
            <NumberInput
              label="技能 (1-10)"
              min={1}
              max={10}
              value={skill()}
              onInput={(e) => {
                const n = Number(e.currentTarget.value);
                setSkill(n);
                try { localStorage.setItem('giveall.skill', JSON.stringify(n)); } catch {}
              }}
              persistKey="giveall.skill"
            />
            <NumberInput
              label="天赋 (0-5)"
              min={0}
              max={5}
              value={talent()}
              onInput={(e) => {
                const n = Number(e.currentTarget.value);
                setTalent(n);
                try { localStorage.setItem('giveall.talent', JSON.stringify(n)); } catch {}
              }}
              persistKey="giveall.talent"
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
              onInput={(e) => {
                const n = Number(e.currentTarget.value);
                setLevel(n);
                try { localStorage.setItem('giveall.level', JSON.stringify(n)); } catch {}
              }}
              persistKey="giveall.level"
            />
            <NumberInput
              label="阶段 (0-8)"
              min={0}
              max={8}
              value={discAscension()}
              onInput={(e) => {
                const n = Number(e.currentTarget.value);
                setDiscAscension(n);
                try { localStorage.setItem('giveall.discAscension', JSON.stringify(n)); } catch {}
              }}
              persistKey="giveall.discAscension"
            />
            <NumberInput
              label="星级 (0-5)"
              min={0}
              max={5}
              value={crescendo()}
              onInput={(e) => {
                const n = Number(e.currentTarget.value);
                setCrescendo(n);
                try { localStorage.setItem('giveall.crescendo', JSON.stringify(n)); } catch {}
              }}
              persistKey="giveall.crescendo"
            />
          </div>
        </Card>
      )}
    </div>
  );
}
