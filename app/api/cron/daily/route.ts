import { NextRequest, NextResponse } from 'next/server';
import { AggregatorService } from '@/lib/services/aggregator';

export async function GET(request: NextRequest) {
  try {
    // 验证请求来源（可以添加更严格的验证）
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.CRON_SECRET;
    
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting daily content aggregation...');
    
    // 强制刷新内容
    const content = await AggregatorService.getLatestContent(true);
    
    console.log(`Daily aggregation completed: ${content.trending.length} trending, ${content.news.length} news`);

    return NextResponse.json({
      success: true,
      message: 'Daily content aggregation completed',
      data: {
        trending: content.trending.length,
        news: content.news.length,
        lastUpdated: content.lastUpdated
      }
    });
  } catch (error) {
    console.error('Daily cron error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to aggregate daily content'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, sendEmail = false } = body;

    // 验证请求来源
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.CRON_SECRET;
    
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (action === 'aggregate') {
      console.log('Manual content aggregation triggered...');
      
      const content = await AggregatorService.getLatestContent(true);
      
      let emailResult = null;
      
      if (sendEmail) {
        try {
          // 发送邮件
          const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/email/send`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: 'daily'
            })
          });
          
          emailResult = await emailResponse.json();
        } catch (emailError) {
          console.error('Failed to send emails:', emailError);
          emailResult = { success: false, error: 'Failed to send emails' };
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Manual aggregation completed',
        data: {
          content: {
            trending: content.trending.length,
            news: content.news.length,
            lastUpdated: content.lastUpdated
          },
          email: emailResult
        }
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 });
  } catch (error) {
    console.error('Manual cron error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to execute manual task'
    }, { status: 500 });
  }
} 