"use client"

import { useLanguage } from "@/lib/contexts/language-context"
import Link from "next/link"
import { Github, Mail, Heart } from "lucide-react"

// X (Twitter) 图标组件
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

export function Footer() {
  const { t } = useLanguage()

  const footerLinks = [
    {
      title: t('footerAbout'),
      links: [
        { label: t('footerAbout'), href: '/about' },
        { label: t('footerContact'), href: '/contact' },
        { label: 'GitHub', href: 'https://github.com/trendmind' },
      ]
    },
    {
      title: t('subscribe'),
      links: [
        { label: t('subscribeTitle'), href: '/subscribe' },
        { label: 'RSS', href: '/rss' },
        { label: t('aiNewsTitle'), href: '/ai-news' },
      ]
    },
    {
      title: '法律信息',
      links: [
        { label: t('footerPrivacy'), href: '/privacy' },
        { label: t('footerTerms'), href: '/terms' },
        { label: '使用条款', href: '/terms' },
      ]
    }
  ]

  return (
    <footer className="bg-muted/30 border-t mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">TM</span>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t('siteTitle')}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {t('footerDescription')}
            </p>
            <div className="flex space-x-3">
              <Link 
                href="https://github.com/trendmind" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link 
                href="mailto:contact@trendmind.dev" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-5 w-5" />
              </Link>
              <Link 
                href="https://x.com/trendmind" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <XIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {t('footerCopyright')}
            </p>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground mt-4 md:mt-0">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>for developers worldwide</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
