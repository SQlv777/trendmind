import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// 简单的内存存储，实际项目中应该使用数据库
const subscribers = new Map<string, { email: string; language: 'zh' | 'en'; subscribed: boolean; subscribedAt: string }>();

const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
  language: z.enum(['zh', 'en']).default('zh'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, language } = subscribeSchema.parse(body);

    // 检查是否已经订阅
    const existing = subscribers.get(email);
    if (existing && existing.subscribed) {
      return NextResponse.json({
        success: false,
        error: language === 'zh' ? '该邮箱已经订阅' : 'Email already subscribed'
      }, { status: 400 });
    }

    // 添加订阅
    subscribers.set(email, {
      email,
      language,
      subscribed: true,
      subscribedAt: new Date().toISOString()
    });

    console.log(`New subscriber: ${email} (${language})`);

    return NextResponse.json({
      success: true,
      message: language === 'zh' ? '订阅成功！' : 'Successfully subscribed!'
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid input data'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email is required'
      }, { status: 400 });
    }

    const subscriber = subscribers.get(email);
    if (!subscriber) {
      return NextResponse.json({
        success: false,
        error: 'Email not found'
      }, { status: 404 });
    }

    // 标记为取消订阅
    subscribers.set(email, {
      ...subscriber,
      subscribed: false
    });

    console.log(`Unsubscribed: ${email}`);

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed'
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'stats') {
      const stats = {
        total: subscribers.size,
        active: Array.from(subscribers.values()).filter(s => s.subscribed).length,
        languages: {
          zh: Array.from(subscribers.values()).filter(s => s.subscribed && s.language === 'zh').length,
          en: Array.from(subscribers.values()).filter(s => s.subscribed && s.language === 'en').length,
        }
      };

      return NextResponse.json({
        success: true,
        data: stats
      });
    }

    if (action === 'list') {
      // 仅返回基本统计信息，不暴露邮箱地址
      const activeSubscribers = Array.from(subscribers.values())
        .filter(s => s.subscribed)
        .map(s => ({
          language: s.language,
          subscribedAt: s.subscribedAt
        }));

      return NextResponse.json({
        success: true,
        data: activeSubscribers
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 });
  } catch (error) {
    console.error('Get subscribers error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// 导出订阅者数据供邮件发送使用
export function getActiveSubscribers(): Array<{ email: string; language: 'zh' | 'en' }> {
  return Array.from(subscribers.values())
    .filter(s => s.subscribed)
    .map(s => ({ email: s.email, language: s.language }));
} 