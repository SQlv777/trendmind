"use client"

import { Button } from "@/components/ui/button"
import { ArrowDown, Github, Newspaper, Sparkles } from "lucide-react"
import { useState, useEffect } from "react"

export function Hero() {
  const [language, setLanguage] = useState<'zh' | 'en'>('zh')

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'zh' | 'en'
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  const scrollToContent = () => {
    const element = document.getElementById('content')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const scrollToNewsletter = () => {
    const element = document.getElementById('newsletter')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"></div>
      </div>

      <div className="relative container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-200">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">
                {language === 'zh' ? '每日更新' : 'Daily Updates'}
              </span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6 leading-tight">
            {language === 'zh' ? '技术趋势' : 'Tech Trends'}
            <br />
            <span className="text-4xl md:text-6xl">
              {language === 'zh' ? '一目了然' : 'At a Glance'}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            {language === 'zh' 
              ? '聚合 GitHub 热门项目与 AI 技术新闻，通过 AI 智能摘要，让你快速掌握技术脉搏'
              : 'Aggregate GitHub trending projects and AI tech news with intelligent AI summaries to help you stay on top of tech trends'
            }
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              onClick={scrollToContent}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Github className="h-5 w-5 mr-2" />
              {language === 'zh' ? '开始探索' : 'Start Exploring'}
            </Button>
            <Button 
              onClick={scrollToNewsletter}
              variant="outline" 
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 text-lg font-medium transition-all duration-300"
            >
              <Newspaper className="h-5 w-5 mr-2" />
              {language === 'zh' ? '订阅推送' : 'Subscribe'}
            </Button>
          </div>

          <div className="flex justify-center">
            <button 
              onClick={scrollToContent}
              className="animate-bounce text-gray-400 hover:text-blue-600 transition-colors"
            >
              <ArrowDown className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
