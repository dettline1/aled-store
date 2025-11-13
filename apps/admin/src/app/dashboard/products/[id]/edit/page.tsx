'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Save, Trash2, Package, Upload, X } from 'lucide-react'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  sku: string
  description: string
  price: number
  oldPrice: number | null
  stock: number
  categoryId: string
  images: string[] | { fileKey: string; alt?: string }[]
  isPublished: boolean
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params?.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Product | null>(null)
  const [newImages, setNewImages] = useState<string[]>([])

  const categories = [
    { id: '1', name: 'Би-светодиодные линзы' },
    { id: '2', name: 'LED лампы' },
    { id: '3', name: 'LED ленты' },
    { id: '4', name: 'DRL модули' }
  ]

  useEffect(() => {
    loadProduct()
  }, [productId])

  const loadProduct = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/v1/products/${productId}`)
      const result = await response.json()
      setFormData(result.data)
    } catch (error) {
      console.error('Error loading product:', error)
      alert('Ошибка загрузки товара')
    } finally {
      setLoading(false)
    }
  }

  // Загрузка новых изображений
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setNewImages(prev => [...prev, base64])
      }
      reader.readAsDataURL(file)
    })
  }

  // Удаление существующего изображения
  const removeExistingImage = (index: number) => {
    if (!formData) return
    const currentImages = Array.isArray(formData.images) ? formData.images : []
    const updatedImages = currentImages.filter((_, i) => i !== index)
    setFormData({ ...formData, images: updatedImages })
  }

  // Удаление нового изображения
  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index))
  }

  // Получение всех изображений (Base64 строки)
  const getImageUrls = (): string[] => {
    if (!formData) return []
    
    const existing = Array.isArray(formData.images) 
      ? formData.images.map(img => typeof img === 'string' ? img : img.fileKey)
      : []
    
    return existing
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return

    setSaving(true)

    try {
      // Объединяем существующие и новые изображения
      const existingImages = getImageUrls()
      const allImages = [...existingImages, ...newImages]

      const updatedData = {
        ...formData,
        images: allImages
      }

      const response = await fetch(`http://localhost:4000/api/v1/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
      })

      if (!response.ok) {
        throw new Error('Ошибка при обновлении товара')
      }

      alert('✅ Товар успешно обновлен!')
      router.push('/dashboard/products')
    } catch (error) {
      console.error('Error:', error)
      alert('❌ Ошибка при обновлении товара')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) {
      return
    }

    try {
      const response = await fetch(`http://localhost:4000/api/v1/products/${productId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Ошибка при удалении товара')
      }

      alert('✅ Товар удален')
      router.push('/dashboard/products')
    } catch (error) {
      console.error('Error:', error)
      alert('❌ Ошибка при удалении товара')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Загрузка...</p>
        </div>
      </div>
    )
  }

  if (!formData) {
    return (
      <div className="text-center py-12">
        <p>Товар не найден</p>
        <Link href="/dashboard/products">
          <Button className="mt-4">Вернуться к списку</Button>
        </Link>
      </div>
    )
  }

  const existingImages = getImageUrls()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/products">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Редактировать товар</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Изменение товара в каталоге
            </p>
          </div>
        </div>
        <Button variant="destructive" onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Удалить
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Основная информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Название товара <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Артикул (SKU) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Категория <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      required
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Описание
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700 min-h-[120px]"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Цены и остатки</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Цена (₽) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Старая цена (₽)
                    </label>
                    <Input
                      type="number"
                      value={formData.oldPrice || ''}
                      onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value ? parseFloat(e.target.value) : null })}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Остаток на складе <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                    required
                    min="0"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Изображения товара</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Существующие изображения */}
                {existingImages.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Текущие изображения
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {existingImages.map((img, index) => (
                        <div key={index} className="relative border rounded-lg overflow-hidden">
                          <img
                            src={img}
                            alt={`Image ${index + 1}`}
                            className="w-full h-32 object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(index)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Новые изображения */}
                {newImages.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Новые изображения
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {newImages.map((img, index) => (
                        <div key={index} className="relative border rounded-lg overflow-hidden">
                          <img
                            src={img}
                            alt={`New ${index + 1}`}
                            className="w-full h-32 object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeNewImage(index)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          <span className="absolute bottom-1 left-1 px-2 py-1 bg-green-500 text-white text-xs rounded">
                            Новое
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Загрузка новых изображений */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Добавить изображения
                  </label>
                  <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
                    <Upload className="h-5 w-5 text-gray-600" />
                    <span className="text-sm text-gray-600">Выбрать файлы</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Рекомендуемый размер: 800x800px
                  </p>
                </div>

                {existingImages.length === 0 && newImages.length === 0 && (
                  <div className="border-2 border-dashed rounded-lg p-8 text-center text-gray-400">
                    <Package className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-sm">Нет изображений</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Публикация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="isPublished" className="text-sm font-medium cursor-pointer">
                    Опубликовать товар
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  {formData.isPublished 
                    ? 'Товар виден на сайте' 
                    : 'Товар скрыт (черновик)'}
                </p>

                <div className="pt-4 space-y-2">
                  <Button type="submit" className="w-full" disabled={saving}>
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? 'Сохранение...' : 'Сохранить изменения'}
                  </Button>
                  <Link href="/dashboard/products" className="block">
                    <Button type="button" variant="outline" className="w-full">
                      Отмена
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}

