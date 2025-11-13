'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Pagination } from '@/components/common/Pagination';
import { Loader } from '@/components/common/Loader';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useProducts } from '@/hooks/useProducts';
import { SORT_OPTIONS } from '@/lib/filters';
import { parseSearchParams, updateSearchParams, getActiveFiltersCount } from '@/lib/filters';
import { getCategories, getBrands, getFilterOptions } from '@/lib/api';
import { Category, Brand } from '@/types';

export default function CatalogPage() {
  const searchParams = useSearchParams();
  const currentParams = parseSearchParams(searchParams);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 10000 });
  const [localFilters, setLocalFilters] = useState({
    min: currentParams.min || '',
    max: currentParams.max || '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const { products, pagination, loading, error } = useProducts(currentParams);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, brandsData, filterOptions] = await Promise.all([
          getCategories(),
          getBrands(),
          getFilterOptions(),
        ]);
        
        setCategories(categoriesData);
        setBrands(brandsData);
        setPriceRange(filterOptions.priceRange);
      } catch (err) {
        console.error('Error fetching filter data:', err);
      }
    };

    fetchData();
  }, []);

  const updateUrl = (updates: any) => {
    const newParams = updateSearchParams(currentParams, updates);
    const url = new URL(window.location.href);
    
    Object.keys(newParams).forEach(key => {
      if (newParams[key as keyof typeof newParams]) {
        url.searchParams.set(key, newParams[key as keyof typeof newParams] as string);
      } else {
        url.searchParams.delete(key);
      }
    });

    window.history.pushState({}, '', url.toString());
  };

  const handleSortChange = (sort: string) => {
    updateUrl({ sort: sort === 'default' ? undefined : sort });
  };

  const handleFilterChange = (key: string, value: string | undefined) => {
    updateUrl({ [key]: value });
  };

  const handlePriceFilter = () => {
    updateUrl({
      min: localFilters.min || undefined,
      max: localFilters.max || undefined,
    });
  };

  const clearAllFilters = () => {
    setLocalFilters({ min: '', max: '' });
    updateUrl({
      q: undefined,
      category: undefined,
      brand: undefined,
      min: undefined,
      max: undefined,
      inStock: undefined,
      isNew: undefined,
    });
  };

  const activeFiltersCount = getActiveFiltersCount(currentParams);

  const breadcrumbs = [
    { label: 'Главная', href: '/' },
    { label: 'Каталог', href: '/catalog' },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 mb-2">
              Каталог товаров
            </h1>
            {pagination && (
              <p className="text-secondary-600">
                Найдено {pagination.total} товаров
              </p>
            )}
          </div>

          {/* Mobile filter toggle */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden"
          >
            Фильтры {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </Button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white border border-secondary-200 rounded-lg p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-secondary-900">
                  Фильтры
                </h2>
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                  >
                    Очистить
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                {/* Search */}
                {currentParams.q && (
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Поиск
                    </label>
                    <div className="flex items-center gap-2">
                      <Badge variant="info" className="flex-1">
                        {currentParams.q}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFilterChange('q', undefined)}
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                )}

                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Категория
                  </label>
                  <Select
                    options={[
                      { value: '', label: 'Все категории' },
                      ...categories.map(cat => ({ value: cat.slug, label: cat.name }))
                    ]}
                    value={currentParams.category || ''}
                    onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
                  />
                </div>

                {/* Brands */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Бренд
                  </label>
                  <Select
                    options={[
                      { value: '', label: 'Все бренды' },
                      ...brands.map(brand => ({ value: brand.slug, label: brand.name }))
                    ]}
                    value={currentParams.brand || ''}
                    onChange={(e) => handleFilterChange('brand', e.target.value || undefined)}
                  />
                </div>

                {/* Price range */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Цена (₽)
                  </label>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="От"
                        value={localFilters.min}
                        onChange={(e) => setLocalFilters(prev => ({ ...prev, min: e.target.value }))}
                        min={priceRange.min}
                        max={priceRange.max}
                      />
                      <Input
                        type="number"
                        placeholder="До"
                        value={localFilters.max}
                        onChange={(e) => setLocalFilters(prev => ({ ...prev, max: e.target.value }))}
                        min={priceRange.min}
                        max={priceRange.max}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePriceFilter}
                      className="w-full"
                    >
                      Применить
                    </Button>
                  </div>
                </div>

                {/* Stock filter */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={currentParams.inStock === 'true'}
                      onChange={(e) => handleFilterChange('inStock', e.target.checked ? 'true' : undefined)}
                      className="mr-2"
                    />
                    <span className="text-sm text-secondary-700">Только в наличии</span>
                  </label>
                </div>

                {/* New items filter */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={currentParams.isNew === 'true'}
                      onChange={(e) => handleFilterChange('isNew', e.target.checked ? 'true' : undefined)}
                      className="mr-2"
                    />
                    <span className="text-sm text-secondary-700">Только новинки</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="lg:col-span-3">
            {/* Sort and view options */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Select
                  options={SORT_OPTIONS}
                  value={currentParams.sort || 'default'}
                  onChange={(e) => handleSortChange(e.target.value)}
                />
              </div>

              {pagination && (
                <div className="text-sm text-secondary-600">
                  Страница {pagination.page} из {pagination.totalPages}
                </div>
              )}
            </div>

            {/* Active filters */}
            {activeFiltersCount > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-secondary-600">Активные фильтры:</span>
                  
                  {currentParams.category && (
                    <Badge variant="info" className="flex items-center gap-1">
                      Категория: {categories.find(c => c.slug === currentParams.category)?.name}
                      <button
                        onClick={() => handleFilterChange('category', undefined)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  
                  {currentParams.brand && (
                    <Badge variant="info" className="flex items-center gap-1">
                      Бренд: {brands.find(b => b.slug === currentParams.brand)?.name}
                      <button
                        onClick={() => handleFilterChange('brand', undefined)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  
                  {(currentParams.min || currentParams.max) && (
                    <Badge variant="info" className="flex items-center gap-1">
                      Цена: {currentParams.min || '0'} - {currentParams.max || '∞'} ₽
                      <button
                        onClick={() => {
                          setLocalFilters({ min: '', max: '' });
                          handleFilterChange('min', undefined);
                          handleFilterChange('max', undefined);
                        }}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                  >
                    Очистить все
                  </Button>
                </div>
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <div className="py-12">
                <Loader size="lg" text="Загрузка товаров..." />
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="py-12">
                <ErrorMessage message={error} />
              </div>
            )}

            {/* Products grid */}
            {!loading && !error && (
              <>
                <ProductGrid products={products} />
                
                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="mt-12">
                    <Pagination pagination={pagination} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
