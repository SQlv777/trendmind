'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Mail, CheckCircle, AlertCircle, Globe } from "lucide-react"
import { useState, useEffect } from "react"

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [language, setLanguage] = useState<'zh' | 'en'>('zh')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'zh' | 'en'
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/email/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          language
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        setMessage(data.message)
        setEmail('')
      } else {
        setIsSuccess(false)
        setMessage(data.error || (language === 'zh' ? '订阅失败，请稍后重试' : 'Subscription failed, please try again'))
      }
    } catch (error) {
      setIsSuccess(false)
      setMessage(language === 'zh' ? '网络错误，请稍后重试' : 'Network error, please try again')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="newsletter" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-600 rounded-full">
                <Mail className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {language === 'zh' ? '订阅技术动态' : 'Subscribe to Tech Updates'}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {language === 'zh' 
                ? '每日精选 GitHub 热门项目和 AI 技术新闻，通过 AI 智能摘要，直接发送到您的邮箱'
                : 'Daily curated GitHub trending projects and AI tech news with intelligent AI summaries, delivered directly to your inbox'
              }
            </p>
          </div>

          <Card className="max-w-2xl mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
                    {language === 'zh' ? '邮箱地址' : 'Email Address'}
                  </Label>
                  <Input 
                    id="email"
                    type="email" 
                    placeholder={language === 'zh' ? '请输入您的邮箱地址' : 'Enter your email address'}
                    className="h-12 text-lg border-2 border-gray-200 focus:border-blue-500 transition-colors" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    {language === 'zh' ? '邮件语言偏好' : 'Email Language Preference'}
                  </Label>
                  <RadioGroup 
                    value={language} 
                    onValueChange={(value: 'zh' | 'en') => setLanguage(value)}
                    className="flex space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="zh" id="zh" />
                      <Label htmlFor="zh" className="cursor-pointer">🇨🇳 中文</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="en" id="en" />
                      <Label htmlFor="en" className="cursor-pointer">🇺🇸 English</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading || !email}
                  className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {language === 'zh' ? '订阅中...' : 'Subscribing...'}
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 mr-2" />
                      {language === 'zh' ? '立即订阅' : 'Subscribe Now'}
                    </div>
                  )}
                </Button>

                {message && (
                  <div className={`flex items-center p-4 rounded-lg ${
                    isSuccess 
                      ? 'bg-green-50 border border-green-200 text-green-800' 
                      : 'bg-red-50 border border-red-200 text-red-800'
                  }`}>
                    {isSuccess ? (
                      <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    )}
                    <span className="text-sm">{message}</span>
                  </div>
                )}
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid md:grid-cols-3 gap-4 text-center text-sm text-gray-600">
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    {language === 'zh' ? '每日更新' : 'Daily Updates'}
                  </div>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    {language === 'zh' ? 'AI 智能摘要' : 'AI Summaries'}
                  </div>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    {language === 'zh' ? '随时取消' : 'Unsubscribe Anytime'}
                  </div>
                </div>
                <p className="text-xs text-gray-500 text-center mt-4">
                  {language === 'zh' 
                    ? '我们尊重您的隐私，不会向第三方分享您的邮箱地址'
                    : 'We respect your privacy and will never share your email with third parties'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
