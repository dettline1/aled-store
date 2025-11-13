'use client';

import { FileText, PenTool, Calendar, Eye } from 'lucide-react';

export default function PostsPage() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="h-8 w-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">Блог</h1>
        </div>
        <p className="text-gray-600">Управление статьями и новостями</p>
      </div>

      {/* Info Block */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-6">
            <PenTool className="h-24 w-24 text-gray-300 mx-auto" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Раздел блога в разработке
          </h2>
          
          <p className="text-gray-600 mb-8 text-lg">
            Система управления контентом для публикации статей, новостей и SEO-материалов
            будет доступна в следующих версиях проекта.
          </p>

          {/* Planned Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
              <div className="h-12 w-12 bg-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <PenTool className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-indigo-900 mb-2">Редактор статей</h3>
              <p className="text-sm text-indigo-700">
                WYSIWYG редактор с поддержкой Markdown, изображений и форматирования
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <div className="h-12 w-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-green-900 mb-2">Планирование</h3>
              <p className="text-sm text-green-700">
                Отложенная публикация, черновики и автосохранение
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
              <div className="h-12 w-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-purple-900 mb-2">SEO оптимизация</h3>
              <p className="text-sm text-purple-700">
                Мета-теги, Open Graph, структурированные данные
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 text-left rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-3">📝 Что будет включено:</h3>
            <ul className="text-sm text-yellow-800 space-y-2 grid md:grid-cols-2 gap-x-6">
              <li>• Категории и теги статей</li>
              <li>• Поиск и фильтрация</li>
              <li>• Комментарии к статьям</li>
              <li>• Статистика просмотров</li>
              <li>• Связь товаров со статьями</li>
              <li>• Мультиязычность</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
