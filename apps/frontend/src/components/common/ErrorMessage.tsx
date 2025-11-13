import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorMessage({
  title = 'Произошла ошибка',
  message,
  onRetry,
  className,
}: ErrorMessageProps) {
  return (
    <div className={cn('text-center py-8', className)}>
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-secondary-900 mb-2">
          {title}
        </h3>
        <p className="text-secondary-600 mb-6">
          {message}
        </p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            Попробовать снова
          </Button>
        )}
      </div>
    </div>
  );
}

export function NotFoundError({ 
  title = 'Страница не найдена',
  message = 'Запрашиваемая страница не существует или была перемещена.',
  showHomeButton = true,
}: {
  title?: string;
  message?: string;
  showHomeButton?: boolean;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-9xl font-bold text-primary-600 mb-4">404</div>
        <h1 className="text-3xl font-bold text-secondary-900 mb-4">{title}</h1>
        <p className="text-lg text-secondary-600 mb-8 max-w-md">{message}</p>
        {showHomeButton && (
          <Button asChild>
            <a href="/">Вернуться на главную</a>
          </Button>
        )}
      </div>
    </div>
  );
}
