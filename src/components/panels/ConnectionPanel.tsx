import { createSignal, For, Show } from 'solid-js';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { SearchableSelect } from '../ui/SearchableSelect';
import type { Language, ConnectionStatus } from '../../types';
import { executeCommand } from '../../utils/api';
import { t } from '../../i18n';

interface ConnectionPanelProps {
  language: Language;
  serverUrl: string;
  token: string;
  targetUid: string;
  connectionMode: 'admin' | 'player';
  connectionStatus: ConnectionStatus;
  onServerUrlChange: (url: string) => void;
  onTokenChange: (token: string) => void;
  onTargetUidChange: (uid: string) => void;
  onConnectionModeChange: (mode: 'admin' | 'player') => void;
  onTestConnection: () => void;
}

export function ConnectionPanel(props: ConnectionPanelProps) {
  const canSave = () => {
    if (!props.serverUrl.trim() || !props.token.trim()) return false;
    return !(props.connectionMode === 'admin' && !props.targetUid.trim());

  };
  const [consoleInput, setConsoleInput] = createSignal('');
  const [consoleLogs, setConsoleLogs] = createSignal<{ time: string; cmd: string; code: number; msg: string }[]>([]);
  const canExecConsole = () => {
    if (!props.serverUrl.trim() || !props.token.trim()) return false;
    if (!consoleInput().trim()) return false;
    return !(props.connectionMode === 'admin' && !props.targetUid.trim());

  };
  const runConsole = async () => {
    if (!canExecConsole()) return;
    const base = consoleInput().trim();
    const finalCmd = props.targetUid.trim() ? `${base} @${props.targetUid.trim()}` : base;
    const response = await executeCommand({ serverUrl: props.serverUrl + '/api/command', token: props.token }, finalCmd);
    const now = new Date();
    const time = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    setConsoleLogs([{ time, cmd: finalCmd, code: response.Code, msg: response.Msg || '' }, ...consoleLogs()]);
  };
  return (
    <div style="display: flex; flex-direction: column; gap: var(--spacing-lg);">
      <Card title={t(props.language, 'connection.configTitle')}>
        <div style="display: flex; flex-direction: column; gap: var(--spacing-md);">
          <Input
            label={t(props.language, 'connection.serverUrlLabel')}
            placeholder={t(props.language, 'connection.serverUrlPlaceholder')}
            value={props.serverUrl}
            onInput={(e) => props.onServerUrlChange(e.currentTarget.value)}
          />
          
          <SearchableSelect
            label={t(props.language, 'connection.modeLabel')}
            options={[
              { value: 'admin', label: t(props.language, 'connection.modeOptionAdmin') },
              { value: 'player', label: t(props.language, 'connection.modeOptionPlayer') }
            ]}
            value={props.connectionMode}
            searchable={false}
            compact={false}
            hideArrow={true}
            hideCheckmark={true}
            persistKey="conn.mode"
            language={props.language}
            onChange={(e) => props.onConnectionModeChange(e.currentTarget.value as 'admin' | 'player')}
          />
          
          <Input
            label={props.connectionMode === 'admin' ? t(props.language, 'connection.tokenAdminLabel') : t(props.language, 'connection.tokenPlayerLabel')}
            placeholder={props.connectionMode === 'admin' ? t(props.language, 'connection.tokenAdminPlaceholder') : t(props.language, 'connection.tokenPlayerPlaceholder')}
            value={props.token}
            onInput={(e) => props.onTokenChange(e.currentTarget.value)}
            persistKey={props.connectionMode === 'admin' ? 'conn.token' : undefined}
          />
          
          <Show when={props.connectionMode === 'admin'}>
            <Input
              label={t(props.language, 'connection.uidLabel')}
              placeholder={t(props.language, 'connection.uidPlaceholder')}
              value={props.targetUid}
              onInput={(e) => props.onTargetUidChange(e.currentTarget.value)}
              persistKey="conn.uid"
            />
          </Show>
          
          <div style="margin-top: var(--spacing-sm);">
            <Button
              variant="primary"
              onClick={() => {
                if (!canSave()) return;
                try {
                  localStorage.setItem('conn.config', JSON.stringify({
                    serverUrl: props.serverUrl,
                    token: props.token,
                    targetUid: props.targetUid,
                    connectionMode: props.connectionMode,
                  }));
                } catch {}
                props.onTestConnection();
              }}
              style="width: 100%;"
              disabled={!canSave()}
            >
              {t(props.language, 'connection.saveButton')}
            </Button>
            {!canSave() && (
              <div style="margin-top: 6px; font-size: 12px; color: var(--text-tertiary);">
                {(!props.serverUrl.trim() || !props.token.trim()) ? t(props.language, 'connection.saveHintFill') : t(props.language, 'connection.saveHintUid')}
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card title={t(props.language, 'connection.consoleTitle')}>
        <div style="display: flex; flex-direction: column; gap: var(--spacing-md);">
          <Input
            label={t(props.language, 'connection.consoleInputLabel')}
            placeholder={t(props.language, 'connection.consoleInputPlaceholder')}
            value={consoleInput()}
            onInput={(e) => setConsoleInput(e.currentTarget.value)}
            persistKey="conn.console.input"
          />
          <Button variant="primary" onClick={runConsole} disabled={!canExecConsole()}>
            {t(props.language, 'connection.consoleRunButton')}
          </Button>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <For each={consoleLogs()}>
              {(log) => (
                <div style="display:flex; flex-direction:column; gap:8px; padding:12px; background: var(--bg-secondary); border: 1px solid var(--border-secondary); border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">
                  <div style="display:flex; align-items:center; justify-content:space-between; font-size:12px; color: var(--text-tertiary);">
                    <span>{log.time}</span>
                    <span>{t(props.language, 'connection.consoleCodePrefix')}{log.code}</span>
                  </div>
                  <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, 'JetBrains Mono', monospace; font-size: 13px; color: var(--accent);">{log.cmd}</div>
                  <div style="font-size: 13px; color: var(--text-secondary); white-space: pre-wrap; line-height: 1.6;">{log.msg}</div>
                </div>
              )}
            </For>
          </div>
        </div>
      </Card>

      <Card title={t(props.language, 'connection.docsTitle')}>
        <div style="display: flex; flex-direction: column; gap: var(--spacing-sm); font-size: 14px; line-height: 1.6; color: var(--text-secondary);">
          <div style="display: flex; align-items: start; gap: var(--spacing-sm);">
            <span style="color: var(--primary); font-weight: 600;">1.</span>
            <span>{t(props.language, 'connection.docs.step1')}</span>
          </div>
          <div style="display: flex; align-items: start; gap: var(--spacing-sm);">
            <span style="color: var(--primary); font-weight: 600;">2.</span>
            <span>{t(props.language, 'connection.docs.step2')} <code style="padding: 2px 6px; background: var(--bg-tertiary); border-radius: 4px; font-family: monospace;">http://127.0.0.1:5210</code></span>
          </div>
          <div style="display: flex; align-items: start; gap: var(--spacing-sm);">
            <span style="color: var(--primary); font-weight: 600;">3.</span>
            <span>{t(props.language, 'connection.docs.step3')}</span>
          </div>
          <div style="padding-left: 24px; display: flex; flex-direction: column; gap: 6px; font-size: 13px; color: var(--text-secondary);">
            <div>{t(props.language, 'connection.docs.listAdmin')}</div>
            <div>{t(props.language, 'connection.docs.listPlayer')}</div>
          </div>
          <div style="display: flex; align-items: start; gap: var(--spacing-sm);">
            <span style="color: var(--primary); font-weight: 600;">4.</span>
            <span>{t(props.language, 'connection.docs.step4Pre')} <code style="padding: 2px 6px; background: var(--bg-tertiary); border-radius: 4px; font-family: monospace;">/remote</code> {t(props.language, 'connection.docs.step4Post')}</span>
          </div>
          <div style="display: flex; align-items: start; gap: var(--spacing-sm);">
            <span style="color: var(--primary); font-weight: 600;">5.</span>
            <span>{t(props.language, 'connection.docs.step5')}</span>
          </div>
          <div style="display: flex; align-items: start; gap: var(--spacing-sm);">
            <span style="color: var(--primary); font-weight: 600;">6.</span>
            <span>{t(props.language, 'connection.docs.step6')}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
