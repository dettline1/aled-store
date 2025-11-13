import { ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const defaultIcon = (
    <svg className="w-16 h-16 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
  );

  return (
    <div className={cn('text-center py-12', className)}>
      <div className="max-w-md mx-auto">
        <div className="mb-4">
          {icon || defaultIcon}
        </div>
        <h3 className="text-lg font-medium text-secondary-900 mb-2">
          {title}
        </h3>
        <p className="text-secondary-500 mb-6">
          {description}
        </p>
        {action && (
          <>
            {action.href ? (
              <Button asChild>
                <a href={action.href}>{action.label}</a>
              </Button>
            ) : (
              <Button onClick={action.onClick}>
                {action.label}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Готовые варианты пустых состояний
export function EmptyCart() {
  return (
    <EmptyState
      icon={
        <svg className="w-16 h-16 text-secondary-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15.5M9 19.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM20 19.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
        </svg>
      }
      title="Корзина пуста"
      description="Добавьте товары в корзину, чтобы оформить заказ"
      action={{
        label: 'Перейти в каталог',
        href: '/catalog',
      }}
    />
  );
}

export function EmptySearch({ query }: { query: string }) {
  return (
    <EmptyState
      icon={
        <svg className="w-16 h-16 text-secondary-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      }
      title="Ничего не найдено"
      description={`По запросу "${query}" товары не найдены. Попробуйте изменить поисковый запрос.`}
      action={{
        label: 'Смотреть все товары',
        href: '/catalog',
      }}
    />
  );
}

export function EmptyCategory({ categoryName }: { categoryName: string }) {
  return (
    <EmptyState
      icon={
        <svg className="w-16 h-16 text-secondary-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      }
      title="Товары скоро появятся"
      description={`В категории "${categoryName}" пока нет товаров. Следите за обновлениями.`}
      action={{
        label: 'Смотреть все категории',
        href: '/catalog',
      }}
    />
  );
}
