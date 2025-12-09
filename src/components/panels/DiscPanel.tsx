import { createSignal, createEffect, For, Show } from 'solid-js';
import { Card } from '../ui/Card';
import { Segmented } from '../ui/Segmented';
import { NumberInput } from '../ui/NumberInput';
import { MultiSelect } from '../ui/MultiSelect';
import type { Disc, Language, Element } from '../../types';
import { t } from '../../i18n';

interface DiscPanelProps {
  discs: Disc[];
  language: Language;
  onCommandChange: (command: string) => void;
}

export function DiscPanel(props: DiscPanelProps) {
  const [mode, setMode] = createSignal<'select' | 'all'>('select');
  const [selectedDiscs, setSelectedDiscs] = createSignal<number[]>([]);
  const [elementFilter, setElementFilter] = createSignal<Element | 'ALL'>('ALL');
  const [level, setLevel] = createSignal<number>(90);
  const [ascension, setAscension] = createSignal<number>(8);
  const [crescendo, setCrescendo] = createSignal<number>(5);

  try {
    const ef = localStorage.getItem('disc.elementFilter');
    if (ef) setElementFilter(JSON.parse(ef));
  } catch {}

  const elements: Array<{ value: Element | 'ALL'; icon: string; color: string }> = [
    { value: 'ALL', icon: '⚡', color: 'bg-gray-100 text-gray-600 border-gray-300' },
    { value: 'FIRE', icon: '🔥', color: 'bg-red-100 text-red-600 border-red-300' },
    { value: 'AQUA', icon: '💧', color: 'bg-blue-100 text-blue-600 border-blue-300' },
    { value: 'WIND', icon: '🌪️', color: 'bg-green-100 text-green-600 border-green-300' },
    { value: 'EARTH', icon: '🗿', color: 'bg-orange-100 text-orange-600 border-orange-300' },
    { value: 'LIGHT', icon: '✨', color: 'bg-yellow-100 text-yellow-600 border-yellow-300' },
    { value: 'DARK', icon: '🌑', color: 'bg-purple-100 text-purple-600 border-purple-300' },
    { value: 'NONE', icon: '⚪', color: 'bg-gray-100 text-gray-600 border-gray-300' },
  ];

  // 过滤秘纹
  const filteredDiscs = () => {
    if (elementFilter() === 'ALL') {
      return props.discs;
    }
    return props.discs.filter((disc) => disc.element === elementFilter());
  };

  // 生成下拉选项（不显示元素标签）
  const discOptions = () => {
    return filteredDiscs().map((disc) => ({
      value: disc.id,
      label: disc.names[props.language],
      description: `ID: ${disc.id}`,
    }));
  };

  // 实时生成命令
  createEffect(() => {
    const parts: string[] = ['disc'];
    if (mode() === 'all') {
      parts.push('all');
    } else {
      if (selectedDiscs().length === 0) {
        props.onCommandChange('');
        return;
      }
      parts.push(selectedDiscs().join(' '));
    }

    if (level()) parts.push(`lv${level()}`);
    if (ascension()) parts.push(`a${ascension()}`);
    if (crescendo()) parts.push(`c${crescendo()}`);

    props.onCommandChange(parts.join(' '));
    try { localStorage.setItem('disc.mode', JSON.stringify(mode())); } catch {}
  });

  return (
    <div style="display: flex; flex-direction: column; gap: var(--spacing-lg);">
      <Card title={t(props.language, 'common.modeTitle')}>
        <Segmented
          options={[
            { value: 'select', label: t(props.language, 'common.mode.select') },
            { value: 'all', label: t(props.language, 'common.mode.all') },
          ]}
          value={mode()}
          onChange={(e) => setMode(e.currentTarget.value as 'select' | 'all')}
          persistKey="disc.mode"
        />
      </Card>
      <Show when={mode() === 'select'}>
        <Card title={t(props.language, 'disc.selectTitle')}>
          <div style="margin-bottom: var(--spacing-md);">
            <label style="display: block; font-size: 12px; font-weight: 500; color: var(--text-secondary); margin-bottom: var(--spacing-sm);">
              {t(props.language, 'disc.elementFilter')}
            </label>
            <div style="display: flex; flex-wrap: wrap; gap: var(--spacing-sm);">
              <For each={elements}>
                {(elem) => (
                  <button
                    type="button"
                    style={`display: inline-flex; align-items: center; gap: 4px; padding: 7px 14px; border-radius: 9999px; font-size: 13px; font-weight: 600; border: 2px solid; cursor: pointer; transition: all 0.25s; ${
                      elementFilter() === elem.value
                        ? 'border-color: var(--primary); background: linear-gradient(135deg, var(--primary-light), var(--primary)); color: white; box-shadow: 0 4px 12px rgba(0, 188, 212, 0.5);'
                        : `border-color: transparent; ${elem.color.replace('border-', 'border-transparent ')}`
                    }`}
                    class={elementFilter() === elem.value ? '' : elem.color}
                    onClick={() => {
                      setElementFilter(elem.value);
                      try { localStorage.setItem('disc.elementFilter', JSON.stringify(elem.value)); } catch {}
                    }}
                  >
                    <span>{elem.icon}</span>
                    <span>{t(props.language, `disc.elements.${String(elem.value)}`)}</span>
                  </button>
                )}
              </For>
            </div>
          </div>

          <MultiSelect
            language={props.language}
            label={t(props.language, 'disc.listLabel')}
            options={discOptions()}
            selected={selectedDiscs()}
            onChange={(selected) => setSelectedDiscs(selected as number[])}
            persistKey="disc.selected"
            placeholder={t(props.language, 'disc.placeholder')}
          />
          <div style="margin-top: var(--spacing-sm); font-size: 14px; color: var(--text-secondary);">
            {t(props.language, 'disc.selectedPrefix')} <span style="font-weight: 600; color: var(--primary);">{selectedDiscs().length}</span> {t(props.language, 'disc.selectedSuffix')}
          </div>
        </Card>
      </Show>

      <Card title={t(props.language, 'disc.settingsTitle')}>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--spacing-md);">
          <style>{`
            @media (min-width: 768px) {
              .disc-attr-grid {
                grid-template-columns: repeat(3, 1fr);
              }
            }
          `}</style>
          <div class="disc-attr-grid" style="display: contents;">
            <NumberInput
              label={t(props.language, 'disc.attr.level')}
              min={1}
              max={90}
              value={level()}
              onInput={(e) => setLevel(Number(e.currentTarget.value))}
              persistKey="disc.level"
            />
            <NumberInput
              label={t(props.language, 'disc.attr.ascension')}
              min={0}
              max={8}
              value={ascension()}
              onInput={(e) => setAscension(Number(e.currentTarget.value))}
              persistKey="disc.ascension"
            />
            <NumberInput
              label={t(props.language, 'disc.attr.crescendo')}
              min={0}
              max={5}
              value={crescendo()}
              onInput={(e) => setCrescendo(Number(e.currentTarget.value))}
              persistKey="disc.crescendo"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
