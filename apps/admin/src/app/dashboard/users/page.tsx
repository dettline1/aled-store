'use client';

import { useEffect, useState } from 'react';
import { Users, Mail, Calendar, ShieldCheck, User } from 'lucide-react';

interface Customer {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  createdAt?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/v1/users');
      const data = await response.json();
      setUsers(data.data || []);
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'bg-red-100 text-red-800';
      case 'MANAGER': return 'bg-blue-100 text-blue-800';
      case 'CUSTOMER': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'Администратор';
      case 'MANAGER': return 'Менеджер';
      case 'CUSTOMER': return 'Клиент';
      default: return role;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Users className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Клиенты</h1>
        </div>
        <p className="text-gray-600">Управление пользователями системы ({users.length} чел.)</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Всего пользователей</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">{users.length}</p>
            </div>
            <Users className="h-12 w-12 text-blue-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Клиенты</p>
              <p className="text-3xl font-bold text-green-900 mt-1">
                {users.filter(u => u.role === 'CUSTOMER').length}
              </p>
            </div>
            <User className="h-12 w-12 text-green-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Администраторы</p>
              <p className="text-3xl font-bold text-purple-900 mt-1">
                {users.filter(u => u.role === 'SUPER_ADMIN' || u.role === 'MANAGER').length}
              </p>
            </div>
            <ShieldCheck className="h-12 w-12 text-purple-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Users List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Пользователей пока нет</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Пользователь</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Роль</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Дата регистрации</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold">
                          {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.firstName && user.lastName 
                              ? `${user.firstName} ${user.lastName}` 
                              : user.email.split('@')[0]}
                          </p>
                          <p className="text-sm text-gray-500">ID: {user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Mail className="h-4 w-4 text-gray-400" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {getRoleText(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {user.createdAt 
                          ? new Date(user.createdAt).toLocaleDateString('ru-RU')
                          : 'Не указано'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
