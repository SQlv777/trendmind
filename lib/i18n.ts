export const translations = {
  zh: {
    // 通用
    loading: '加载中...',
    noData: '暂无数据',
    lastUpdated: '最后更新：',
    backToTop: '返回顶部',
    
    // 导航
    home: '首页',
    github: 'GitHub',
    aiNews: 'AI新闻',
    about: '关于',
    subscribe: '订阅',
    
    // 首页
    siteTitle: 'TrendMind',
    siteSubtitle: '智能技术趋势聚合平台',
    heroTitle: '掌握最新技术趋势',
    heroSubtitle: '实时聚合 GitHub 热门项目和 AI 技术新闻，通过 AI 智能摘要为您呈现',
    getStarted: '开始探索',
    learnMore: '了解更多',
    
    // 内容部分
    todayTechUpdates: '今日技术动态',
    all: '全部',
    githubTrending: 'GitHub 趋势',
    aiNewsTitle: 'AI 新闻',
    projects: '个项目',
    articles: '条新闻',
    stars: '星',
    forks: '分叉',
    todayStars: '今日星数',
    readMore: '阅读更多',
    viewOnGithub: '在 GitHub 查看',
    
    // 页面标题
    githubPageTitle: 'GitHub 热门项目',
    githubPageSubtitle: '发现最新的开源项目和技术趋势',
    aiNewsPageTitle: 'AI 技术新闻',
    aiNewsPageSubtitle: '最新的人工智能技术动态和行业资讯',
    
    // 筛选和排序
    filter: '筛选',
    sort: '排序',
    sortByStars: '按星数排序',
    sortByForks: '按分叉排序',
    sortByDate: '按日期排序',
    language: '编程语言',
    allLanguages: '所有语言',
    
    // 邮件订阅
    subscribeTitle: '订阅技术动态',
    subscribeSubtitle: '获取每日技术趋势摘要',
    emailPlaceholder: '请输入您的邮箱地址',
    subscribeButton: '订阅',
    subscribeSuccess: '订阅成功！',
    subscribeError: '订阅失败，请稍后重试',
    
    // 底部
    footerAbout: '关于我们',
    footerContact: '联系我们',
    footerPrivacy: '隐私政策',
    footerTerms: '使用条款',
    footerCopyright: '© 2025 TrendMind. 保留所有权利。',
    footerDescription: 'TrendMind 是一个智能技术趋势聚合平台，帮助开发者和技术爱好者掌握最新的技术动态。',
    
    // 主题
    theme: '主题',
    lightTheme: '浅色主题',
    darkTheme: '深色主题',
    systemTheme: '跟随系统',
    
    // 时间
    timeAgo: {
      justNow: '刚刚',
      minutesAgo: '分钟前',
      hoursAgo: '小时前',
      daysAgo: '天前',
      weeksAgo: '周前',
      monthsAgo: '个月前',
      yearsAgo: '年前'
    }
  },
  en: {
    // Common
    loading: 'Loading...',
    noData: 'No data available',
    lastUpdated: 'Last updated: ',
    backToTop: 'Back to top',
    
    // Navigation
    home: 'Home',
    github: 'GitHub',
    aiNews: 'AI News',
    about: 'About',
    subscribe: 'Subscribe',
    
    // Homepage
    siteTitle: 'TrendMind',
    siteSubtitle: 'Intelligent Tech Trend Aggregation Platform',
    heroTitle: 'Stay Ahead of Tech Trends',
    heroSubtitle: 'Real-time aggregation of GitHub trending projects and AI tech news, presented with intelligent AI summaries',
    getStarted: 'Get Started',
    learnMore: 'Learn More',
    
    // Content sections
    todayTechUpdates: "Today's Tech Updates",
    all: 'All',
    githubTrending: 'GitHub Trending',
    aiNewsTitle: 'AI News',
    projects: 'projects',
    articles: 'articles',
    stars: 'stars',
    forks: 'forks',
    todayStars: 'stars today',
    readMore: 'Read more',
    viewOnGithub: 'View on GitHub',
    
    // Page titles
    githubPageTitle: 'GitHub Trending Projects',
    githubPageSubtitle: 'Discover the latest open source projects and tech trends',
    aiNewsPageTitle: 'AI Technology News',
    aiNewsPageSubtitle: 'Latest artificial intelligence technology updates and industry insights',
    
    // Filter and sort
    filter: 'Filter',
    sort: 'Sort',
    sortByStars: 'Sort by stars',
    sortByForks: 'Sort by forks',
    sortByDate: 'Sort by date',
    language: 'Language',
    allLanguages: 'All languages',
    
    // Email subscription
    subscribeTitle: 'Subscribe to Tech Updates',
    subscribeSubtitle: 'Get daily tech trend summaries',
    emailPlaceholder: 'Enter your email address',
    subscribeButton: 'Subscribe',
    subscribeSuccess: 'Successfully subscribed!',
    subscribeError: 'Subscription failed, please try again',
    
    // Footer
    footerAbout: 'About Us',
    footerContact: 'Contact',
    footerPrivacy: 'Privacy Policy',
    footerTerms: 'Terms of Service',
    footerCopyright: '© 2025 TrendMind. All rights reserved.',
    footerDescription: 'TrendMind is an intelligent tech trend aggregation platform helping developers and tech enthusiasts stay updated with the latest technology trends.',
    
    // Theme
    theme: 'Theme',
    lightTheme: 'Light',
    darkTheme: 'Dark',
    systemTheme: 'System',
    
    // Time
    timeAgo: {
      justNow: 'just now',
      minutesAgo: 'minutes ago',
      hoursAgo: 'hours ago',
      daysAgo: 'days ago',
      weeksAgo: 'weeks ago',
      monthsAgo: 'months ago',
      yearsAgo: 'years ago'
    }
  }
} as const;

export type Language = 'zh' | 'en';
export type TranslationKey = keyof typeof translations.zh;

export function getTranslation(language: Language, key: string): string {
  const keys = key.split('.');
  let value: any = translations[language];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
}

export function useTranslation(language: Language) {
  return {
    t: (key: string) => getTranslation(language, key),
    language
  };
} 