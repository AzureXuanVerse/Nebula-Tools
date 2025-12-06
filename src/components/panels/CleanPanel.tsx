import { createSignal, createEffect, onMount } from 'solid-js';
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

    // 从localStorage加载保存的状态
    onMount(() => {
        try {
            const t = localStorage.getItem('clean.type');
            if (t) setType(JSON.parse(t));
            const sel = localStorage.getItem('clean.selected');
            if (sel) {
                const arr = JSON.parse(sel);
                if (Array.isArray(arr)) setSelectedIds(arr);
            }
        } catch {}
    });

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
                    <div style="display: flex; flex-direction: column; gap: var(--spacing-sm);">
                        <label style="font-size: 12px; font-weight: 500; color: var(--text-secondary);">
                            清除类型
                        </label>
                        <Segmented
                            options={typeOptions}
                            value={type()}
                            onChange={(e) => {
                                setType(e.currentTarget.value);
                                try { localStorage.setItem('clean.type', JSON.stringify(e.currentTarget.value)); } catch {}
                            }}
                            persistKey="clean.type"
                        />
                    </div>

                    {/* 物品ID选择器 */}
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
                            onChange={(sel) => {
                                setSelectedIds(sel);
                                try { localStorage.setItem('clean.selected', JSON.stringify(sel)); } catch {}
                            }}
                            persistKey="clean.selected"
                            placeholder="选择或搜索物品"
                        />
                    )}
                </div>
            </Card>
        </div>
    );
}