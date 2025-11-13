'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Link as LinkIcon, Save } from 'lucide-react';

export default function NewBannerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    link: '',
    buttonText: 'Смотреть каталог',
    isActive: true,
    order: 1
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:4000/api/v1/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        router.push('/dashboard/banners');
      } else {
        alert('Ошибка создания баннера');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка создания баннера');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Создать баннер</h1>
        <p className="text-gray-600 mt-2">
          Новый баннер для главной страницы
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-lg p-8">
        {/* Заголовок */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Заголовок *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Новинка! Би-LED линзы"
          />
        </div>

        {/* Подзаголовок */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Подзаголовок
          </label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Яркий свет для вашего автомобиля"
          />
        </div>

        {/* Изображение */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Изображение баннера
          </label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors">
              <Upload className="h-4 w-4" />
              Выбрать файл
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            {formData.image && (
              <div className="relative w-32 h-32 border-2 border-gray-300 rounded-lg overflow-hidden">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Рекомендуемый размер: 1920x600px
          </p>
        </div>

        {/* Ссылка */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <LinkIcon className="h-4 w-4 inline mr-1" />
            Ссылка
          </label>
          <input
            type="text"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="/catalog/bi-led-lenses"
          />
        </div>

        {/* Текст кнопки */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Текст кнопки
          </label>
          <input
            type="text"
            value={formData.buttonText}
            onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Смотреть каталог"
          />
        </div>

        {/* Порядок отображения */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Порядок отображения
          </label>
          <input
            type="number"
            min="1"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">
            Чем меньше число, тем раньше баннер появится в карусели
          </p>
        </div>

        {/* Активен */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
            Показывать на сайте
          </label>
        </div>

        {/* Кнопки */}
        <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
          >
            <Save className="h-5 w-5" />
            {loading ? 'Создание...' : 'Создать баннер'}
          </button>
          
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}

