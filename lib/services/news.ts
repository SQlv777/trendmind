import Parser from 'rss-parser';
import { NewsItem } from '../types';

export class NewsService {
  private static readonly RSS_SOURCES = [
    // 只保留稳定可靠的英文AI新闻源
    {
      name: 'Hacker News',
      url: 'https://hnrss.org/frontpage',
    },
    {
      name: 'AI News',
      url: 'https://artificialintelligence-news.com/feed/',
    },
    // 暂时移除不稳定的源
    // {
    //   name: 'MIT Technology Review',
    //   url: 'https://www.technologyreview.com/feed/',
    // },
    // {
    //   name: 'The Verge AI',
    //   url: 'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml',
    // },
    // {
    //   name: 'Analytics Vidhya',
    //   url: 'https://www.analyticsvidhya.com/feed/',
    // },
    // {
    //   name: 'KDnuggets',
    //   url: 'https://www.kdnuggets.com/feed.xml',
    // },
    // {
    //   name: 'Machine Learning Mastery',
    //   url: 'https://machinelearningmastery.com/feed/',
    // },
    // {
    //   name: 'OpenAI Blog',
    //   url: 'https://openai.com/index/rss.xml',
    // },
    // {
    //   name: 'DeepMind Blog',
    //   url: 'https://deepmind.google/discover/blog/rss.xml',
    // },
    // {
    //   name: 'Towards Data Science',
    //   url: 'https://towardsdatascience.com/feed',
    // },
    // 只保留稳定的中文AI新闻源
    {
      name: '机器之心',
      url: 'https://www.jiqizhixin.com/rss',
    },
    {
      name: '虎嗅网-科技',
      url: 'https://www.huxiu.com/rss/0.xml',
    },
    {
      name: '雷锋网AI',
      url: 'https://www.leiphone.com/feed',
    },
    // 暂时移除不稳定的源
    // {
    //   name: 'InfoQ中文',
    //   url: 'https://www.infoq.cn/feed.xml',
    // },
    // {
    //   name: 'AI科技大本营',
    //   url: 'https://blog.csdn.net/dQCFKyQDXYm3F8rB0/rss/list',
    // }
  ];

  private static parser = new Parser({
    timeout: 15000, // 减少超时时间
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Cache-Control': 'no-cache',
    },
    customFields: {
      item: ['description', 'content:encoded', 'summary', 'content']
    }
  });

  static async getLatestNews(limit: number = 20): Promise<Partial<NewsItem>[]> {
    const allNews: Partial<NewsItem>[] = [];
    const promises = this.RSS_SOURCES.map(async (source) => {
      try {
        console.log(`Fetching news from ${source.name}...`);
        
        // 使用Promise.race来处理超时，减少超时时间
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), 15000);
        });
        
        const parsePromise = this.parser.parseURL(source.url);
        const feed = await Promise.race([parsePromise, timeoutPromise]) as any;
        
        if (feed && feed.items && Array.isArray(feed.items)) {
          const sourceNews = feed.items.slice(0, 5).map(item => ({
            title: item.title || '',
            url: item.link || item.url || '',
            rawText: this.extractContent(item),
            publishedAt: item.pubDate || item.isoDate || new Date().toISOString(),
            source: source.name,
            summaryZh: '',
            summaryEn: ''
          })).filter(news => news.title && news.url && news.title.length > 10); // 增加过滤条件

          return sourceNews;
        }
        return [];
      } catch (error) {
        console.error(`Error fetching from ${source.name}:`, error);
        return [];
      }
    });

    try {
      // 设置整体超时
      const results = await Promise.race([
        Promise.allSettled(promises),
        new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Overall timeout')), 30000);
        })
      ]) as PromiseSettledResult<Partial<NewsItem>[]>[];
     
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && Array.isArray(result.value)) {
          allNews.push(...result.value);
        } else if (result.status === 'rejected') {
          console.error(`Failed to fetch from ${this.RSS_SOURCES[index].name}:`, result.reason);
        }
      });
    } catch (error) {
      console.error('Error in Promise.allSettled:', error);
    }

    // 按发布时间排序，返回最新的
    const sortedNews = allNews
      .filter(news => news.title && news.url && news.title.length > 10) // 再次过滤确保数据质量
      .sort((a, b) => {
        const dateA = new Date(a.publishedAt || 0).getTime();
        const dateB = new Date(b.publishedAt || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, limit);

    console.log(`Successfully fetched ${sortedNews.length} news items from ${this.RSS_SOURCES.length} sources`);
    return sortedNews;
  }

  private static extractContent(item: any): string {
    // 提取文章内容，支持多种RSS格式字段
    const contentSources = [
      item['content:encoded'],
      item.description,
      item.summary,
      item.contentSnippet
    ];

    for (const content of contentSources) {
      if (content && typeof content === 'string' && content.trim()) {
        const cleanContent = this.stripHtml(content);
        if (cleanContent.length > 50) {
          return cleanContent.slice(0, 500); // 减少内容长度以节省处理时间
        }
      }
    }
    
    return item.title || '';
  }

  private static stripHtml(html: string): string {
    // 改进的HTML清理，保留更多有用的文本内容
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // 移除script标签
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '') // 移除style标签
      .replace(/<[^>]*>/g, '') // 移除所有HTML标签
      .replace(/&nbsp;/g, ' ') // 替换&nbsp;
      .replace(/&amp;/g, '&') // 替换&amp;
      .replace(/&lt;/g, '<') // 替换&lt;
      .replace(/&gt;/g, '>') // 替换&gt;
      .replace(/&quot;/g, '"') // 替换&quot;
      .replace(/&#39;/g, "'") // 替换&#39;
      .replace(/\s+/g, ' ') // 替换多个空白字符为单个空格
      .trim();
  }

  static async getNewsFromUrl(url: string): Promise<string> {
    try {
      // 这里可以实现更复杂的网页内容抓取
      // 目前返回空字符串，实际使用时可以用puppeteer或其他工具
      return '';
    } catch (error) {
      console.error('Error fetching news content:', error);
      return '';
    }
  }
} 