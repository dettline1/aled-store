'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  DollarSign,
  Eye,
  Star
} from 'lucide-react'
import { api } from '@/lib/api'
import { formatPrice } from '@/lib/utils'

interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalUsers: number
  totalRevenue: number
  recentOrders: any[]
  topProducts: any[]
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // В реальном проекте здесь был бы отдельный эндпоинт для статистики
      // Пока используем существующие эндпоинты
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        api.get('/products?limit=1'),
        api.get('/orders?limit=5'),
        api.get('/users?limit=1'),
      ])

      setStats({
        totalProducts: productsRes.data.meta?.total || 0,
        totalOrders: ordersRes.data.meta?.total || 0,
        totalUsers: usersRes.data.meta?.total || 0,
        totalRevenue: 150000, // Заглушка
        recentOrders: ordersRes.data.data || [],
        topProducts: [], // Заглушка
      })
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Товары',
      value: stats?.totalProducts || 0,
      icon: Package,
      description: 'Всего товаров',
      color: 'text-blue-600',
    },
    {
      title: 'Заказы',
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      description: 'Всего заказов',
      color: 'text-green-600',
    },
    {
      title: 'Клиенты',
      value: stats?.totalUsers || 0,
      icon: Users,
      description: 'Зарегистрированных',
      color: 'text-purple-600',
    },
    {
      title: 'Выручка',
      value: formatPrice(stats?.totalRevenue || 0),
      icon: DollarSign,
      description: 'За всё время',
      color: 'text-yellow-600',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <span className="text-5xl">👋</span>
            Добро пожаловать!
          </h1>
          <p className="text-white/90 text-lg">
            Панель управления ALed Store - Ваш интернет-магазин светодиодной продукции
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 opacity-10">
          <Package className="h-64 w-64" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -mr-16 -mt-16"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {stat.title}
              </CardTitle>
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg">
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20">
          <CardHeader className="border-b border-blue-100 dark:border-blue-900/30">
            <CardTitle className="flex items-center gap-2 text-xl">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
              Последние заказы
            </CardTitle>
            <CardDescription>
              Недавно оформленные заказы
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {stats?.recentOrders?.length ? (
              <div className="space-y-3">
                {stats.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-900 shadow-md hover:shadow-lg transition-all hover:scale-105">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        Заказ #{order.id.slice(-8)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {order.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-blue-600">
                        {formatPrice(order.total)}
                      </p>
                      <p className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        {order.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <p className="text-sm text-gray-500">Заказов пока нет</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20">
          <CardHeader className="border-b border-purple-100 dark:border-purple-900/30">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Star className="h-5 w-5 text-purple-600" />
              Быстрые действия
            </CardTitle>
            <CardDescription>
              Часто используемые функции
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-6">
            <a
              href="/dashboard/products/new"
              className="flex items-center p-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 transform"
            >
              <Package className="h-6 w-6 mr-3" />
              <div>
                <div className="font-semibold">Добавить товар</div>
                <div className="text-xs opacity-90">Создать новый товар</div>
              </div>
            </a>
            <a
              href="/dashboard/orders"
              className="flex items-center p-4 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 transform"
            >
              <ShoppingCart className="h-6 w-6 mr-3" />
              <div>
                <div className="font-semibold">Просмотреть заказы</div>
                <div className="text-xs opacity-90">Управление заказами</div>
              </div>
            </a>
            <a
              href="/dashboard/media"
              className="flex items-center p-4 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 transform"
            >
              <Eye className="h-6 w-6 mr-3" />
              <div>
                <div className="font-semibold">Управление медиа</div>
                <div className="text-xs opacity-90">Загрузка изображений</div>
              </div>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
