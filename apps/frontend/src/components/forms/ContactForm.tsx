'use client';

import { useState } from 'react';
import { ContactForm as ContactFormType } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { isValidEmail, isValidPhone } from '@/lib/utils';

interface ContactFormProps {
  className?: string;
}

export function ContactForm({ className }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormType>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  
  const [errors, setErrors] = useState<Partial<ContactFormType>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormType> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Имя обязательно для заполнения';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен для заполнения';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Некорректный email адрес';
    }

    if (formData.phone && !isValidPhone(formData.phone)) {
      newErrors.phone = 'Некорректный номер телефона';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Сообщение обязательно для заполнения';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Сообщение должно содержать минимум 10 символов';
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
      // Имитация отправки формы
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Form submitted:', formData);
      setIsSubmitted(true);
      
      // Очистка формы
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      });
      setErrors({});
      
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ContactFormType, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Очистка ошибки при изменении поля
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (isSubmitted) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">
            Сообщение отправлено!
          </h3>
          <p className="text-secondary-600 mb-6">
            Мы получили ваше сообщение и свяжемся с вами в ближайшее время.
          </p>
          <Button
            onClick={() => setIsSubmitted(false)}
            variant="outline"
          >
            Отправить еще одно сообщение
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Имя *"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={errors.name}
            placeholder="Ваше имя"
          />
          
          <Input
            label="Email *"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={errors.email}
            placeholder="your@email.com"
          />
        </div>

        <Input
          label="Телефон"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          error={errors.phone}
          placeholder="+7 (999) 123-45-67"
          helperText="Необязательное поле"
        />

        <Textarea
          label="Сообщение *"
          value={formData.message}
          onChange={(e) => handleInputChange('message', e.target.value)}
          error={errors.message}
          placeholder="Расскажите, чем мы можем помочь..."
          rows={5}
        />

        <Button
          type="submit"
          loading={isSubmitting}
          disabled={isSubmitting}
          className="w-full md:w-auto"
        >
          Отправить сообщение
        </Button>
      </div>
    </form>
  );
}
