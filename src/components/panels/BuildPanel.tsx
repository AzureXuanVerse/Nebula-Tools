import { createSignal, createEffect, onMount, For, Show } from 'solid-js';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { MultiSelect } from '../ui/MultiSelect';
import { NumberInput } from '../ui/NumberInput';
import type { Character, Disc, Language } from '../../types';
import { getElementIcon } from '../../utils/dataLoader';
import { t } from '../../i18n';

interface Potential {
  id: number;
  charId: number;
  names: Record<Language, string>;
}

interface Melody {
  id: number;
  names: Record<Language, string>;
}

interface PotentialConfig {
  id: string;
  charId: number;
  potentialId: number;
  level: number;
}

interface MelodyConfig {
  melodyId: number;
  level: number;
}

interface BuildPanelProps {
  language: Language;
  onCommandChange: (command: string) => void;
}

export function BuildPanel(props: BuildPanelProps) {
  const [characters, setCharacters] = createSignal<Character[]>([]);
  const [discs, setDiscs] = createSignal<Disc[]>([]);
  const [potentials, setPotentials] = createSignal<Potential[]>([]);
  const [melodies, setMelodies] = createSignal<Melody[]>([]);
  const [selectedCharacters, setSelectedCharacters] = createSignal<number[]>([]);
  const [lockedCharacters, setLockedCharacters] = createSignal<number[]>([]);

  // 每个角色的完整配置
  interface CharacterFullConfig {
    charId: number;
    potentials: PotentialConfig[];
    discIds: number[];
    melodies: MelodyConfig[];
  }
  const [characterConfigs, setCharacterConfigs] = createSignal<CharacterFullConfig[]>([]);

  onMount(async () => {
    try {
      const [charRes, discRes, potRes, itemRes] = await Promise.all([
        fetch('/data/Characters.json'),
        fetch('/data/Discs.json'),
        fetch('/data/Potential.json'),
        fetch('/data/Items.json'),
      ]);
      const charData = await charRes.json();
      const discData = await discRes.json();
      const potData = await potRes.json();
      const itemData = await itemRes.json();

      setCharacters(charData.characters || []);
      setDiscs(discData.discs || []);
      setPotentials(potData.potentials || []);

      // 筛选音符 - stype为19的物品
      const melodyItems = (itemData.items || []).filter(
        (item: any) => item.stype === 19
      );
      setMelodies(melodyItems);

      try {
        const savedChars = localStorage.getItem('build.selected');
        if (savedChars) {
          const arr = JSON.parse(savedChars) as number[];
          if (Array.isArray(arr)) {
            setSelectedCharacters(arr);
            setCharacterConfigs(arr.map(cid => ({ charId: cid, potentials: [], discIds: [], melodies: [] })));
          }
        }
        const savedLocked = localStorage.getItem('build.locked');
        if (savedLocked) {
          const arr = JSON.parse(savedLocked) as number[];
          if (Array.isArray(arr)) setLockedCharacters(arr);
        }
        const savedCfg = localStorage.getItem('build.configs');
        if (savedCfg) {
          const cfgs = JSON.parse(savedCfg) as Array<{ charId:number; potentials:{potentialId:number;level:number}[]; discIds:number[]; melodies:{melodyId:number;level:number}[] }>;
          if (Array.isArray(cfgs)) {
            setCharacterConfigs(cfgs.map(c => ({
              charId: c.charId,
              potentials: (c.potentials || []).map(p => ({ id: `${c.charId}-${p.potentialId}`, charId: c.charId, potentialId: p.potentialId, level: p.level })),
              discIds: (c.discIds || []).map(Number),
              melodies: (c.melodies || []).map(m => ({ melodyId: m.melodyId, level: m.level }))
            })));
          }
        }
      } catch {}
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  });

  // 切换角色选择
  const toggleCharacter = (id: number) => {
    const current = selectedCharacters();
    const locked = lockedCharacters();
    const configs = characterConfigs();

    if (current.includes(id)) {
      // 取消选择：移除角色和配置
      const next = current.filter((cid) => cid !== id);
      setSelectedCharacters(next);
      try { localStorage.setItem('build.selected', JSON.stringify(next)); } catch {}
      setCharacterConfigs(configs.filter(c => c.charId !== id));
      const nextLocked = locked.filter(cid => cid !== id);
      setLockedCharacters(nextLocked);
      try { localStorage.setItem('build.locked', JSON.stringify(nextLocked)); } catch {}
    } else if (current.length < 3) {
      // 选择：添加角色和初始配置
      const nextSel = [...current, id];
      setSelectedCharacters(nextSel);
      try { localStorage.setItem('build.selected', JSON.stringify(nextSel)); } catch {}
      setCharacterConfigs([...configs, {
        charId: id,
        potentials: [],
        discIds: [],
        melodies: []
      }]);
      const nextLocked = locked.includes(id) ? locked : [...locked, id];
      setLockedCharacters(nextLocked);
      try { localStorage.setItem('build.locked', JSON.stringify(nextLocked)); } catch {}
    }
  };

  // 获取角色配置
  const getCharConfig = (charId: number) => {
    return characterConfigs().find(c => c.charId === charId);
  };

// 获取角色的潜能列表
  const getCharacterPotentials = (charId: number) => {
    return potentials().filter(p => p.charId === charId);
  };

  const updateCharacterPotentialLevel = (charId: number, potentialId: string, level: number) => {
    setCharacterConfigs(prev => {
      const next = prev.slice();
      const idx = next.findIndex(c => c.charId === charId);
      if (idx >= 0) {
        const pot = next[idx].potentials.find(p => p.id === potentialId);
        if (pot) pot.level = level;
      }
      try { localStorage.setItem('build.configs', JSON.stringify(next.map(c => ({ charId:c.charId, potentials:c.potentials.map(p=>({potentialId:p.potentialId,level:p.level})), discIds:c.discIds, melodies:c.melodies })))); } catch {}
      return next;
    });
  };

  const updateCharacterMelody = (charId: number, index: number, melodyId: number, level: number) => {
    setCharacterConfigs(prev => {
      const next = prev.slice();
      const idx = next.findIndex(c => c.charId === charId);
      if (idx >= 0) {
        const m = next[idx].melodies[index];
        if (m) {
          m.melodyId = melodyId;
          m.level = level;
        }
      }
      try { localStorage.setItem('build.configs', JSON.stringify(next.map(c => ({ charId:c.charId, potentials:c.potentials.map(p=>({potentialId:p.potentialId,level:p.level})), discIds:c.discIds, melodies:c.melodies })))); } catch {}
      return next;
    });
  };

  // 获取可用音符选项
  const getAvailableMelodyOptions = (charId: number, currentMelodyId?: number) => {
    const allUsedMelodyIds = characterConfigs()
      .flatMap(c => c.melodies.map(m => m.melodyId))
      .filter(id => id !== currentMelodyId);

    return [
      { value: 0, label: t(props.language, 'build.melodyOptionPlaceholder') },
      ...melodies()
        .filter(m => !allUsedMelodyIds.includes(m.id))
        .map(mel => ({
          value: mel.id,
          label: `${mel.names?.[props.language] || mel.names?.en_US || String(mel.id)}`
        }))
    ];
  };

  // 获取可用秘纹选项（全局去重，当前角色已选除外）
  const getAvailableDiscOptions = (charId: number) => {
    const current = getCharConfig(charId)?.discIds || [];
    const allUsedDiscIds = characterConfigs()
      .flatMap(c => c.discIds)
      .filter(id => !current.includes(id));

    return discs()
      .filter(d => !allUsedDiscIds.includes(d.id))
      .map(disc => ({ value: disc.id, label: `${disc.names[props.language]} (${disc.id})` }));
  };

  // 实时生成命令
  createEffect(() => {
    const configs = characterConfigs();
    const charIds = Array.from(new Set(configs.map(c => c.charId)));
    const allDiscIds = Array.from(new Set(configs.flatMap(c => c.discIds)));
    const allPotentials = configs.flatMap(c => c.potentials);
    const allMelodies = configs.flatMap(c => c.melodies);

    // 仅在满足要求时展示命令预览
    if (charIds.length !== 3 || allDiscIds.length < 3 || allDiscIds.length > 6) {
      props.onCommandChange('');
      return;
    }

    const parts: string[] = ['build'];
    
    // 角色
    if (charIds.length > 0) {
      parts.push(...charIds.map(String));
    }
    
    // 秘纹
    if (allDiscIds.length > 0) {
      parts.push(...allDiscIds.map(String));
    }
    
    // 添加潜能
    allPotentials.forEach(p => {
      if (p.potentialId > 0) {
        parts.push(`${p.potentialId}:${p.level}`);
      }
    });
    
    // 添加音符
    allMelodies.forEach(m => {
      if (m.melodyId > 0) {
        parts.push(`${m.melodyId}:${m.level}`);
      }
    });

    props.onCommandChange(parts.join(' '));
    try {
      localStorage.setItem('build.selected', JSON.stringify(Array.from(new Set(characterConfigs().map(c=>c.charId)))));
      localStorage.setItem('build.configs', JSON.stringify(characterConfigs().map(c => ({ charId:c.charId, potentials:c.potentials.map(p=>({potentialId:p.potentialId,level:p.level})), discIds:c.discIds, melodies:c.melodies }))));
    } catch {}
  });

  return (
    <div style="display: flex; flex-direction: column; gap: var(--spacing-lg);">
      <Card>
        <div style="background: rgba(41, 182, 246, 0.1); border: 1px solid rgba(41, 182, 246, 0.3); border-radius: var(--radius-md); padding: var(--spacing-md); margin-bottom: var(--spacing-md);">
          <div style="display: flex; align-items: start; gap: 12px;">
            <span style="font-size: 24px;">ℹ️</span>
            <div>
              <div style="font-weight: 600; color: #1976D2;">{t(props.language, 'build.tipTitle')}</div>
              <div style="font-size: 14px; color: #1565C0; margin-top: 4px;">
                {t(props.language, 'build.tipText')}
              </div>
            </div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: var(--spacing-lg);">
          {/* 角色选择与配置 */}
          <div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--spacing-sm);">
              <label style="display: block; font-size: 12px; font-weight: 500; color: var(--text-secondary);">
                {t(props.language, 'build.selectLabel')}
              </label>
              <Button
                variant="accent"
                onClick={() => {
                  const listChars = characters();
                  const listDiscs = discs();
                  if (listChars.length < 3 || listDiscs.length < 3) return;
                  const pre = lockedCharacters();
                  const remain = listChars.filter(c => !pre.includes(c.id)).map(c => c.id).sort(() => Math.random() - 0.5);
                  const charIds = [...pre.slice(0, 3), ...remain].slice(0, 3);
                  const maxDiscs = Math.min(listDiscs.length, 6);
                  const totalDiscs = Math.max(3, maxDiscs);
                  const discIds = [...listDiscs.map(d => d.id)].sort(() => Math.random() - 0.5).slice(0, totalDiscs);
                  const cfgs = charIds.map(cid => ({ charId: cid, potentials: [] as PotentialConfig[], discIds: [] as number[], melodies: [] as { melodyId:number; level:number }[] }));
                  discIds.forEach((did, idx) => { cfgs[idx % cfgs.length].discIds.push(did); });
                  cfgs.forEach(c => {
                    const pool = getCharacterPotentials(c.charId);
                    const pickCount = Math.min(pool.length, Math.floor(Math.random() * 4) + 3); // 3-6
                    const picked = [...pool].sort(() => Math.random() - 0.5).slice(0, pickCount);
                    c.potentials = picked.map(p => ({ id: `${c.charId}-${p.id}`, charId: c.charId, potentialId: p.id, level: Math.floor(Math.random() * 5) + 6 })); // 6-10
                  });
                  let availableMelodies = [...melodies().map(m => m.id)].sort(() => Math.random() - 0.5);
                  for (const c of cfgs) {
                    const mCount = Math.min(availableMelodies.length, Math.floor(Math.random() * 3) + 1); // 1-3
                    for (let i = 0; i < mCount; i++) {
                      const mid = availableMelodies.shift();
                      if (mid === undefined) break;
                      c.melodies.push({ melodyId: mid, level: Math.floor(Math.random() * 60) + 40 }); // 40-99
                    }
                  }
                  setSelectedCharacters(charIds);
                  setCharacterConfigs(cfgs);
                  try {
                    localStorage.setItem('build.selected', JSON.stringify(charIds));
                    localStorage.setItem('build.configs', JSON.stringify(cfgs.map(c => ({ charId:c.charId, potentials:c.potentials.map(p=>({potentialId:p.potentialId,level:p.level})), discIds:c.discIds, melodies:c.melodies }))))
                  } catch {}
                }}
                disabled={characters().length < 3 || discs().length < 3}
              >
                 {t(props.language, 'build.randomButton')}
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  const listChars = characters();
                  const listDiscs = discs();
                  if (listChars.length < 3 || listDiscs.length < 3) return;
                  const pre = lockedCharacters();
                  const remain = listChars.filter(c => !pre.includes(c.id)).map(c => c.id).sort(() => Math.random() - 0.5);
                  const charIds = [...pre.slice(0, 3), ...remain].slice(0, 3);
                  const totalDiscs = Math.min(listDiscs.length, 6);
                  const discIds = [...listDiscs.map(d => d.id)].slice(0, totalDiscs);
                  const cfgs = charIds.map(cid => ({ charId: cid, potentials: [] as PotentialConfig[], discIds: [] as number[], melodies: [] as { melodyId:number; level:number }[] }));
                  discIds.forEach((did, idx) => { cfgs[idx % cfgs.length].discIds.push(did); });
                  cfgs.forEach(c => {
                    const pool = getCharacterPotentials(c.charId);
                    c.potentials = pool.map(p => ({ id: `${c.charId}-${p.id}`, charId: c.charId, potentialId: p.id, level: 99 }));
                  });
                  let melodyIds = melodies().map(m => m.id).filter(id => id > 0);
                  for (let i = 0; i < melodyIds.length; i++) {
                    const mid = melodyIds[i];
                    cfgs[i % cfgs.length].melodies.push({ melodyId: mid, level: 99 });
                  }
                  setSelectedCharacters(charIds);
                  setCharacterConfigs(cfgs);
                  try {
                    localStorage.setItem('build.selected', JSON.stringify(charIds));
                    localStorage.setItem('build.configs', JSON.stringify(cfgs.map(c => ({ charId:c.charId, potentials:c.potentials.map(p=>({potentialId:p.potentialId,level:p.level})), discIds:c.discIds, melodies:c.melodies }))))
                  } catch {}
                }}
                disabled={characters().length < 3 || discs().length < 3}
              >
                {t(props.language, 'build.allInOneButton')}
              </Button>
            </div>
            <div style="display: grid; grid-template-columns: repeat(1, 1fr); gap: var(--spacing-md);">
              <style>{`
                @media (min-width: 768px) {
                  .build-char-grid-new {
                    grid-template-columns: repeat(2, 1fr) !important;
                  }
                }
                @media (min-width: 1024px) {
                  .build-char-grid-new {
                    grid-template-columns: repeat(3, 1fr) !important;
                  }
                }
              `}</style>
              <div class="build-char-grid-new" style="display: grid; grid-template-columns: repeat(1, 1fr); gap: var(--spacing-md); align-items: start;">
                <For each={characters()}>
                  {(character) => {
                    return (
                      <div style={`border-radius: var(--radius-md); border: 2px solid; transition: all 0.25s; ${
                        selectedCharacters().includes(character.id)
                          ? 'border-color: var(--primary); background: rgba(0, 188, 212, 0.05);'
                          : 'border-color: var(--border-secondary); background: var(--bg-secondary);'
                      } ${selectedCharacters().length >= 3 && !selectedCharacters().includes(character.id) ? 'opacity: 0.5;' : ''}`}>
                        {/* 角色卡片头部 */}
                        <button
                          type="button"
                          style="width: 100%; padding: 10px; text-align: left; cursor: pointer; background: transparent; border: none; display: flex; align-items: center; gap: 8px;"
                          onClick={() => toggleCharacter(character.id)}
                          disabled={selectedCharacters().length >= 3 && !selectedCharacters().includes(character.id)}
                        >
                          <span style="font-size: 20px;">{getElementIcon(character.element)}</span>
                          <div style="flex: 1; min-width: 0;">
                            <div style="font-weight: 600; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{character.names[props.language]}</div>
                            <div style="font-size: 10px; color: var(--text-tertiary);">ID: {character.id}</div>
                          </div>
                        </button>

                        {/* 角色配置区域 */}
                        <Show when={selectedCharacters().includes(character.id)}>
                          <div style="padding: 0 10px 10px 10px; border-top: 1px solid var(--border-secondary);">
                            {/* 潜能配置（使用角色页面下拉样式：MultiSelect） */}
                            <div style="margin-top: 8px; margin-bottom: 6px; font-size: 11px; font-weight: 500; color: var(--text-secondary); display: flex; align-items: center; gap: 4px;">
                              <span>⚡</span>
                              <span>{t(props.language, 'build.potentialTitle')}</span>
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 6px;">
                              <MultiSelect
                                language={props.language}
                                selected={(getCharConfig(character.id)?.potentials || []).map(p => p.potentialId)}
                                onChange={(newSelected) => {
                                  const numeric = (newSelected || []).map(v => Number(v)).filter(v => v > 0)
                                  setCharacterConfigs(
                                    characterConfigs().map(c => {
                                      if (c.charId !== character.id) return c
                                      const prev = c.potentials
                                      const next: PotentialConfig[] = numeric.map(pid => {
                                        const exist = prev.find(p => p.potentialId === pid)
                                        return exist ? exist : { id: `${character.id}-${pid}`, charId: character.id, potentialId: pid, level: 1 }
                                      })
                                      return { ...c, potentials: next }
                                    })
                                  )
                                }}
                                options={getCharacterPotentials(character.id).map(p => ({ value: p.id, label: `${p.names[props.language]} (${p.id})` }))}
                                placeholder={t(props.language, 'character.placeholder')}
                              />
                              <For each={getCharConfig(character.id)?.potentials || []}>
                                {(pconf) => (
                                  <div style="display: flex; align-items: center; gap: 6px;">
                                    <div style="flex: 1; font-size: 12px; color: var(--text-secondary);">
                                      {getCharacterPotentials(character.id).find(p => p.id === pconf.potentialId)?.names[props.language]} ({pconf.potentialId})
                                    </div>
                                    <div style="width: 250px;">
                                      <NumberInput
                                        value={pconf.level}
                                        onInput={(e) => updateCharacterPotentialLevel(character.id, pconf.id, Number(e.currentTarget.value))}
                                        min={1}
                                        placeholder={t(props.language, 'build.potentialLevelPlaceholder')}
                                      />
                                    </div>
                                  </div>
                                )}
                              </For>
                            </div>

                            {/* 秘纹配置区域 */}
                            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border-secondary);">
                              <div style="margin-bottom: 6px; font-size: 11px; font-weight: 500; color: var(--text-secondary); display: flex; align-items: center; gap: 4px;">
                                <span>💿</span>
                                <span>{t(props.language, 'build.discTitle')}</span>
                              </div>
                              <MultiSelect
                                language={props.language}
                                selected={getCharConfig(character.id)?.discIds || []}
                                onChange={(newIds) => {
                                  const charConfig = getCharConfig(character.id);
                                  if (!charConfig) return;

                                  const allOtherDiscIds = characterConfigs()
                                    .filter(c => c.charId !== character.id)
                                    .flatMap(c => c.discIds);

                                  // 确保转换为number数组
                                  const numericIds = newIds.map(id => Number(id));
                                  const totalDiscs = allOtherDiscIds.length + numericIds.length;

                                  if (totalDiscs <= 6) {
                                    setCharacterConfigs(
                                      characterConfigs().map(c =>
                                        c.charId === character.id ? { ...c, discIds: numericIds } : c
                                      )
                                    );
                                  }
                                }}
                                options={getAvailableDiscOptions(character.id)}
                                placeholder={t(props.language, 'build.discPlaceholder')}
                              />
                              <div style="margin-top: 4px; font-size: 10px; color: var(--text-tertiary);">
                                {t(props.language, 'build.discSelectedPrefix')} {getCharConfig(character.id)?.discIds.length || 0} {t(props.language, 'build.discSelectedMiddle')} {characterConfigs().flatMap(c => c.discIds).length} {t(props.language, 'build.discSelectedSuffix')}
                              </div>
                            </div>

                            {/* 音符配置区域 */}
                            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border-secondary);">
                              <div style="margin-bottom: 6px; font-size: 11px; font-weight: 500; color: var(--text-secondary); display: flex; align-items: center; gap: 4px;">
                                <span>🎵</span>
                                <span>{t(props.language, 'build.melodyTitle')}</span>
                              </div>
                              <div style="display: flex; flex-direction: column; gap: 6px;">
                                <MultiSelect
                                  language={props.language}
                                  selected={(getCharConfig(character.id)?.melodies || []).map(m => m.melodyId)}
                                  onChange={(newSelected) => {
                                    const numeric = (newSelected || []).map(v => Number(v)).filter(v => v > 0)
                                    // 过滤掉全局重复
                                    const globalUsed = characterConfigs().flatMap(c => c.melodies.map(m => m.melodyId))
                                    const filtered = numeric.filter(id => !globalUsed.includes(id) || (getCharConfig(character.id)?.melodies || []).some(m => m.melodyId === id))
                                    setCharacterConfigs(
                                      characterConfigs().map(c => {
                                        if (c.charId !== character.id) return c
                                        const prev = c.melodies
                                        const next: MelodyConfig[] = filtered.map(mid => {
                                          const exist = prev.find(m => m.melodyId === mid)
                                          return exist ? exist : { melodyId: mid, level: 1 }
                                        })
                                        return { ...c, melodies: next }
                                      })
                                    )
                                  }}
                                  options={getAvailableMelodyOptions(character.id).map(o => ({ value: o.value, label: o.label }))}
                                  placeholder={t(props.language, 'build.melodyPlaceholder')}
                                />
                                <For each={getCharConfig(character.id)?.melodies || []}>
                                  {(melody, index) => (
                                    <div style="display: flex; align-items: center; gap: 6px;">
                                      <div style="flex: 1; font-size: 12px; color: var(--text-secondary);">
                                        {melodies().find(m => m.id === melody.melodyId)?.names[props.language] || melody.melodyId}
                                      </div>
                                      <div style="width: 250px;">
                                        <NumberInput
                                          value={melody.level}
                                          onInput={(e) => updateCharacterMelody(character.id, index(), melody.melodyId, Number(e.currentTarget.value))}
                                          min={1}
                                          max={99}
                                          placeholder={t(props.language, 'build.melodyLevelPlaceholder')}
                                        />
                                      </div>
                                    </div>
                                  )}
                                </For>
                              </div>
                            </div>
                          </div>
                        </Show>
                      </div>
                    );
                  }}
                </For>
              </div>
            </div>
            <div style="margin-top: var(--spacing-sm); font-size: 13px; color: var(--text-secondary);">
              {t(props.language, 'build.summarySelectedPrefix')} <span style="font-weight: 600; color: var(--primary);">{selectedCharacters().length}</span>{t(props.language, 'build.summarySelectedSuffix')}
              {t(props.language, 'build.summaryDiscTotalPrefix')} <span style="font-weight: 600; color: var(--primary);">{characterConfigs().flatMap(c => c.discIds).length}</span>{t(props.language, 'build.summaryDiscTotalSuffix')}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
