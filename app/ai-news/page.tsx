"use client"

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { ExternalLink, Search, Clock, Newspaper } from 'lucide-react'
import { useLanguage } from '@/lib/contexts/language-context'
import { ContentData, NewsItem } from '@/lib/types'
import Link from 'next/link'

export default function AINewsPage() {
  const { t, language } = useLanguage()
  const [content, setContent] = useState<ContentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'date' | 'source'>('date')
  const [filterSource, setFilterSource] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [displayCount, setDisplayCount] = useState(20)

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

  const getFilteredAndSortedNews = () => {
    if (!content?.news) return []

    let filtered = content.news

    // 搜索过滤
    if (searchTerm) {
      filtered = filtered.filter(news => 
        news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        news.summaryZh.toLowerCase().includes(searchTerm.toLowerCase()) ||
        news.summaryEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        news.source.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // 来源过滤
    if (filterSource !== 'all') {
      filtered = filtered.filter(news => news.source === filterSource)
    }

    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        case 'source':
          return a.source.localeCompare(b.source)
        default:
          return 0
      }
    })

    return filtered.slice(0, displayCount)
  }

  const getAvailableSources = () => {
    if (!content?.news) return []
    const sources = content.news
      .map(news => news.source)
      .filter((source, index, arr) => arr.indexOf(source) === index)
      .sort()
    return sources
  }

  const getTimeAgo = (dateString: string): string => {
    const now = new Date()
    const publishedDate = new Date(dateString)
    const diffInMs = now.getTime() - publishedDate.getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInHours < 1) {
      return t('timeAgo.justNow')
    } else if (diffInHours < 24) {
      return `${diffInHours} ${t('timeAgo.hoursAgo')}`
    } else if (diffInDays < 7) {
      return `${diffInDays} ${t('timeAgo.daysAgo')}`
    } else {
      return publishedDate.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US')
    }
  }

  const filteredNews = getFilteredAndSortedNews()
  const availableSources = getAvailableSources()

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {t('aiNewsPageTitle')}
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('aiNewsPageSubtitle')}
              </p>
              <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                <span>{content?.news.length || 0} {t('articles')}</span>
                <span>•</span>
                <span>{t('lastUpdated')} {content?.lastUpdated ? new Date(content.lastUpdated).toLocaleString() : ''}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Filters and Controls */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索新闻..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-4">
                <Select value={filterSource} onValueChange={setFilterSource}>
                  <SelectTrigger className="w-[180px]">
                    <Newspaper className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有来源</SelectItem>
                    {availableSources.map(source => (
                      <SelectItem key={source} value={source}>{source}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value: 'date' | 'source') => setSortBy(value)}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">按时间排序</SelectItem>
                    <SelectItem value="source">按来源排序</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* News Grid */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.map((news, index) => (
                <NewsCard key={index} news={news} getTimeAgo={getTimeAgo} language={language} />
              ))}
            </div>

            {/* Load More */}
            {displayCount < (content?.news.length || 0) && (
              <div className="text-center mt-8">
                <Button 
                  onClick={() => setDisplayCount(prev => prev + 20)}
                  variant="outline"
                >
                  加载更多新闻
                </Button>
              </div>
            )}

            {/* No Results */}
            {filteredNews.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{t('noData')}</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function NewsCard({ 
  news, 
  getTimeAgo, 
  language 
}: { 
  news: NewsItem
  getTimeAgo: (date: string) => string
  language: 'zh' | 'en'
}) {
  const summary = language === 'zh' ? news.summaryZh : news.summaryEn

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
            {news.source}
          </span>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            {getTimeAgo(news.publishedAt)}
          </div>
        </div>
        
        <h3 className="font-semibold text-lg leading-6 mb-3 line-clamp-2">
          {news.title}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-4">
          {summary || news.rawText.slice(0, 200) + '...'}
        </p>
        
        <div className="flex items-center justify-between">
          <Link href={news.url} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <ExternalLink className="h-4 w-4 mr-2" />
              {language === 'zh' ? '阅读原文' : 'Read more'}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
} 