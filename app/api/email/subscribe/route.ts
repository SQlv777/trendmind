import { NextRequest, NextResponse } from 'next/server';
import { resend, FROM_EMAIL } from '@/lib/resend';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, language = 'zh' } = body;

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: '请提供有效的邮箱地址' },
        { status: 400 }
      );
    }

    // 发送欢迎邮件
    const welcomeSubject = language === 'zh' 
      ? '欢迎订阅 TrendMind 技术动态！' 
      : 'Welcome to TrendMind Tech Updates!';

    const welcomeHtml = language === 'zh' ? `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1f2937;">欢迎订阅 TrendMind！</h1>
        <p>感谢您订阅 TrendMind 技术动态。</p>
        <p>您将定期收到以下内容：</p>
        <ul>
          <li>🔥 GitHub 热门项目趋势</li>
          <li>📰 最新 AI 技术新闻</li>
          <li>🤖 AI 生成的中文摘要</li>
        </ul>
        <p>如果您想取消订阅，可以点击邮件底部的取消订阅链接。</p>
        <hr style="margin: 20px 0;">
        <p style="color: #6b7280; font-size: 14px;">
          TrendMind 团队<br>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}">访问我们的网站</a>
        </p>
      </div>
    ` : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1f2937;">Welcome to TrendMind!</h1>
        <p>Thank you for subscribing to TrendMind Tech Updates.</p>
        <p>You will regularly receive:</p>
        <ul>
          <li>🔥 Trending GitHub projects</li>
          <li>📰 Latest AI technology news</li>
          <li>🤖 AI-generated summaries</li>
        </ul>
        <p>If you want to unsubscribe, you can click the unsubscribe link at the bottom of any email.</p>
        <hr style="margin: 20px 0;">
        <p style="color: #6b7280; font-size: 14px;">
          TrendMind Team<br>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}">Visit our website</a>
        </p>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: welcomeSubject,
      html: welcomeHtml,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: '订阅失败，请稍后重试', details: error },
        { status: 500 }
      );
    }

    // TODO: 这里应该将邮箱保存到数据库
    // 目前只是发送欢迎邮件，实际项目中需要数据库存储订阅信息

    return NextResponse.json({
      success: true,
      message: language === 'zh' ? '订阅成功！欢迎邮件已发送到您的邮箱。' : 'Subscription successful! Welcome email sent.',
      messageId: data?.id
    });

  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: '服务器内部错误', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 