import { createSignal, For, Show, createEffect, untrack } from 'solid-js';
import { SiGit } from 'solid-icons/si';
import { FaSolidGamepad, FaSolidClock, FaSolidUsers, FaSolidMemory } from 'solid-icons/fa';
import { HiOutlineGlobeAlt, HiOutlineCpuChip, HiOutlineChartBar, HiOutlineServerStack, HiOutlineArrowPath } from 'solid-icons/hi';
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

  type ServerStatus = {
    git?: string;
    game?: string;
    http?: string;
    uptime?: string;
    cpu?: number;
    load?: number;
    disk?: number;
    memoryCurrentMB?: number;
    memoryMaxMB?: number;
    memoryPercent?: number;
    players?: number;
    raw?: string;
  };

  const [statusData, setStatusData] = createSignal<ServerStatus | null>(null);
  const [statusUpdatedAt, setStatusUpdatedAt] = createSignal<string>('');
  const [statusFetching, setStatusFetching] = createSignal<boolean>(false);
  const [statusFetchedOnce, setStatusFetchedOnce] = createSignal<boolean>(false);

  const [cpuAnim, setCpuAnim] = createSignal<number>(0);
  const [loadAnim, setLoadAnim] = createSignal<number>(0);
  const [diskAnim, setDiskAnim] = createSignal<number>(0);
  const [memAnim, setMemAnim] = createSignal<number>(0);
  const [memHover, setMemHover] = createSignal<boolean>(false);
  let animFrame: number | null = null;
  const animateValues = (
    from: { cpu: number; load: number; disk: number; mem: number },
    to: { cpu: number; load: number; disk: number; mem: number },
    duration: number
  ) => {
    if (animFrame) cancelAnimationFrame(animFrame);
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const ease = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
      setCpuAnim(from.cpu + (to.cpu - from.cpu) * ease);
      setLoadAnim(from.load + (to.load - from.load) * ease);
      setDiskAnim(from.disk + (to.disk - from.disk) * ease);
      setMemAnim(from.mem + (to.mem - from.mem) * ease);
      if (p < 1) animFrame = requestAnimationFrame(step);
      else animFrame = null;
    };
    animFrame = requestAnimationFrame(step);
  };

  const parseStatus = (msg: string): ServerStatus => {
    const lines = msg.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    const out: ServerStatus = { raw: msg };
    for (const line of lines) {
      const idx = line.indexOf(':');
      if (idx === -1) continue;
      const key = line.slice(0, idx).trim();
      const val = line.slice(idx + 1).trim();
      switch (key.toLowerCase()) {
        case 'git': out.git = val; break;
        case 'game': out.game = val; break;
        case 'http': out.http = val; break;
        case 'uptime': out.uptime = val; break;
        case 'cpu': {
          const m = val.match(/([\d.]+)%/); out.cpu = m ? parseFloat(m[1]) : parseFloat(val);
          break; }
        case 'load': {
          const m = val.match(/([\d.]+)%/); out.load = m ? parseFloat(m[1]) : parseFloat(val);
          break; }
        case 'disk': {
          const m = val.match(/([\d.]+)%/); out.disk = m ? parseFloat(m[1]) : parseFloat(val);
          break; }
        case 'memory': {
          const cur = val.match(/([\d.]+)\s*MB/i);
          const mx = val.match(/max\s*([\d.]+)\s*MB/i);
          if (cur) out.memoryCurrentMB = parseFloat(cur[1]);
          if (mx) out.memoryMaxMB = parseFloat(mx[1]);
          if (out.memoryCurrentMB && out.memoryMaxMB && out.memoryMaxMB > 0) {
            out.memoryPercent = Math.min(100, Math.max(0, (out.memoryCurrentMB / out.memoryMaxMB) * 100));
          }
          break; }
        case 'players': {
          const m = val.match(/\d+/); out.players = m ? parseInt(m[0]) : Number(val);
          break; }
      }
    }
    return out;
  };

  const fetchStatus = async () => {
    if (!props.serverUrl.trim() || !props.token.trim()) return;
    setStatusFetching(true);
    const finalCmd = props.targetUid.trim() ? `status @${props.targetUid.trim()}` : 'status';
    const response = await executeCommand({ serverUrl: props.serverUrl + '/api/command', token: props.token }, finalCmd);
    if (response) {
      const parsed = parseStatus(response.Msg);
      setStatusData(parsed);
      setStatusUpdatedAt(new Date().toLocaleString());
      setStatusFetchedOnce(true);
    }
    setStatusFetching(false);
  };

  createEffect(() => {
    const s = statusData();
    if (!s) return;
    const to = {
      cpu: Math.max(0, Math.min(100, s.cpu ?? 0)),
      load: Math.max(0, Math.min(100, s.load ?? 0)),
      disk: Math.max(0, Math.min(100, s.disk ?? 0)),
      mem: Math.max(0, Math.min(100, s.memoryPercent ?? 0)),
    };
    const from = {
      cpu: untrack(cpuAnim),
      load: untrack(loadAnim),
      disk: untrack(diskAnim),
      mem: untrack(memAnim),
    };
    animateValues(from, to, 600);
  });

  createEffect(() => {
    if (props.connectionStatus === 'connected' && !statusFetchedOnce()) {
      fetchStatus();
    }
  });
  return (
    <div style="display: flex; flex-direction: column; gap: var(--spacing-lg);">
      <Show when={props.connectionStatus === 'connected'}>
        <Card title={t(props.language, 'connection.statusCardTitle')}>
          <div style="display: flex; flex-direction: column; gap: var(--spacing-md);">
            <div style="display:flex; align-items:center; justify-content:space-between; font-size:12px; color: var(--text-tertiary);">
              <div>{t(props.language, 'connection.updatedAtPrefix')}{statusUpdatedAt()}</div>
              <button
                onClick={fetchStatus}
                disabled={statusFetching()}
                title={t(props.language, 'connection.refreshButton')}
                aria-label={t(props.language, 'connection.refreshButton')}
                style="display:flex; align-items:center; justify-content:center; width:28px; height:28px; background: transparent; border: none; cursor: pointer;"
              >
                <HiOutlineArrowPath size={16} style={{ color: 'var(--primary)' }} />
              </button>
            </div>
            <Show when={statusData()}>
              <div style="display:flex; flex-direction:column; gap: var(--spacing-md);">
                <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap: var(--spacing-md); align-items:center;">
                  <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
                    <svg width="120" height="120" viewBox="0 0 120 120" style="display:block">
                      <circle cx="60" cy="60" r="52" stroke="var(--bg-tertiary)" stroke-width="10" fill="none" />
                      <circle cx="60" cy="60" r="52" stroke="var(--primary)" stroke-width="10" fill="none" stroke-linecap="round" style={`transform: rotate(-90deg); transform-origin: 60px 60px; stroke-dasharray: ${2*Math.PI*52}; stroke-dashoffset: ${2*Math.PI*52 - ((cpuAnim())/100)*(2*Math.PI*52)};`} />
                      <text x="60" y="64" text-anchor="middle" dominant-baseline="middle" style="font-size:16px; font-weight:700; fill: var(--text-secondary);">{cpuAnim().toFixed(1)}%</text>
                    </svg>
                    <div style="display:flex; align-items:center; gap:6px; font-size:12px; color: var(--text-secondary);">
                      <HiOutlineCpuChip size={16} style={{ color: 'var(--primary)' }} />
                      <span>{t(props.language, 'connection.labels.cpu')}</span>
                    </div>
                  </div>
                  <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
                    <svg width="120" height="120" viewBox="0 0 120 120" style="display:block">
                      <circle cx="60" cy="60" r="52" stroke="var(--bg-tertiary)" stroke-width="10" fill="none" />
                      <circle cx="60" cy="60" r="52" stroke="var(--secondary)" stroke-width="10" fill="none" stroke-linecap="round" style={`transform: rotate(-90deg); transform-origin: 60px 60px; stroke-dasharray: ${2*Math.PI*52}; stroke-dashoffset: ${2*Math.PI*52 - ((loadAnim())/100)*(2*Math.PI*52)};`} />
                      <text x="60" y="64" text-anchor="middle" dominant-baseline="middle" style="font-size:16px; font-weight:700; fill: var(--text-secondary);">{loadAnim().toFixed(1)}%</text>
                    </svg>
                    <div style="display:flex; align-items:center; gap:6px; font-size:12px; color: var(--text-secondary);">
                      <HiOutlineChartBar size={16} style={{ color: 'var(--secondary)' }} />
                      <span>{t(props.language, 'connection.labels.load')}</span>
                    </div>
                  </div>
                  <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
                    <svg width="120" height="120" viewBox="0 0 120 120" style="display:block">
                      <circle cx="60" cy="60" r="52" stroke="var(--bg-tertiary)" stroke-width="10" fill="none" />
                      <circle cx="60" cy="60" r="52" stroke="#FFA726" stroke-width="10" fill="none" stroke-linecap="round" style={`transform: rotate(-90deg); transform-origin: 60px 60px; stroke-dasharray: ${2*Math.PI*52}; stroke-dashoffset: ${2*Math.PI*52 - ((diskAnim())/100)*(2*Math.PI*52)};`} />
                      <text x="60" y="64" text-anchor="middle" dominant-baseline="middle" style="font-size:16px; font-weight:700; fill: var(--text-secondary);">{diskAnim().toFixed(1)}%</text>
                    </svg>
                    <div style="display:flex; align-items:center; gap:6px; font-size:12px; color: var(--text-secondary);">
                      <HiOutlineServerStack size={16} style={{ color: '#FFA726' }} />
                      <span>{t(props.language, 'connection.labels.disk')}</span>
                    </div>
                  </div>
                  <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
                    <svg
                      width="120" height="120" viewBox="0 0 120 120" style="display:block"
                      onMouseEnter={() => setMemHover(true)}
                      onMouseLeave={() => setMemHover(false)}
                    >
                      <title>{`${Number(statusData()!.memoryCurrentMB ?? 0).toFixed(1)} MB / ${Number(statusData()!.memoryMaxMB ?? 0).toFixed(1)} MB`}</title>
                      <circle cx="60" cy="60" r="52" stroke="var(--bg-tertiary)" stroke-width="10" fill="none" />
                      <circle cx="60" cy="60" r="52" stroke="#7E57C2" stroke-width="10" fill="none" stroke-linecap="round" style={`transform: rotate(-90deg); transform-origin: 60px 60px; stroke-dasharray: ${2*Math.PI*52}; stroke-dashoffset: ${2*Math.PI*52 - ((memAnim())/100)*(2*Math.PI*52)};`} />
                      <text x="60" y="62" text-anchor="middle" dominant-baseline="middle" style="font-size:16px; font-weight:700; fill: var(--text-secondary);">{memAnim().toFixed(1)}%</text>
                      <Show when={memHover()}>
                        <text x="60" y="84" text-anchor="middle" dominant-baseline="middle" style="font-size:12px; font-weight:600; fill: var(--text-tertiary);">{Number(statusData()!.memoryCurrentMB ?? 0).toFixed(1)} MB / {Number(statusData()!.memoryMaxMB ?? 0).toFixed(1)} MB</text>
                      </Show>
                    </svg>
                    <div style="display:flex; align-items:center; gap:6px; font-size:12px; color: var(--text-secondary);">
                      <FaSolidMemory size={16} style={{ color: '#7E57C2' }} />
                      <span>{t(props.language, 'connection.labels.memory')}</span>
                    </div>
                  </div>
                </div>
                <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap: var(--spacing-md);">
                  <div style="padding:12px; background: var(--bg-secondary); border: 1px solid var(--border-secondary); border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">
                    <div style="display:flex; align-items:center; gap:6px; font-size:12px; color: var(--text-tertiary);">
                      <SiGit size={16} style={{ color: '#F05032' }} />
                      <span>{t(props.language, 'connection.labels.git')}</span>
                    </div>
                    <div style="margin-top:4px; font-size:14px; font-weight:600; color: var(--accent);">{statusData()!.git || '-'}</div>
                  </div>
                  <div style="padding:12px; background: var(--bg-secondary); border: 1px solid var(--border-secondary); border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">
                    <div style="display:flex; align-items:center; gap:6px; font-size:12px; color: var(--text-tertiary);">
                      <FaSolidGamepad size={16} style={{ color: '#43A047' }} />
                      <span>{t(props.language, 'connection.labels.game')}</span>
                    </div>
                    <div style="margin-top:4px; font-size:14px; font-weight:600; color: var(--accent);">{statusData()!.game || '-'}</div>
                  </div>
                  <div style="padding:12px; background: var(--bg-secondary); border: 1px solid var(--border-secondary); border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">
                    <div style="display:flex; align-items:center; gap:6px; font-size:12px; color: var(--text-tertiary);">
                      <HiOutlineGlobeAlt size={16} style={{ color: '#1E88E5' }} />
                      <span>{t(props.language, 'connection.labels.http')}</span>
                    </div>
                    <div style="margin-top:4px; font-size:14px; font-weight:600; color: var(--accent);">{statusData()!.http || '-'}</div>
                  </div>
                  <div style="padding:12px; background: var(--bg-secondary); border: 1px solid var(--border-secondary); border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">
                    <div style="display:flex; align-items:center; gap:6px; font-size:12px; color: var(--text-tertiary);">
                      <FaSolidClock size={16} style={{ color: '#7E57C2' }} />
                      <span>{t(props.language, 'connection.labels.uptime')}</span>
                    </div>
                    <div style="margin-top:4px; font-size:14px; font-weight:600; color: var(--accent);">{statusData()!.uptime || '-'}</div>
                  </div>
                  <div style="padding:12px; background: var(--bg-secondary); border: 1px solid var(--border-secondary); border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">
                    <div style="display:flex; align-items:center; gap:6px; font-size:12px; color: var(--text-tertiary);">
                      <FaSolidUsers size={16} style={{ color: '#FB8C00' }} />
                      <span>{t(props.language, 'connection.labels.players')}</span>
                    </div>
                    <div style="margin-top:4px; font-size:14px; font-weight:600; color: var(--accent);">{statusData()!.players ?? '-'}</div>
                  </div>
                </div>
              </div>
            </Show>
          </div>
        </Card>
      </Show>
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
