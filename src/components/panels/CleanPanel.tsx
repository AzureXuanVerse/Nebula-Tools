import { createSignal, createEffect } from 'solid-js';
import { Card } from '../ui/Card';
import { Segmented } from '../ui/Segmented';
import { MultiSelect } from '../ui/MultiSelect';
import type { Item, Language } from '../../types';

interface CleanPanelProps {
  language: Language;
  onCommandChange: (command: string) => void;
}

export function CleanPanel(props: CleanPanelProps) {
  const [items, setItems] = createSignal<Item[]>([]);
  const [selectedIds, setSelectedIds] = createSignal<(string | number)[]>([]);
  const [type, setType] = createSignal<string>('items');

  const typeOptions = [
    { value: 'all', label: '全部' },
    { value: 'items', label: '物品' },
    { value: 'resources', label: '资源' },
  ];

  // 加载物品数据
  (async () => {
    try {
      const res = await fetch('/data/Items.json');
      const data = await res.json();
      setItems(data.items || []);
    } catch (e) {
      console.error('Failed to load items for CleanPanel', e);
    }
  })();

  // 实时生成命令
  createEffect(() => {
    const parts: string[] = ['clean'];

    if (type() === 'all') {
      parts.push('all');
    } else {
      const idList = selectedIds().map(String);
      if (idList.length === 0) {
        props.onCommandChange('');
        return;
      }
      parts.push(...idList);
      parts.push(type());
    }

    props.onCommandChange(parts.join(' '));
  });

  return (
    <div style="display: flex; flex-direction: column; gap: var(--spacing-lg);">
      <Card>
        <div style="display: flex; flex-direction: column; gap: var(--spacing-md);">
          {type() !== 'all' && (
            <MultiSelect
              label="物品 ID"
              options={(items()
                .filter((it) => (type() === 'items' ? it.type === 'Item' : it.type === 'Res'))
                .map((it) => ({
                  value: it.id,
                  label: `${it.names?.[props.language] || it.names?.en_US || 'Unknown'} - ID: ${it.id}`,
                  description: it.type,
                })))}
              selected={selectedIds()}
              onChange={setSelectedIds}
              placeholder="选择或搜索物品"
            />
          )}

          <div style="display: flex; flex-direction: column; gap: var(--spacing-sm);">
            <label style="font-size: 12px; font-weight: 500; color: var(--text-secondary);">
              清除类型
            </label>
            <Segmented
              options={typeOptions}
              value={type()}
              onChange={(e) => setType(e.currentTarget.value)}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
