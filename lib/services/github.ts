import axios from 'axios';
import * as cheerio from 'cheerio';
import { TrendingItem } from '../types';

export class GitHubService {
  private static readonly BASE_URL = 'https://github.com/trending';
  private static readonly API_BASE = 'https://api.github.com';
  private static readonly MAX_RETRIES = 1;
  private static readonly RETRY_DELAY = 2000;

  static async getTrending(period: 'daily' | 'weekly' = 'daily'): Promise<TrendingItem[]> {
    let lastError: any;
    
    for (let attempt = 0; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        const url = period === 'weekly' ? `${this.BASE_URL}?since=weekly` : this.BASE_URL;
        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          },
          timeout: 15000
        });

        const $ = cheerio.load(response.data);
        const trending: TrendingItem[] = [];

        $('article.Box-row').each((_, element) => {
          const $el = $(element);
          
          const titleElement = $el.find('h2 a');
          const title = titleElement.text().trim().replace(/\s+/g, ' ');
          const repoUrl = 'https://github.com' + titleElement.attr('href');
          
          const description = $el.find('p').text().trim();
          
          const language = $el.find('[itemprop="programmingLanguage"]').text().trim();
          
          const starsText = $el.find('a[href*="/stargazers"]').text().trim();
          const stars = this.parseNumber(starsText);
          
          const forksText = $el.find('a[href*="/forks"]').text().trim();
          const forks = this.parseNumber(forksText);
          
          const todayStarsText = $el.find('.float-sm-right').text().trim();
          const todayStars = this.parseNumber(todayStarsText);

          if (title && repoUrl) {
            trending.push({
              title,
              repoUrl,
              stars,
              description,
              language: language || undefined,
              todayStars,
              forks
            });
          }
        });

        return trending.slice(0, 25); // 返回前25个
      } catch (error) {
        lastError = error;
        console.error(`Error fetching GitHub trending (attempt ${attempt + 1}):`, error);
        
        if (attempt < this.MAX_RETRIES && this.isRetryableError(error)) {
          console.log(`Retrying in ${this.RETRY_DELAY}ms...`);
          await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
          continue;
        }
        
        break;
      }
    }
    
    console.error('Failed to fetch GitHub trending after retries');
    return [];
  }

  private static isRetryableError(error: any): boolean {
    if (error.code === 'ECONNRESET' || 
        error.code === 'ECONNABORTED' || 
        error.code === 'ETIMEDOUT' ||
        error.message?.includes('timeout')) {
      return true;
    }
    
    if (error.response?.status >= 500) {
      return true;
    }
    
    return false;
  }

  private static parseNumber(text: string): number {
    if (!text) return 0;
    
    const cleanText = text.replace(/[^\d.,k]/gi, '');
    if (cleanText.includes('k')) {
      return Math.round(parseFloat(cleanText.replace('k', '')) * 1000);
    }
    return parseInt(cleanText.replace(/,/g, '')) || 0;
  }

  static async getRepositoryDetails(repoUrl: string): Promise<Partial<TrendingItem> | null> {
    try {
      const repoPath = repoUrl.replace('https://github.com/', '');
      const apiUrl = `https://api.github.com/repos/${repoPath}`;
      
      const response = await axios.get(apiUrl, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'TrendMind-App'
        },
        timeout: 10000
      });

      const data = response.data;
      return {
        stars: data.stargazers_count,
        forks: data.forks_count,
        language: data.language,
        description: data.description
      };
    } catch (error) {
      console.error('Error fetching repository details:', error);
      return null;
    }
  }

  // 获取AI相关的热门仓库
  static async getAITrendingRepos(): Promise<TrendingItem[]> {
    let lastError: any;
    
    for (let attempt = 0; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        // 简化搜索，减少API调用
        const searchQueries = [
          'artificial intelligence stars:>1000',
          'machine learning stars:>1000'
        ];

        const allRepos: TrendingItem[] = [];
        
        for (const query of searchQueries) {
          try {
            const response = await axios.get(`${this.API_BASE}/search/repositories`, {
              params: {
                q: `${query} pushed:>2024-01-01`,
                sort: 'stars',
                order: 'desc',
                per_page: 5
              },
              headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'TrendMind-App'
              },
              timeout: 10000
            });

            const repos = response.data.items.map((repo: any) => ({
              title: repo.full_name,
              repoUrl: repo.html_url,
              stars: repo.stargazers_count,
              description: repo.description || '',
              language: repo.language,
              todayStars: 0, // API不提供今日增长数据
              forks: repo.forks_count
            }));

            allRepos.push(...repos);
            
            // 添加延迟避免API限制
            await new Promise(resolve => setTimeout(resolve, 1000));
          } catch (error) {
            console.error(`Error searching for ${query}:`, error);
          }
        }

        // 去重并按stars排序
        const uniqueRepos = allRepos.filter((repo, index, self) => 
          index === self.findIndex(r => r.repoUrl === repo.repoUrl)
        );

        return uniqueRepos.sort((a, b) => b.stars - a.stars).slice(0, 10);
      } catch (error) {
        lastError = error;
        console.error(`Error fetching AI trending repos (attempt ${attempt + 1}):`, error);
        
        if (attempt < this.MAX_RETRIES && this.isRetryableError(error)) {
          console.log(`Retrying in ${this.RETRY_DELAY}ms...`);
          await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
          continue;
        }
        
        break;
      }
    }
    
    console.error('Failed to fetch AI trending repos after retries');
    return [];
  }

  // 获取最近创建的热门仓库
  static async getNewHotRepos(): Promise<TrendingItem[]> {
    let lastError: any;
    
    for (let attempt = 0; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const dateStr = oneMonthAgo.toISOString().split('T')[0];

        const response = await axios.get(`${this.API_BASE}/search/repositories`, {
          params: {
            q: `created:>${dateStr} stars:>50`, // 降低stars要求
            sort: 'stars',
            order: 'desc',
            per_page: 10
          },
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'TrendMind-App'
          },
          timeout: 10000
        });

        return response.data.items.map((repo: any) => ({
          title: repo.full_name,
          repoUrl: repo.html_url,
          stars: repo.stargazers_count,
          description: repo.description || '',
          language: repo.language,
          todayStars: 0,
          forks: repo.forks_count
        }));
      } catch (error) {
        lastError = error;
        console.error(`Error fetching new hot repos (attempt ${attempt + 1}):`, error);
        
        if (attempt < this.MAX_RETRIES && this.isRetryableError(error)) {
          console.log(`Retrying in ${this.RETRY_DELAY}ms...`);
          await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
          continue;
        }
        
        break;
      }
    }
    
    console.error('Failed to fetch new hot repos after retries');
    return [];
  }
} 