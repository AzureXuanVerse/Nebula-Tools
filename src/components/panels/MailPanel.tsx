import { createSignal, createEffect, For, onMount } from 'solid-js';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { NumberInput } from '../ui/NumberInput';
import { Button } from '../ui/Button';
import { SearchableSelect } from '../ui/SearchableSelect';
import type { Language, Item } from '../../types';

interface MailPanelProps {
  language: Language;
  onCommandChange: (command: string) => void;
}

interface Attachment {
  itemId: string;
  quantity: number;
}

export function MailPanel(props: MailPanelProps) {
  const [items, setItems] = createSignal<Item[]>([]);
  const [subject, setSubject] = createSignal<string>('');
  const [body, setBody] = createSignal<string>('');
  const [attachments, setAttachments] = createSignal<Attachment[]>([]);
  const [newItemId, setNewItemId] = createSignal<string>('');
  const [newQuantity, setNewQuantity] = createSignal<number>(1);

  // 加载物品数据
  onMount(async () => {
    try {
      const response = await fetch('/data/Items.json');
      const data = await response.json();
      setItems(data.items || []);
    } catch (error) {
      console.error('Failed to load items for MailPanel:', error);
    }
  });

  // 选项列表
  const itemOptions = () => [
    { value: '', label: '-- 请选择物品 --' },
    ...items().map((item) => ({
      value: String(item.id),
      label: `${item.names?.[props.language] || item.names?.en_US || 'Unknown'} - ID: ${item.id}`,
    })),
  ];

  const addAttachment = () => {
    const id = newItemId().trim();
    if (!id) return;

    setAttachments([
      ...attachments(),
      { itemId: id, quantity: newQuantity() },
    ]);
    setNewItemId('');
    setNewQuantity(1);
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments().filter((_, i) => i !== index));
  };

  // 实时生成命令
  createEffect(() => {
    if (!subject().trim() || !body().trim()) {
      props.onCommandChange('');
      return;
    }

    const parts: string[] = ['mail'];
    parts.push(`"${subject()}"`);
    parts.push(`"${body()}"`);

    if (attachments().length > 0) {
      parts.push(...attachments().map((a) => `${a.itemId} x${a.quantity}`));
    }

    props.onCommandChange(parts.join(' '));
  });

  return (
    <div style="display: flex; flex-direction: column; gap: var(--spacing-lg);">
      <Card title="邮件内容">
        <div style="display: flex; flex-direction: column; gap: var(--spacing-md);">
          <Input
            label="邮件主题"
            placeholder="输入邮件主题"
            value={subject()}
            onInput={(e) => setSubject(e.currentTarget.value)}
          />
          <div style="display: flex; flex-direction: column; gap: var(--spacing-sm);">
            <label style="font-size: 12px; font-weight: 500; color: var(--text-secondary);">
              邮件正文
            </label>
            <textarea
              class="input-custom"
              rows={4}
              placeholder="输入邮件正文"
              value={body()}
              onInput={(e) => setBody(e.currentTarget.value)}
              style="resize: none;"
            />
          </div>
        </div>
      </Card>

      <Card title="附件">
        <div style="display: flex; flex-direction: column; gap: var(--spacing-md);">
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <SearchableSelect
              label="物品 ID"
              options={itemOptions()}
              value={newItemId()}
              onChange={(e) => {
                const v = e.currentTarget.value;
                setNewItemId(v);
                if (v && v.trim()) {
                  addAttachment();
                }
              }}
            />
            <NumberInput
              label="数量"
              min={1}
              max={999}
              value={newQuantity()}
              onInput={(e) => setNewQuantity(Number(e.currentTarget.value))}
              onKeyDown={(e) => {
                if ((e as unknown as KeyboardEvent).key === 'Enter' && newItemId().trim()) {
                  addAttachment();
                }
              }}
            />
          </div>
          <Button variant="secondary" onClick={addAttachment}>
            添加附件
          </Button>

          {attachments().length > 0 && (
            <div style="display: flex; flex-direction: column; gap: var(--spacing-sm); margin-top: var(--spacing-md);">
              <div style="font-size: 12px; font-weight: 500; color: var(--text-secondary); margin-bottom: var(--spacing-sm);">
                附件列表:
              </div>
              <For each={attachments()}>
                {(attachment, index) => (
                  <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: var(--bg-tertiary); border-radius: var(--radius-md);">
                    <div style="font-size: 14px;">
                      <span style="font-weight: 500;">ID: {attachment.itemId}</span>
                      <span style="color: var(--text-tertiary); margin-left: 8px;">
                        × {attachment.quantity}
                      </span>
                    </div>
                    <button
                      style="color: var(--error); background: none; border: none; cursor: pointer; font-size: 14px; transition: opacity 0.25s;"
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                      onClick={() => removeAttachment(index())}
                    >
                      删除
                    </button>
                  </div>
                )}
              </For>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
