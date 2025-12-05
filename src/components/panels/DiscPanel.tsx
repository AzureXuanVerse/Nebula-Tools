import { createSignal, createEffect, For } from 'solid-js';
import { Card } from '../ui/Card';
import { NumberInput } from '../ui/NumberInput';
import { MultiSelect } from '../ui/MultiSelect';
import type { Disc, Language, Element } from '../../types';

interface DiscPanelProps {
  discs: Disc[];
  language: Language;
  onCommandChange: (command: string) => void;
}

export function DiscPanel(props: DiscPanelProps) {
  const [selectedDiscs, setSelectedDiscs] = createSignal<number[]>([]);
  const [elementFilter, setElementFilter] = createSignal<Element | 'ALL'>('ALL');
  const [level, setLevel] = createSignal<number>(90);
  const [ascension, setAscension] = createSignal<number>(8);
  const [crescendo, setCrescendo] = createSignal<number>(5);

  const elements: Array<{ value: Element | 'ALL'; label: string; icon: string; color: string }> = [
    { value: 'ALL', label: '全部', icon: '⚡', color: 'bg-gray-100 text-gray-600 border-gray-300' },
    { value: 'FIRE', label: '火', icon: '🔥', color: 'bg-red-100 text-red-600 border-red-300' },
    { value: 'AQUA', label: '水', icon: '💧', color: 'bg-blue-100 text-blue-600 border-blue-300' },
    { value: 'WIND', label: '风', icon: '🌪️', color: 'bg-green-100 text-green-600 border-green-300' },
    { value: 'EARTH', label: '地', icon: '🗿', color: 'bg-orange-100 text-orange-600 border-orange-300' },
    { value: 'LIGHT', label: '光', icon: '✨', color: 'bg-yellow-100 text-yellow-600 border-yellow-300' },
    { value: 'DARK', label: '暗', icon: '🌑', color: 'bg-purple-100 text-purple-600 border-purple-300' },
    { value: 'NONE', label: '无', icon: '⚪', color: 'bg-gray-100 text-gray-600 border-gray-300' },
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
    if (selectedDiscs().length === 0) {
      props.onCommandChange('');
      return;
    }

    const parts: string[] = ['disc'];
    parts.push(selectedDiscs().join(' '));
    if (level()) parts.push(`lv${level()}`);
    if (ascension()) parts.push(`a${ascension()}`);
    if (crescendo()) parts.push(`c${crescendo()}`);

    props.onCommandChange(parts.join(' '));
  });

  return (
    <div style="display: flex; flex-direction: column; gap: var(--spacing-lg);">
      <Card title="选择秘纹">
        {/* 元素过滤 */}
        <div style="margin-bottom: var(--spacing-md);">
          <label style="display: block; font-size: 12px; font-weight: 500; color: var(--text-secondary); margin-bottom: var(--spacing-sm);">
            元素筛选
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
                  onClick={() => setElementFilter(elem.value)}
                >
                  <span>{elem.icon}</span>
                  <span>{elem.label}</span>
                </button>
              )}
            </For>
          </div>
        </div>

        <MultiSelect
          label="秘纹列表"
          options={discOptions()}
          selected={selectedDiscs()}
          onChange={(selected) => setSelectedDiscs(selected as number[])}
          placeholder="点击选择秘纹（可多选）"
        />
        <div style="margin-top: var(--spacing-sm); font-size: 14px; color: var(--text-secondary);">
          已选择: <span style="font-weight: 600; color: var(--primary);">{selectedDiscs().length}</span> 个秘纹
        </div>
      </Card>

      <Card title="属性设置">
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
              label="等级 (1-90)"
              min={1}
              max={90}
              value={level()}
              onInput={(e) => setLevel(Number(e.currentTarget.value))}
            />
            <NumberInput
              label="升阶 (0-8)"
              min={0}
              max={8}
              value={ascension()}
              onInput={(e) => setAscension(Number(e.currentTarget.value))}
            />
            <NumberInput
              label="Crescendo (0-5)"
              min={0}
              max={5}
              value={crescendo()}
              onInput={(e) => setCrescendo(Number(e.currentTarget.value))}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
