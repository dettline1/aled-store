import axios from 'axios'
import { toast } from 'react-hot-toast'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

// Интерцептор для добавления токена авторизации
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Токен истек, пытаемся обновить
      try {
        const refreshResponse = await api.post('/auth/refresh')
        const newToken = refreshResponse.data.data.accessToken
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', newToken)
        }
        
        // Повторяем исходный запрос с новым токеном
        error.config.headers.Authorization = `Bearer ${newToken}`
        return api.request(error.config)
      } catch (refreshError) {
        // Refresh не удался, перенаправляем на логин
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token')
          localStorage.removeItem('user')
          window.location.href = '/login'
        }
      }
    }

    // НЕ показываем toast тут - пусть компонент сам обрабатывает ошибки
    
    return Promise.reject(error)
  }
)

// API методы
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  
  logout: () => api.post('/auth/logout'),
  
  me: () => api.get('/auth/me'),
  
  refresh: () => api.post('/auth/refresh'),
}

export const usersApi = {
  getAll: (params?: any) => api.get('/users', { params }),
  getById: (id: string) => api.get(`/users/${id}`),
  create: (data: any) => api.post('/users', data),
  update: (id: string, data: any) => api.patch(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
}

export const productsApi = {
  getAll: (params?: any) => api.get('/products', { params }),
  getBySlug: (slug: string) => api.get(`/products/${slug}`),
  create: (data: any) => api.post('/products', data),
  update: (id: string, data: any) => api.patch(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
}

export const categoriesApi = {
  getAll: () => api.get('/categories'),
  getBySlug: (slug: string) => api.get(`/categories/${slug}`),
  create: (data: any) => api.post('/categories', data),
  update: (id: string, data: any) => api.patch(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
}

export const ordersApi = {
  getAll: (params?: any) => api.get('/orders', { params }),
  getById: (id: string) => api.get(`/orders/${id}`),
  updateStatus: (id: string, status: string) => 
    api.patch(`/orders/${id}/status`, { status }),
}

export const mediaApi = {
  getAll: (params?: any) => api.get('/media', { params }),
  getPresignedUrl: (fileName: string, contentType: string) =>
    api.post('/media/presign', { fileName, contentType }),
  create: (data: any) => api.post('/media', data),
  update: (id: string, data: any) => api.patch(`/media/${id}`, data),
  delete: (id: string) => api.delete(`/media/${id}`),
}

export const settingsApi = {
  getAll: () => api.get('/settings'),
  getPublic: () => api.get('/settings/public'),
  update: (settings: Record<string, any>) => 
    api.post('/settings', { settings }),
}
