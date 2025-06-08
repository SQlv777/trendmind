import { NextRequest, NextResponse } from 'next/server';
import { resend, FROM_EMAIL } from '@/lib/resend';
import { ChineseEmailTemplate, EnglishEmailTemplate, GitHubRepo, NewsItem } from '@/components/email-templates';
import { renderToString } from 'react-dom/server';
import React from 'react';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      to, 
      language = 'zh', 
      githubRepos = [], 
      newsItems = [],
      subject 
    } = body;

    // 验证必需参数
    if (!to || !Array.isArray(to)) {
      return NextResponse.json(
        { error: '收件人邮箱地址是必需的' },
        { status: 400 }
      );
    }

    // 生成取消订阅链接
    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe?email=${encodeURIComponent(to[0])}`;

    // 选择邮件模板
    const EmailTemplate = language === 'zh' ? ChineseEmailTemplate : EnglishEmailTemplate;
    
    // 渲染邮件HTML
    const emailHtml = renderToString(React.createElement(EmailTemplate, {
      language,
      githubRepos,
      newsItems,
      unsubscribeUrl,
    }));

    // 设置邮件主题
    const emailSubject = subject || (language === 'zh' 
      ? `TrendMind 技术动态 - ${new Date().toLocaleDateString('zh-CN')}`
      : `TrendMind Tech Updates - ${new Date().toLocaleDateString('en-US')}`
    );

    // 发送邮件
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: emailSubject,
      html: emailHtml,
      headers: {
        'List-Unsubscribe': `<${unsubscribeUrl}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: '邮件发送失败', details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: data?.id,
      message: language === 'zh' ? '邮件发送成功' : 'Email sent successfully'
    });

  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: '服务器内部错误', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 