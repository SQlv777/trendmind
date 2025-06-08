"use client"

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Star, ExternalLink, GitFork, Search, Filter } from 'lucide-react'
import { useLanguage } from '@/lib/contexts/language-context'
import { ContentData, TrendingItem } from '@/lib/types'
import Link from 'next/link'

export default function GitHubPage() {
  const { t } = useLanguage()
  const [content, setContent] = useState<ContentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'stars' | 'forks' | 'date'>('stars')
  const [filterLanguage, setFilterLanguage] = useState<string>('all')
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

  const getFilteredAndSortedRepos = () => {
    if (!content?.trending) return []

    let filtered = content.trending

    // 搜索过滤
    if (searchTerm) {
      filtered = filtered.filter(repo => 
        repo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (repo.language && repo.language.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // 语言过滤
    if (filterLanguage !== 'all') {
      filtered = filtered.filter(repo => repo.language === filterLanguage)
    }

    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'stars':
          return b.stars - a.stars
        case 'forks':
          return (b.forks || 0) - (a.forks || 0)
        case 'date':
          // 使用publishedAt字段作为日期，如果没有则使用当前时间
          return new Date().getTime() - new Date().getTime() // 暂时使用相同时间，因为GitHub API没有date字段
        default:
          return 0
      }
    })

    return filtered.slice(0, displayCount)
  }

  const getAvailableLanguages = () => {
    if (!content?.trending) return []
    const languages = content.trending
      .map(repo => repo.language)
      .filter(Boolean)
      .filter((lang, index, arr) => arr.indexOf(lang) === index)
      .sort()
    return languages
  }

  const filteredRepos = getFilteredAndSortedRepos()
  const availableLanguages = getAvailableLanguages()

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
        <section className="py-12 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {t('githubPageTitle')}
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('githubPageSubtitle')}
              </p>
              <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                <span>{content?.trending.length || 0} {t('projects')}</span>
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
                    placeholder="搜索项目..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-4">
                <Select value={filterLanguage} onValueChange={setFilterLanguage}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('allLanguages')}</SelectItem>
                    {availableLanguages.map(lang => (
                      <SelectItem key={lang} value={lang!}>{lang}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value: 'stars' | 'forks' | 'date') => setSortBy(value)}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stars">{t('sortByStars')}</SelectItem>
                    <SelectItem value="forks">{t('sortByForks')}</SelectItem>
                    <SelectItem value="date">{t('sortByDate')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredRepos.map((repo, index) => (
                <GitHubCard key={index} repo={repo} />
              ))}
            </div>

            {/* Load More */}
            {filteredRepos.length < getFilteredAndSortedRepos().length && (
              <div className="text-center mt-8">
                <Button 
                  onClick={() => setDisplayCount(prev => prev + 20)}
                  variant="outline"
                >
                  加载更多项目
                </Button>
              </div>
            )}

            {/* No Results */}
            {filteredRepos.length === 0 && (
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

function GitHubCard({ repo }: { repo: TrendingItem }) {
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
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-lg leading-6 mb-2 line-clamp-2">
            {repo.title}
          </h3>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {repo.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1" />
              <span>{repo.stars.toLocaleString()}</span>
            </div>
            <div className="flex items-center">
              <GitFork className="h-4 w-4 mr-1" />
              <span>{(repo.forks || 0).toLocaleString()}</span>
            </div>
          </div>
          
          {repo.language && (
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${getLanguageColor(repo.language)}`}></div>
              <span className="text-xs">{repo.language}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          {repo.todayStars && (
            <span className="text-xs text-green-600 dark:text-green-400">
              +{repo.todayStars} stars today
            </span>
          )}
          
          <Link href={repo.repoUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="ml-auto">
              <ExternalLink className="h-4 w-4 mr-1" />
              查看
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
} 