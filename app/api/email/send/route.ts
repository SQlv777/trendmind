import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { AggregatorService } from '@/lib/services/aggregator';
import { getActiveSubscribers } from '../subscribe/route';
import { EmailTemplate } from '@/lib/types';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@trendmind.dev';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type = 'daily', language, testEmail } = body;

    // 如果是测试邮件，只发送给指定邮箱
    if (testEmail) {
      const template = await generateEmailTemplate(type, language || 'zh');
      
      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: [testEmail],
        subject: `[测试] ${template.subject}`,
        html: template.html,
      });

      if (error) {
        console.error('Test email error:', error);
        return NextResponse.json({
          success: false,
          error: 'Failed to send test email'
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully',
        messageId: data?.id
      });
    }

    // 获取所有活跃订阅者
    const subscribers = getActiveSubscribers();
    
    if (subscribers.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No active subscribers found'
      }, { status: 400 });
    }

    console.log(`Sending ${type} emails to ${subscribers.length} subscribers`);

    // 按语言分组发送
    const results = {
      sent: 0,
      failed: 0,
      errors: [] as string[]
    };

    for (const subscriber of subscribers) {
      try {
        const template = await generateEmailTemplate(type, subscriber.language);
        
        const { error } = await resend.emails.send({
          from: FROM_EMAIL,
          to: [subscriber.email],
          subject: template.subject,
          html: template.html,
        });

        if (error) {
          console.error(`Failed to send to ${subscriber.email}:`, error);
          results.failed++;
          results.errors.push(`${subscriber.email}: ${error.message || 'Unknown error'}`);
        } else {
          results.sent++;
        }

        // 添加延迟避免API限制
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error processing ${subscriber.email}:`, error);
        results.failed++;
        results.errors.push(`${subscriber.email}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    console.log(`Email sending completed: ${results.sent} sent, ${results.failed} failed`);

    return NextResponse.json({
      success: true,
      message: `Emails sent: ${results.sent} successful, ${results.failed} failed`,
      data: results
    });
  } catch (error) {
    console.error('Send email error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

async function generateEmailTemplate(type: string, language: 'zh' | 'en'): Promise<EmailTemplate> {
  try {
    const content = await AggregatorService.getLatestContent();
    const summary = await AggregatorService.generateDailySummary(language);
    
    const isZh = language === 'zh';
    const subject = isZh ? 'TrendMind 每日技术动态' : 'TrendMind Daily Tech Updates';
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
          .content { padding: 30px 20px; }
          .section { margin-bottom: 30px; }
          .section h2 { color: #2d3748; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
          .trending-item, .news-item { background: #f7fafc; border-left: 4px solid #4299e1; padding: 15px; margin-bottom: 15px; border-radius: 0 8px 8px 0; }
          .trending-item h3, .news-item h3 { margin: 0 0 8px 0; color: #2d3748; }
          .trending-item a, .news-item a { color: #3182ce; text-decoration: none; }
          .trending-item a:hover, .news-item a:hover { text-decoration: underline; }
          .meta { font-size: 14px; color: #718096; margin-top: 8px; }
          .footer { background: #2d3748; color: #a0aec0; padding: 20px; text-align: center; font-size: 14px; }
          .footer a { color: #63b3ed; }
          .summary { background: #edf2f7; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>TrendMind</h1>
            <p>${isZh ? '每日技术动态' : 'Daily Tech Updates'}</p>
          </div>
          
          <div class="content">
            <div class="summary">
              <h2>${isZh ? '今日概览' : 'Today\'s Overview'}</h2>
              <p><strong>${isZh ? 'GitHub 热门项目' : 'GitHub Trending'}:</strong> ${summary.trendingCount} ${isZh ? '个项目' : 'projects'}</p>
              <p><strong>${isZh ? 'AI 新闻' : 'AI News'}:</strong> ${summary.newsCount} ${isZh ? '条新闻' : 'articles'}</p>
              <p>${summary.trendingSummary}</p>
            </div>

            ${content.trending.length > 0 ? `
            <div class="section">
              <h2>${isZh ? '🔥 GitHub 热门项目' : '🔥 GitHub Trending'}</h2>
              ${content.trending.slice(0, 8).map(item => `
                <div class="trending-item">
                  <h3><a href="${item.repoUrl}" target="_blank">${item.title}</a></h3>
                  <p>${item.description}</p>
                  <div class="meta">
                    ${item.language ? `<span>💻 ${item.language}</span> • ` : ''}
                    <span>⭐ ${item.stars.toLocaleString()}</span>
                    ${item.todayStars ? ` • <span>📈 +${item.todayStars} ${isZh ? '今日' : 'today'}</span>` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
            ` : ''}

            ${content.news.length > 0 ? `
            <div class="section">
              <h2>${isZh ? '📰 AI 技术新闻' : '📰 AI Tech News'}</h2>
              ${content.news.slice(0, 6).map(item => `
                <div class="news-item">
                  <h3><a href="${item.url}" target="_blank">${item.title}</a></h3>
                  <p>${isZh ? item.summaryZh : item.summaryEn}</p>
                  <div class="meta">
                    <span>📅 ${new Date(item.publishedAt).toLocaleDateString(isZh ? 'zh-CN' : 'en-US')}</span>
                    <span> • 📰 ${item.source}</span>
                  </div>
                </div>
              `).join('')}
            </div>
            ` : ''}
          </div>

          <div class="footer">
            <p>${isZh ? '感谢您订阅 TrendMind！' : 'Thank you for subscribing to TrendMind!'}</p>
            <p>
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://trendmind.dev'}">${isZh ? '访问网站' : 'Visit Website'}</a> • 
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://trendmind.dev'}/unsubscribe">${isZh ? '取消订阅' : 'Unsubscribe'}</a>
            </p>
            <p style="margin-top: 15px; font-size: 12px; color: #718096;">
              ${isZh ? '更新时间' : 'Last updated'}: ${new Date(content.lastUpdated).toLocaleString(isZh ? 'zh-CN' : 'en-US')}
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    return {
      subject,
      html,
      text: `${subject}\n\n${summary.trendingSummary}\n\n${isZh ? 'GitHub 热门项目' : 'GitHub Trending'}: ${summary.trendingCount}\n${isZh ? 'AI 新闻' : 'AI News'}: ${summary.newsCount}`
    };
  } catch (error) {
    console.error('Error generating email template:', error);
    
    const isZh = language === 'zh';
    return {
      subject: isZh ? 'TrendMind 每日技术动态' : 'TrendMind Daily Tech Updates',
      html: `<p>${isZh ? '抱歉，今日内容获取失败，请稍后访问网站查看最新动态。' : 'Sorry, failed to fetch today\'s content. Please visit our website for the latest updates.'}</p>`,
      text: isZh ? '抱歉，今日内容获取失败。' : 'Sorry, failed to fetch today\'s content.'
    };
  }
} 