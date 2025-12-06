import type {
  CharacterParams,
  DiscParams,
  GiveParams,
  GiveAllParams,
  LevelParams,
  BuildParams,
  MailParams,
  CleanParams,
  BattlePassParams,
} from '../types';

/**
 * 生成角色命令
 */
export function generateCharacterCommand(params: CharacterParams): string {
  const { characters, level, ascension, skill, talent, favor } = params;

  if (characters.length === 0) return '';

  const parts: string[] = ['character'];
  parts.push(characters.join(' '));

  if (level) parts.push(`lv${level}`);
  if (ascension) parts.push(`a${ascension}`);
  if (skill) parts.push(`s${skill}`);
  if (talent) parts.push(`t${talent}`);
  if (favor) parts.push(`f${favor}`);

  return parts.join(' ');
}

/**
 * 生成战令命令
 */
export function generateBattlePassCommand(params: BattlePassParams): string {
  const { mode, level } = params;
  const parts: string[] = ['battlepass'];

  if (mode) {
    parts.push(mode);
  }
  
  if (level !== undefined && level >= 0 && level <= 50) {
    parts.push(`lv${level}`);
  }

  if (parts.length === 1) return '';

  return parts.join(' ');
}

/**
 * 生成唱片命令
 */
export function generateDiscCommand(params: DiscParams): string {
  const { discs, level, ascension, crescendo } = params;

  if (discs.length === 0) return '';

  const parts: string[] = ['disc'];
  parts.push(discs.join(' '));

  if (level) parts.push(`lv${level}`);
  if (ascension) parts.push(`a${ascension}`);
  if (crescendo) parts.push(`c${crescendo}`);

  return parts.join(' ');
}

/**
 * 生成物品命令
 */
export function generateGiveCommand(params: GiveParams): string {
  const { itemId, quantity } = params;

  if (!itemId) return '';
  const q = Math.max(1, Math.min(999, Number(quantity)));
  return `give ${itemId} x${q}`;
}

/**
 * 生成批量命令
 */
export function generateGiveAllCommand(params: GiveAllParams): string {
  const { type, level, talent, skill, crescendo } = params;

  const parts: string[] = ['giveall', type];

  if (level) parts.push(`lv${level}`);
  if (type === 'characters' && skill) parts.push(`s${skill}`);
  if (type === 'characters' && talent) parts.push(`t${talent}`);
  if (type === 'discs' && crescendo) parts.push(`c${crescendo}`);

  return parts.join(' ');
}

/**
 * 生成等级命令
 */
export function generateLevelCommand(params: LevelParams): string {
  const { level } = params;

  if (!level || level < 1 || level > 90) return '';

  return `level ${level}`;
}

/**
 * 生成星塔配置命令
 */
export function generateBuildCommand(params: BuildParams): string {
  const { characters, discs, potentials, melodies } = params;

  const parts: string[] = ['build'];

  if (characters && characters.length > 0) {
    // 去重并仅保留正整数
    const uniqChars = Array.from(new Set(characters.map((c) => Number(c)).filter((c) => c > 0)));
    parts.push(...uniqChars.map(String));
  }

  if (discs && discs.length > 0) {
    const uniqDiscs = Array.from(new Set(discs.map((d) => Number(d)).filter((d) => d > 0)));
    parts.push(...uniqDiscs.map(String));
  }

  if (potentials && potentials.length > 0) {
    parts.push(
      ...potentials
        .map((p) => ({ id: Number(p.id), level: Number(p.level) }))
        .filter((p) => p.id > 0)
        .map((p) => `${p.id}:${p.level}`)
    );
  }

  if (melodies && melodies.length > 0) {
    parts.push(
      ...melodies
        .map((m) => ({ id: Number(m.id), level: Number(m.level) }))
        .filter((m) => m.id > 0)
        .map((m) => `${m.id}:${m.level}`)
    );
  }

  return parts.join(' ').trim();
}

/**
 * 生成邮件命令
 */
export function generateMailCommand(params: MailParams): string {
  const { subject, body, attachments } = params;

  if (!subject || !body) return '';

  const parts: string[] = ['mail'];
  parts.push(`"${subject}"`);
  parts.push(`"${body}"`);

  if (attachments && attachments.length > 0) {
    parts.push(
      ...attachments.map((a) => `${a.itemId} x${Math.max(1, Math.min(999, Number(a.quantity)))}`)
    );
  }

  return parts.join(' ');
}

/**
 * 生成清除命令
 */
export function generateCleanCommand(params: CleanParams): string {
  const { all, ids, type } = params;

  const parts: string[] = ['clean'];

  if (all) {
    parts.push('all');
  } else if (ids && ids.length > 0) {
    parts.push(...ids.map(String));
  }

  if (type) {
    parts.push(type === 'resources' ? 'resources' : 'items');
  }

  return parts.join(' ');
}
