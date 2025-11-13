'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/categories');
      // API возвращает { data: [...] }
      const categoriesData = response.data?.data || response.data;
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      console.log('✅ Загружено категорий:', categoriesData?.length || 0);
    } catch (error) {
      console.error('❌ Ошибка загрузки категорий:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Загрузка изображения
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const categoryData = {
        ...formData,
        image: uploadedImage || undefined
      };

      if (editingCategory) {
        // Обновление категории
        const response = await fetch(`http://localhost:4000/api/v1/categories/${editingCategory.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoryData),
        });
        if (!response.ok) throw new Error('Ошибка обновления');
      } else {
        // Создание новой категории
        const response = await fetch('http://localhost:4000/api/v1/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoryData),
        });
        if (!response.ok) throw new Error('Ошибка создания');
      }
      
      // Перезагрузка списка
      await fetchCategories();
      
      // Сброс формы
      setFormData({ name: '', slug: '', description: '' });
      setUploadedImage('');
      setShowAddModal(false);
      setEditingCategory(null);
      
      alert('✅ ' + (editingCategory ? 'Категория обновлена!' : 'Категория создана!'));
    } catch (error: any) {
      console.error('Error:', error);
      alert('❌ Ошибка: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту категорию?')) return;
    
    try {
      const response = await fetch(`http://localhost:4000/api/v1/categories/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Ошибка удаления');
      
      await fetchCategories();
      alert('✅ Категория удалена!');
    } catch (error: any) {
      console.error('Error:', error);
      alert('❌ Ошибка при удалении: ' + error.message);
    }
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
    });
    setUploadedImage(category.image || '');
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingCategory(null);
    setFormData({ name: '', slug: '', description: '' });
    setUploadedImage('');
  };

  // Автогенерация slug из названия
  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: name
        .toLowerCase()
        .replace(/[^a-zа-я0-9]+/g, '-')
        .replace(/^-+|-+$/g, ''),
    }));
  };

  return (
    <div className="p-6">
      {/* Шапка */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Категории</h1>
          <p className="text-gray-600 mt-2">Управление категориями товаров ({categories.length} шт.)</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Plus size={20} />
          Добавить категорию
        </button>
      </div>

      {/* Список категорий */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-600 text-lg">Категорий пока нет</p>
          <p className="text-gray-500 mt-2">Добавьте первую категорию</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 font-mono">
                    {category.slug}
                  </p>
                </div>
              </div>
              
              {category.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {category.description}
                </p>
              )}

              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => openEditModal(category)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Edit2 size={16} />
                  Изменить
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={16} />
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Модальное окно добавления/редактирования */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingCategory ? 'Редактировать категорию' : 'Новая категория'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Название *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Например: Светодиодные лампы"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug (автоматически)
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  placeholder="led-lamps"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Описание (опционально)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Краткое описание категории"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Изображение категории (опционально)
                </label>
                <div className="space-y-3">
                  <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
                    <Plus size={20} className="text-gray-600" />
                    <span className="text-sm text-gray-600">Выбрать изображение</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  {uploadedImage && (
                    <div className="relative w-full h-32 border border-gray-300 rounded-lg overflow-hidden">
                      <img
                        src={uploadedImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setUploadedImage('')}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-gray-500">
                    💡 Рекомендуемый размер: 400x400px
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  {editingCategory ? 'Сохранить' : 'Создать'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

