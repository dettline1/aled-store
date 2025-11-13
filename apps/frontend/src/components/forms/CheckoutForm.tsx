'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckoutForm as CheckoutFormType } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { useCart } from '@/hooks/useCart';
import { isValidEmail, isValidPhone } from '@/lib/utils';

interface CheckoutFormProps {
  className?: string;
}

export function CheckoutForm({ className }: CheckoutFormProps) {
  const router = useRouter();
  const { clearCart, total } = useCart();
  
  const [formData, setFormData] = useState<CheckoutFormType>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    city: '',
    address: '',
    postalCode: '',
    deliveryMethod: 'courier',
    paymentMethod: 'card',
    comments: '',
  });
  
  const [errors, setErrors] = useState<Partial<CheckoutFormType>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deliveryOptions = [
    { value: 'pickup', label: 'Самовывоз из магазина (бесплатно)' },
    { value: 'courier', label: 'Курьерская доставка (300₽)' },
    { value: 'post', label: 'Почта России (от 200₽)' },
  ];

  const paymentOptions = [
    { value: 'card', label: 'Банковская карта' },
    { value: 'cash', label: 'Наличными при получении' },
    { value: 'transfer', label: 'Банковский перевод' },
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutFormType> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Некорректный email';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Имя обязательно';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Телефон обязателен';
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = 'Некорректный номер телефона';
    }

    if (formData.deliveryMethod !== 'pickup') {
      if (!formData.city.trim()) {
        newErrors.city = 'Город обязателен';
      }

      if (!formData.address.trim()) {
        newErrors.address = 'Адрес обязателен';
      }

      if (!formData.postalCode.trim()) {
        newErrors.postalCode = 'Почтовый индекс обязателен';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Имитация отправки заказа
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Order submitted:', { formData, total });
      
      // Очистка корзины
      clearCart();
      
      // Перенаправление на страницу успеха
      router.push('/order-success');
      
    } catch (error) {
      console.error('Error submitting order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof CheckoutFormType, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Очистка ошибки при изменении поля
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="space-y-8">
        {/* Contact information */}
        <div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            Контактная информация
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Имя *"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                error={errors.firstName}
                placeholder="Иван"
              />
              
              <Input
                label="Телефон *"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                error={errors.phone}
                placeholder="+7 (999) 123-45-67"
              />
            </div>
            
            <Input
              label="Email *"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={errors.email}
              placeholder="your@email.com"
              helperText="Чек будет отправлен на эту почту"
            />
          </div>
        </div>

        {/* Delivery method */}
        <div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            Способ доставки
          </h3>
          <Select
            options={deliveryOptions}
            value={formData.deliveryMethod}
            onChange={(e) => handleInputChange('deliveryMethod', e.target.value)}
          />
        </div>

        {/* Delivery address */}
        {formData.deliveryMethod !== 'pickup' && (
          <div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Адрес доставки
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Input
                    label="Город *"
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    error={errors.city}
                    placeholder="Москва"
                  />
                </div>
                
                <Input
                  label="Почтовый индекс *"
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  error={errors.postalCode}
                  placeholder="123456"
                />
              </div>
              
              <Input
                label="Адрес *"
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                error={errors.address}
                placeholder="ул. Примерная, д. 123, кв. 45"
              />
            </div>
          </div>
        )}

        {/* Payment method */}
        <div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            Способ оплаты
          </h3>
          <Select
            options={paymentOptions}
            value={formData.paymentMethod}
            onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
          />
        </div>

        {/* Comments */}
        <div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            Комментарий к заказу
          </h3>
          <Textarea
            placeholder="Дополнительная информация о заказе..."
            value={formData.comments}
            onChange={(e) => handleInputChange('comments', e.target.value)}
            rows={3}
          />
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          size="lg"
          loading={isSubmitting}
          disabled={isSubmitting}
          className="w-full"
        >
          Оформить заказ
        </Button>
      </div>
    </form>
  );
}
