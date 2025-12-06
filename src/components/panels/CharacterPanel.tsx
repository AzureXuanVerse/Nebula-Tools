import { createSignal, createEffect, For } from 'solid-js';
import { Card } from '../ui/Card';
import { NumberInput } from '../ui/NumberInput';
import { MultiSelect } from '../ui/MultiSelect';
import type { Character, Language, Element } from '../../types';
import { t } from '../../i18n';
import { getElementIcon } from '../../utils/dataLoader';

interface CharacterPanelProps {
  characters: Character[];
  language: Language;
  onCommandChange: (command: string) => void;
}

export function CharacterPanel(props: CharacterPanelProps) {
  const [selectedCharacters, setSelectedCharacters] = createSignal<number[]>([]);
  const [elementFilter, setElementFilter] = createSignal<Element | 'ALL'>('ALL');
  const [level, setLevel] = createSignal<number>(90);
  const [ascension, setAscension] = createSignal<number>(8);
  const [skill, setSkill] = createSignal<number>(10);
  const [talent, setTalent] = createSignal<number>(5);
  const [favor, setFavor] = createSignal<number>(50);

  try {
    const ef = localStorage.getItem('character.elementFilter');
    if (ef) setElementFilter(JSON.parse(ef));
  } catch {}

  const elements: Array<{ value: Element | 'ALL'; label: string; icon: string; color: string }> = [
    { value: 'ALL', label: '全部', icon: '⚡', color: 'bg-gray-100 text-gray-600 border-gray-300' },
    { value: 'FIRE', label: '火', icon: '🔥', color: 'bg-red-100 text-red-600 border-red-300' },
    { value: 'AQUA', label: '水', icon: '💧', color: 'bg-blue-100 text-blue-600 border-blue-300' },
    { value: 'WIND', label: '风', icon: '🌪️', color: 'bg-green-100 text-green-600 border-green-300' },
    { value: 'EARTH', label: '地', icon: '🗿', color: 'bg-orange-100 text-orange-600 border-orange-300' },
    { value: 'LIGHT', label: '光', icon: '✨', color: 'bg-yellow-100 text-yellow-600 border-yellow-300' },
    { value: 'DARK', label: '暗', icon: '🌑', color: 'bg-purple-100 text-purple-600 border-purple-300' },
  ];

  // 过滤角色
  const filteredCharacters = () => {
    if (elementFilter() === 'ALL') {
      return props.characters;
    }
    return props.characters.filter((char) => char.element === elementFilter());
  };

  // 生成下拉选项
  const characterOptions = () => {
    return filteredCharacters().map((char) => ({
      value: char.id,
      label: char.names[props.language],
      description: `ID: ${char.id}`,
    }));
  };

  // 实时生成命令
  createEffect(() => {
    if (selectedCharacters().length === 0) {
      props.onCommandChange('');
      return;
    }

    const parts: string[] = ['character'];
    parts.push(selectedCharacters().join(' '));
    if (level()) parts.push(`lv${level()}`);
    if (ascension()) parts.push(`a${ascension()}`);
    if (skill()) parts.push(`s${skill()}`);
    if (talent()) parts.push(`t${talent()}`);
    if (favor()) parts.push(`f${favor()}`);

    props.onCommandChange(parts.join(' '));
  });

  return (
    <div style="display: flex; flex-direction: column; gap: var(--spacing-lg);">
      <Card title={t(props.language, 'character.selectTitle')}>
        {/* 元素过滤 */}
        <div style="margin-bottom: var(--spacing-md);">
          <label style="display: block; font-size: 12px; font-weight: 500; color: var(--text-secondary); margin-bottom: var(--spacing-sm);">
            {t(props.language, 'character.elementFilter')}
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
                    try { localStorage.setItem('character.elementFilter', JSON.stringify(elem.value)); } catch {}
                  }}
                >
                  <span>{elem.icon}</span>
                  <span>{t(props.language, `character.elements.${String(elem.value)}`)}</span>
                </button>
              )}
            </For>
          </div>
        </div>

        <MultiSelect
          language={props.language}
          label={t(props.language, 'character.listLabel')}
          options={characterOptions()}
          selected={selectedCharacters()}
          onChange={(selected) => setSelectedCharacters(selected as number[])}
          persistKey="character.selected"
          placeholder={t(props.language, 'character.placeholder')}
        />
        <div style="margin-top: var(--spacing-sm); font-size: 14px; color: var(--text-secondary);">
          {t(props.language, 'character.selectedPrefix')} <span style="font-weight: 600; color: var(--primary);">{selectedCharacters().length}</span> {t(props.language, 'character.selectedSuffix')}
        </div>
      </Card>

      <Card title={t(props.language, 'character.settingsTitle')}>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--spacing-md);">
          <style>{`
            @media (min-width: 768px) {
              .attr-grid {
                grid-template-columns: repeat(3, 1fr);
              }
            }
          `}</style>
          <div class="attr-grid" style="display: contents;">
            <NumberInput
              label={t(props.language, 'character.attr.level')}
              min={1}
              max={90}
              value={level()}
              onInput={(e) => setLevel(Number(e.currentTarget.value))}
              persistKey="character.level"
            />
            <NumberInput
              label={t(props.language, 'character.attr.ascension')}
              min={0}
              max={8}
              value={ascension()}
              onInput={(e) => setAscension(Number(e.currentTarget.value))}
              persistKey="character.ascension"
            />
            <NumberInput
              label={t(props.language, 'character.attr.skill')}
              min={1}
              max={10}
              value={skill()}
              onInput={(e) => setSkill(Number(e.currentTarget.value))}
              persistKey="character.skill"
            />
            <NumberInput
              label={t(props.language, 'character.attr.talent')}
              min={0}
              max={5}
              value={talent()}
              onInput={(e) => setTalent(Number(e.currentTarget.value))}
              persistKey="character.talent"
            />
            <NumberInput
              label={t(props.language, 'character.attr.favor')}
              min={0}
              max={50}
              value={favor()}
              onInput={(e) => setFavor(Number(e.currentTarget.value))}
              persistKey="character.favor"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
