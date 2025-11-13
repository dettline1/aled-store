'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ShoppingCart, 
  User, 
  Calendar, 
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Trash2
} from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'

enum OrderStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

interface Order {
  id: string
  email: string
  phone: string
  status: OrderStatus
  total: number
  subtotal: number
  shippingCost: number
  discountTotal: number
  currency: string
  createdAt: string
  user?: {
    firstName?: string
    lastName?: string
  }
  items?: {
    id: string
    qty: number
    unitPrice: number
    product: {
      name: string
    }
  }[]
}

const statusConfig = {
  [OrderStatus.DRAFT]: { label: 'Черновик', color: 'bg-gray-500', icon: Clock },
  [OrderStatus.PENDING]: { label: 'Ожидает', color: 'bg-yellow-500', icon: Clock },
  [OrderStatus.PAID]: { label: 'Оплачен', color: 'bg-green-500', icon: CheckCircle },
  [OrderStatus.SHIPPED]: { label: 'Отправлен', color: 'bg-blue-500', icon: Truck },
  [OrderStatus.COMPLETED]: { label: 'Выполнен', color: 'bg-green-600', icon: CheckCircle },
  [OrderStatus.CANCELLED]: { label: 'Отменен', color: 'bg-red-500', icon: XCircle },
  [OrderStatus.REFUNDED]: { label: 'Возвращен', color: 'bg-purple-500', icon: XCircle },
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all'>('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    loadOrders()
  }, [page, selectedStatus])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams({ page: page.toString(), limit: '10' })
      if (selectedStatus !== 'all') {
        queryParams.append('status', selectedStatus)
      }
      
      const response = await fetch(`http://localhost:4000/api/v1/orders?${queryParams}`)
      if (!response.ok) throw new Error('Ошибка загрузки')
      
      const data = await response.json()
      setOrders(Array.isArray(data) ? data : [])
      setTotalPages(1) // API пока не возвращает пагинацию
    } catch (error) {
      console.error('Failed to load orders:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const response = await fetch(`http://localhost:4000/api/v1/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!response.ok) throw new Error('Ошибка обновления')
      
      alert('✅ Статус заказа обновлен')
      loadOrders()
    } catch (error) {
      console.error('Failed to update order status:', error)
      alert('❌ Не удалось обновить статус заказа')
    }
  }

  const deleteOrder = async (orderId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот заказ?')) return
    
    try {
      const response = await fetch(`http://localhost:4000/api/v1/orders/${orderId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Ошибка удаления')
      
      alert('✅ Заказ удален')
      loadOrders()
    } catch (error) {
      console.error('Failed to delete order:', error)
      alert('❌ Не удалось удалить заказ')
    }
  }

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const flow = {
      [OrderStatus.PENDING]: OrderStatus.PAID,
      [OrderStatus.PAID]: OrderStatus.SHIPPED,
      [OrderStatus.SHIPPED]: OrderStatus.COMPLETED,
    }
    return flow[currentStatus] || null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Заказы</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Управление заказами клиентов
        </p>
      </div>

      {/* Status Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedStatus === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedStatus('all')}
            >
              Все заказы
            </Button>
            {Object.entries(statusConfig).map(([status, config]) => (
              <Button
                key={status}
                variant={selectedStatus === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedStatus(status as OrderStatus)}
              >
                <config.icon className="mr-1 h-3 w-3" />
                {config.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => {
            const config = statusConfig[order.status]
            const nextStatus = getNextStatus(order.status)
            
            return (
              <Card key={order.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        Заказ #{order.id.slice(-8)}
                      </CardTitle>
                      <CardDescription>
                        {formatDate(order.createdAt)}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${config.color} text-white`}>
                        <config.icon className="mr-1 h-3 w-3" />
                        {config.label}
                      </Badge>
                      {nextStatus && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, nextStatus)}
                        >
                          → {statusConfig[nextStatus].label}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteOrder(order.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Клиент
                      </h4>
                      <p className="text-sm">
                        {order.user?.firstName} {order.user?.lastName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.email}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.phone}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Package className="mr-2 h-4 w-4" />
                        Товары
                      </h4>
                      {order.items?.slice(0, 2).map((item) => (
                        <p key={item.id} className="text-sm">
                          {item.product.name} × {item.qty}
                        </p>
                      ))}
                      {order.items && order.items.length > 2 && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          +{order.items.length - 2} товаров
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Сумма</h4>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Товары:</span>
                          <span>{formatPrice(order.subtotal)}</span>
                        </div>
                        {order.discountTotal > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Скидка:</span>
                            <span>-{formatPrice(order.discountTotal)}</span>
                          </div>
                        )}
                        {order.shippingCost > 0 && (
                          <div className="flex justify-between">
                            <span>Доставка:</span>
                            <span>{formatPrice(order.shippingCost)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-semibold text-lg border-t pt-1">
                          <span>Итого:</span>
                          <span>{formatPrice(order.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Заказы не найдены</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {selectedStatus !== 'all' 
                ? `Нет заказов со статусом "${statusConfig[selectedStatus as OrderStatus]?.label}"`
                : 'Заказов пока нет'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Назад
          </Button>
          <span className="flex items-center px-4">
            Страница {page} из {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Вперед
          </Button>
        </div>
      )}
    </div>
  )
}
