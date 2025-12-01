'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { authApi } from '@/lib/api'
import { toast } from 'react-hot-toast'
import { Lock, Mail, Sparkles } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await authApi.login({ email, password })
      const { user, accessToken } = response.data.data

      // Проверяем права доступа
      const allowedRoles = ['SUPER_ADMIN', 'MANAGER', 'CONTENT', 'SUPPORT', 'WAREHOUSE']
      if (!allowedRoles.includes(user.role)) {
        toast.error('❌ У вас нет прав доступа к админ-панели')
        setLoading(false)
        return
      }

      // Сохраняем данные
      localStorage.setItem('access_token', accessToken)
      localStorage.setItem('user', JSON.stringify(user))

      toast.success(`✅ Добро пожаловать, ${user.firstName || user.email}!`)
      router.push('/dashboard')
    } catch (error: any) {
      console.error('Login error:', error)
      
      // Более детальная обработка ошибок
      if (!error.response) {
        toast.error('❌ Ошибка подключения к серверу! Проверьте, что API запущен на http://localhost:4000')
      } else if (error.response.status === 401) {
        toast.error('❌ Неверный email или пароль')
      } else {
        toast.error(error.response?.data?.error || '❌ Ошибка авторизации')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-4 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <Card className="w-full max-w-md relative z-10 shadow-2xl border-0 glass-effect">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-animated rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 hover:rotate-6 transition-all duration-300 animate-float">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              ALed Admin
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2 text-base font-medium">
              Панель управления магазином
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2 text-gray-700">
                Email адрес
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@aled.local"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="pl-10 h-12 border-2 focus:border-blue-500 rounded-xl"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold mb-2 text-gray-700">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="pl-10 h-12 border-2 focus:border-blue-500 rounded-xl"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold bg-gradient-animated hover:shadow-2xl shadow-lg transition-all rounded-xl transform hover:scale-105 active:scale-95"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Подключаюсь к серверу...</span>
                </div>
              ) : (
                <span className="flex items-center gap-2">
                  <span>🚀</span>
                  <span>Войти в систему</span>
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
