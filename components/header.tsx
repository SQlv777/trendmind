"use client"

import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Globe, Github, Newspaper, Mail } from "lucide-react"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const [language, setLanguage] = useState<'zh' | 'en'>('zh')

  const toggleLanguage = (lang: 'zh' | 'en') => {
    setLanguage(lang)
    // 这里可以添加语言切换逻辑
    localStorage.setItem('language', lang)
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            TrendMind
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => scrollToSection('trending')}
              className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="h-4 w-4 mr-1" />
              {language === 'zh' ? 'GitHub 趋势' : 'GitHub Trending'}
            </button>
            <button 
              onClick={() => scrollToSection('news')}
              className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Newspaper className="h-4 w-4 mr-1" />
              {language === 'zh' ? 'AI 新闻' : 'AI News'}
            </button>
            <button 
              onClick={() => scrollToSection('newsletter')}
              className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="h-4 w-4 mr-1" />
              {language === 'zh' ? '邮件订阅' : 'Newsletter'}
            </button>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                <Globe className="h-4 w-4 mr-2" />
                {language === 'zh' ? '中文' : 'English'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => toggleLanguage('zh')}>
                🇨🇳 中文
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleLanguage('en')}>
                🇺🇸 English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
