import { createSignal, createEffect } from 'solid-js';
import { Card } from '../ui/Card';
import { Segmented } from '../ui/Segmented';
import { NumberInput } from '../ui/NumberInput';
import { Button } from '../ui/Button';
import type { Language } from '../../types';
import { t } from '../../i18n';

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
    { value: 'characters', label: t(props.language, 'giveall.typeOptions.characters') },
    { value: 'discs', label: t(props.language, 'giveall.typeOptions.discs') },
    { value: 'materials', label: t(props.language, 'giveall.typeOptions.materials') },
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
      <Card title={t(props.language, 'giveall.typeTitle')}>
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
        <Card title={t(props.language, 'giveall.char.title')}>
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
              label={t(props.language, 'giveall.char.attr.level')}
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
              label={t(props.language, 'giveall.char.attr.skill')}
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
              label={t(props.language, 'giveall.char.attr.talent')}
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
        <Card title={t(props.language, 'giveall.disc.title')}>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--spacing-md);">
            <NumberInput
              label={t(props.language, 'giveall.disc.attr.level')}
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
              label={t(props.language, 'giveall.disc.attr.ascension')}
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
              label={t(props.language, 'giveall.disc.attr.crescendo')}
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
