# Resend 邮件服务设置指南

## 1. 注册 Resend 账户

1. 访问 [Resend 官网](https://resend.com)
2. 点击 "Sign Up" 注册账户
3. 验证邮箱地址

## 2. 获取 API 密钥

1. 登录 Resend 控制台
2. 进入 [API Keys](https://resend.com/api-keys) 页面
3. 点击 "Create API Key"
4. 输入密钥名称（如：TrendMind）
5. 选择权限：`Sending access`
6. 复制生成的 API 密钥

## 3. 配置域名（可选但推荐）

### 使用自定义域名
1. 进入 [Domains](https://resend.com/domains) 页面
2. 点击 "Add Domain"
3. 输入您的域名（如：yourdomain.com）
4. 按照指示添加 DNS 记录
5. 等待域名验证完成

### 使用 Resend 默认域名
- 如果暂时没有自定义域名，可以使用 Resend 提供的默认域名
- 发件人地址格式：`noreply@resend.dev`

## 4. 环境变量配置

创建 `.env.local` 文件并添加以下配置：

```bash
# Resend API Key
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx

# 发件人邮箱（使用您验证的域名）
FROM_EMAIL=noreply@yourdomain.com
# 或使用默认域名
# FROM_EMAIL=noreply@resend.dev

# 网站URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 5. 测试邮件功能

### 测试订阅功能
1. 启动开发服务器：`npm run dev`
2. 访问 http://localhost:3000
3. 在页面底部输入您的邮箱地址
4. 点击"订阅"按钮
5. 检查邮箱是否收到欢迎邮件

### 测试完整邮件模板
使用 API 测试工具（如 Postman）或 curl：

```bash
curl -X POST http://localhost:3000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "language": "zh"
  }'
```

## 6. API 端点说明

### 订阅邮件
- **端点**：`POST /api/email/subscribe`
- **参数**：
  ```json
  {
    "email": "user@example.com",
    "language": "zh" // 或 "en"
  }
  ```

### 发送技术动态邮件
- **端点**：`POST /api/email/send`
- **参数**：
  ```json
  {
    "to": ["user@example.com"],
    "language": "zh",
    "githubRepos": [...],
    "newsItems": [...],
    "subject": "自定义主题（可选）"
  }
  ```

### 测试邮件
- **端点**：`POST /api/email/test`
- **参数**：
  ```json
  {
    "email": "test@example.com",
    "language": "zh"
  }
  ```

## 7. 生产环境注意事项

1. **域名验证**：确保在生产环境中使用已验证的域名
2. **发送限制**：Resend 免费计划有发送限制，根据需要升级计划
3. **监控**：在 Resend 控制台监控邮件发送状态和统计
4. **合规性**：确保遵守邮件营销相关法规（如 GDPR、CAN-SPAM）

## 8. 故障排除

### 常见问题

1. **API 密钥错误**
   - 检查 `.env.local` 文件中的 `RESEND_API_KEY` 是否正确
   - 确保 API 密钥有发送权限

2. **域名未验证**
   - 检查 DNS 记录是否正确配置
   - 等待 DNS 传播完成（可能需要几小时）

3. **邮件未收到**
   - 检查垃圾邮件文件夹
   - 确认收件人邮箱地址正确
   - 查看 Resend 控制台的发送日志

4. **发送失败**
   - 查看服务器日志中的错误信息
   - 检查网络连接
   - 验证请求参数格式

## 9. 更多资源

- [Resend 官方文档](https://resend.com/docs)
- [Resend API 参考](https://resend.com/docs/api-reference)
- [React Email 文档](https://react.email/docs) 