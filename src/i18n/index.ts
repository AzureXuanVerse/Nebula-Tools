import type { Language } from '../types'

const dict: Record<Language, Record<string, any>> = {
  zh_CN: {
    navbar: {
      title: 'Nebula Tools',
      github: 'GitHub',
      command: {
        character: '角色',
        disc: '秘纹',
        give: '物品',
        giveall: '批量',
        level: '等级',
        battlepass: '基金',
        build: '记录',
        mail: '邮件',
        clean: '清除',
        ban: '封禁',
        connection: '连接'
      },
      status: {
        connected: '已连接',
        connecting: '连接中',
        disconnected: '未连接'
      }
    },
    common: {
      modeTitle: '模式',
      mode: {
        select: '选择',
        all: '全部'
      }
    },
    level: {
      title: '设置等级',
      labelPrefix: '等级: '
    },
    battlepass: {
      title: '基金设置',
      modeLabel: '基金补贴',
      mode: {
        keep: '无',
        free: '基础',
        premium: '尊享'
      },
      levelPrefix: '等级: '
    },
    character: {
      selectTitle: '选择角色',
      elementFilter: '元素筛选',
      listLabel: '角色列表',
      placeholder: '点击选择角色（可多选）',
      selectedPrefix: '已选择:',
      selectedSuffix: '个角色',
      settingsTitle: '属性设置',
      attr: {
        level: '等级 (1-90)',
        ascension: '突破 (0-8)',
        skill: '技能 (1-10)',
        talent: '天赋 (0-5)',
        favor: '默契 (0-50)'
      },
      elements: {
        ALL: '全部',
        FIRE: '火',
        AQUA: '水',
        WIND: '风',
        EARTH: '地',
        LIGHT: '光',
        DARK: '暗'
      }
    }
    ,
    ban: {
      title: '封禁管理',
      modeLabel: '操作',
      mode: { ban: '封禁', unban: '解禁' },
      scopeLabel: '封禁范围',
      scope: { all: '同时封禁UID与IP', ip: '仅IP', uid: '仅UID' },
      scopeAllBan: '同时封禁UID与IP',
      scopeAllUnban: '同时解禁UID与IP',
      endTimeLabel: '结束时间',
      endTimePlaceholder: '选择结束时间（本地）',
      endFields: { year: '年', month: '月', day: '日', hour: '时', minute: '分', second: '秒' },
      invalidEnd: '请选择一个晚于当前时间的有效时间',
      uidLabel: '玩家 UID',
      uidPlaceholder: '如：10001（管理员模式可用）',
      ipLabel: 'IP 地址',
      ipPlaceholder: '如：192.168.1.2',
      reasonLabel: '原因',
      reasonPlaceholder: '可选，填写封禁原因',
      previewTitle: '结束时间预览',
      previewLocal: '本地时区',
      previewUTC: 'UTC',
      previewEpochMs: '时间戳 (毫秒)',
      previewMore: '显示UTC/时间戳',
      previewLess: '收起UTC/时间戳'
    }
    ,
    disc: {
      selectTitle: '选择秘纹',
      elementFilter: '元素筛选',
      listLabel: '秘纹列表',
      placeholder: '点击选择秘纹（可多选）',
      selectedPrefix: '已选择:',
      selectedSuffix: '个秘纹',
      settingsTitle: '属性设置',
      attr: {
        level: '等级 (1-90)',
        ascension: '阶段 (0-8)',
        crescendo: '星级 (0-5)'
      },
      elements: {
        ALL: '全部',
        FIRE: '火',
        AQUA: '水',
        WIND: '风',
        EARTH: '地',
        LIGHT: '光',
        DARK: '暗',
        NONE: '无'
      }
    }
    ,
    give: {
      selectTitle: '选择物品',
      typeFilter: '类型筛选',
      listLabel: '物品列表',
      quantityLabel: '数量',
      selectPlaceholder: '-- 选择物品 --',
      types: {
        ALL: '全部',
        Res: '资源',
        Item: '物品',
        Char: '角色',
        Energy: '能量',
        CharacterSkin: '皮肤',
        MonthlyCard: '月卡',
        RogueItem: '肉鸽物品',
        WorldRankExp: '世界等级经验',
        Title: '称号',
        Honor: '荣誉',
        HeadItem: '头像',
        Disc: '秘纹'
      }
      ,
      batchMaterialsTitle: '批量材料',
      batchMaterialsHint: '快速生成所有材料命令',
      batchMaterialsButton: '生成全部材料命令'
    }
    ,
    giveall: {
      typeTitle: '批量类型',
      typeOptions: {
        characters: '所有角色',
        discs: '所有秘纹',
        materials: '所有材料'
      },
      hints: {
        characters: '发放所有角色并设置属性',
        discs: '发放所有秘纹并设置属性'
      },
      char: {
        title: '角色属性',
        attr: {
          level: '等级 (1-90)',
          skill: '技能 (1-10)',
          talent: '天赋 (0-5)'
        }
      },
      disc: {
        title: '秘纹属性',
        attr: {
          level: '等级 (1-90)',
          ascension: '阶段 (0-8)',
          crescendo: '星级 (0-5)'
        }
      }
    }
    ,
    build: {
      tipTitle: '提示',
      tipText: '已选中的卡片在点击“随机”或“一键满配”时将被优先使用；不足部分随机补齐。需满足：3个角色、秘纹总数3-6、音符可选。',
      selectLabel: '选择3个角色并配置',
      randomButton: '随机',
      allInOneButton: '一键满配',
      potentialTitle: '潜能',
      potentialLevelPlaceholder: 'Lv',
      discTitle: '秘纹（总共需3-6个）',
      discPlaceholder: '选择秘纹...',
      discSelectedPrefix: '已选:',
      discSelectedMiddle: '个，总计:',
      discSelectedSuffix: '/ 6',
      melodyTitle: '音符',
      melodyPlaceholder: '选择音符（可多选）',
      melodyLevelPlaceholder: 'Lv'
      ,
      melodyOptionPlaceholder: '选择音符...'
      ,
      summarySelectedPrefix: '已选择:',
      summarySelectedSuffix: ' / 3，',
      summaryDiscTotalPrefix: '秘纹总计:',
      summaryDiscTotalSuffix: ' / 6'
    }
    ,
    mail: {
      contentTitle: '邮件内容',
      subjectLabel: '邮件主题',
      subjectPlaceholder: '输入邮件主题',
      bodyLabel: '邮件正文',
      bodyPlaceholder: '输入邮件正文',
      attachmentsTitle: '附件',
      itemIdLabel: '物品 ID',
      quantityLabel: '数量',
      addButton: '添加附件',
      listLabel: '附件列表:',
      deleteButton: '删除',
      deleteAllButton: '删除全部',
      globalQuantityToggleOn: '启用全局数量',
      globalQuantityToggleOff: '关闭全局数量'
    }
    ,
    clean: {
      typeLabel: '清除类型',
      typeOptions: {
        all: '全部',
        items: '物品',
        resources: '资源'
      },
      itemIdLabel: '物品 ID',
      itemPlaceholder: '选择或搜索物品'
    }
    ,
    app: {
      previewTitle: '命令预览',
      copyTitle: '点击复制命令',
      copyPlaceholder: '点击复制',
      runButton: '执行',
      toastCopied: '命令已复制到剪贴板',
      toastCopyFailed: '复制失败',
      toastNeedCommand: '请先生成命令',
      toastExecuting: '正在执行命令...',
      execSuccess: '命令执行成功: ',
      execSuccessNoMsg: '命令执行成功',
      execFailedPrefix: '命令执行失败: ',
      connectionFill: '请填写服务器地址和Token',
      connectionTesting: '正在测试连接...',
      connectionSuccess: '连接成功',
      connectionFailedPrefix: '连接失败: '
    }
    ,
    connection: {
      configTitle: '服务器配置',
      serverUrlLabel: '服务器地址',
      serverUrlPlaceholder: 'http://127.0.0.1:5210',
      modeLabel: '连接方式',
      modeOptionAdmin: '管理员密钥（需要指定目标UID）',
      modeOptionPlayer: '玩家令牌（自动使用令牌对应的玩家）',
      tokenAdminLabel: 'Token (管理员密钥)',
      tokenAdminPlaceholder: '输入管理员密钥',
      tokenPlayerLabel: 'Token (玩家令牌)',
      tokenPlayerPlaceholder: '输入玩家令牌（8位随机码）',
      uidLabel: '目标玩家 UID（必填）',
      uidPlaceholder: '如: 10001',
      saveButton: '保存',
      saveHintFill: '请填写服务器地址与Token',
      saveHintUid: '管理员模式需填写目标UID',
      consoleTitle: '控制台',
      consoleInputLabel: '输入命令',
      consoleInputPlaceholder: '如：/help',
      consoleRunButton: '执行',
      consoleCodePrefix: 'Code: ',
      docsTitle: '使用说明',
      docs: {
        step1: '确保你的星塔旅人游戏服务器已启动并开启了远程命令功能。',
        step2: '在上方输入服务器地址，通常为',
        step3: '选择连接方式：',
        listAdmin: '• 管理员密钥：可以对任意玩家执行命令，需要指定目标UID',
        listPlayer: '• 玩家令牌：只能对令牌对应的玩家执行命令，无需指定UID',
        step4Pre: '输入相应的 Token（在服务器配置或游戏内使用',
        step4Post: '命令获取）。',
        step5: '点击"测试连接"按钮验证配置是否正确。',
        step6: '连接成功后，你可以在其他页面生成命令并直接执行。'
      }
    }
    ,
    multiselect: {
      selectedPrefix: '已选择',
      selectedSuffix: '项',
      placeholder: '请选择...',
      empty: '未找到匹配项'
    }
    ,
    selectable: {
      placeholder: '请选择...',
      empty: '未找到匹配项'
    }
    ,
    toast: {
      title: {
        success: '操作成功',
        error: '错误',
        warning: '警告',
        info: '提示信息',
        default: '提示'
      }
    }
    ,
    remote: {
      missingParams: '缺少必要参数',
      upstreamInvalidJson: '上游响应不是有效 JSON',
      proxyFailedPrefix: '代理请求失败: ',
      unknownError: '未知错误'
    }
  },
  zh_TW: {} as any,
  en_US: {
    navbar: {
      title: 'Nebula Tools',
      github: 'GitHub',
      command: {
        character: 'Character',
        disc: 'Disc',
        give: 'Item',
        giveall: 'Batch',
        level: 'Level',
        battlepass: 'Battle Pass',
        build: 'Build',
        mail: 'Mail',
        clean: 'Clean',
        ban: 'Ban',
        connection: 'Connection'
      },
      status: {
        connected: 'Connected',
        connecting: 'Connecting',
        disconnected: 'Disconnected'
      }
    },
    common: {
      modeTitle: 'Mode',
      mode: {
        select: 'Select',
        all: 'All'
      }
    },
    level: {
      title: 'Set Level',
      labelPrefix: 'Level: '
    },
    battlepass: {
      title: 'Battle Pass',
      modeLabel: 'Mode',
      mode: {
        keep: 'Keep',
        free: 'Free',
        premium: 'Premium'
      },
      levelPrefix: 'Level: '
    },
    character: {
      selectTitle: 'Select Characters',
      elementFilter: 'Element Filter',
      listLabel: 'Character List',
      placeholder: 'Click to select characters (multi-select)',
      selectedPrefix: 'Selected:',
      selectedSuffix: 'characters',
      settingsTitle: 'Attributes',
      attr: {
        level: 'Level (1-90)',
        ascension: 'Ascension (0-8)',
        skill: 'Skill (1-10)',
        talent: 'Talent (0-5)',
        favor: 'Favor (0-50)'
      },
      elements: {
        ALL: 'All',
        FIRE: 'Fire',
        AQUA: 'Water',
        WIND: 'Wind',
        EARTH: 'Earth',
        LIGHT: 'Light',
        DARK: 'Dark'
      }
    }
    ,
    ban: {
      title: 'Ban Management',
      modeLabel: 'Action',
      mode: { ban: 'Ban', unban: 'Unban' },
      scopeLabel: 'Scope',
      scope: { all: 'UID + IP', ip: 'IP only', uid: 'UID only' },
      scopeAllBan: 'UID + IP (ban)',
      scopeAllUnban: 'UID + IP (unban)',
      endTimeLabel: 'End Time',
      endTimePlaceholder: 'Select end time (local)',
      endFields: { year: 'Year', month: 'Month', day: 'Day', hour: 'Hour', minute: 'Minute', second: 'Second' },
      invalidEnd: 'Please select a valid time in the future',
      uidLabel: 'Player UID',
      uidPlaceholder: 'e.g., 10001 (admin mode)',
      ipLabel: 'IP Address',
      ipPlaceholder: 'e.g., 192.168.1.2',
      reasonLabel: 'Reason',
      reasonPlaceholder: 'Optional, enter ban reason',
      previewTitle: 'End Time Preview',
      previewLocal: 'Local Time',
      previewUTC: 'UTC',
      previewEpochMs: 'Epoch (ms)',
      previewMore: 'Show UTC/Epoch',
      previewLess: 'Hide UTC/Epoch'
    }
    ,
    disc: {
      selectTitle: 'Select Discs',
      elementFilter: 'Element Filter',
      listLabel: 'Disc List',
      placeholder: 'Click to select discs (multi-select)',
      selectedPrefix: 'Selected:',
      selectedSuffix: 'discs',
      settingsTitle: 'Attributes',
      attr: {
        level: 'Level (1-90)',
        ascension: 'Ascension (0-8)',
        crescendo: 'Stars (0-5)'
      },
      elements: {
        ALL: 'All',
        FIRE: 'Fire',
        AQUA: 'Water',
        WIND: 'Wind',
        EARTH: 'Earth',
        LIGHT: 'Light',
        DARK: 'Dark',
        NONE: 'None'
      }
    }
    ,
    give: {
      selectTitle: 'Select Items',
      typeFilter: 'Type Filter',
      listLabel: 'Item List',
      quantityLabel: 'Quantity',
      selectPlaceholder: '-- Select an item --',
      types: {
        ALL: 'All',
        Res: 'Resources',
        Item: 'Items',
        Char: 'Characters',
        Energy: 'Energy',
        CharacterSkin: 'Skins',
        MonthlyCard: 'Monthly Card',
        RogueItem: 'Rogue Items',
        WorldRankExp: 'World Rank EXP',
        Title: 'Title',
        Honor: 'Honor',
        HeadItem: 'Head Item',
        Disc: 'Disc'
      }
      ,
      batchMaterialsTitle: 'Batch Materials',
      batchMaterialsHint: 'Quickly generate command for all materials',
      batchMaterialsButton: 'Generate All Materials'
    }
    ,
    giveall: {
      typeTitle: 'Batch Type',
      typeOptions: {
        characters: 'All Characters',
        discs: 'All Discs',
        materials: 'All Materials'
      },
      hints: {
        characters: 'Give all characters and set attributes',
        discs: 'Give all discs and set attributes'
      },
      char: {
        title: 'Character Attributes',
        attr: {
          level: 'Level (1-90)',
          skill: 'Skill (1-10)',
          talent: 'Talent (0-5)'
        }
      },
      disc: {
        title: 'Disc Attributes',
        attr: {
          level: 'Level (1-90)',
          ascension: 'Ascension (0-8)',
          crescendo: 'Stars (0-5)'
        }
      }
    }
    ,
    build: {
      tipTitle: 'Notice',
      tipText: 'If characters are preselected, “Random” or “All In One” keeps them and fills the rest randomly. Requirements: 3 characters, 3–6 total discs, melodies optional.',
      selectLabel: 'Select 3 characters and configure',
      randomButton: 'Random',
      allInOneButton: 'All In One Max',
      potentialTitle: 'Potentials',
      potentialLevelPlaceholder: 'Lv',
      discTitle: 'Discs (total 3-6)',
      discPlaceholder: 'Select discs...',
      discSelectedPrefix: 'Selected:',
      discSelectedMiddle: ', total:',
      discSelectedSuffix: ' / 6',
      melodyTitle: 'Melodies',
      melodyPlaceholder: 'Select melodies (multi-select)',
      melodyLevelPlaceholder: 'Lv'
      ,
      melodyOptionPlaceholder: 'Select a melody...',
      summarySelectedPrefix: 'Selected:',
      summarySelectedSuffix: ' / 3, ',
      summaryDiscTotalPrefix: 'Discs total:',
      summaryDiscTotalSuffix: ' / 6'
    }
    ,
    mail: {
      contentTitle: 'Mail Content',
      subjectLabel: 'Subject',
      subjectPlaceholder: 'Enter subject',
      bodyLabel: 'Body',
      bodyPlaceholder: 'Enter body',
      attachmentsTitle: 'Attachments',
      itemIdLabel: 'Item ID',
      quantityLabel: 'Quantity',
      addButton: 'Add Attachment',
      listLabel: 'Attachment List:',
      deleteButton: 'Delete',
      deleteAllButton: 'Clear All',
      globalQuantityToggleOn: 'Enable Global Quantity',
      globalQuantityToggleOff: 'Disable Global Quantity'
    }
    ,
    clean: {
      typeLabel: 'Clear Type',
      typeOptions: {
        all: 'All',
        items: 'Items',
        resources: 'Resources'
      },
      itemIdLabel: 'Item ID',
      itemPlaceholder: 'Select or search items'
    }
    ,
    app: {
      previewTitle: 'Command Preview',
      copyTitle: 'Click to copy command',
      copyPlaceholder: 'Click to copy',
      runButton: 'Run',
      toastCopied: 'Command copied to clipboard',
      toastCopyFailed: 'Copy failed',
      toastNeedCommand: 'Generate a command first',
      toastExecuting: 'Executing command...',
      execSuccess: 'Command succeeded: ',
      execSuccessNoMsg: 'Command succeeded',
      execFailedPrefix: 'Command failed: ',
      connectionFill: 'Please fill server URL and Token',
      connectionTesting: 'Testing connection...',
      connectionSuccess: 'Connection successful',
      connectionFailedPrefix: 'Connection failed: '
    }
    ,
    connection: {
      configTitle: 'Server Configuration',
      serverUrlLabel: 'Server URL',
      serverUrlPlaceholder: 'http://127.0.0.1:5210',
      modeLabel: 'Connection Mode',
      modeOptionAdmin: 'Admin Token (requires target UID)',
      modeOptionPlayer: 'Player Token (uses token owner automatically)',
      tokenAdminLabel: 'Token (Admin)',
      tokenAdminPlaceholder: 'Enter admin token',
      tokenPlayerLabel: 'Token (Player)',
      tokenPlayerPlaceholder: 'Enter player token (8-char code)',
      uidLabel: 'Target Player UID (required)',
      uidPlaceholder: 'e.g., 10001',
      saveButton: 'Save',
      saveHintFill: 'Please fill server URL and Token',
      saveHintUid: 'Admin mode requires target UID',
      consoleTitle: 'Console',
      consoleInputLabel: 'Command',
      consoleInputPlaceholder: 'e.g., /help',
      consoleRunButton: 'Run',
      consoleCodePrefix: 'Code: ',
      docsTitle: 'Instructions',
      docs: {
        step1: 'Ensure your Star Tower server is running with remote command enabled.',
        step2: 'Enter the server URL above, typically',
        step3: 'Choose a connection mode:',
        listAdmin: '• Admin Token: run commands on any player, requires target UID',
        listPlayer: '• Player Token: runs commands only on the token owner, no UID needed',
        step4Pre: 'Enter the Token (obtain via',
        step4Post: 'command).',
        step5: 'Click "Test Connection" to validate settings.',
        step6: 'Once connected, you can generate and run commands on other pages.'
      }
    }
    ,
    multiselect: {
      selectedPrefix: 'Selected',
      selectedSuffix: 'items',
      placeholder: 'Please select...',
      empty: 'No matching items'
    }
    ,
    selectable: {
      placeholder: 'Please select...',
      empty: 'No matching items'
    }
    ,
    toast: {
      title: {
        success: 'Success',
        error: 'Error',
        warning: 'Warning',
        info: 'Info',
        default: 'Notice'
      }
    }
    ,
    remote: {
      missingParams: 'Missing required parameters',
      upstreamInvalidJson: 'Upstream response is not valid JSON',
      proxyFailedPrefix: 'Proxy request failed: ',
      unknownError: 'Unknown error'
    }
  },
  ja_JP: {} as any,
  ko_KR: {} as any
}

function get(obj: any, path: string): any {
  const parts = path.split('.')
  let cur = obj
  for (const p of parts) {
    if (!cur || typeof cur !== 'object' || !(p in cur)) return undefined
    cur = cur[p]
  }
  return cur
}

export function t(lang: Language, key: string): string {
  const primary = get(dict[lang], key)
  if (typeof primary === 'string') return primary
  const fallback = get(dict.zh_CN, key)
  if (typeof fallback === 'string') return fallback
  return key
}
