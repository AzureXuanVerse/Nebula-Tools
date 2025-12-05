// 简单的localStorage包装器用于持久化连接配置
const STORAGE_KEY = 'nebula-connection';

export interface ConnectionConfig {
  serverUrl: string;
  token: string;
  targetUid: string;
}

export function saveConnection(config: ConnectionConfig): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }
}

export function loadConnection(): ConnectionConfig | null {
  if (typeof localStorage !== 'undefined') {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }
  return null;
}

export function clearConnection(): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}

