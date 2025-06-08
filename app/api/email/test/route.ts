import { NextRequest, NextResponse } from 'next/server';
import { resend, FROM_EMAIL } from '@/lib/resend';
import { ChineseEmailTemplate, EnglishEmailTemplate, GitHubRepo, NewsItem } from '@/components/email-templates';
import { renderToString } from 'react-dom/server';
import React from 'react';

// 模拟数据
const mockGithubRepos: GitHubRepo[] = [
  {
    name: 'microsoft/TypeScript',
    description: 'TypeScript 是 JavaScript 的超集，添加了类型系统',
    stars: 98234,
    todayStars: 234,
    language: 'TypeScript',
    url: 'https://github.com/microsoft/TypeScript'
  },
  {
    name: 'vercel/next.js',
    description: 'React 全栈框架，支持服务端渲染和静态生成',
    stars: 118567,
    todayStars: 189,
    language: 'JavaScript',
    url: 'https://github.com/vercel/next.js'
  }
];

const mockNewsItems: NewsItem[] = [
  {
    title: 'OpenAI 发布 GPT-4 Turbo 新版本',
    summary: '新模型具有更强的推理能力和更低的成本，在代码生成和数学推理方面有显著提升。',
    time: '2小时前',
    source: 'TechCrunch',
    url: 'https://techcrunch.com'
  },
  {
    title: 'Google DeepMind 蛋白质折叠新突破',
    summary: 'AlphaFold 3 能够预测更复杂的蛋白质结构，为药物发现开辟新途径。',
    time: '4小时前',
    source: 'Nature',
    url: 'https://nature.com'
  }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, language = 'zh' } = body;

    if (!email) {
      return NextResponse.json(
        { error: '请提供测试邮箱地址' },
        { status: 400 }
      );
    }

    // 生成取消订阅链接
    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe?email=${encodeURIComponent(email)}`;

    // 选择邮件模板
    const EmailTemplate = language === 'zh' ? ChineseEmailTemplate : EnglishEmailTemplate;
    
    // 渲染邮件HTML
    const emailHtml = renderToString(React.createElement(EmailTemplate, {
      language,
      githubRepos: mockGithubRepos,
      newsItems: mockNewsItems,
      unsubscribeUrl,
    }));

    // 设置邮件主题
    const emailSubject = language === 'zh' 
      ? `[测试] TrendMind 技术动态 - ${new Date().toLocaleDateString('zh-CN')}`
      : `[Test] TrendMind Tech Updates - ${new Date().toLocaleDateString('en-US')}`;

    // 发送邮件
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
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
        { error: '测试邮件发送失败', details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: data?.id,
      message: language === 'zh' ? '测试邮件发送成功！' : 'Test email sent successfully!'
    });

  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { error: '服务器内部错误', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 