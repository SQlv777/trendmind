import { Github, Twitter, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="py-8 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-500">© 2023 TrendMind. 保留所有权利。</p>
          </div>

          <div className="flex items-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-gray-600">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-600">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-600">
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
