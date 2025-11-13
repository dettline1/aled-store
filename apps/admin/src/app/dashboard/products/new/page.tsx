'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Save, Package, Upload, X, Plus } from 'lucide-react'
import Link from 'next/link'
import { api } from '@/lib/api'

interface Category {
  id: string
  name: string
  slug: string
}

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [characteristics, setCharacteristics] = useState<{key: string, value: string}[]>([
    { key: '', value: '' }
  ])
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    imageUrl: '',
    isPublished: true
  })

  // Загрузка категорий из API
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true)
      const response = await api.get('/categories')
      // API возвращает { data: [...] }
      const categoriesData = response.data?.data || response.data
      const cats = Array.isArray(categoriesData) ? categoriesData : []
      setCategories(cats)
      console.log('✅ Загружено категорий для выбора:', cats.length)
      if (cats.length > 0 && !formData.categoryId) {
        setFormData(prev => ({ ...prev, categoryId: cats[0].id }))
      }
    } catch (error) {
      console.error('❌ Ошибка загрузки категорий:', error)
    } finally {
      setLoadingCategories(false)
    }
  }

  // Функция загрузки изображений
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setUploadedImages(prev => [...prev, base64])
      }
      reader.readAsDataURL(file)
    })
  }

  // Drag and Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (!files) return

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64 = reader.result as string
          setUploadedImages(prev => [...prev, base64])
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  // Управление характеристиками
  const addCharacteristic = () => {
    setCharacteristics([...characteristics, { key: '', value: '' }])
  }

  const removeCharacteristic = (index: number) => {
    setCharacteristics(characteristics.filter((_, i) => i !== index))
  }

  const updateCharacteristic = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...characteristics]
    updated[index][field] = value
    setCharacteristics(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Все изображения (загруженные + URL)
      const allImages = [...uploadedImages]
      if (formData.imageUrl) {
        allImages.push(formData.imageUrl)
      }

      // Преобразуем характеристики в объект
      const characteristicsObj: Record<string, string> = {}
      characteristics.forEach(char => {
        if (char.key && char.value) {
          characteristicsObj[char.key] = char.value
        }
      })

      const productData = {
        name: formData.name,
        sku: formData.sku,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock) || 0,
        categoryId: formData.categoryId,
        images: allImages,
        characteristics: characteristicsObj,
        isPublished: formData.isPublished
      }

      console.log('📤 Отправка товара:', productData)

      const response = await fetch('http://localhost:4000/api/v1/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      })

      console.log('📥 Ответ сервера:', response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('❌ Ошибка API:', errorData)
        throw new Error(errorData.error || `Ошибка ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      console.log('✅ Товар создан:', result.data)
      alert('✅ Товар успешно создан!')
      router.push('/dashboard/products')
    } catch (error: any) {
      console.error('❌ Полная ошибка:', error)
      const errorMessage = error.message || 'Неизвестная ошибка'
      alert(`❌ Ошибка при создании товара:\n${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/products">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Новый товар</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Добавление нового товара в каталог
          </p>
        </div>
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
                    placeholder="Би-светодиодные линзы ALed X5 Pro"
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
                      placeholder="ALED-X5-PRO-001"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium">
                        Категория <span className="text-red-500">*</span>
                      </label>
                      <Link
                        href="/dashboard/categories"
                        className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <Plus size={12} />
                        Добавить категорию
                      </Link>
                    </div>
                    {loadingCategories ? (
                      <div className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-400">
                        Загрузка категорий...
                      </div>
                    ) : categories.length === 0 ? (
                      <div className="w-full border border-dashed border-gray-300 rounded-md px-3 py-2 text-gray-400 text-center">
                        <p>Категорий нет</p>
                        <Link href="/dashboard/categories" className="text-blue-600 text-sm hover:underline">
                          Создайте первую категорию
                        </Link>
                      </div>
                    ) : (
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
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Описание
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700 min-h-[120px]"
                    placeholder="Профессиональные би-светодиодные линзы..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Характеристики товара
                  <Button type="button" variant="outline" size="sm" onClick={addCharacteristic}>
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {characteristics.map((char, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex gap-2 items-start">
                      <div className="flex-1">
                        <Input
                          placeholder="Название (например: Мощность)"
                          value={char.key}
                          onChange={(e) => updateCharacteristic(index, 'key', e.target.value)}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeCharacteristic(index)}
                        disabled={characteristics.length === 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <textarea
                      placeholder="Значение (например: 35W или подробное описание)"
                      value={char.value}
                      onChange={(e) => updateCharacteristic(index, 'value', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700 min-h-[60px]"
                    />
                  </div>
                ))}
                <p className="text-xs text-gray-500">
                  💡 Добавьте характеристики товара (цветовая температура, мощность, размер и т.д.)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Цены и остатки</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Цена (₽) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    placeholder="12500"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Остаток на складе <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    placeholder="25"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
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
                {/* Рекомендации по размеру */}
                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900 mb-1">
                        Рекомендуемый размер изображений
                      </p>
                      <p className="text-xs text-blue-700">
                        <strong>800x800 px</strong> или больше (квадрат)
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        Минимум: 400x400 px • Формат: PNG, JPG • До 5MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Drag & Drop зона */}
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer"
                >
                  <Upload className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Перетащите изображения сюда
                  </p>
                  <p className="text-xs text-gray-500 mb-3">
                    или нажмите для выбора файлов
                  </p>
                  <label className="inline-block">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <span className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm cursor-pointer hover:bg-blue-700 inline-block">
                      Выбрать файлы
                    </span>
                  </label>
                  <p className="text-xs text-gray-400 mt-2">
                    PNG, JPG, GIF до 5MB
                  </p>
                </div>

                {/* Превью загруженных изображений */}
                {uploadedImages.length > 0 && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Загружено ({uploadedImages.length})
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {uploadedImages.map((img, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={img}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Или URL */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white text-gray-500">или</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    URL изображения
                  </label>
                  <Input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Вставьте прямую ссылку на изображение
                  </p>
                </div>

                {/* Превью URL изображения */}
                {formData.imageUrl && (
                  <div className="border rounded-lg overflow-hidden">
                    <img
                      src={formData.imageUrl}
                      alt="URL Preview"
                      className="w-full h-auto"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.jpg'
                      }}
                    />
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
                    ? 'Товар будет виден на сайте' 
                    : 'Товар будет скрыт (черновик)'}
                </p>

                <div className="pt-4 space-y-2">
                  <Button type="submit" className="w-full" disabled={loading}>
                    <Save className="mr-2 h-4 w-4" />
                    {loading ? 'Сохранение...' : 'Сохранить товар'}
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

