import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Globe } from "lucide-react"

export function Header() {
  return (
    <header className="border-b border-gray-100">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="font-semibold text-xl text-gray-900">TrendMind</div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
              GitHub 趋势
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
              AI 新闻
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
              订阅推送
            </a>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="text-gray-600">
            <Globe className="h-4 w-4 mr-2" />
            EN
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
