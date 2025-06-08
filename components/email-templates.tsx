import React from 'react';

// 类型定义
export interface GitHubRepo {
  name: string;
  description: string;
  stars: number;
  todayStars: number;
  language: string;
  url: string;
}

export interface NewsItem {
  title: string;
  summary: string;
  time: string;
  source: string;
  url: string;
}

export interface EmailTemplateProps {
  language: 'zh' | 'en';
  githubRepos: GitHubRepo[];
  newsItems: NewsItem[];
  unsubscribeUrl: string;
}

// 中文邮件模板
export const ChineseEmailTemplate: React.FC<EmailTemplateProps> = ({
  githubRepos,
  newsItems,
  unsubscribeUrl,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
    <header style={{ backgroundColor: '#1f2937', color: 'white', padding: '20px', textAlign: 'center' }}>
      <h1 style={{ margin: 0, fontSize: '24px' }}>TrendMind 技术动态</h1>
      <p style={{ margin: '10px 0 0 0', opacity: 0.8 }}>
        {new Date().toLocaleDateString('zh-CN', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </p>
    </header>

    <main style={{ padding: '20px' }}>
      {/* GitHub 趋势 */}
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#1f2937', borderBottom: '2px solid #3b82f6', paddingBottom: '10px' }}>
          🔥 GitHub 热门项目
        </h2>
        {githubRepos.map((repo, index) => (
          <div key={index} style={{ 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px', 
            padding: '15px', 
            marginBottom: '15px',
            backgroundColor: '#f9fafb'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#3b82f6' }}>
              <a href={repo.url} style={{ textDecoration: 'none', color: '#3b82f6' }}>
                {repo.name}
              </a>
            </h3>
            <p style={{ margin: '0 0 10px 0', color: '#6b7280' }}>{repo.description}</p>
            <div style={{ display: 'flex', gap: '15px', fontSize: '14px', color: '#6b7280' }}>
              <span>⭐ {repo.stars.toLocaleString()}</span>
              <span style={{ color: '#10b981' }}>+{repo.todayStars}</span>
              <span>{repo.language}</span>
            </div>
          </div>
        ))}
      </section>

      {/* AI 新闻 */}
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#1f2937', borderBottom: '2px solid #10b981', paddingBottom: '10px' }}>
          📰 AI 技术新闻
        </h2>
        {newsItems.map((news, index) => (
          <div key={index} style={{ 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px', 
            padding: '15px', 
            marginBottom: '15px',
            backgroundColor: '#f9fafb'
          }}>
            <h3 style={{ margin: '0 0 10px 0' }}>
              <a href={news.url} style={{ textDecoration: 'none', color: '#1f2937' }}>
                {news.title}
              </a>
            </h3>
            <p style={{ margin: '0 0 10px 0', color: '#6b7280' }}>{news.summary}</p>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              <span>{news.source}</span> • <span>{news.time}</span>
            </div>
          </div>
        ))}
      </section>
    </main>

    <footer style={{ backgroundColor: '#f3f4f6', padding: '20px', textAlign: 'center', fontSize: '14px', color: '#6b7280' }}>
      <p>感谢您订阅 TrendMind 技术动态！</p>
      <p>
        <a href={unsubscribeUrl} style={{ color: '#6b7280' }}>取消订阅</a> | 
        <a href="https://trendmind.dev" style={{ color: '#6b7280', marginLeft: '10px' }}>访问网站</a>
      </p>
    </footer>
  </div>
);

// 英文邮件模板
export const EnglishEmailTemplate: React.FC<EmailTemplateProps> = ({
  githubRepos,
  newsItems,
  unsubscribeUrl,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
    <header style={{ backgroundColor: '#1f2937', color: 'white', padding: '20px', textAlign: 'center' }}>
      <h1 style={{ margin: 0, fontSize: '24px' }}>TrendMind Tech Updates</h1>
      <p style={{ margin: '10px 0 0 0', opacity: 0.8 }}>
        {new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </p>
    </header>

    <main style={{ padding: '20px' }}>
      {/* GitHub Trending */}
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#1f2937', borderBottom: '2px solid #3b82f6', paddingBottom: '10px' }}>
          🔥 Trending GitHub Projects
        </h2>
        {githubRepos.map((repo, index) => (
          <div key={index} style={{ 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px', 
            padding: '15px', 
            marginBottom: '15px',
            backgroundColor: '#f9fafb'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#3b82f6' }}>
              <a href={repo.url} style={{ textDecoration: 'none', color: '#3b82f6' }}>
                {repo.name}
              </a>
            </h3>
            <p style={{ margin: '0 0 10px 0', color: '#6b7280' }}>{repo.description}</p>
            <div style={{ display: 'flex', gap: '15px', fontSize: '14px', color: '#6b7280' }}>
              <span>⭐ {repo.stars.toLocaleString()}</span>
              <span style={{ color: '#10b981' }}>+{repo.todayStars}</span>
              <span>{repo.language}</span>
            </div>
          </div>
        ))}
      </section>

      {/* AI News */}
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#1f2937', borderBottom: '2px solid #10b981', paddingBottom: '10px' }}>
          📰 AI Technology News
        </h2>
        {newsItems.map((news, index) => (
          <div key={index} style={{ 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px', 
            padding: '15px', 
            marginBottom: '15px',
            backgroundColor: '#f9fafb'
          }}>
            <h3 style={{ margin: '0 0 10px 0' }}>
              <a href={news.url} style={{ textDecoration: 'none', color: '#1f2937' }}>
                {news.title}
              </a>
            </h3>
            <p style={{ margin: '0 0 10px 0', color: '#6b7280' }}>{news.summary}</p>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              <span>{news.source}</span> • <span>{news.time}</span>
            </div>
          </div>
        ))}
      </section>
    </main>

    <footer style={{ backgroundColor: '#f3f4f6', padding: '20px', textAlign: 'center', fontSize: '14px', color: '#6b7280' }}>
      <p>Thank you for subscribing to TrendMind Tech Updates!</p>
      <p>
        <a href={unsubscribeUrl} style={{ color: '#6b7280' }}>Unsubscribe</a> | 
        <a href="https://trendmind.dev" style={{ color: '#6b7280', marginLeft: '10px' }}>Visit Website</a>
      </p>
    </footer>
  </div>
); 