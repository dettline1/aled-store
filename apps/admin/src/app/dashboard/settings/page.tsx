'use client';

import { useEffect, useState } from 'react';
import { Settings as SettingsIcon, Store, DollarSign, Mail, Globe, Save } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/v1/settings/public');
      const data = await response.json();
      setSettings(data.data || {});
    } catch (error) {
      console.error('Ошибка загрузки настроек:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    // Имитация сохранения
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('✅ Настройки сохранены!');
    setSaving(false);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <SettingsIcon className="h-8 w-8 text-gray-600" />
          <h1 className="text-3xl font-bold text-gray-900">Настройки</h1>
        </div>
        <p className="text-gray-600">Конфигурация магазина и системы</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      ) : (
        <div className="max-w-4xl space-y-6">
          {/* Store Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Store className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Настройки магазина</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Название магазина
                </label>
                <input
                  type="text"
                  value={settings['store.name'] || 'ALed Store'}
                  onChange={(e) => setSettings({...settings, 'store.name': e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ALed Store"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Описание
                </label>
                <textarea
                  value={settings['store.description'] || 'Интернет-магазин светодиодной продукции'}
                  onChange={(e) => setSettings({...settings, 'store.description': e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Описание магазина"
                />
              </div>
            </div>
          </div>

          {/* Currency Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-bold text-gray-900">Валюта</h2>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Основная валюта
              </label>
              <select
                value={settings['store.currency'] || 'RUB'}
                onChange={(e) => setSettings({...settings, 'store.currency': e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="RUB">₽ Российский рубль (RUB)</option>
                <option value="USD">$ Доллар США (USD)</option>
                <option value="EUR">€ Евро (EUR)</option>
                <option value="KZT">₸ Тенге (KZT)</option>
              </select>
            </div>
          </div>

          {/* Contact Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Mail className="h-6 w-6 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-900">Контакты</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email для уведомлений
                </label>
                <input
                  type="email"
                  value={settings['store.email'] || 'info@aled.local'}
                  onChange={(e) => setSettings({...settings, 'store.email': e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="info@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Телефон
                </label>
                <input
                  type="tel"
                  value={settings['store.phone'] || '+7 (000) 000-00-00'}
                  onChange={(e) => setSettings({...settings, 'store.phone': e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+7 (000) 000-00-00"
                />
              </div>
            </div>
          </div>

          {/* Info Block */}
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg">
            <div className="flex items-start gap-3">
              <Globe className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-blue-900 mb-2">
                  <strong>Примечание:</strong>
                </p>
                <p className="text-sm text-blue-800">
                  В текущей демо-версии изменения сохраняются только в памяти и сбрасываются при перезапуске сервера.
                  В production версии настройки будут сохраняться в базу данных.
                </p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-5 w-5" />
              {saving ? 'Сохранение...' : 'Сохранить настройки'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
