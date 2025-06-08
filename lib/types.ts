export interface TrendingItem {
  title: string;
  repoUrl: string;
  stars: number;
  description: string;
  language?: string;
  todayStars?: number;
  forks?: number;
}

export interface NewsItem {
  title: string;
  url: string;
  rawText: string;
  summaryZh: string;
  summaryEn: string;
  publishedAt: string;
  source: string;
}

export interface User {
  email: string;
  language: 'zh' | 'en';
  subscribed: boolean;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export type Language = 'zh' | 'en';

export interface ContentData {
  trending: TrendingItem[];
  news: NewsItem[];
  lastUpdated: string;
} 