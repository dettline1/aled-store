'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  ShoppingCart, 
  Users, 
  FileImage, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  ImageIcon
} from 'lucide-react'
import { authApi } from '@/lib/api'
import { toast } from 'react-hot-toast'
import { useTheme } from 'next-themes'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Товары', href: '/dashboard/products', icon: Package },
  { name: 'Категории', href: '/dashboard/categories', icon: FolderTree },
  { name: 'Заказы', href: '/dashboard/orders', icon: ShoppingCart },
  { name: 'Баннеры', href: '/dashboard/banners', icon: ImageIcon },
  { name: 'Клиенты', href: '/dashboard/users', icon: Users },
  { name: 'Медиа', href: '/dashboard/media', icon: FileImage },
  { name: 'Блог', href: '/dashboard/posts', icon: FileText },
  { name: 'Настройки', href: '/dashboard/settings', icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    // Проверяем авторизацию
    const token = localStorage.getItem('access_token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/login')
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    } catch (error) {
      router.push('/login')
    }
  }, [router])

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      router.push('/login')
      toast.success('Вы вышли из системы')
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-blue-950 dark:to-purple-950">
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 transform transition-transform shadow-2xl
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-600 to-purple-600">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            ALed Admin
          </h1>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white hover:bg-white/20"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="mt-6 px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-4 py-3 mb-2 text-sm font-medium rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50 transform scale-105' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 hover:transform hover:scale-105'
                  }
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className={`mr-3 h-5 w-5 transition-transform group-hover:scale-110 ${isActive ? '' : 'text-blue-600 dark:text-blue-400'}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-t from-white/50 to-transparent dark:from-gray-900/50">
          <div className="flex items-center justify-between mb-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 p-3 rounded-lg">
            <div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {user.firstName} {user.lastName}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {user.role}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="hover:bg-white/50 dark:hover:bg-gray-800/50"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-yellow-500" /> : <Moon className="h-4 w-4 text-blue-600" />}
            </Button>
          </div>
          <Button
            size="sm"
            className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Выйти
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Top bar */}
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 px-6 py-4 lg:hidden shadow-lg">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-25 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
