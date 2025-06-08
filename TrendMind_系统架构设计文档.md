
系统架构设计文档 - TrendMind

一、架构总览
用户浏览器
    ↓
Next.js 应用（支持多语言）
    ↕
API 路由（/api/news, /api/trending, /api/email）
    ↕
后端逻辑（Node.js / TypeScript）
    ↕
- GitHub API
- RSS Parser
- DeepSeek-v3（多语言摘要）
- Resend API（邮件推送）

二、模块结构
模块            | 描述
----------------|-------------------------------
数据聚合模块     | 抓取 GitHub Trending、AI RSS 新闻源
摘要翻译模块     | 使用 DeepSeek-v3，对新闻内容摘要 + 翻译（中英）
前端展示模块     | Next.js + Tailwind，支持中英切换，内容卡片式展示
邮件发送模块     | 使用 Resend 按语言发送每日摘要邮件
定时任务模块     | 使用 Vercel Cron 或 GitHub Actions 触发定时推送

三、技术选型
技术层        | 技术方案
---------------|-------------------------
前端           | Next.js, Tailwind CSS, next-i18next（中英切换）
后端/API       | Node.js + TypeScript
AI 服务        | DeepSeek-v3 API（摘要 + 翻译）
邮件服务       | Resend（支持 HTML 模板邮件）
部署平台       | Vercel（支持定时任务）

四、关键数据结构（简化）
- TrendingItem: { title, repoUrl, stars, description }
- NewsItem: { title, url, rawText, summaryZh, summaryEn }
- User: { email, language }

五、流程说明
1. 每天定时抓取 GitHub 和 RSS 内容
2. 使用 DeepSeek 生成中英文摘要
3. 存入缓存（JSON 或数据库）
4. 用户可访问网页查看 / 自动接收邮件
5. 多语言切换由浏览器或订阅语言决定
