'use client';

import { Image, Upload, Folder, HardDrive } from 'lucide-react';

export default function MediaPage() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Image className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Медиатека</h1>
        </div>
        <p className="text-gray-600">Управление изображениями и файлами</p>
      </div>

      {/* Info Block */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-6">
            <Folder className="h-24 w-24 text-gray-300 mx-auto" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Медиатека в разработке
          </h2>
          
          <p className="text-gray-600 mb-8 text-lg">
            Сейчас изображения загружаются напрямую при создании товара в формате Base64.
            Централизованное управление медиафайлами будет доступно в будущих версиях.
          </p>

          {/* Current Features */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-green-50 border-l-4 border-green-600 p-6 text-left rounded-lg">
              <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Уже доступно:
              </h3>
              <ul className="text-sm text-green-800 space-y-2">
                <li>✓ Загрузка изображений при создании товара</li>
                <li>✓ Drag & Drop загрузка</li>
                <li>✓ Поддержка Base64</li>
                <li>✓ Предпросмотр изображений</li>
              </ul>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 text-left rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                Планируется:
              </h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• Централизованное хранилище (MinIO/S3)</li>
                <li>• Галерея всех загруженных файлов</li>
                <li>• Поиск и фильтрация медиафайлов</li>
                <li>• Массовая загрузка и управление</li>
              </ul>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
            <h3 className="font-semibold text-purple-900 mb-3">💡 Совет</h3>
            <p className="text-sm text-purple-800">
              Для загрузки изображений перейдите в раздел{' '}
              <a href="/dashboard/products/new" className="underline font-medium">
                "Создать товар"
              </a>
              {' '}и используйте форму загрузки изображений там.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
