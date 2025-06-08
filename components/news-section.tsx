import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"

const aiNews = [
  {
    title: "OpenAI 发布 GPT-4 Turbo 新版本",
    summary: "新模型具有更强的推理能力和更低的成本，在代码生成和数学推理方面有显著提升。",
    time: "2小时前",
    source: "TechCrunch",
  },
  {
    title: "Google DeepMind 蛋白质折叠新突破",
    summary: "AlphaFold 3 能够预测更复杂的蛋白质结构，为药物发现开辟新途径。",
    time: "4小时前",
    source: "Nature",
  },
  {
    title: "Microsoft Copilot 扩展到更多应用",
    summary: "Copilot AI 助手将集成到 Excel、PowerPoint 和 Outlook 中，提升办公效率。",
    time: "6小时前",
    source: "Microsoft",
  },
]

export function NewsSection() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">📰 AI 新闻</h2>
      <div className="space-y-4">
        {aiNews.map((news, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{news.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{news.summary}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>来源: {news.source}</span>
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {news.time}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
