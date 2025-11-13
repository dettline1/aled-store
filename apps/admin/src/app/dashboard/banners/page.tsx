'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Edit, Trash2, Plus, Eye, EyeOff } from 'lucide-react';

interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  link?: string;
  buttonText?: string;
  isActive: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/v1/banners/all');
      const data = await response.json();
      setBanners(data.data || []);
    } catch (error) {
      console.error('Ошибка загрузки баннеров:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await fetch(`http://localhost:4000/api/v1/banners/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      fetchBanners();
    } catch (error) {
      console.error('Ошибка обновления статуса:', error);
    }
  };

  const deleteBanner = async (id: string) => {
    if (!confirm('Удалить этот баннер?')) return;
    
    try {
      await fetch(`http://localhost:4000/api/v1/banners/${id}`, {
        method: 'DELETE'
      });
      fetchBanners();
    } catch (error) {
      console.error('Ошибка удаления баннера:', error);
    }
  };

  if (loading) {
    return <div className="p-6">Загрузка...</div>;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Баннеры</h1>
          <p className="text-gray-600 mt-2">
            Управление баннерами на главной странице
          </p>
        </div>
        <Link
          href="/dashboard/banners/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="h-5 w-5" />
          Добавить баннер
        </Link>
      </div>

      {/* Banners List */}
      {banners.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-4">Баннеры не найдены</p>
          <Link
            href="/dashboard/banners/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Создать первый баннер
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden border-2 transition-all ${
                banner.isActive ? 'border-green-500' : 'border-gray-200'
              }`}
            >
              {/* Banner Preview */}
              <div className="h-48 bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center relative">
                {banner.image ? (
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-6xl">🎨</span>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  {banner.isActive ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                      <Eye className="h-3 w-3" />
                      Активен
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-500 text-white text-xs font-medium rounded-full">
                      <EyeOff className="h-3 w-3" />
                      Скрыт
                    </span>
                  )}
                </div>
                
                {/* Order Number */}
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 bg-white/90 text-gray-900 text-xs font-bold rounded-full">
                    #{banner.order}
                  </span>
                </div>
              </div>

              {/* Banner Info */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
                  {banner.title}
                </h3>
                {banner.subtitle && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {banner.subtitle}
                  </p>
                )}
                
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  {banner.buttonText && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      {banner.buttonText}
                    </span>
                  )}
                  {banner.link && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded truncate max-w-[150px]">
                      {banner.link}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(banner.id, banner.isActive)}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      banner.isActive
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {banner.isActive ? (
                      <>
                        <EyeOff className="h-4 w-4 inline mr-1" />
                        Скрыть
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 inline mr-1" />
                        Показать
                      </>
                    )}
                  </button>
                  
                  <Link
                    href={`/dashboard/banners/${banner.id}/edit`}
                    className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  
                  <button
                    onClick={() => deleteBanner(banner.id)}
                    className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

