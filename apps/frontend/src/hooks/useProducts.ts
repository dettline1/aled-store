import { useState, useEffect } from 'react';
import { Product, SearchParams, PaginationInfo } from '@/types';
import { getProducts, getProductBySlug, getFeaturedProducts, getNewProducts, searchProducts } from '@/lib/api';

export const useProducts = (params?: SearchParams) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { products: fetchedProducts, pagination: paginationInfo } = await getProducts(params);
        setProducts(fetchedProducts);
        setPagination(paginationInfo);
      } catch (err) {
        setError('Ошибка загрузки товаров');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [params?.q, params?.category, params?.brand, params?.min, params?.max, params?.sort, params?.page, params?.inStock, params?.isNew]);

  return { products, pagination, loading, error };
};

export const useProduct = (slug: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const fetchedProduct = await getProductBySlug(slug);
        setProduct(fetchedProduct);
        
        if (!fetchedProduct) {
          setError('Товар не найден');
        }
      } catch (err) {
        setError('Ошибка загрузки товара');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  return { product, loading, error };
};

export const useFeaturedProducts = (limit?: number) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const fetchedProducts = await getFeaturedProducts(limit);
        setProducts(fetchedProducts);
      } catch (err) {
        setError('Ошибка загрузки рекомендуемых товаров');
        console.error('Error fetching featured products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, [limit]);

  return { products, loading, error };
};

export const useNewProducts = (limit?: number) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const fetchedProducts = await getNewProducts(limit);
        setProducts(fetchedProducts);
      } catch (err) {
        setError('Ошибка загрузки новинок');
        console.error('Error fetching new products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewProducts();
  }, [limit]);

  return { products, loading, error };
};

export const useProductSearch = () => {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (query: string, limit?: number) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const searchResults = await searchProducts(query, limit);
      setResults(searchResults);
    } catch (err) {
      setError('Ошибка поиска');
      console.error('Error searching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
    setError(null);
  };

  return { results, loading, error, search, clearResults };
};
