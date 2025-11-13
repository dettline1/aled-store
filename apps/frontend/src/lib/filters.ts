import { Product, SearchParams, SortOption } from '@/types';

export const SORT_OPTIONS: SortOption[] = [
  { value: 'default', label: 'По умолчанию' },
  { value: 'price-asc', label: 'Цена: по возрастанию' },
  { value: 'price-desc', label: 'Цена: по убыванию' },
  { value: 'name-asc', label: 'Название: А-Я' },
  { value: 'name-desc', label: 'Название: Я-А' },
  { value: 'rating', label: 'По рейтингу' },
  { value: 'newest', label: 'Новинки' },
];

export function createSearchParams(params: SearchParams): URLSearchParams {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, value.toString());
    }
  });
  
  return searchParams;
}

export function parseSearchParams(searchParams: URLSearchParams): SearchParams {
  const params: SearchParams = {};
  
  for (const [key, value] of searchParams.entries()) {
    if (value) {
      params[key as keyof SearchParams] = value;
    }
  }
  
  return params;
}

export function updateSearchParams(
  current: SearchParams,
  updates: Partial<SearchParams>
): SearchParams {
  const newParams = { ...current };
  
  Object.entries(updates).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      delete newParams[key as keyof SearchParams];
    } else {
      newParams[key as keyof SearchParams] = value;
    }
  });
  
  // Сбрасываем страницу при изменении фильтров
  if (Object.keys(updates).some(key => key !== 'page')) {
    delete newParams.page;
  }
  
  return newParams;
}

export function getPriceRange(products: Product[]): { min: number; max: number } {
  if (products.length === 0) {
    return { min: 0, max: 10000 };
  }
  
  const prices = products.map(product => product.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}

export function getUniqueValues<T>(
  array: T[],
  key: keyof T
): { value: string; count: number }[] {
  const counts = array.reduce((acc, item) => {
    const value = String(item[key]);
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(counts)
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count);
}

export function formatFilterCount(count: number): string {
  return count > 0 ? ` (${count})` : '';
}

export function getActiveFiltersCount(params: SearchParams): number {
  let count = 0;
  
  if (params.q) count++;
  if (params.category) count++;
  if (params.brand) count++;
  if (params.min) count++;
  if (params.max) count++;
  if (params.inStock === 'true') count++;
  if (params.isNew === 'true') count++;
  
  return count;
}

export function clearAllFilters(params: SearchParams): SearchParams {
  return {
    sort: params.sort,
    page: params.page,
  };
}

export function hasActiveFilters(params: SearchParams): boolean {
  return getActiveFiltersCount(params) > 0;
}

export function buildBreadcrumbs(
  pathname: string,
  searchParams?: SearchParams
): Array<{ label: string; href: string }> {
  const breadcrumbs = [{ label: 'Главная', href: '/' }];
  
  const segments = pathname.split('/').filter(Boolean);
  
  segments.forEach((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    
    switch (segment) {
      case 'catalog':
        breadcrumbs.push({ label: 'Каталог', href });
        break;
      case 'product':
        breadcrumbs.push({ label: 'Товар', href });
        break;
      case 'cart':
        breadcrumbs.push({ label: 'Корзина', href });
        break;
      case 'checkout':
        breadcrumbs.push({ label: 'Оформление заказа', href });
        break;
      case 'blog':
        breadcrumbs.push({ label: 'Блог', href });
        break;
      case 'about':
        breadcrumbs.push({ label: 'О компании', href });
        break;
      case 'contact':
        breadcrumbs.push({ label: 'Контакты', href });
        break;
      default:
        // Для динамических сегментов (slug'ов)
        const formattedLabel = segment
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        breadcrumbs.push({ label: formattedLabel, href });
    }
  });
  
  return breadcrumbs;
}
