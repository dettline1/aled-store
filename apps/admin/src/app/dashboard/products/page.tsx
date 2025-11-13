'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Search, Edit, Trash2, Eye, Package } from 'lucide-react'
import { productsApi } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import { toast } from 'react-hot-toast'

interface Product {
  id: string
  name: string
  slug: string
  sku: string
  price: number
  stock: number
  isPublished: boolean
  category?: { name: string }
  images?: string[] // Base64 или URL изображений
  createdAt: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    loadProducts()
  }, [page, search])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const response = await productsApi.getAll({
        page,
        limit: 12,
        search: search || undefined,
      })
      
      setProducts(response.data.data)
      setTotalPages(response.data.meta.totalPages)
    } catch (error) {
      console.error('Failed to load products:', error)
      toast.error('Не удалось загрузить товары')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) {
      return
    }

    try {
      await productsApi.delete(id)
      toast.success('Товар удален')
      loadProducts()
    } catch (error) {
      console.error('Failed to delete product:', error)
      toast.error('Не удалось удалить товар')
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    loadProducts()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Товары</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Управление каталогом товаров
          </p>
        </div>
        <Link href="/dashboard/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Добавить товар
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Поиск товаров..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button type="submit" variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-square bg-gray-100 dark:bg-gray-800 relative">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Если изображение не загрузилось, показываем placeholder
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`w-full h-full flex items-center justify-center ${product.images && product.images.length > 0 ? 'hidden' : ''}`}>
                  <Package className="h-12 w-12 text-gray-400" />
                </div>
                {!product.isPublished && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs">
                    Черновик
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {product.category?.name}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-lg">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Остаток: {product.stock}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Link href={`/dashboard/products/${product.id}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="mr-1 h-3 w-3" />
                      Изменить
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Товары не найдены</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {search ? 'Попробуйте изменить параметры поиска' : 'Начните с добавления первого товара'}
            </p>
            <Link href="/dashboard/products/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Добавить товар
              </Button>
            </Link>
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
