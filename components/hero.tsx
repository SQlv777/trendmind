import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">技术趋势，一目了然</h1>
          <p className="text-xl text-gray-600 mb-8">聚合 GitHub 热门项目与 AI 技术新闻，让你快速掌握技术脉搏</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-blue-600 hover:bg-blue-700">开始探索</Button>
            <Button variant="outline">订阅推送</Button>
          </div>
        </div>
      </div>
    </section>
  )
}
