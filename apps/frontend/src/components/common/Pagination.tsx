'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PaginationInfo } from '@/types';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface PaginationProps {
  pagination: PaginationInfo;
  className?: string;
}

export function Pagination({ pagination, className }: PaginationProps) {
  const searchParams = useSearchParams();
  const { page, totalPages } = pagination;

  if (totalPages <= 1) return null;

  const createPageUrl = (pageNum: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (pageNum === 1) {
      params.delete('page');
    } else {
      params.set('page', pageNum.toString());
    }
    return `?${params.toString()}`;
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    // Определяем диапазон страниц для отображения
    for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
      range.push(i);
    }

    // Добавляем первую страницу
    if (page - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    // Добавляем основной диапазон
    rangeWithDots.push(...range);

    // Добавляем последнюю страницу
    if (page + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav className={cn('flex items-center justify-center space-x-2', className)} aria-label="Pagination">
      {/* Previous button */}
{page > 1 ? (
        <Button variant="outline" size="sm" asChild>
          <Link href={createPageUrl(page - 1)} aria-label="Предыдущая страница">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Назад
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Назад
        </Button>
      )}

      {/* Page numbers */}
      <div className="flex items-center space-x-1">
        {visiblePages.map((pageNum, index) => {
          if (pageNum === '...') {
            return (
              <span key={`dots-${index}`} className="px-3 py-2 text-secondary-500">
                ...
              </span>
            );
          }

          const isCurrentPage = pageNum === page;
          
          if (isCurrentPage) {
            return (
              <Button
                key={pageNum}
                variant="primary"
                size="sm"
                disabled
                className={cn('min-w-[40px] pointer-events-none')}
              >
                {pageNum}
              </Button>
            );
          }

          return (
            <Button
              key={pageNum}
              variant="outline"
              size="sm"
              className="min-w-[40px]"
              asChild
            >
              <Link href={createPageUrl(pageNum as number)} aria-label={`Страница ${pageNum}`}>
                {pageNum}
              </Link>
            </Button>
          );
        })}
      </div>

      {/* Next button */}
      {page < totalPages ? (
        <Button variant="outline" size="sm" asChild>
          <Link href={createPageUrl(page + 1)} aria-label="Следующая страница">
            Вперед
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>
          Вперед
          <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      )}

      {/* Page info */}
      <div className="hidden sm:flex items-center ml-4">
        <span className="text-sm text-secondary-600">
          Страница {page} из {totalPages}
        </span>
      </div>
    </nav>
  );
}

// Простая пагинация для мобильных устройств
export function SimplePagination({ pagination, className }: PaginationProps) {
  const searchParams = useSearchParams();
  const { page, totalPages } = pagination;

  if (totalPages <= 1) return null;

  const createPageUrl = (pageNum: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (pageNum === 1) {
      params.delete('page');
    } else {
      params.set('page', pageNum.toString());
    }
    return `?${params.toString()}`;
  };

  return (
    <nav className={cn('flex items-center justify-between', className)} aria-label="Pagination">
      {page > 1 ? (
        <Button variant="outline" asChild>
          <Link href={createPageUrl(page - 1)}>
            ← Предыдущая
          </Link>
        </Button>
      ) : (
        <Button variant="outline" disabled>
          ← Предыдущая
        </Button>
      )}

      <span className="text-sm text-secondary-600">
        {page} / {totalPages}
      </span>

      {page < totalPages ? (
        <Button variant="outline" asChild>
          <Link href={createPageUrl(page + 1)}>
            Следующая →
          </Link>
        </Button>
      ) : (
        <Button variant="outline" disabled>
          Следующая →
        </Button>
      )}
    </nav>
  );
}
