"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, ExternalLink, Clock, Github, Newspaper } from "lucide-react"
import { useState, useEffect } from "react"
import { ContentData, TrendingItem, NewsItem } from "@/lib/types"
import { useLanguage } from "@/lib/contexts/language-context"

export function ContentSection() {
  const { t, language } = useLanguage()
  const [content, setContent] = useState<ContentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('combined')

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/content')
      const result = await response.json()
      
      if (result.success) {
        setContent(result.data)
      } else {
        console.error('Failed to fetch content:', result.error)
      }
    } catch (error) {
      console.error('Error fetching content:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading && !content) {
    return (
      <section id="content" className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="content" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('todayTechUpdates')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('heroSubtitle')}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="combined">
              {t('all')}
            </TabsTrigger>
            <TabsTrigger value="github">
              <Github className="h-4 w-4 mr-1" />
              {t('github')}
            </TabsTrigger>
            <TabsTrigger value="ai">
              <Newspaper className="h-4 w-4 mr-1" />
              {t('aiNews')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="combined">
            <div className="grid lg:grid-cols-2 gap-8 mt-8">
              <div id="trending">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-semibold text-gray-900 flex items-center">
                    <Github className="h-6 w-6 mr-2 text-blue-600" />
                    GitHub {language === 'zh' ? '趋势' : 'Trending'}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {content?.trending.length || 0} {language === 'zh' ? '个项目' : 'projects'}
                  </span>
                </div>
                <div className="space-y-4">
                  {content?.trending.slice(0, 6).map((repo, index) => (
                    <GithubCard key={index} repo={repo} language={language} />
                  )) || (
                    <div className="text-center py-8 text-gray-500">
                      {language === 'zh' ? '暂无数据' : 'No data available'}
                    </div>
                  )}
                </div>
              </div>

              <div id="news">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-semibold text-gray-900 flex items-center">
                    <Newspaper className="h-6 w-6 mr-2 text-purple-600" />
                    AI {language === 'zh' ? '新闻' : 'News'}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {content?.news.length || 0} {language === 'zh' ? '条新闻' : 'articles'}
                  </span>
                </div>
                <div className="space-y-4">
                  {content?.news.slice(0, 6).map((news, index) => (
                    <NewsCard key={index} news={news} language={language} />
                  )) || (
                    <div className="text-center py-8 text-gray-500">
                      {language === 'zh' ? '暂无数据' : 'No data available'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="github">
            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-gray-900 flex items-center">
                  <Github className="h-6 w-6 mr-2 text-blue-600" />
                  GitHub {language === 'zh' ? '趋势' : 'Trending'}
                </h3>
                <span className="text-sm text-gray-500">
                  {content?.trending.length || 0} {language === 'zh' ? '个项目' : 'projects'}
                </span>
              </div>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {content?.trending.map((repo, index) => (
                  <GithubCard key={index} repo={repo} language={language} />
                )) || (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    {language === 'zh' ? '暂无数据' : 'No data available'}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai">
            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-gray-900 flex items-center">
                  <Newspaper className="h-6 w-6 mr-2 text-purple-600" />
                  AI {language === 'zh' ? '新闻' : 'News'}
                </h3>
                <span className="text-sm text-gray-500">
                  {content?.news.length || 0} {language === 'zh' ? '条新闻' : 'articles'}
                </span>
              </div>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {content?.news.map((news, index) => (
                  <NewsCard key={index} news={news} language={language} />
                )) || (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    {language === 'zh' ? '暂无数据' : 'No data available'}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {content?.lastUpdated && (
          <div className="text-center mt-8 text-sm text-gray-500">
            {language === 'zh' ? '最后更新：' : 'Last updated: '}
            {new Date(content.lastUpdated).toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US')}
          </div>
        )}
      </div>
    </section>
  )
}

function GithubCard({ repo, language }: { repo: TrendingItem; language: 'zh' | 'en' }) {
  const getLanguageColor = (lang: string) => {
    const colors: { [key: string]: string } = {
      'TypeScript': 'bg-blue-500',
      'JavaScript': 'bg-yellow-500',
      'Python': 'bg-green-500',
      'Rust': 'bg-orange-500',
      'Go': 'bg-cyan-500',
      'Java': 'bg-red-500',
      'C++': 'bg-pink-500',
      'C': 'bg-gray-500',
      'Swift': 'bg-orange-400',
      'Kotlin': 'bg-purple-500',
    }
    return colors[lang] || 'bg-gray-400'
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-blue-600 truncate mb-2">
              <a 
                href={repo.repoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {repo.title}
              </a>
            </h4>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{repo.description}</p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              {repo.language && (
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full ${getLanguageColor(repo.language)} mr-1`}></div>
                  {repo.language}
                </div>
              )}
              <div className="flex items-center">
                <Star className="w-3 h-3 mr-1" />
                {repo.stars.toLocaleString()}
              </div>
              {repo.todayStars && repo.todayStars > 0 && (
                <div className="text-green-600 font-medium">
                  +{repo.todayStars} {language === 'zh' ? '今日' : 'today'}
                </div>
              )}
            </div>
          </div>
          <a 
            href={repo.repoUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="ml-2 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </CardContent>
    </Card>
  )
}

function NewsCard({ news, language }: { news: NewsItem; language: 'zh' | 'en' }) {
  const summary = language === 'zh' ? news.summaryZh : news.summaryEn
  const timeAgo = getTimeAgo(news.publishedAt, language)

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500">
      <CardContent className="p-4">
        <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
          <a 
            href={news.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-purple-600 transition-colors"
          >
            {news.title}
          </a>
        </h4>
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">
          {summary || news.rawText.substring(0, 150) + '...'}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="font-medium">{news.source}</span>
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {timeAgo}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function getTimeAgo(dateString: string, language: 'zh' | 'en'): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) {
    return language === 'zh' ? '刚刚' : 'Just now'
  } else if (diffInHours < 24) {
    return language === 'zh' ? `${diffInHours}小时前` : `${diffInHours}h ago`
  } else {
    const diffInDays = Math.floor(diffInHours / 24)
    return language === 'zh' ? `${diffInDays}天前` : `${diffInDays}d ago`
  }
}
