import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { LanguageProvider } from '@/lib/contexts/language-context'

export const metadata: Metadata = {
  title: 'TrendMind - 智能技术趋势聚合平台',
  description: 'TrendMind是一个智能技术趋势聚合平台，实时聚合GitHub热门项目和AI技术新闻，通过AI智能摘要为您呈现最新技术动态。',
  keywords: 'GitHub trending, AI news, 技术趋势, 开源项目, 人工智能',
  authors: [{ name: 'TrendMind Team' }],
  openGraph: {
    title: 'TrendMind - 智能技术趋势聚合平台',
    description: '实时聚合GitHub热门项目和AI技术新闻，通过AI智能摘要为您呈现最新技术动态',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
