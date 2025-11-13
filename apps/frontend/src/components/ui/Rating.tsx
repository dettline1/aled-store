import { cn } from '@/lib/utils';

interface RatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

export function Rating({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = false,
  className,
}: RatingProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const stars = Array.from({ length: maxRating }, (_, index) => {
    const isFilled = index < Math.floor(rating);
    const isHalfFilled = index === Math.floor(rating) && rating % 1 !== 0;
    
    return (
      <div key={index} className="relative">
        <svg
          className={cn(sizes[size], 'text-secondary-300')}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        
        {(isFilled || isHalfFilled) && (
          <svg
            className={cn(
              sizes[size],
              'absolute top-0 left-0 text-yellow-400',
              isHalfFilled && 'overflow-hidden'
            )}
            style={isHalfFilled ? { width: '50%' } : undefined}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
      </div>
    );
  });

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex">{stars}</div>
      {showValue && (
        <span className="text-sm text-secondary-600 ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
