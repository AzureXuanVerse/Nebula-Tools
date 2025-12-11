// 语言类型
export type Language = 'zh_CN' | 'zh_TW' | 'en_US' | 'ja_JP' | 'ko_KR';

// 元素类型
export type Element = 'FIRE' | 'AQUA' | 'WIND' | 'EARTH' | 'LIGHT' | 'DARK' | 'NONE';

// 角色数据
export interface Character {
  id: number;
  element: Element;
  names: Record<Language, string>;
}

// 秘纹数据
export interface Disc {
  id: number;
  element: Element;
  names: Record<Language, string>;
}

// 物品数据
export interface Item {
  id: number;
  type: string; // 'Res' | 'Item' | 'Char' | 'Energy' | 'WorldRankExp' | 'RogueItem' | 'MonthlyCard' | 'CharacterSkin'
  stype?: number;
  names: Record<Language, string>;
}

// 潜能数据
export interface Potential {
  id: number;
  charId: number;
  names: Record<Language, string>;
}

// 命令类型
export type CommandType = 
  | 'character' 
  | 'disc' 
  | 'give' 
  | 'level' 
  | 'build' 
  | 'mail' 
  | 'clean'
  | 'battlepass'
  | 'ban'
  | 'connection';

// 角色命令参数
export interface CharacterParams {
  characters: number[];
  level?: number;
  ascension?: number;
  skill?: number;
  talent?: number;
  favor?: number;
}

// 秘纹命令参数
export interface DiscParams {
  discs: number[];
  level?: number;
  ascension?: number;
  crescendo?: number;
}

// 物品命令参数
export interface GiveParams {
  itemId: number;
  quantity: number;
}

// 批量命令参数
export interface GiveAllParams {
  type: 'characters' | 'discs' | 'materials';
  level?: number;
  talent?: number;
  skill?: number;
  crescendo?: number;
}

// 等级命令参数
export interface LevelParams {
  level: number;
}

// 星塔命令参数
export interface BuildParams {
  characters: number[];
  discs: number[];
  potentials?: Array<{ id: number; level: number }>;
  melodies?: Array<{ id: number; level: number }>;
}

// 邮件命令参数
export interface MailParams {
  subject: string;
  body: string;
  attachments: Array<{ itemId: number; quantity: number }>;
}

// 清除命令参数
export interface CleanParams {
  all: boolean;
  ids?: number[];
  type?: 'items' | 'resources';
}

// 战令命令参数
export interface BattlePassParams {
  mode?: 'free' | 'premium';
  level?: number;
}

// 封禁命令参数
export interface BanParams {
  mode: 'ban' | 'unban';
  scope: 'all' | 'ip' | 'uid';
  timestamp?: number;
  reason?: string;
  uid?: string;
  ip?: string;
}

// 连接状态
export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting';

// 连接配置
export interface ConnectionConfig {
  serverUrl: string;
  token: string;
  uid?: string; // 目标玩家UID（管理员密钥模式必填，玩家令牌模式留空）
}

// API响应
export interface ApiResponse<T = any> {
  Code: number;
  Msg: string;
  Data?: T;
}

// 通知类型
export type ToastType = 'success' | 'error' | 'warning' | 'info';

// 通知消息
export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message: string;
}
