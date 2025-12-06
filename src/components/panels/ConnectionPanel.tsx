import { createSignal, For, Show } from 'solid-js';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { SearchableSelect } from '../ui/SearchableSelect';
import type { Language, ConnectionStatus } from '../../types';
import { executeCommand } from '../../utils/api';

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
    if (props.connectionMode === 'admin' && !props.targetUid.trim()) return false;
    return true;
  };
  const [consoleInput, setConsoleInput] = createSignal('');
  const [consoleLogs, setConsoleLogs] = createSignal<{ time: string; cmd: string; code: number; msg: string }[]>([]);
  const canExecConsole = () => {
    if (!props.serverUrl.trim() || !props.token.trim()) return false;
    if (!consoleInput().trim()) return false;
    if (props.connectionMode === 'admin' && !props.targetUid.trim()) return false;
    return true;
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
      <Card title="服务器配置">
        <div style="display: flex; flex-direction: column; gap: var(--spacing-md);">
          <Input
            label="服务器地址"
            placeholder="http://127.0.0.1:5210"
            value={props.serverUrl}
            onInput={(e) => props.onServerUrlChange(e.currentTarget.value)}
          />
          
          <SearchableSelect
            label="连接方式"
            options={[
              { value: 'admin', label: '管理员密钥（需要指定目标UID）' },
              { value: 'player', label: '玩家令牌（自动使用令牌对应的玩家）' }
            ]}
            value={props.connectionMode}
            searchable={false}
            compact={false}
            hideArrow={true}
            hideCheckmark={true}
            persistKey="conn.mode"
            onChange={(e) => props.onConnectionModeChange(e.currentTarget.value as 'admin' | 'player')}
          />
          
          <Input
            label={props.connectionMode === 'admin' ? 'Token (管理员密钥)' : 'Token (玩家令牌)'}
            placeholder={props.connectionMode === 'admin' ? '输入管理员密钥' : '输入玩家令牌（8位随机码）'}
            value={props.token}
            onInput={(e) => props.onTokenChange(e.currentTarget.value)}
            persistKey="conn.token"
          />
          
          <Show when={props.connectionMode === 'admin'}>
            <Input
              label="目标玩家 UID（必填）（由于服务端没验证UID，所以请输入正确）"
              placeholder="如: 10001"
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
              保存
            </Button>
            {!canSave() && (
              <div style="margin-top: 6px; font-size: 12px; color: var(--text-tertiary);">
                {(!props.serverUrl.trim() || !props.token.trim()) ? '请填写服务器地址与Token' : '管理员模式需填写目标UID'}
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card title="控制台">
        <div style="display: flex; flex-direction: column; gap: var(--spacing-md);">
          <Input
            label="输入命令"
            placeholder="如：/help"
            value={consoleInput()}
            onInput={(e) => setConsoleInput(e.currentTarget.value)}
            persistKey="conn.console.input"
          />
          <Button variant="primary" onClick={runConsole} disabled={!canExecConsole()}>
            执行
          </Button>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <For each={consoleLogs()}>
              {(log) => (
                <div style="display:flex; flex-direction:column; gap:8px; padding:12px; background: var(--bg-secondary); border: 1px solid var(--border-secondary); border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">
                  <div style="display:flex; align-items:center; justify-content:space-between; font-size:12px; color: var(--text-tertiary);">
                    <span>{log.time}</span>
                    <span>Code: {log.code}</span>
                  </div>
                  <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, 'JetBrains Mono', monospace; font-size: 13px; color: var(--accent);">{log.cmd}</div>
                  <div style="font-size: 13px; color: var(--text-secondary); white-space: pre-wrap; line-height: 1.6;">{log.msg}</div>
                </div>
              )}
            </For>
          </div>
        </div>
      </Card>

      <Card title="使用说明">
        <div style="display: flex; flex-direction: column; gap: var(--spacing-sm); font-size: 14px; line-height: 1.6; color: var(--text-secondary);">
          <div style="display: flex; align-items: start; gap: var(--spacing-sm);">
            <span style="color: var(--primary); font-weight: 600;">1.</span>
            <span>确保你的星塔旅人游戏服务器已启动并开启了远程命令功能。</span>
          </div>
          <div style="display: flex; align-items: start; gap: var(--spacing-sm);">
            <span style="color: var(--primary); font-weight: 600;">2.</span>
            <span>在上方输入服务器地址，通常为 <code style="padding: 2px 6px; background: var(--bg-tertiary); border-radius: 4px; font-family: monospace;">http://127.0.0.1:5210</code></span>
          </div>
          <div style="display: flex; align-items: start; gap: var(--spacing-sm);">
            <span style="color: var(--primary); font-weight: 600;">3.</span>
            <span>选择连接方式：</span>
          </div>
          <div style="padding-left: 24px; display: flex; flex-direction: column; gap: 6px; font-size: 13px; color: var(--text-secondary);">
            <div>• <strong>管理员密钥</strong>：可以对任意玩家执行命令，需要指定目标UID</div>
            <div>• <strong>玩家令牌</strong>：只能对令牌对应的玩家执行命令，无需指定UID</div>
          </div>
          <div style="display: flex; align-items: start; gap: var(--spacing-sm);">
            <span style="color: var(--primary); font-weight: 600;">4.</span>
            <span>输入相应的 Token（在服务器配置或游戏内使用 <code style="padding: 2px 6px; background: var(--bg-tertiary); border-radius: 4px; font-family: monospace;">/remote</code> 命令获取）。</span>
          </div>
          <div style="display: flex; align-items: start; gap: var(--spacing-sm);">
            <span style="color: var(--primary); font-weight: 600;">5.</span>
            <span>点击"测试连接"按钮验证配置是否正确。</span>
          </div>
          <div style="display: flex; align-items: start; gap: var(--spacing-sm);">
            <span style="color: var(--primary); font-weight: 600;">6.</span>
            <span>连接成功后，你可以在其他页面生成命令并直接执行。</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
