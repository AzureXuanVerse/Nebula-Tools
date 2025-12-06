import { createSignal, createEffect, onMount, For } from 'solid-js';
import { Card } from '../ui/Card';
import { SearchableSelect } from '../ui/SearchableSelect';
import { NumberInput } from '../ui/NumberInput';
import type { Item, Language } from '../../types';

interface GivePanelProps {
  language: Language;
  onCommandChange: (command: string) => void;
}

export function GivePanel(props: GivePanelProps) {
  const [items, setItems] = createSignal<Item[]>([]);
  const [itemId, setItemId] = createSignal<string>('');
  const [quantity, setQuantity] = createSignal<number>(1);
  const [typeFilter, setTypeFilter] = createSignal<string>('ALL');

  const itemTypes = [
    { value: 'ALL', label: '全部', icon: '⚡', color: 'bg-gray-100 text-gray-600 border-gray-300' },
    { value: 'Res', label: '资源', icon: '💰', color: 'bg-yellow-100 text-yellow-600 border-yellow-300' },
    { value: 'Item', label: '物品', icon: '📦', color: 'bg-blue-100 text-blue-600 border-blue-300' },
    { value: 'Char', label: '角色', icon: '👤', color: 'bg-purple-100 text-purple-600 border-purple-300' },
    { value: 'Energy', label: '能量', icon: '⚡', color: 'bg-green-100 text-green-600 border-green-300' },
    { value: 'CharacterSkin', label: '皮肤', icon: '🎨', color: 'bg-pink-100 text-pink-600 border-pink-300' },
    { value: 'MonthlyCard', label: '月卡', icon: '🎫', color: 'bg-orange-100 text-orange-600 border-orange-300' },
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
      { value: '', label: '-- 请选择物品 --' },
      ...filteredItems().map((item) => ({
        value: String(item.id),
        label: `${item.names?.[props.language] || item.names?.en_US || 'Unknown'} - ID: ${item.id}`,
      }))
    ];
  };

  // 实时生成命令
  createEffect(() => {
    const id = itemId().trim();
    if (!id || id === '') {
      props.onCommandChange('');
      return;
    }
    props.onCommandChange(`give ${id} x${quantity()}`);
  });

  return (
    <div style="display: flex; flex-direction: column; gap: var(--spacing-lg);">
      <Card title="选择物品">
        {/* 类型过滤 */}
        <div style="margin-bottom: var(--spacing-md);">
          <label style="display: block; font-size: 12px; font-weight: 500; color: var(--text-secondary); margin-bottom: var(--spacing-sm);">
            类型筛选
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
                  <span>{type.label}</span>
                </button>
              )}
            </For>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: var(--spacing-md);">
          <SearchableSelect
            label="物品列表"
            options={itemOptions()}
            value={itemId()}
            onChange={(e) => {
              setItemId(e.currentTarget.value);
              try { localStorage.setItem('give.itemId', JSON.stringify(e.currentTarget.value)); } catch {}
            }}
            persistKey="give.itemId"
          />
          <NumberInput
            label="数量"
            min={1}
            max={999}
            value={quantity()}
            onInput={(e) => {
              const val = Number(e.currentTarget.value);
              setQuantity(val);
              try { localStorage.setItem('give.quantity', JSON.stringify(val)); } catch {}
            }}
            persistKey="give.quantity"
          />
        </div>
      </Card>
    </div>
  );
}
