import { createSignal, createEffect, For, onMount } from 'solid-js';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { NumberInput } from '../ui/NumberInput';
import { Button } from '../ui/Button';
import { MultiSelect } from '../ui/MultiSelect';
import type { Language, Item } from '../../types';
import { t } from '../../i18n';

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
    const [newQuantity, setNewQuantity] = createSignal<string>('');
  const [globalQuantityEnabled, setGlobalQuantityEnabled] = createSignal<boolean>(false);

  // 加载物品数据
  onMount(async () => {
    try {
      const response = await fetch('/data/Items.json');
      const data = await response.json();
      setItems(data.items || []);
      try {
        const s = localStorage.getItem('mail.subject');
        if (s) setSubject(JSON.parse(s));
        const b = localStorage.getItem('mail.body');
        if (b) setBody(JSON.parse(b));
        const att = localStorage.getItem('mail.attachments');
        if (att) {
          const arr = JSON.parse(att);
          if (Array.isArray(arr)) setAttachments(arr);
        }
        const gqEnabled = localStorage.getItem('mail.globalQuantityEnabled');
        if (gqEnabled) setGlobalQuantityEnabled(JSON.parse(gqEnabled) === true);
      } catch {}
    } catch (error) {
      console.error('Failed to load items for MailPanel:', error);
    }
  });

  // 选项列表
    const removeAttachment = (index: number) => {
    const next = attachments().filter((_, i) => i !== index);
    setAttachments(next);
    try { localStorage.setItem('mail.attachments', JSON.stringify(next)); } catch {}
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
      const gqStr = newQuantity().trim();
      const useGlobal = globalQuantityEnabled() && gqStr !== '' && Number.isFinite(Number(gqStr));
      const gq = useGlobal ? Number(gqStr) : undefined;
      parts.push(...attachments().map((a) => `${a.itemId} x${useGlobal ? gq : a.quantity}`));
    }

    props.onCommandChange(parts.join(' '));
  });

  return (
    <div style="display: flex; flex-direction: column; gap: var(--spacing-lg);">
      <Card title={t(props.language, 'mail.contentTitle')}>
        <div style="display: flex; flex-direction: column; gap: var(--spacing-md);">
          <Input
            label={t(props.language, 'mail.subjectLabel')}
            placeholder={t(props.language, 'mail.subjectPlaceholder')}
            value={subject()}
            onInput={(e) => {
              const v = e.currentTarget.value;
              setSubject(v);
              try { localStorage.setItem('mail.subject', JSON.stringify(v)); } catch {}
            }}
            persistKey="mail.subject"
          />
          <div style="display: flex; flex-direction: column; gap: var(--spacing-sm);">
            <label style="font-size: 12px; font-weight: 500; color: var(--text-secondary);">
              {t(props.language, 'mail.bodyLabel')}
            </label>
            <textarea
              class="input-custom"
              rows={4}
              placeholder={t(props.language, 'mail.bodyPlaceholder')}
              value={body()}
              onInput={(e) => {
                const v = e.currentTarget.value;
                setBody(v);
                try { localStorage.setItem('mail.body', JSON.stringify(v)); } catch {}
              }}
              style="resize: none;"
            />
          </div>
        </div>
      </Card>

      <Card title={t(props.language, 'mail.attachmentsTitle')}>
        <div style="display: flex; flex-direction: column; gap: var(--spacing-md);">
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <MultiSelect
              label={t(props.language, 'mail.itemIdLabel')}
              language={props.language}
              options={items().map((item) => ({
                value: String(item.id),
                label: `${item.names?.[props.language] || item.names?.en_US || 'Unknown'} - ID: ${item.id}`,
                description: item.type,
              }))}
              selected={attachments().map((a) => a.itemId)}
              onChange={(sel) => {
                const values = sel.map(String);
                const prev = attachments();
                const q = newQuantity().trim();
                const useGlobal = globalQuantityEnabled() && q !== '' && Number.isFinite(Number(q));
                const next = values.map((id) => {
                  const exist = prev.find((a) => a.itemId === id);
                  return exist ? exist : { itemId: id, quantity: useGlobal ? Number(q) : 1 };
                });
                setAttachments(next);
                try { localStorage.setItem('mail.attachments', JSON.stringify(next)); } catch {}
              }}
              persistKey="mail.attachments.selected"
              placeholder={t(props.language, 'selectable.placeholder')}
            />
            <div style="display: flex; align-items: end; gap: 12px;">
              <div style="flex: 1;">
                <NumberInput
                  label={t(props.language, 'mail.quantityLabel')}
                  min={1}
                  max={999}
                  value={newQuantity()}
                  persistKey="mail.globalQuantity"
                  onInput={(e) => setNewQuantity((e as any).currentTarget.value)}
                />
              </div>
              <Button
                variant={globalQuantityEnabled() ? 'accent' : 'secondary'}
                onClick={() => {
                  const next = !globalQuantityEnabled();
                  setGlobalQuantityEnabled(next);
                  try { localStorage.setItem('mail.globalQuantityEnabled', JSON.stringify(next)); } catch {}
                }}
              >
                {globalQuantityEnabled() ? t(props.language, 'mail.globalQuantityToggleOff') : t(props.language, 'mail.globalQuantityToggleOn')}
              </Button>
            </div>
          </div>
          {attachments().length > 0 && (
            <div style="display: flex; flex-direction: column; gap: var(--spacing-sm); margin-top: var(--spacing-md);">
              <div style="display: flex; align-items: center; justify-content: space-between; font-size: 12px; font-weight: 500; color: var(--text-secondary); margin-bottom: var(--spacing-sm);">
                <span>{t(props.language, 'mail.listLabel')}</span>
                <button
                  type="button"
                  style="color: var(--error); background: none; border: none; cursor: pointer; font-size: 12px;"
                  onClick={() => { setAttachments([]); try { localStorage.setItem('mail.attachments', JSON.stringify([])); } catch {} }}
                >
                  {t(props.language, 'mail.deleteAllButton')}
                </button>
              </div>
              <For each={attachments()}>
                {(attachment, index) => (
                  <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;">
                    <div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
                      <div style="padding: 12px; background: var(--bg-tertiary); border-radius: var(--radius-md); width: 100%; display: flex; align-items: center; justify-content: space-between;">
                        <div style="font-size: 14px; font-weight: 500;">ID: {attachment.itemId}</div>
                        <button
                          type="button"
                          style="color: var(--error); background: none; border: none; cursor: pointer; font-size: 12px;"
                          onClick={() => removeAttachment(index())}
                        >
                          {t(props.language, 'mail.deleteButton')}
                        </button>
                      </div>
                      <div style="width: 100%;">
                        <NumberInput
                          label=""
                          min={1}
                          max={999}
                          value={attachment.quantity}
                          onInput={(e) => {
                            const val = Number(e.currentTarget.value) || 1;
                            setAttachments(prev => {
                              const next = prev.slice();
                              next[index()].quantity = val;
                              try { localStorage.setItem('mail.attachments', JSON.stringify(next)); } catch {}
                              return next;
                            });
                          }}
                        />
                      </div>
                    </div>
                    
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
