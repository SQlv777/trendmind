import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, ExternalLink, Clock } from "lucide-react"

// GitHub 趋势数据
const trendingRepos = [
  {
    name: "microsoft/TypeScript",
    description: "TypeScript 是 JavaScript 的超集，添加了类型系统",
    stars: 98234,
    todayStars: 234,
    language: "TypeScript",
    url: "#",
  },
  {
    name: "vercel/next.js",
    description: "React 全栈框架，支持服务端渲染和静态生成",
    stars: 118567,
    todayStars: 189,
    language: "JavaScript",
    url: "#",
  },
  {
    name: "openai/whisper",
    description: "强大的语音识别模型，支持多种语言",
    stars: 65432,
    todayStars: 156,
    language: "Python",
    url: "#",
  },
  {
    name: "rust-lang/rust",
    description: "高性能、内存安全的系统编程语言",
    stars: 87654,
    todayStars: 145,
    language: "Rust",
    url: "#",
  },
]

// AI 新闻数据
const aiNews = [
  {
    title: "OpenAI 发布 GPT-4 Turbo 新版本",
    summary: "新模型具有更强的推理能力和更低的成本，在代码生成和数学推理方面有显著提升。",
    time: "2小时前",
    source: "TechCrunch",
    url: "#",
  },
  {
    title: "Google DeepMind 蛋白质折叠新突破",
    summary: "AlphaFold 3 能够预测更复杂的蛋白质结构，为药物发现开辟新途径。",
    time: "4小时前",
    source: "Nature",
    url: "#",
  },
  {
    title: "Microsoft Copilot 扩展到更多应用",
    summary: "Copilot AI 助手将集成到 Excel、PowerPoint 和 Outlook 中，提升办公效率。",
    time: "6小时前",
    source: "Microsoft",
    url: "#",
  },
  {
    title: "Meta 开源大型多模态模型",
    summary: "新模型支持文本、图像和音频处理，并提供开源许可，促进AI研究社区发展。",
    time: "8小时前",
    source: "VentureBeat",
    url: "#",
  },
]

export function ContentSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <Tabs defaultValue="combined" className="mb-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="combined">全部</TabsTrigger>
            <TabsTrigger value="github">GitHub 趋势</TabsTrigger>
            <TabsTrigger value="ai">AI 新闻</TabsTrigger>
          </TabsList>

          <TabsContent value="combined">
            <div className="grid lg:grid-cols-2 gap-8 mt-8">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">GitHub 趋势</h2>
                  <a href="#" className="text-sm text-blue-600 hover:underline">
                    查看更多
                  </a>
                </div>
                <div className="space-y-4">
                  {trendingRepos.slice(0, 3).map((repo, index) => (
                    <GithubCard key={index} repo={repo} />
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">AI 新闻</h2>
                  <a href="#" className="text-sm text-blue-600 hover:underline">
                    查看更多
                  </a>
                </div>
                <div className="space-y-4">
                  {aiNews.slice(0, 3).map((news, index) => (
                    <NewsCard key={index} news={news} />
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="github">
            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">GitHub 趋势</h2>
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  查看更多
                </a>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {trendingRepos.map((repo, index) => (
                  <GithubCard key={index} repo={repo} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai">
            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">AI 新闻</h2>
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  查看更多
                </a>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {aiNews.map((news, index) => (
                  <NewsCard key={index} news={news} />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

function GithubCard({ repo }: { repo: any }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-blue-600 truncate mb-1">
              <a href={repo.url} className="hover:underline">
                {repo.name}
              </a>
            </h3>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{repo.description}</p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center">
                <div
                  className={`w-2 h-2 rounded-full bg-${repo.language === "TypeScript" ? "blue" : repo.language === "JavaScript" ? "yellow" : repo.language === "Python" ? "green" : "red"}-500 mr-1`}
                ></div>
                {repo.language}
              </div>
              <div className="flex items-center">
                <Star className="w-3 h-3 mr-1" />
                {repo.stars.toLocaleString()}
              </div>
              <div className="text-green-600">+{repo.todayStars}</div>
            </div>
          </div>
          <a href={repo.url} className="ml-2 text-gray-400 hover:text-gray-600">
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </CardContent>
    </Card>
  )
}

function NewsCard({ news }: { news: any }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <h3 className="font-medium text-gray-900 mb-1">
          <a href={news.url} className="hover:text-blue-600">
            {news.title}
          </a>
        </h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{news.summary}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{news.source}</span>
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {news.time}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
