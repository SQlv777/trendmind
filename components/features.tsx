import { Card, CardContent } from "@/components/ui/card"
import { Github, Newspaper, Brain, Mail } from "lucide-react"

const features = [
  {
    icon: Github,
    title: "GitHub 热门",
    description: "每日最热开源项目",
  },
  {
    icon: Newspaper,
    title: "AI 新闻",
    description: "最新技术资讯",
  },
  {
    icon: Brain,
    title: "智能摘要",
    description: "AI 自动生成摘要",
  },
  {
    icon: Mail,
    title: "邮件推送",
    description: "定时发送到邮箱",
  },
]

export function Features() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">核心功能</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <feature.icon className="w-8 h-8 mx-auto mb-4 text-blue-600" />
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
