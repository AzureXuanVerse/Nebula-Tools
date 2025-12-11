import { createSignal, createEffect, Show, createMemo } from 'solid-js';
import { Card } from '../ui/Card';
import { Segmented } from '../ui/Segmented';
import { NumberInput } from '../ui/NumberInput';
import { Input } from '../ui/Input';
import { t } from '../../i18n';
import type { Language, BanParams } from '../../types';
import { generateBanCommand } from '../../utils/commandGenerator';

interface BanPanelProps {
  language: Language;
  onCommandChange: (command: string) => void;
  connectionMode?: 'admin' | 'player';
  targetUid?: string;
}

export function BanPanel(props: BanPanelProps) {
  const [mode, setMode] = createSignal<'ban' | 'unban'>('ban');
  const [scope, setScope] = createSignal<'all' | 'ip' | 'uid'>('uid');
  const init = new Date(Date.now() + 3600000);
  const [year, setYear] = createSignal<number>(init.getFullYear());
  const [month, setMonth] = createSignal<number>(init.getMonth() + 1);
  const [day, setDay] = createSignal<number>(init.getDate());
  const [hour, setHour] = createSignal<number>(init.getHours());
  const [minute, setMinute] = createSignal<number>(init.getMinutes());
  const [second, setSecond] = createSignal<number>(init.getSeconds());
  const [reason, setReason] = createSignal<string>('');
  const [uidInput, setUidInput] = createSignal<string>('');
  const [ipInput, setIpInput] = createSignal<string>('');
  const [showDetail, setShowDetail] = createSignal<boolean>(false);

  const dayMax = createMemo(() => {
    const y = year();
    const m = month();
    return new Date(y, m, 0).getDate();
  });

  const timestampMs = createMemo(() => {
    if (mode() !== 'ban') return 0;
    const y = year();
    const m = month();
    const d = Math.max(1, Math.min(day(), dayMax()));
    const h = hour();
    const mi = minute();
    const s = second();
    const dt = new Date(y, m - 1, d, h, mi, s);
    const valid = dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d && dt.getHours() === h && dt.getMinutes() === mi && dt.getSeconds() === s;
    const ms = valid ? dt.getTime() : 0;
    return ms > Date.now() ? ms : 0;
  });

  try {
    const m = localStorage.getItem('ban.mode'); if (m) setMode(JSON.parse(m));
    const sc = localStorage.getItem('ban.scope'); if (sc) setScope(JSON.parse(sc));
    const ey = localStorage.getItem('ban.endYear'); if (ey) setYear(Number(JSON.parse(ey)));
    const em = localStorage.getItem('ban.endMonth'); if (em) setMonth(Number(JSON.parse(em)));
    const ed = localStorage.getItem('ban.endDay'); if (ed) setDay(Number(JSON.parse(ed)));
    const eh = localStorage.getItem('ban.endHour'); if (eh) setHour(Number(JSON.parse(eh)));
    const emin = localStorage.getItem('ban.endMinute'); if (emin) setMinute(Number(JSON.parse(emin)));
    const es = localStorage.getItem('ban.endSecond'); if (es) setSecond(Number(JSON.parse(es)));
    const r = localStorage.getItem('ban.reason'); if (r) setReason(JSON.parse(r));
    const suid = localStorage.getItem('ban.uid'); if (suid) setUidInput(JSON.parse(suid));
    const sip = localStorage.getItem('ban.ip'); if (sip) setIpInput(JSON.parse(sip));
  } catch {}

  // 保持初始值为当前时间+1小时（已在 init 中设置）

  // 预填管理员目标UID
  try {
    if (props.connectionMode === 'admin' && props.targetUid && !uidInput()) {
      setUidInput(props.targetUid);
    }
  } catch {}

  createEffect(() => {
    const ts = timestampMs();
    const params: BanParams = { mode: mode(), scope: scope(), timestamp: ts, reason: reason(), uid: uidInput(), ip: ipInput() };
    const cmd = generateBanCommand(params);
    props.onCommandChange(cmd);
  });

  return (
    <div style="display: flex; flex-direction: column; gap: var(--spacing-lg);">
      <Card title={t(props.language, 'ban.title')}>
        <div style="display: flex; flex-direction: column; gap: var(--spacing-md);">
          <div>
            <label style="font-size: 12px; font-weight: 500; color: var(--text-secondary);">{t(props.language, 'ban.modeLabel')}</label>
            <Segmented
              options={[
                { value: 'ban', label: t(props.language, 'ban.mode.ban') },
                { value: 'unban', label: t(props.language, 'ban.mode.unban') },
              ]}
              value={mode()}
              onChange={(e) => { const v = (e as any).currentTarget.value as 'ban'|'unban'; setMode(v); try { localStorage.setItem('ban.mode', JSON.stringify(v)); } catch {} }}
              persistKey="ban.mode"
            />
          </div>

          <div>
            <label style="font-size: 12px; font-weight: 500; color: var(--text-secondary);">{t(props.language, 'ban.scopeLabel')}</label>
            <Segmented
              options={[
                { value: 'all', label: mode() === 'unban' ? t(props.language, 'ban.scopeAllUnban') : t(props.language, 'ban.scopeAllBan') },
                { value: 'ip', label: t(props.language, 'ban.scope.ip') },
                { value: 'uid', label: t(props.language, 'ban.scope.uid') },
              ]}
              value={scope()}
              onChange={(e) => { const v = (e as any).currentTarget.value as 'all'|'ip'|'uid'; setScope(v); try { localStorage.setItem('ban.scope', JSON.stringify(v)); } catch {} }}
              persistKey="ban.scope"
            />
          </div>

          {/* UID/IP 输入（按范围需求显示） */}
          <Show when={scope() !== 'ip' && props.connectionMode === 'admin'}>
            <Input
              label={t(props.language, 'ban.uidLabel')}
              placeholder={t(props.language, 'ban.uidPlaceholder')}
              value={uidInput()}
              onInput={(e) => { const v = (e as any).currentTarget.value; setUidInput(v); try { localStorage.setItem('ban.uid', JSON.stringify(v)); } catch {} }}
              persistKey="ban.uid"
            />
          </Show>

          <Show when={scope() === 'ip'}>
            <Input
              label={t(props.language, 'ban.ipLabel')}
              placeholder={t(props.language, 'ban.ipPlaceholder')}
              value={ipInput()}
              onInput={(e) => { const v = (e as any).currentTarget.value; setIpInput(v); try { localStorage.setItem('ban.ip', JSON.stringify(v)); } catch {} }}
              persistKey="ban.ip"
            />
          </Show>

          <Show when={mode() === 'ban'}>
            <div style="display: flex; flex-direction: column; gap: var(--spacing-sm);">
              <label style="font-size: 12px; font-weight: 500; color: var(--text-secondary);">{t(props.language, 'ban.endTimeLabel')}</label>
              <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: var(--spacing-md); align-items: end;">
                <NumberInput label={t(props.language, 'ban.endFields.year')} min={1970} max={9999} value={year()} onInput={(e) => { const v = Number((e as any).currentTarget.value); setYear(v); try { localStorage.setItem('ban.endYear', JSON.stringify(v)); } catch {} }} persistKey="ban.endYear" />
                <NumberInput label={t(props.language, 'ban.endFields.month')} min={1} max={12} value={month()} onInput={(e) => { const v = Number((e as any).currentTarget.value); setMonth(v); try { localStorage.setItem('ban.endMonth', JSON.stringify(v)); } catch {} }} persistKey="ban.endMonth" />
                <NumberInput label={t(props.language, 'ban.endFields.day')} min={1} max={dayMax()} value={day()} onInput={(e) => { const v = Number((e as any).currentTarget.value); setDay(v); try { localStorage.setItem('ban.endDay', JSON.stringify(v)); } catch {} }} persistKey="ban.endDay" />
                <NumberInput label={t(props.language, 'ban.endFields.hour')} min={0} max={23} value={hour()} onInput={(e) => { const v = Number((e as any).currentTarget.value); setHour(v); try { localStorage.setItem('ban.endHour', JSON.stringify(v)); } catch {} }} persistKey="ban.endHour" />
                <NumberInput label={t(props.language, 'ban.endFields.minute')} min={0} max={59} value={minute()} onInput={(e) => { const v = Number((e as any).currentTarget.value); setMinute(v); try { localStorage.setItem('ban.endMinute', JSON.stringify(v)); } catch {} }} persistKey="ban.endMinute" />
                <NumberInput label={t(props.language, 'ban.endFields.second')} min={0} max={59} value={second()} onInput={(e) => { const v = Number((e as any).currentTarget.value); setSecond(v); try { localStorage.setItem('ban.endSecond', JSON.stringify(v)); } catch {} }} persistKey="ban.endSecond" />
              </div>
              <Show when={timestampMs() === 0}>
                <div style="font-size: 12px; color: var(--error);">{t(props.language, 'ban.invalidEnd')}</div>
              </Show>
            </div>

            <Input
              label={t(props.language, 'ban.reasonLabel')}
              placeholder={t(props.language, 'ban.reasonPlaceholder')}
              value={reason()}
              onInput={(e) => { const v = (e as any).currentTarget.value; setReason(v); try { localStorage.setItem('ban.reason', JSON.stringify(v)); } catch {} }}
              persistKey="ban.reason"
            />

            <Show when={timestampMs() > 0}>
              <div style="display: flex; flex-direction: column; gap: var(--spacing-md);">
                <div style="font-size: 12px; font-weight: 500; color: var(--text-secondary);">{t(props.language, 'ban.previewTitle')}</div>
                <div style="font-size: 12px; color: var(--text-secondary);">{t(props.language, 'ban.previewLocal')}: {new Date(timestampMs()).toLocaleString()}</div>
                <Show when={showDetail()}>
                  <div style="font-size: 12px; color: var(--text-secondary);">{t(props.language, 'ban.previewUTC')}: {new Date(timestampMs()).toUTCString()}</div>
                  <div style="font-size: 12px; color: var(--text-secondary);">{t(props.language, 'ban.previewEpochMs')}: {timestampMs()}</div>
                </Show>
                <div style="font-size: 12px; color: var(--text-secondary); cursor: pointer; text-decoration: underline; width: fit-content;" onClick={() => setShowDetail(!showDetail())}>
                  {showDetail() ? t(props.language, 'ban.previewLess') : t(props.language, 'ban.previewMore')}
                </div>
              </div>
            </Show>
          </Show>
        </div>
      </Card>
    </div>
  );
}
