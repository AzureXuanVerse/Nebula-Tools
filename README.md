# Nebula-Tools

轻量、直观的指令生成与执行工具，支持 Web 与桌面端（Tauri）。

## 功能
- 角色/秘纹/物品/批量/等级/星塔/邮件/清除
- 实时预览与一键复制（支持 `@UID`）
- 连接测试与状态指示
- 多语言：zh_CN / zh_TW / en_US / ja_JP / ko_KR

## 快速开始
```sh
npm install
npm run dev        # Web 开发 (http://localhost:4321)
npm run build      # 构建
npm run preview    # 预览

npm run tauri:dev  # 桌面开发
npm run tauri:build# 桌面打包
```

## 使用
- 在「连接」面板填写服务器地址与 Token 并测试
- 在各面板选择参数生成命令，点击预览复制
- 已连接后点击「执行命令」调用后端 `/api/command`

## HTTPS 说明
- 桌面端本地代理仅支持 `http://`，暂不支持 `https://`。
- Web 端代理支持 HTTPS（需有效证书）。
- 若页面为 HTTPS，调用 HTTP 后端会触发浏览器混合内容拦截；建议使用桌面端。

## 技术栈
- Astro 5 · SolidJS · Tailwind CSS 4 · Tauri 2
