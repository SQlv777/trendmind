import { GitHubService } from './github';
import { NewsService } from './news';
import { AIService } from './ai';
import { ContentData, TrendingItem, NewsItem } from '../types';

export class AggregatorService {
  private static cache: ContentData | null = null;
  private static lastUpdate: Date | null = null;
  private static readonly CACHE_DURATION = 30 * 60 * 1000; // 30分钟

  static async getLatestContent(forceRefresh: boolean = false): Promise<ContentData> {
    // 检查缓存
    if (!forceRefresh && this.cache && this.lastUpdate) {
      const timeSinceUpdate = Date.now() - this.lastUpdate.getTime();
      if (timeSinceUpdate < this.CACHE_DURATION) {
        console.log('Returning cached content');
        return this.cache;
      }
    }

    console.log('Fetching fresh content...');
    
    try {
      // 并行获取多源数据，使用Promise.allSettled确保部分失败不影响其他数据
      // 设置整体超时时间
      const results = await Promise.race([
        Promise.allSettled([
          GitHubService.getTrending('daily'),
          GitHubService.getAITrendingRepos(),
          GitHubService.getNewHotRepos(),
          NewsService.getLatestNews(50) // 减少新闻数量
        ]),
        new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Overall operation timeout')), 60000); // 1分钟总超时
        })
      ]) as PromiseSettledResult<any>[];

      const dailyTrending = results[0].status === 'fulfilled' ? results[0].value : [];
      const aiTrending = results[1].status === 'fulfilled' ? results[1].value : [];
      const newHotRepos = results[2].status === 'fulfilled' ? results[2].value : [];
      const rawNews = results[3].status === 'fulfilled' ? results[3].value : [];

      // 合并GitHub数据并去重
      const allTrending = [...dailyTrending, ...aiTrending, ...newHotRepos];
      const uniqueTrending = allTrending.filter((repo, index, self) => 
        index === self.findIndex(r => r.repoUrl === repo.repoUrl)
      );
      
      // 按照stars数量排序，取前50个
      const trending = uniqueTrending
        .sort((a, b) => b.stars - a.stars)
        .slice(0, 50);

      console.log(`Fetched ${trending.length} trending repos and ${rawNews.length} news items`);

      // 处理新闻摘要 - 只处理前20个新闻
      const processedNews = await this.processNewsWithTimeout(rawNews.slice(0, 20));

      const contentData: ContentData = {
        trending,
        news: processedNews,
        lastUpdated: new Date().toISOString()
      };

      // 更新缓存
      this.cache = contentData;
      this.lastUpdate = new Date();

      console.log('Content aggregation completed');
      return contentData;
    } catch (error) {
      console.error('Error aggregating content:', error);
      
      // 如果有缓存，返回缓存数据
      if (this.cache) {
        return this.cache;
      }

      // 返回空数据
      return {
        trending: [],
        news: [],
        lastUpdated: new Date().toISOString()
      };
    }
  }

  private static async processNewsWithTimeout(rawNews: Partial<NewsItem>[]): Promise<NewsItem[]> {
    try {
      // 设置新闻处理超时
      const processedNews = await Promise.race([
        AIService.processMultipleNews(rawNews),
        new Promise<NewsItem[]>((_, reject) => {
          setTimeout(() => reject(new Error('News processing timeout')), 30000); // 30秒超时
        })
      ]);
      
      return processedNews;
    } catch (error) {
      console.error('Error processing news:', error);
      
      // 如果AI处理失败，返回带有基本摘要的新闻
      return rawNews.map(item => ({
        title: item.title || '',
        url: item.url || '',
        rawText: item.rawText || item.title || '',
        summaryZh: this.generateBasicSummary(item.rawText || item.title || ''),
        summaryEn: this.generateBasicSummary(item.rawText || item.title || ''),
        publishedAt: item.publishedAt || new Date().toISOString(),
        source: item.source || 'Unknown'
      }));
    }
  }

  private static generateBasicSummary(content: string): string {
    // 生成基础摘要
    const sentences = content.split(/[.!?。！？]/).filter(s => s.trim().length > 10);
    const firstSentence = sentences[0]?.trim() || content.substring(0, 100);
    return firstSentence.length > 150 ? firstSentence.substring(0, 150) + '...' : firstSentence;
  }

  static async getTrendingOnly(): Promise<TrendingItem[]> {
    try {
      return await GitHubService.getTrending('daily');
    } catch (error) {
      console.error('Error fetching trending:', error);
      return [];
    }
  }

  static async getNewsOnly(): Promise<NewsItem[]> {
    try {
      const rawNews = await NewsService.getLatestNews(10);
      return await this.processNewsWithTimeout(rawNews);
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  }

  static async getWeeklyTrending(): Promise<TrendingItem[]> {
    try {
      return await GitHubService.getTrending('weekly');
    } catch (error) {
      console.error('Error fetching weekly trending:', error);
      return [];
    }
  }

  static clearCache(): void {
    this.cache = null;
    this.lastUpdate = null;
    console.log('Cache cleared');
  }

  static getCacheStatus(): { cached: boolean; lastUpdate: string | null; age: number } {
    return {
      cached: !!this.cache,
      lastUpdate: this.lastUpdate?.toISOString() || null,
      age: this.lastUpdate ? Date.now() - this.lastUpdate.getTime() : 0
    };
  }

  static async generateDailySummary(language: 'zh' | 'en' = 'zh'): Promise<{
    trendingSummary: string;
    newsCount: number;
    trendingCount: number;
    lastUpdated: string;
  }> {
    try {
      const content = await this.getLatestContent();
      const trendingSummary = await AIService.generateTrendingSummary(content.trending, language);
      
      return {
        trendingSummary,
        newsCount: content.news.length,
        trendingCount: content.trending.length,
        lastUpdated: content.lastUpdated
      };
    } catch (error) {
      console.error('Error generating daily summary:', error);
      return {
        trendingSummary: language === 'zh' ? '暂无数据' : 'No data available',
        newsCount: 0,
        trendingCount: 0,
        lastUpdated: new Date().toISOString()
      };
    }
  }
} 