import { Card, CardContent } from "@/components/ui/card"
import { Star, ExternalLink } from "lucide-react"

const trendingRepos = [
  {
    name: "microsoft/TypeScript",
    description: "TypeScript 是 JavaScript 的超集",
    stars: 98234,
    language: "TypeScript",
  },
  {
    name: "vercel/next.js",
    description: "React 全栈框架",
    stars: 118567,
    language: "JavaScript",
  },
  {
    name: "openai/whisper",
    description: "语音识别模型",
    stars: 65432,
    language: "Python",
  },
]

export function TrendingSection() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">🔥 GitHub 热门</h2>
      <div className="space-y-4">
        {trendingRepos.map((repo, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-600 mb-1">{repo.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{repo.description}</p>
                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <span>{repo.language}</span>
                    <div className="flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      {repo.stars.toLocaleString()}
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 ml-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
