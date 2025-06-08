import axios from 'axios';
import { NewsItem, TrendingItem } from '../types';

export class AIService {
  private static readonly DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
  private static readonly API_KEY = process.env.DEEPSEEK_API_KEY;
  private static readonly MAX_RETRIES = 1;
  private static readonly RETRY_DELAY = 2000;

  static async generateSummary(content: string, language: 'zh' | 'en' = 'zh'): Promise<string> {
    if (!this.API_KEY) {
      console.warn('DeepSeek API key not configured');
      return this.generateFallbackSummary(content);
    }

    if (content.length < 50) {
      return this.generateFallbackSummary(content);
    }

    let lastError: any;
    
    for (let attempt = 0; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        const prompt = language === 'zh' 
          ? `请将以下技术新闻内容总结成简洁的中文摘要，控制在80字以内：\n\n${content.slice(0, 1000)}`
          : `Please summarize the following technical news content into a concise English summary within 80 words:\n\n${content.slice(0, 1000)}`;

        const response = await axios.post(
          this.DEEPSEEK_API_URL,
          {
            model: 'deepseek-chat',
            messages: [
              {
                role: 'user',
                content: prompt
              }
            ],
            max_tokens: 150,
            temperature: 0.1
          },
          {
            headers: {
              'Authorization': `Bearer ${this.API_KEY}`,
              'Content-Type': 'application/json'
            },
            timeout: 15000
          }
        );

        const summary = response.data.choices[0]?.message?.content;
        if (summary && summary.trim()) {
          return summary.trim();
        }
        
        throw new Error('Empty response from AI service');
      } catch (error: any) {
        lastError = error;
        console.error(`Error generating summary (attempt ${attempt + 1}):`, error.message);
        
        if (attempt < this.MAX_RETRIES && this.isRetryableError(error)) {
          console.log(`Retrying in ${this.RETRY_DELAY}ms...`);
          await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
          continue;
        }
        
        break;
      }
    }
    
    console.error('All attempts failed, using fallback summary');
    return this.generateFallbackSummary(content);
  }

  private static isRetryableError(error: any): boolean {
    if (error.code === 'ECONNRESET' || 
        error.code === 'ECONNABORTED' || 
        error.code === 'ETIMEDOUT' ||
        error.message?.includes('timeout') ||
        error.message?.includes('aborted')) {
      return true;
    }
    
    if (error.response?.status >= 500) {
      return true;
    }
    
    return false;
  }

  private static generateFallbackSummary(content: string): string {
    const sentences = content.split(/[.!?。！？]/).filter(s => s.trim().length > 10);
    const firstSentence = sentences[0]?.trim() || content.substring(0, 100);
    return firstSentence.length > 150 ? firstSentence.substring(0, 150) + '...' : firstSentence;
  }

  static async processNewsItem(newsItem: Partial<NewsItem>): Promise<NewsItem> {
    const content = newsItem.rawText || newsItem.title || '';
    
    let summaryZh = this.generateFallbackSummary(content);
    let summaryEn = this.generateFallbackSummary(content);
    
    if (content.length > 200 && this.API_KEY) {
      try {
        summaryZh = await this.generateSummary(content, 'zh');
        await new Promise(resolve => setTimeout(resolve, 1000));
        summaryEn = await this.generateSummary(content, 'en');
      } catch (error) {
        console.error('Error processing news item:', error);
      }
    }

    return {
      title: newsItem.title || '',
      url: newsItem.url || '',
      rawText: content,
      summaryZh,
      summaryEn,
      publishedAt: newsItem.publishedAt || new Date().toISOString(),
      source: newsItem.source || 'Unknown'
    };
  }

  static async processMultipleNews(newsItems: Partial<NewsItem>[]): Promise<NewsItem[]> {
    const processedNews: NewsItem[] = [];
    
    for (const item of newsItems) {
      try {
        const result = await this.processNewsItem(item);
        processedNews.push(result);
        
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error('Error processing individual news item:', error);
        processedNews.push({
          title: item.title || '',
          url: item.url || '',
          rawText: item.rawText || item.title || '',
          summaryZh: this.generateFallbackSummary(item.rawText || item.title || ''),
          summaryEn: this.generateFallbackSummary(item.rawText || item.title || ''),
          publishedAt: item.publishedAt || new Date().toISOString(),
          source: item.source || 'Unknown'
        });
      }
    }

    return processedNews;
  }

  static async generateTrendingSummary(trending: TrendingItem[], language: 'zh' | 'en' = 'zh'): Promise<string> {
    const fallbackSummary = language === 'zh' 
      ? `今日GitHub热门项目共${trending.length}个，涵盖多种编程语言和技术领域。`
      : `Today's GitHub trending includes ${trending.length} popular projects across various programming languages and tech domains.`;

    if (!this.API_KEY) {
      return fallbackSummary;
    }

    try {
      const trendingText = trending.slice(0, 8).map(item => 
        `${item.title}: ${item.description} (${item.stars} stars, ${item.language || 'Unknown'})`
      ).join('\n');

      const prompt = language === 'zh'
        ? `请基于以下GitHub热门项目信息，生成一个简洁的中文总结（80字以内）：\n\n${trendingText}`
        : `Please generate a concise English summary (within 80 words) based on the following GitHub trending projects:\n\n${trendingText}`;

      const response = await axios.post(
        this.DEEPSEEK_API_URL,
        {
          model: 'deepseek-chat',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 150,
          temperature: 0.1
        },
        {
          headers: {
            'Authorization': `Bearer ${this.API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 15000
        }
      );

      const summary = response.data.choices[0]?.message?.content;
      return summary && summary.trim() ? summary.trim() : fallbackSummary;
    } catch (error) {
      console.error('Error generating trending summary:', error);
      return fallbackSummary;
    }
  }
} 