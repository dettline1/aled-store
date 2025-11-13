import { Product, Category, Brand, BlogPost, SearchParams, PaginationInfo } from '@/types';
// Импортируем локальные данные как fallback
import { products as fallbackProducts, categories as fallbackCategories, brands as fallbackBrands, blogPosts as fallbackBlogPosts } from './data';

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

// Флаг использования API (можно отключить для разработки без API)
const USE_API = process.env.NEXT_PUBLIC_USE_API !== 'false';

// Константы
const PRODUCTS_PER_PAGE = 12;
const BLOG_PER_PAGE = 6;

// ==================== HTTP CLIENT ====================

async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error(`API Request failed: ${endpoint}`, error);
    throw error;
  }
}

// ==================== УТИЛИТЫ ДЛЯ ЛОКАЛЬНЫХ ДАННЫХ ====================

function filterProducts(products: Product[], params: SearchParams): Product[] {
  let filtered = [...products];

  // Поиск
  if (params.q) {
    const query = params.q.toLowerCase();
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  }

  // Фильтр по категории
  if (params.category) {
    filtered = filtered.filter(product => product.category === params.category);
  }

  // Фильтр по бренду
  if (params.brand) {
    filtered = filtered.filter(product => product.brand === params.brand);
  }

  // Фильтр по цене
  if (params.min) {
    filtered = filtered.filter(product => product.price >= parseInt(params.min || '0'));
  }
  if (params.max) {
    filtered = filtered.filter(product => product.price <= parseInt(params.max || '999999'));
  }

  // Фильтр по наличию
  if (params.inStock === 'true') {
    filtered = filtered.filter(product => product.inStock);
  }

  // Фильтр по новинкам
  if (params.isNew === 'true') {
    filtered = filtered.filter(product => product.isNew);
  }

  return filtered;
}

function sortProducts(products: Product[], sortBy?: string): Product[] {
  const sorted = [...products];

  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'newest':
      return sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    default:
      return sorted.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }
}

function paginateArray<T>(array: T[], page: number, limit: number): { items: T[], pagination: PaginationInfo } {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const items = array.slice(startIndex, endIndex);
  
  return {
    items,
    pagination: {
      page,
      limit,
      total: array.length,
      totalPages: Math.ceil(array.length / limit),
    },
  };
}

// ==================== ПРОДУКТЫ ====================

export async function getProducts(params: SearchParams = {}): Promise<{ products: Product[], pagination: PaginationInfo }> {
  if (!USE_API) {
    // Локальная версия
    await new Promise(resolve => setTimeout(resolve, 100));
    const page = parseInt(params.page || '1');
    let filtered = filterProducts(fallbackProducts, params);
    filtered = sortProducts(filtered, params.sort);
    const result = paginateArray(filtered, page, PRODUCTS_PER_PAGE);
    return {
      products: result.items,
      pagination: result.pagination,
    };
  }

  // API версия
  try {
    const query = new URLSearchParams();
    if (params.page) query.set('page', params.page);
    if (params.q) query.set('search', params.q);
    
    // Если передан slug категории, нужно найти ID
    if (params.category) {
      const categories = await getCategories();
      const category = categories.find(c => c.slug === params.category);
      if (category) {
        query.set('categoryId', category.id);
        console.log(`🔍 Фильтр по категории: ${params.category} (ID: ${category.id})`);
      }
    }
    
    if (params.sort) {
      // Конвертируем формат сортировки
      if (params.sort === 'price-asc') query.set('sort', 'price'), query.set('order', 'asc');
      else if (params.sort === 'price-desc') query.set('sort', 'price'), query.set('order', 'desc');
      else if (params.sort === 'name-asc') query.set('sort', 'name'), query.set('order', 'asc');
      else if (params.sort === 'name-desc') query.set('sort', 'name'), query.set('order', 'desc');
    }

    const queryString = query.toString();
    console.log(`📡 API запрос: /products?${queryString}`);
    const response = await apiRequest<any>(`/products${queryString ? `?${queryString}` : ''}`);
    
    // API возвращает массив, преобразуем к нужному формату
    const products = Array.isArray(response) ? response : (response.products || response.data || []);
    const meta = response.meta || {};
    console.log(`✅ Получено товаров: ${products.length}`);
    
    return {
      products: products.map((p: any) => ({
        id: p.id || p._id,
        name: p.name || p.title,
        slug: p.slug,
        description: p.description,
        price: p.price,
        rating: p.rating || 4.5,
        reviewsCount: p.reviewsCount || 0,
        images: p.images || [p.image || '/images/placeholder.jpg'],
        // Если есть объект category, берем slug, иначе используем categoryId
        category: p.category?.slug || p.categoryId || p.category,
        brand: p.brand || 'aled',
        inStock: p.inStock !== false,
        isNew: p.isNew || false,
        isFeatured: p.isFeatured || false,
        characteristics: p.characteristics || {},
      })),
      pagination: {
        page: meta.page || 1,
        limit: meta.limit || PRODUCTS_PER_PAGE,
        total: meta.total || products.length,
        totalPages: meta.totalPages || 1,
      },
    };
  } catch (error) {
    console.error('Failed to fetch products from API, using fallback data', error);
    // Fallback к локальным данным при ошибке
    const page = parseInt(params.page || '1');
    let filtered = filterProducts(fallbackProducts, params);
    filtered = sortProducts(filtered, params.sort);
    const result = paginateArray(filtered, page, PRODUCTS_PER_PAGE);
    return {
      products: result.items,
      pagination: result.pagination,
    };
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!USE_API) {
    // Локальная версия
    await new Promise(resolve => setTimeout(resolve, 100));
    return fallbackProducts.find(p => p.slug === slug) || null;
  }

  // API версия
  try {
    const response = await apiRequest<any>(`/products/${slug}`);
    const p = response.product || response.data || response;
    
    return {
      id: p.id || p._id,
      name: p.name || p.title,
      slug: p.slug,
      description: p.description,
      price: p.price,
      rating: p.rating || 4.5,
      reviewsCount: p.reviewsCount || 0,
      images: p.images || [p.image || '/images/placeholder.jpg'],
      // Если есть объект category, берем slug, иначе используем categoryId
      category: p.category?.slug || p.categoryId || p.category,
      brand: p.brand || 'aled',
      inStock: p.inStock !== false,
      isNew: p.isNew || false,
      isFeatured: p.isFeatured || false,
      characteristics: p.characteristics || {},
    };
  } catch (error) {
    console.error(`Failed to fetch product ${slug} from API, using fallback data`, error);
    return fallbackProducts.find(p => p.slug === slug) || null;
  }
}

export async function getFeaturedProducts(limit: number = 8): Promise<Product[]> {
  const { products } = await getProducts({ sort: 'featured' });
  return products.filter(p => p.isFeatured).slice(0, limit);
}

export async function getNewProducts(limit: number = 8): Promise<Product[]> {
  const { products } = await getProducts({ sort: 'newest', isNew: 'true' });
  return products.slice(0, limit);
}

export async function searchProducts(query: string, limit: number = 20): Promise<Product[]> {
  const { products } = await getProducts({ q: query });
  return products.slice(0, limit);
}

export async function getRelatedProducts(productId: string, limit: number = 4): Promise<Product[]> {
  const product = await getProductBySlug(productId);
  if (!product) return [];

  const { products } = await getProducts({ category: product.category });
  return products
    .filter(p => p.id !== productId)
    .slice(0, limit);
}

// ==================== КАТЕГОРИИ ====================

export async function getCategories(): Promise<Category[]> {
  if (!USE_API) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return fallbackCategories;
  }

  try {
    const response = await apiRequest<any>('/categories');
    const categories = Array.isArray(response) ? response : (response.categories || response.data || []);
    
    return categories.map((c: any) => ({
      id: c.id || c._id,
      name: c.name,
      slug: c.slug,
      description: c.description || '',
      image: c.image || '/images/placeholder.jpg',
      productsCount: c.productsCount || 0,
    }));
  } catch (error) {
    console.error('Failed to fetch categories from API, using fallback data', error);
    return fallbackCategories;
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find(c => c.slug === slug) || null;
}

// ==================== БРЕНДЫ ====================

export async function getBrands(): Promise<Brand[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return fallbackBrands;
}

// ==================== БЛОГ ====================

export async function getBlogPosts(page: number = 1): Promise<{ posts: BlogPost[], pagination: PaginationInfo }> {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const result = paginateArray(fallbackBlogPosts, page, BLOG_PER_PAGE);
  return {
    posts: result.items,
    pagination: result.pagination,
  };
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return fallbackBlogPosts.find(p => p.slug === slug) || null;
}

export async function getFeaturedBlogPosts(limit: number = 3): Promise<BlogPost[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return fallbackBlogPosts.filter(p => p.featured).slice(0, limit);
}
