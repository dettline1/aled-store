'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProductSearch } from '@/hooks/useProducts';
import { debounce } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface SearchFormProps {
  className?: string;
  onSearch?: () => void;
}

export function SearchForm({ className, onSearch }: SearchFormProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { results, search, clearResults } = useProductSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search
  const debouncedSearch = debounce((searchQuery: string) => {
    if (searchQuery.trim()) {
      search(searchQuery, 5);
      setIsOpen(true);
    } else {
      clearResults();
      setIsOpen(false);
    }
  }, 300);

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/catalog?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      onSearch?.();
    }
  };

  const handleSelectProduct = (productSlug: string) => {
    setIsOpen(false);
    setQuery('');
    clearResults();
    router.push(`/product/${productSlug}`);
    onSearch?.();
  };

  const handleViewAllResults = () => {
    if (query.trim()) {
      router.push(`/catalog?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      onSearch?.();
    }
  };

  return (
    <div className={cn('relative', className)}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Поиск товаров..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          className="w-full px-4 py-2 pl-10 pr-12 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
        />
        
        {/* Search icon */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <svg className="w-5 h-5 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Clear button */}
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              clearResults();
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary-100 rounded transition-colors"
            aria-label="Очистить поиск"
          >
            <svg className="w-4 h-4 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </form>

      {/* Search results dropdown */}
      {isOpen && (results.length > 0 || query.trim()) && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-secondary-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
        >
          {results.length > 0 ? (
            <>
              <div className="py-2">
                {results.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleSelectProduct(product.slug)}
                    className="w-full px-4 py-2 text-left hover:bg-secondary-50 transition-colors flex items-center gap-3"
                  >
                    <svg className="w-4 h-4 text-secondary-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-secondary-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-sm text-secondary-500 capitalize">
                        {product.brand}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-secondary-900">
                        {product.price.toLocaleString('ru-RU')}₽
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              
              {query.trim() && (
                <div className="border-t border-secondary-200">
                  <button
                    onClick={handleViewAllResults}
                    className="w-full px-4 py-3 text-left text-primary-600 hover:bg-primary-50 transition-colors font-medium"
                  >
                    Показать все результаты для "{query}"
                  </button>
                </div>
              )}
            </>
          ) : query.trim() ? (
            <div className="px-4 py-8 text-center">
              <svg className="w-12 h-12 mx-auto text-secondary-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-secondary-500 mb-3">
                Ничего не найдено по запросу "{query}"
              </p>
              <Link
                href="/catalog"
                onClick={() => {
                  setIsOpen(false);
                  onSearch?.();
                }}
                className="text-primary-600 hover:text-primary-700 transition-colors font-medium"
              >
                Посмотреть весь каталог
              </Link>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
