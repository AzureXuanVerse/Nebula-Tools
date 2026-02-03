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
      previewMore: '显示UTC/时间戳',
      previewLess: '收起UTC/时间戳',
      currentTitle: '当前时间',
      currentLocal: '本地时区',
      currentUTC: 'UTC',
      currentEpochMs: '时间戳 (毫秒)'
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
        materials: '所有材料',
        skins: '所有皮肤'
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
      melodyLevelPlaceholder: 'Lv',
      melodyOptionPlaceholder: '选择音符...',
      summarySelectedPrefix: '已选择:',
      summarySelectedSuffix: ' / 3，',
      summaryDiscTotalPrefix: '秘纹总计:',
      summaryDiscTotalSuffix: ' / 6',
      modeEmblem: '纹章',
      autobuildToggleLabel: '自动构建',
      autobuildLevelLabel: '等级',
      autobuildLevelPlaceholder: '等级（可选）',
      autobuildScoreLabel: '分数',
      autobuildScorePlaceholder: '分数（可选）',
      emblemCharacterLabel: '角色',
      emblemCharacterPlaceholder: '选择角色',
      emblemSlotLabel: '槽位',
      emblemSlotPlaceholder: '选择槽位 (1-3)',
      emblemAttrLabel: '属性 (选择 4 条)',
      emblemAttrOverlayText: '属性',
      emblemAttrPlaceholder: '选择 4 个属性 ID'
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
      ,
      statusCardTitle: '服务器状态',
      refreshButton: '刷新',
      updatedAtPrefix: '更新于: ',
      labels: {
        git: 'Git',
        game: '游戏版本',
        http: 'HTTP',
        uptime: '运行时长',
        cpu: 'CPU',
        load: '负载',
        disk: '磁盘',
        memory: '内存',
        players: '在线玩家'
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
  zh_TW: {
    navbar: {
      title: 'Nebula Tools',
      github: 'GitHub',
      command: {
        character: '角色',
        disc: '秘紋',
        give: '物品',
        giveall: '批量',
        level: '等級',
        battlepass: '基金',
        build: '紀錄',
        mail: '郵件',
        clean: '清除',
        ban: '封鎖',
        connection: '連線'
      },
      status: {
        connected: '已連線',
        connecting: '連線中',
        disconnected: '未連線'
      }
    },
    common: {
      modeTitle: '模式',
      mode: {
        select: '選擇',
        all: '全部'
      }
    },
    level: {
      title: '設定等級',
      labelPrefix: '等級: '
    },
    battlepass: {
      title: '基金設定',
      modeLabel: '基金補貼',
      mode: {
        keep: '無',
        free: '基礎',
        premium: '尊享'
      },
      levelPrefix: '等級: '
    },
    character: {
      selectTitle: '選擇角色',
      elementFilter: '元素篩選',
      listLabel: '角色列表',
      placeholder: '點擊選擇角色（可多選）',
      selectedPrefix: '已選擇:',
      selectedSuffix: '個角色',
      settingsTitle: '屬性設定',
      attr: {
        level: '等級 (1-90)',
        ascension: '突破 (0-8)',
        skill: '技能 (1-10)',
        talent: '天賦 (0-5)',
        favor: '默契 (0-50)'
      },
      elements: {
        ALL: '全部',
        FIRE: '火',
        AQUA: '水',
        WIND: '風',
        EARTH: '地',
        LIGHT: '光',
        DARK: '暗'
      }
    },
    ban: {
      title: '封鎖管理',
      modeLabel: '操作',
      mode: { ban: '封鎖', unban: '解鎖' },
      scopeLabel: '封鎖範圍',
      scope: { all: '同時封鎖UID與IP', ip: '僅IP', uid: '僅UID' },
      scopeAllBan: '同時封鎖UID與IP',
      scopeAllUnban: '同時解鎖UID與IP',
      endTimeLabel: '結束時間',
      endTimePlaceholder: '選擇結束時間（本地）',
      endFields: { year: '年', month: '月', day: '日', hour: '時', minute: '分', second: '秒' },
      invalidEnd: '請選擇一個晚於當前時間的有效時間',
      uidLabel: '玩家 UID',
      uidPlaceholder: '如：10001（管理員模式可用）',
      ipLabel: 'IP 位址',
      ipPlaceholder: '如：192.168.1.2',
      reasonLabel: '原因',
      reasonPlaceholder: '可選，填寫封鎖原因',
      previewMore: '顯示UTC/時間戳',
      previewLess: '收起UTC/時間戳',
      currentTitle: '當前時間',
      currentLocal: '本地時區',
      currentUTC: 'UTC',
      currentEpochMs: '時間戳 (毫秒)'
    },
    disc: {
      selectTitle: '選擇秘紋',
      elementFilter: '元素篩選',
      listLabel: '秘紋列表',
      placeholder: '點擊選擇秘紋（可多選）',
      selectedPrefix: '已選擇:',
      selectedSuffix: '個秘紋',
      settingsTitle: '屬性設定',
      attr: {
        level: '等級 (1-90)',
        ascension: '階段 (0-8)',
        crescendo: '星級 (0-5)'
      },
      elements: {
        ALL: '全部',
        FIRE: '火',
        AQUA: '水',
        WIND: '風',
        EARTH: '地',
        LIGHT: '光',
        DARK: '暗',
        NONE: '無'
      }
    },
    give: {
      selectTitle: '選擇物品',
      typeFilter: '類型篩選',
      listLabel: '物品列表',
      quantityLabel: '數量',
      selectPlaceholder: '-- 選擇物品 --',
      types: {
        ALL: '全部',
        Res: '資源',
        Item: '物品',
        Char: '角色',
        Energy: '能量',
        CharacterSkin: '造型',
        MonthlyCard: '月卡',
        RogueItem: '肉鴿物品',
        WorldRankExp: '世界等級經驗',
        Title: '稱號',
        Honor: '榮譽',
        HeadItem: '頭像',
        Disc: '秘紋'
      },
      batchMaterialsTitle: '批量材料',
      batchMaterialsHint: '快速生成所有材料命令',
      batchMaterialsButton: '生成全部材料命令'
    },
    giveall: {
      typeTitle: '批量類型',
      typeOptions: {
        characters: '所有角色',
        discs: '所有秘紋',
        materials: '所有材料',
        skins: '所有造型'
      },
      hints: {
        characters: '發放所有角色並設定屬性',
        discs: '發放所有秘紋並設定屬性'
      },
      char: {
        title: '角色屬性',
        attr: {
          level: '等級 (1-90)',
          skill: '技能 (1-10)',
          talent: '天賦 (0-5)'
        }
      },
      disc: {
        title: '秘紋屬性',
        attr: {
          level: '等級 (1-90)',
          ascension: '階段 (0-8)',
          crescendo: '星級 (0-5)'
        }
      }
    },
    build: {
      tipTitle: '提示',
      tipText: '已選中的卡片在點擊“隨機”或“一鍵滿配”時將被優先使用；不足部分隨機補齊。需滿足：3個角色、秘紋總數3-6、音符可選。',
      selectLabel: '選擇3個角色並配置',
      randomButton: '隨機',
      allInOneButton: '一鍵滿配',
      potentialTitle: '潛能',
      potentialLevelPlaceholder: 'Lv',
      discTitle: '秘紋（總共需3-6個）',
      discPlaceholder: '選擇秘紋...',
      discSelectedPrefix: '已選:',
      discSelectedMiddle: '個，總計:',
      discSelectedSuffix: '/ 6',
      melodyTitle: '音符',
      melodyPlaceholder: '選擇音符（可多選）',
      melodyLevelPlaceholder: 'Lv',
      melodyOptionPlaceholder: '選擇音符...',
      summarySelectedPrefix: '已選擇:',
      summarySelectedSuffix: ' / 3，',
      summaryDiscTotalPrefix: '秘紋總計:',
      summaryDiscTotalSuffix: ' / 6',
      modeEmblem: '紋章',
      autobuildToggleLabel: '自動構建',
      autobuildLevelLabel: '等級',
      autobuildLevelPlaceholder: '等級（可選）',
      autobuildScoreLabel: '分數',
      autobuildScorePlaceholder: '分數（可選）',
      emblemCharacterLabel: '角色',
      emblemCharacterPlaceholder: '選擇角色',
      emblemSlotLabel: '槽位',
      emblemSlotPlaceholder: '選擇槽位 (1-3)',
      emblemAttrLabel: '屬性 (選擇 4 條)',
      emblemAttrOverlayText: '屬性',
      emblemAttrPlaceholder: '選擇 4 個屬性 ID'
    },
    mail: {
      contentTitle: '郵件內容',
      subjectLabel: '郵件主題',
      subjectPlaceholder: '輸入郵件主題',
      bodyLabel: '郵件正文',
      bodyPlaceholder: '輸入郵件正文',
      attachmentsTitle: '附件',
      itemIdLabel: '物品 ID',
      quantityLabel: '數量',
      addButton: '添加附件',
      listLabel: '附件列表:',
      deleteButton: '刪除',
      deleteAllButton: '刪除全部',
      globalQuantityToggleOn: '啟用全局數量',
      globalQuantityToggleOff: '關閉全局數量'
    },
    clean: {
      typeLabel: '清除類型',
      typeOptions: {
        all: '全部',
        items: '物品',
        resources: '資源'
      },
      itemIdLabel: '物品 ID',
      itemPlaceholder: '選擇或搜尋物品'
    },
    app: {
      previewTitle: '命令預覽',
      copyTitle: '點擊複製命令',
      copyPlaceholder: '點擊複製',
      runButton: '執行',
      toastCopied: '命令已複製到剪貼簿',
      toastCopyFailed: '複製失敗',
      toastNeedCommand: '請先生成命令',
      toastExecuting: '正在執行命令...',
      execSuccess: '命令執行成功: ',
      execSuccessNoMsg: '命令執行成功',
      execFailedPrefix: '命令執行失敗: ',
      connectionFill: '請填寫伺服器地址和Token',
      connectionTesting: '正在測試連線...',
      connectionSuccess: '連線成功',
      connectionFailedPrefix: '連線失敗: '
    },
    connection: {
      configTitle: '伺服器配置',
      serverUrlLabel: '伺服器地址',
      serverUrlPlaceholder: 'http://127.0.0.1:5210',
      modeLabel: '連線方式',
      modeOptionAdmin: '管理員密鑰（需要指定目標UID）',
      modeOptionPlayer: '玩家令牌（自動使用令牌對應的玩家）',
      tokenAdminLabel: 'Token (管理員密鑰)',
      tokenAdminPlaceholder: '輸入管理員密鑰',
      tokenPlayerLabel: 'Token (玩家令牌)',
      tokenPlayerPlaceholder: '輸入玩家令牌（8位隨機碼）',
      uidLabel: '目標玩家 UID（必填）',
      uidPlaceholder: '如: 10001',
      saveButton: '保存',
      saveHintFill: '請填寫伺服器地址與Token',
      saveHintUid: '管理員模式需填寫目標UID',
      consoleTitle: '控制台',
      consoleInputLabel: '輸入命令',
      consoleInputPlaceholder: '如：/help',
      consoleRunButton: '執行',
      consoleCodePrefix: 'Code: ',
      docsTitle: '使用說明',
      docs: {
        step1: '確保你的星塔旅人遊戲伺服器已啟動並開啟了遠程命令功能。',
        step2: '在上方輸入伺服器地址，通常為',
        step3: '選擇連線方式：',
        listAdmin: '• 管理員密鑰：可以對任意玩家執行命令，需要指定目標UID',
        listPlayer: '• 玩家令牌：只能對令牌對應的玩家執行命令，無需指定UID',
        step4Pre: '輸入相應的 Token（在伺服器配置或遊戲內使用',
        step4Post: '命令獲取）。',
        step5: '點擊"測試連線"按鈕驗證配置是否正確。',
        step6: '連線成功後，你可以在其他頁面生成命令並直接執行。'
      },
      statusCardTitle: '伺服器狀態',
      refreshButton: '重新整理',
      updatedAtPrefix: '更新於: ',
      labels: {
        git: 'Git',
        game: '遊戲版本',
        http: 'HTTP',
        uptime: '運行時長',
        cpu: 'CPU',
        load: '負載',
        disk: '磁碟',
        memory: '記憶體',
        players: '線上玩家'
      }
    },
    multiselect: {
      selectedPrefix: '已選擇',
      selectedSuffix: '項',
      placeholder: '請選擇...',
      empty: '未找到匹配項'
    },
    selectable: {
      placeholder: '請選擇...',
      empty: '未找到匹配項'
    },
    toast: {
      title: {
        success: '操作成功',
        error: '錯誤',
        warning: '警告',
        info: '提示訊息',
        default: '提示'
      }
    },
    remote: {
      missingParams: '缺少必要參數',
      upstreamInvalidJson: '上游響應不是有效 JSON',
      proxyFailedPrefix: '代理請求失敗: ',
      unknownError: '未知錯誤'
    }
  },
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
      previewMore: 'Show UTC/Epoch',
      previewLess: 'Hide UTC/Epoch',
      currentTitle: 'Current Time',
      currentLocal: 'Local Time',
      currentUTC: 'UTC',
      currentEpochMs: 'Epoch (ms)'
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
        materials: 'All Materials',
        skins: 'All Skins'
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
      melodyLevelPlaceholder: 'Lv',
      melodyOptionPlaceholder: 'Select a melody...',
      summarySelectedPrefix: 'Selected:',
      summarySelectedSuffix: ' / 3, ',
      summaryDiscTotalPrefix: 'Discs total:',
      summaryDiscTotalSuffix: ' / 6',
      modeEmblem: 'Emblem',
      autobuildToggleLabel: 'Auto Build',
      autobuildLevelLabel: 'Level',
      autobuildLevelPlaceholder: 'Level (optional)',
      autobuildScoreLabel: 'Score',
      autobuildScorePlaceholder: 'Score (optional)',
      emblemCharacterLabel: 'Character',
      emblemCharacterPlaceholder: 'Select character',
      emblemSlotLabel: 'Slot',
      emblemSlotPlaceholder: 'Select slot (1-3)',
      emblemAttrLabel: 'Attributes (choose 4)',
      emblemAttrOverlayText: 'Attr',
      emblemAttrPlaceholder: 'Select 4 attribute IDs'
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
      ,
      statusCardTitle: 'Server Status',
      refreshButton: 'Refresh',
      updatedAtPrefix: 'Updated: ',
      labels: {
        git: 'Git',
        game: 'Game',
        http: 'HTTP',
        uptime: 'Uptime',
        cpu: 'CPU',
        load: 'Load',
        disk: 'Disk',
        memory: 'Memory',
        players: 'Players'
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
  ja_JP: {
    navbar: {
      title: 'Nebula Tools',
      github: 'GitHub',
      command: {
        character: 'キャラ',
        disc: '秘紋',
        give: 'アイテム',
        giveall: '一括',
        level: 'レベル',
        battlepass: '基金',
        build: '記録',
        mail: 'メール',
        clean: '削除',
        ban: '凍結',
        connection: '接続'
      },
      status: {
        connected: '接続済み',
        connecting: '接続中',
        disconnected: '未接続'
      }
    },
    common: {
      modeTitle: 'モード',
      mode: {
        select: '選択',
        all: '全部'
      }
    },
    level: {
      title: 'レベル設定',
      labelPrefix: 'レベル: '
    },
    battlepass: {
      title: '基金設定',
      modeLabel: '基金補給',
      mode: {
        keep: 'なし',
        free: '基本',
        premium: '上級'
      },
      levelPrefix: 'レベル: '
    },
    character: {
      selectTitle: 'キャラ選択',
      elementFilter: '元素フィルタ',
      listLabel: 'キャラリスト',
      placeholder: 'クリックしてキャラを選択（複数可）',
      selectedPrefix: '選択中:',
      selectedSuffix: '体',
      settingsTitle: 'ステータス設定',
      attr: {
        level: 'レベル (1-90)',
        ascension: '突破 (0-8)',
        skill: 'スキル (1-10)',
        talent: '天賦 (0-5)',
        favor: '絆 (0-50)'
      },
      elements: {
        ALL: '全て',
        FIRE: '火',
        AQUA: '水',
        WIND: '風',
        EARTH: '地',
        LIGHT: '光',
        DARK: '闇'
      }
    },
    ban: {
      title: '凍結管理',
      modeLabel: '操作',
      mode: { ban: '凍結', unban: '解除' },
      scopeLabel: '範囲',
      scope: { all: 'UIDとIP', ip: 'IPのみ', uid: 'UIDのみ' },
      scopeAllBan: 'UIDとIPを凍結',
      scopeAllUnban: 'UIDとIPを解除',
      endTimeLabel: '終了時間',
      endTimePlaceholder: '終了時間を選択（ローカル）',
      endFields: { year: '年', month: '月', day: '日', hour: '時', minute: '分', second: '秒' },
      invalidEnd: '未来の有効な時間を選択してください',
      uidLabel: 'プレイヤーUID',
      uidPlaceholder: '例：10001（管理者モード）',
      ipLabel: 'IPアドレス',
      ipPlaceholder: '例：192.168.1.2',
      reasonLabel: '理由',
      reasonPlaceholder: '任意、凍結理由を入力',
      previewMore: 'UTC/タイムスタンプを表示',
      previewLess: 'UTC/タイムスタンプを隠す',
      currentTitle: '現在時刻',
      currentLocal: 'ローカル',
      currentUTC: 'UTC',
      currentEpochMs: 'タイムスタンプ (ms)'
    },
    disc: {
      selectTitle: '秘紋選択',
      elementFilter: '元素フィルタ',
      listLabel: '秘紋リスト',
      placeholder: 'クリックして秘紋を選択（複数可）',
      selectedPrefix: '選択中:',
      selectedSuffix: '個',
      settingsTitle: 'ステータス設定',
      attr: {
        level: 'レベル (1-90)',
        ascension: '段階 (0-8)',
        crescendo: '星 (0-5)'
      },
      elements: {
        ALL: '全て',
        FIRE: '火',
        AQUA: '水',
        WIND: '風',
        EARTH: '地',
        LIGHT: '光',
        DARK: '闇',
        NONE: '無'
      }
    },
    give: {
      selectTitle: 'アイテム選択',
      typeFilter: 'タイプフィルタ',
      listLabel: 'アイテムリスト',
      quantityLabel: '数量',
      selectPlaceholder: '-- アイテムを選択 --',
      types: {
        ALL: '全部',
        Res: '資源',
        Item: 'アイテム',
        Char: 'キャラ',
        Energy: 'エネルギー',
        CharacterSkin: 'スキン',
        MonthlyCard: '月パス',
        RogueItem: 'ローグアイテム',
        WorldRankExp: '世界ランク経験値',
        Title: '称号',
        Honor: '栄誉',
        HeadItem: 'アイコン',
        Disc: '秘紋'
      },
      batchMaterialsTitle: '一括素材',
      batchMaterialsHint: '全素材コマンドを生成',
      batchMaterialsButton: '全素材コマンド生成'
    },
    giveall: {
      typeTitle: '一括タイプ',
      typeOptions: {
        characters: '全キャラ',
        discs: '全秘紋',
        materials: '全素材',
        skins: '全スキン'
      },
      hints: {
        characters: '全キャラを配布してステータスを設定',
        discs: '全秘紋を配布してステータスを設定'
      },
      char: {
        title: 'キャラステータス',
        attr: {
          level: 'レベル (1-90)',
          skill: 'スキル (1-10)',
          talent: '天賦 (0-5)'
        }
      },
      disc: {
        title: '秘紋ステータス',
        attr: {
          level: 'レベル (1-90)',
          ascension: '段階 (0-8)',
          crescendo: '星 (0-5)'
        }
      }
    },
    build: {
      tipTitle: 'ヒント',
      tipText: '選択したカードは「ランダム」または「一括最大」で優先使用されます。不足分はランダムに補充されます。条件：キャラ3体、秘紋合計3-6個、音符任意。',
      selectLabel: 'キャラを3体選択して構成',
      randomButton: 'ランダム',
      allInOneButton: '一括最大',
      potentialTitle: '潜在',
      potentialLevelPlaceholder: 'Lv',
      discTitle: '秘紋（合計3-6個）',
      discPlaceholder: '秘紋を選択...',
      discSelectedPrefix: '選択:',
      discSelectedMiddle: '個, 合計:',
      discSelectedSuffix: '/ 6',
      melodyTitle: '音符',
      melodyPlaceholder: '音符を選択（複数可）',
      melodyLevelPlaceholder: 'Lv',
      melodyOptionPlaceholder: '音符を選択...',
      summarySelectedPrefix: '選択:',
      summarySelectedSuffix: ' / 3, ',
      summaryDiscTotalPrefix: '秘紋合計:',
      summaryDiscTotalSuffix: ' / 6',
      modeEmblem: '紋章',
      autobuildToggleLabel: '自動構築',
      autobuildLevelLabel: 'レベル',
      autobuildLevelPlaceholder: 'レベル (任意)',
      autobuildScoreLabel: 'スコア',
      autobuildScorePlaceholder: 'スコア (任意)',
      emblemCharacterLabel: 'キャラ',
      emblemCharacterPlaceholder: 'キャラを選択',
      emblemSlotLabel: 'スロット',
      emblemSlotPlaceholder: 'スロット (1-3)',
      emblemAttrLabel: '属性 (4つ選択)',
      emblemAttrOverlayText: '属性',
      emblemAttrPlaceholder: '属性IDを4つ選択'
    },
    mail: {
      contentTitle: 'メール内容',
      subjectLabel: '件名',
      subjectPlaceholder: '件名を入力',
      bodyLabel: '本文',
      bodyPlaceholder: '本文を入力',
      attachmentsTitle: '添付',
      itemIdLabel: 'アイテムID',
      quantityLabel: '数量',
      addButton: '添付追加',
      listLabel: '添付リスト:',
      deleteButton: '削除',
      deleteAllButton: '全削除',
      globalQuantityToggleOn: '全体数量を有効化',
      globalQuantityToggleOff: '全体数量を無効化'
    },
    clean: {
      typeLabel: '削除タイプ',
      typeOptions: {
        all: '全部',
        items: 'アイテム',
        resources: '資源'
      },
      itemIdLabel: 'アイテムID',
      itemPlaceholder: 'アイテムを選択または検索'
    },
    app: {
      previewTitle: 'コマンドプレビュー',
      copyTitle: 'クリックしてコピー',
      copyPlaceholder: 'クリックしてコピー',
      runButton: '実行',
      toastCopied: 'クリップボードにコピーしました',
      toastCopyFailed: 'コピー失敗',
      toastNeedCommand: '先にコマンドを生成してください',
      toastExecuting: 'コマンド実行中...',
      execSuccess: '実行成功: ',
      execSuccessNoMsg: '実行成功',
      execFailedPrefix: '実行失敗: ',
      connectionFill: 'サーバーアドレスとトークンを入力してください',
      connectionTesting: '接続テスト中...',
      connectionSuccess: '接続成功',
      connectionFailedPrefix: '接続失敗: '
    },
    connection: {
      configTitle: 'サーバー設定',
      serverUrlLabel: 'サーバーアドレス',
      serverUrlPlaceholder: 'http://127.0.0.1:5210',
      modeLabel: '接続モード',
      modeOptionAdmin: '管理者キー（対象UIDが必要）',
      modeOptionPlayer: 'プレイヤートークン（トークンの所有者を自動使用）',
      tokenAdminLabel: 'トークン (管理者)',
      tokenAdminPlaceholder: '管理者キーを入力',
      tokenPlayerLabel: 'トークン (プレイヤー)',
      tokenPlayerPlaceholder: 'プレイヤートークンを入力（8文字）',
      uidLabel: '対象プレイヤーUID（必須）',
      uidPlaceholder: '例: 10001',
      saveButton: '保存',
      saveHintFill: 'サーバーアドレスとトークンを入力してください',
      saveHintUid: '管理者モードはUIDが必要です',
      consoleTitle: 'コンソール',
      consoleInputLabel: 'コマンド',
      consoleInputPlaceholder: '例：/help',
      consoleRunButton: '実行',
      consoleCodePrefix: 'Code: ',
      docsTitle: '説明書',
      docs: {
        step1: 'Star Towerサーバーが起動し、リモートコマンドが有効であることを確認してください。',
        step2: 'サーバーアドレスを入力してください。通常は',
        step3: '接続モードを選択：',
        listAdmin: '• 管理者キー：任意のプレイヤーに実行可能、UID指定が必要',
        listPlayer: '• プレイヤートークン：所有者のみ実行可能、UID不要',
        step4Pre: 'トークンを入力（',
        step4Post: 'コマンドで取得可能）。',
        step5: '「接続テスト」をクリックして確認します。',
        step6: '接続成功後、他のページでコマンドを生成・実行できます。'
      },
      statusCardTitle: 'サーバー状態',
      refreshButton: '更新',
      updatedAtPrefix: '更新: ',
      labels: {
        git: 'Git',
        game: 'ゲーム',
        http: 'HTTP',
        uptime: '稼働時間',
        cpu: 'CPU',
        load: '負荷',
        disk: 'ディスク',
        memory: 'メモリ',
        players: 'プレイヤー'
      }
    },
    multiselect: {
      selectedPrefix: '選択済み',
      selectedSuffix: '件',
      placeholder: '選択してください...',
      empty: '一致なし'
    },
    selectable: {
      placeholder: '選択してください...',
      empty: '一致なし'
    },
    toast: {
      title: {
        success: '成功',
        error: 'エラー',
        warning: '警告',
        info: '情報',
        default: '通知'
      }
    },
    remote: {
      missingParams: '必須パラメータが不足しています',
      upstreamInvalidJson: '上流レスポンスが無効なJSONです',
      proxyFailedPrefix: 'プロキシ要求失敗: ',
      unknownError: '不明なエラー'
    }
  },
  ko_KR: {
    navbar: {
      title: 'Nebula Tools',
      github: 'GitHub',
      command: {
        character: '캐릭터',
        disc: '비문',
        give: '아이템',
        giveall: '일괄',
        level: '레벨',
        battlepass: '기금',
        build: '기록',
        mail: '우편',
        clean: '제거',
        ban: '정지',
        connection: '연결'
      },
      status: {
        connected: '연결됨',
        connecting: '연결 중',
        disconnected: '미연결'
      }
    },
    common: {
      modeTitle: '모드',
      mode: {
        select: '선택',
        all: '전체'
      }
    },
    level: {
      title: '레벨 설정',
      labelPrefix: '레벨: '
    },
    battlepass: {
      title: '기금 설정',
      modeLabel: '기금 보급',
      mode: {
        keep: '없음',
        free: '기본',
        premium: '프리미엄'
      },
      levelPrefix: '레벨: '
    },
    character: {
      selectTitle: '캐릭터 선택',
      elementFilter: '속성 필터',
      listLabel: '캐릭터 목록',
      placeholder: '클릭하여 캐릭터 선택 (다중 선택 가능)',
      selectedPrefix: '선택됨:',
      selectedSuffix: '명',
      settingsTitle: '속성 설정',
      attr: {
        level: '레벨 (1-90)',
        ascension: '돌파 (0-8)',
        skill: '스킬 (1-10)',
        talent: '특성 (0-5)',
        favor: '유대 (0-50)'
      },
      elements: {
        ALL: '전체',
        FIRE: '화',
        AQUA: '수',
        WIND: '풍',
        EARTH: '지',
        LIGHT: '광',
        DARK: '암'
      }
    },
    ban: {
      title: '정지 관리',
      modeLabel: '작업',
      mode: { ban: '정지', unban: '해제' },
      scopeLabel: '범위',
      scope: { all: 'UID 및 IP', ip: 'IP만', uid: 'UID만' },
      scopeAllBan: 'UID 및 IP 정지',
      scopeAllUnban: 'UID 및 IP 해제',
      endTimeLabel: '종료 시간',
      endTimePlaceholder: '종료 시간 선택 (로컬)',
      endFields: { year: '년', month: '월', day: '일', hour: '시', minute: '분', second: '초' },
      invalidEnd: '현재 시간 이후의 유효한 시간을 선택하세요',
      uidLabel: '플레이어 UID',
      uidPlaceholder: '예: 10001 (관리자 모드)',
      ipLabel: 'IP 주소',
      ipPlaceholder: '예: 192.168.1.2',
      reasonLabel: '사유',
      reasonPlaceholder: '선택 사항, 정지 사유 입력',
      previewMore: 'UTC/타임스탬프 표시',
      previewLess: 'UTC/타임스탬프 숨기기',
      currentTitle: '현재 시간',
      currentLocal: '로컬 시간',
      currentUTC: 'UTC',
      currentEpochMs: '타임스탬프 (ms)'
    },
    disc: {
      selectTitle: '비문 선택',
      elementFilter: '속성 필터',
      listLabel: '비문 목록',
      placeholder: '클릭하여 비문 선택 (다중 선택 가능)',
      selectedPrefix: '선택됨:',
      selectedSuffix: '개',
      settingsTitle: '속성 설정',
      attr: {
        level: '레벨 (1-90)',
        ascension: '단계 (0-8)',
        crescendo: '성급 (0-5)'
      },
      elements: {
        ALL: '전체',
        FIRE: '화',
        AQUA: '수',
        WIND: '풍',
        EARTH: '지',
        LIGHT: '광',
        DARK: '암',
        NONE: '무'
      }
    },
    give: {
      selectTitle: '아이템 선택',
      typeFilter: '유형 필터',
      listLabel: '아이템 목록',
      quantityLabel: '수량',
      selectPlaceholder: '-- 아이템 선택 --',
      types: {
        ALL: '전체',
        Res: '자원',
        Item: '아이템',
        Char: '캐릭터',
        Energy: '에너지',
        CharacterSkin: '스킨',
        MonthlyCard: '월정액',
        RogueItem: '로그 아이템',
        WorldRankExp: '세계 등급 경험치',
        Title: '칭호',
        Honor: '명예',
        HeadItem: '프로필',
        Disc: '비문'
      },
      batchMaterialsTitle: '일괄 재료',
      batchMaterialsHint: '모든 재료 명령 생성',
      batchMaterialsButton: '모든 재료 명령 생성'
    },
    giveall: {
      typeTitle: '일괄 유형',
      typeOptions: {
        characters: '모든 캐릭터',
        discs: '모든 비문',
        materials: '모든 재료',
        skins: '모든 스킨'
      },
      hints: {
        characters: '모든 캐릭터 지급 및 속성 설정',
        discs: '모든 비문 지급 및 속성 설정'
      },
      char: {
        title: '캐릭터 속성',
        attr: {
          level: '레벨 (1-90)',
          skill: '스킬 (1-10)',
          talent: '특성 (0-5)'
        }
      },
      disc: {
        title: '비문 속성',
        attr: {
          level: '레벨 (1-90)',
          ascension: '단계 (0-8)',
          crescendo: '성급 (0-5)'
        }
      }
    },
    build: {
      tipTitle: '팁',
      tipText: '선택된 카드는 "랜덤" 또는 "일괄 최대" 시 우선 사용됩니다. 부족한 부분은 랜덤으로 채워집니다. 조건: 캐릭터 3명, 비문 총 3-6개, 음표 선택.',
      selectLabel: '캐릭터 3명 선택 및 구성',
      randomButton: '랜덤',
      allInOneButton: '일괄 최대',
      potentialTitle: '잠재력',
      potentialLevelPlaceholder: 'Lv',
      discTitle: '비문 (총 3-6개)',
      discPlaceholder: '비문 선택...',
      discSelectedPrefix: '선택:',
      discSelectedMiddle: '개, 총:',
      discSelectedSuffix: '/ 6',
      melodyTitle: '음표',
      melodyPlaceholder: '음표 선택 (다중 선택 가능)',
      melodyLevelPlaceholder: 'Lv',
      melodyOptionPlaceholder: '음표 선택...',
      summarySelectedPrefix: '선택:',
      summarySelectedSuffix: ' / 3, ',
      summaryDiscTotalPrefix: '비문 총합:',
      summaryDiscTotalSuffix: ' / 6',
      modeEmblem: '문장',
      autobuildToggleLabel: '자동 빌드',
      autobuildLevelLabel: '레벨',
      autobuildLevelPlaceholder: '레벨 (선택)',
      autobuildScoreLabel: '점수',
      autobuildScorePlaceholder: '점수 (선택)',
      emblemCharacterLabel: '캐릭터',
      emblemCharacterPlaceholder: '캐릭터 선택',
      emblemSlotLabel: '슬롯',
      emblemSlotPlaceholder: '슬롯 선택 (1-3)',
      emblemAttrLabel: '속성 (4개 선택)',
      emblemAttrOverlayText: '속성',
      emblemAttrPlaceholder: '속성 ID 4개 선택'
    },
    mail: {
      contentTitle: '우편 내용',
      subjectLabel: '제목',
      subjectPlaceholder: '제목 입력',
      bodyLabel: '본문',
      bodyPlaceholder: '본문 입력',
      attachmentsTitle: '첨부',
      itemIdLabel: '아이템 ID',
      quantityLabel: '수량',
      addButton: '첨부 추가',
      listLabel: '첨부 목록:',
      deleteButton: '삭제',
      deleteAllButton: '전체 삭제',
      globalQuantityToggleOn: '전체 수량 활성화',
      globalQuantityToggleOff: '전체 수량 비활성화'
    },
    clean: {
      typeLabel: '제거 유형',
      typeOptions: {
        all: '전체',
        items: '아이템',
        resources: '자원'
      },
      itemIdLabel: '아이템 ID',
      itemPlaceholder: '아이템 선택 또는 검색'
    },
    app: {
      previewTitle: '명령 미리보기',
      copyTitle: '클릭하여 복사',
      copyPlaceholder: '클릭하여 복사',
      runButton: '실행',
      toastCopied: '클립보드에 복사되었습니다',
      toastCopyFailed: '복사 실패',
      toastNeedCommand: '명령을 먼저 생성하세요',
      toastExecuting: '명령 실행 중...',
      execSuccess: '명령 실행 성공: ',
      execSuccessNoMsg: '명령 실행 성공',
      execFailedPrefix: '명령 실행 실패: ',
      connectionFill: '서버 주소와 토큰을 입력하세요',
      connectionTesting: '연결 테스트 중...',
      connectionSuccess: '연결 성공',
      connectionFailedPrefix: '연결 실패: '
    },
    connection: {
      configTitle: '서버 설정',
      serverUrlLabel: '서버 주소',
      serverUrlPlaceholder: 'http://127.0.0.1:5210',
      modeLabel: '연결 모드',
      modeOptionAdmin: '관리자 키 (대상 UID 필요)',
      modeOptionPlayer: '플레이어 토큰 (토큰 소유자 자동 사용)',
      tokenAdminLabel: '토큰 (관리자)',
      tokenAdminPlaceholder: '관리자 키 입력',
      tokenPlayerLabel: '토큰 (플레이어)',
      tokenPlayerPlaceholder: '플레이어 토큰 입력 (8자리)',
      uidLabel: '대상 플레이어 UID (필수)',
      uidPlaceholder: '예: 10001',
      saveButton: '저장',
      saveHintFill: '서버 주소와 토큰을 입력하세요',
      saveHintUid: '관리자 모드는 대상 UID가 필요합니다',
      consoleTitle: '콘솔',
      consoleInputLabel: '명령',
      consoleInputPlaceholder: '예: /help',
      consoleRunButton: '실행',
      consoleCodePrefix: 'Code: ',
      docsTitle: '사용 설명',
      docs: {
        step1: 'Star Tower 서버가 실행 중이고 원격 명령이 활성화되어 있는지 확인하세요.',
        step2: '서버 주소를 입력하세요. 보통',
        step3: '연결 모드 선택:',
        listAdmin: '• 관리자 키: 모든 플레이어에게 실행 가능, UID 필요',
        listPlayer: '• 플레이어 토큰: 소유자에게만 실행 가능, UID 불필요',
        step4Pre: '토큰 입력 (',
        step4Post: '명령으로 획득).',
        step5: '"연결 테스트"를 클릭하여 확인합니다.',
        step6: '연결 성공 후 다른 페이지에서 명령을 생성하고 실행할 수 있습니다.'
      },
      statusCardTitle: '서버 상태',
      refreshButton: '새로고침',
      updatedAtPrefix: '업데이트: ',
      labels: {
        git: 'Git',
        game: '게임',
        http: 'HTTP',
        uptime: '가동 시간',
        cpu: 'CPU',
        load: '부하',
        disk: '디스크',
        memory: '메모리',
        players: '플레이어'
      }
    },
    multiselect: {
      selectedPrefix: '선택됨',
      selectedSuffix: '개',
      placeholder: '선택하세요...',
      empty: '일치 없음'
    },
    selectable: {
      placeholder: '선택하세요...',
      empty: '일치 없음'
    },
    toast: {
      title: {
        success: '성공',
        error: '오류',
        warning: '경고',
        info: '정보',
        default: '알림'
      }
    },
    remote: {
      missingParams: '필수 매개변수 누락',
      upstreamInvalidJson: '업스트림 응답이 유효한 JSON이 아닙니다',
      proxyFailedPrefix: '프록시 요청 실패: ',
      unknownError: '알 수 없는 오류'
    }
  },
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
