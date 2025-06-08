'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

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
          language: 'zh' // 默认中文，后续可以根据用户选择调整
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        setMessage(data.message)
        setEmail('')
      } else {
        setIsSuccess(false)
        setMessage(data.error || '订阅失败，请稍后重试')
      }
    } catch (error) {
      setIsSuccess(false)
      setMessage('网络错误，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">订阅技术动态</h2>
          <p className="text-gray-600 mb-6">每日/每周精选内容，直接发送到您的邮箱</p>

          <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
            <Input 
              type="email" 
              placeholder="您的邮箱地址" 
              className="flex-1" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !email}>
              {isLoading ? '订阅中...' : '订阅'}
            </Button>
          </form>

          {message && (
            <p className={`text-sm mb-4 ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}

          <p className="text-xs text-gray-500">我们尊重您的隐私，随时可以取消订阅</p>
        </div>
      </div>
    </section>
  )
}
