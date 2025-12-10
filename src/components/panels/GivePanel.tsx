import { createSignal, createEffect, onMount, For, Show } from 'solid-js';
import { Card } from '../ui/Card';
import { SearchableSelect } from '../ui/SearchableSelect';
import { NumberInput } from '../ui/NumberInput';
import { Segmented } from '../ui/Segmented';
import type { Item, Language } from '../../types';
import { t } from '../../i18n';

interface GivePanelProps {
  language: Language;
  onCommandChange: (command: string) => void;
}

export function GivePanel(props: GivePanelProps) {
  const [items, setItems] = createSignal<Item[]>([]);
  const [itemId, setItemId] = createSignal<string>('');
  const [quantity, setQuantity] = createSignal<number>(1);
  const [typeFilter, setTypeFilter] = createSignal<string>('ALL');
  const [mode, setMode] = createSignal<'select' | 'materials'>('select');

  const itemTypes = [
    { value: 'ALL', icon: '⚡', color: 'bg-gray-100 text-gray-600 border-gray-300' },
    { value: 'Res', icon: '💰', color: 'bg-yellow-100 text-yellow-600 border-yellow-300' },
    { value: 'Item', icon: '📦', color: 'bg-blue-100 text-blue-600 border-blue-300' },
    { value: 'Char', icon: '👤', color: 'bg-purple-100 text-purple-600 border-purple-300' },
    { value: 'Energy', icon: '⚡', color: 'bg-green-100 text-green-600 border-green-300' },
    { value: 'CharacterSkin', icon: '🎨', color: 'bg-pink-100 text-pink-600 border-pink-300' },
    { value: 'MonthlyCard', icon: '🎫', color: 'bg-orange-100 text-orange-600 border-orange-300' },
    { value: 'RogueItem', icon: '🎲', color: 'bg-indigo-100 text-indigo-600 border-indigo-300' },
    { value: 'WorldRankExp', icon: '🏆', color: 'bg-teal-100 text-teal-600 border-teal-300' },
    { value: 'Title', icon: '🏷️', color: 'bg-cyan-100 text-cyan-600 border-cyan-300' },
    { value: 'Honor', icon: '🏅', color: 'bg-amber-100 text-amber-600 border-amber-300' },
    { value: 'HeadItem', icon: '🧢', color: 'bg-lime-100 text-lime-600 border-lime-300' },
    { value: 'Disc', icon: '💿', color: 'bg-sky-100 text-sky-600 border-sky-300' },
  ];

  // 加载物品数据
  onMount(async () => {
    try {
      const response = await fetch('/data/Items.json');
      const data = await response.json();
      // 加载所有物品，支持搜索功能
      setItems(data.items || []);
      try {
        const tf = localStorage.getItem('give.typeFilter');
        if (tf) setTypeFilter(JSON.parse(tf));
        const savedId = localStorage.getItem('give.itemId');
        if (savedId) setItemId(JSON.parse(savedId));
        const qty = localStorage.getItem('give.quantity');
        if (qty) setQuantity(Number(JSON.parse(qty)) || 1);
      } catch {}
    } catch (error) {
      console.error('Failed to load items:', error);
    }
  });

  // 过滤物品
  const filteredItems = () => {
    if (typeFilter() === 'ALL') {
      return items();
    }
    return items().filter((item) => item.type === typeFilter());
  };

  // 生成下拉选项
  const itemOptions = () => {
    return [
      { value: '', label: t(props.language, 'give.selectPlaceholder') },
      ...filteredItems().map((item) => ({
        value: String(item.id),
        label: `${item.names?.[props.language] || item.names?.en_US || 'Unknown'} - ID: ${item.id}`,
      }))
    ];
  };

  // 实时生成命令
  createEffect(() => {
    const m = mode();
    if (m === 'materials') {
      props.onCommandChange('giveall materials');
      try { localStorage.setItem('give.mode', JSON.stringify(m)); } catch {}
      return;
    }

    const id = itemId().trim();
    if (!id || id === '') {
      props.onCommandChange('');
      try { localStorage.setItem('give.mode', JSON.stringify(m)); } catch {}
      return;
    }
    props.onCommandChange(`give ${id} x${quantity()}`);
    try { localStorage.setItem('give.mode', JSON.stringify(m)); } catch {}
  });

  return (
    <div style="display: flex; flex-direction: column; gap: var(--spacing-lg);">
      <Card title={t(props.language, 'common.modeTitle')}>
        <Segmented
          options={[
            { value: 'select', label: t(props.language, 'common.mode.select') },
            { value: 'materials', label: t(props.language, 'giveall.typeOptions.materials') },
          ]}
          value={mode()}
          onChange={(e) => setMode(e.currentTarget.value as 'select' | 'materials')}
          persistKey="give.mode"
        />
      </Card>

      <Show when={mode() === 'select'}>
      <Card title={t(props.language, 'give.selectTitle')}>
        {/* 类型过滤 */}
        {mode() === 'select' && (
        <div style="margin-bottom: var(--spacing-md);">
          <label style="display: block; font-size: 12px; font-weight: 500; color: var(--text-secondary); margin-bottom: var(--spacing-sm);">
            {t(props.language, 'give.typeFilter')}
          </label>
          <div style="display: flex; flex-wrap: wrap; gap: var(--spacing-sm);">
            <For each={itemTypes}>
              {(type) => (
                <button
                  type="button"
                  style={`display: inline-flex; align-items: center; gap: 4px; padding: 7px 14px; border-radius: 9999px; font-size: 13px; font-weight: 600; border: 2px solid; cursor: pointer; transition: all 0.25s; ${
                    typeFilter() === type.value
                      ? 'border-color: var(--primary); background: linear-gradient(135deg, var(--primary-light), var(--primary)); color: white; box-shadow: 0 4px 12px rgba(0, 188, 212, 0.5);'
                      : `border-color: transparent; ${type.color.replace('border-', 'border-transparent ')}`
                  }`}
              class={typeFilter() === type.value ? '' : type.color}
                  onClick={() => {
                    setTypeFilter(type.value);
                    try { localStorage.setItem('give.typeFilter', JSON.stringify(type.value)); } catch {}
                  }}
                >
                  <span>{type.icon}</span>
                  <span>{t(props.language, `give.types.${type.value}`)}</span>
                </button>
              )}
            </For>
          </div>
        </div>
        )}

        {mode() === 'select' && (
        <div style="display: flex; flex-direction: column; gap: var(--spacing-md);">
          <SearchableSelect
            label={t(props.language, 'give.listLabel')}
            options={itemOptions()}
            value={itemId()}
            language={props.language}
            onChange={(e) => {
              setItemId(e.currentTarget.value);
              try { localStorage.setItem('give.itemId', JSON.stringify(e.currentTarget.value)); } catch {}
            }}
            persistKey="give.itemId"
          />
          <NumberInput
            label={t(props.language, 'give.quantityLabel')}
            min={1}
            max={9999999}
            value={quantity()}
            onInput={(e) => {
              const val = Number(e.currentTarget.value);
              setQuantity(val);
              try { localStorage.setItem('give.quantity', JSON.stringify(val)); } catch {}
            }}
            persistKey="give.quantity"
          />
        </div>
        )}
      </Card>
      </Show>
    </div>
  );
}
