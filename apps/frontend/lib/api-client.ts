/**
 * API Client для ALed Store Frontend
 * Интеграция с Backend API
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

interface ApiResponse<T> {
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  error?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
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
  }

  // ==================== КАТЕГОРИИ ====================
  
  async getCategories() {
    return this.request<any[]>('/categories');
  }

  async getCategory(slug: string) {
    return this.request<any>(`/categories/${slug}`);
  }

  // ==================== ТОВАРЫ ====================
  
  async getProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
  }) {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.category) query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    if (params?.minPrice) query.set('minPrice', params.minPrice.toString());
    if (params?.maxPrice) query.set('maxPrice', params.maxPrice.toString());
    if (params?.sort) query.set('sort', params.sort);

    const queryString = query.toString();
    return this.request<any[]>(`/products${queryString ? `?${queryString}` : ''}`);
  }

  async getProduct(slug: string) {
    return this.request<any>(`/products/${slug}`);
  }

  async getRelatedProducts(productId: string) {
    return this.request<any[]>(`/products/${productId}/related`);
  }

  // ==================== КОРЗИНА ====================
  
  async getCart(sessionId?: string) {
    const headers: HeadersInit = {};
    if (sessionId) {
      headers['X-Session-ID'] = sessionId;
    }
    
    return this.request<any>('/cart', { headers });
  }

  async addToCart(productId: string, quantity: number = 1, variantId?: string) {
    return this.request<any>('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity, variantId }),
    });
  }

  async updateCartItem(itemId: string, quantity: number) {
    return this.request<any>(`/cart/items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(itemId: string) {
    return this.request<any>(`/cart/items/${itemId}`, {
      method: 'DELETE',
    });
  }

  async clearCart() {
    return this.request<any>('/cart', {
      method: 'DELETE',
    });
  }

  async applyCoupon(code: string) {
    return this.request<any>('/coupons/apply', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  }

  // ==================== ЗАКАЗЫ ====================
  
  async createOrder(orderData: {
    email: string;
    phone: string;
    shippingAddress: {
      city: string;
      street: string;
      building: string;
      apartment?: string;
      postalCode?: string;
    };
    billingAddress?: any;
    paymentMethod: string;
    notes?: string;
  }) {
    return this.request<any>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrder(orderId: string) {
    return this.request<any>(`/orders/${orderId}`);
  }

  async getMyOrders(email: string) {
    return this.request<any[]>(`/orders?email=${email}`);
  }

  // ==================== ОТЗЫВЫ ====================
  
  async getProductReviews(productId: string) {
    return this.request<any[]>(`/products/${productId}/reviews`);
  }

  async createReview(productId: string, reviewData: {
    rating: number;
    text: string;
    email: string;
    name: string;
  }) {
    return this.request<any>(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  // ==================== БЛОГ ====================
  
  async getPosts(params?: { page?: number; limit?: number }) {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());

    const queryString = query.toString();
    return this.request<any[]>(`/posts${queryString ? `?${queryString}` : ''}`);
  }

  async getPost(slug: string) {
    return this.request<any>(`/posts/${slug}`);
  }

  // ==================== НАСТРОЙКИ ====================
  
  async getPublicSettings() {
    return this.request<Record<string, any>>('/settings/public');
  }

  // ==================== АВТОРИЗАЦИЯ (для клиентов) ====================
  
  async login(email: string, password: string) {
    return this.request<{
      user: any;
      accessToken: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) {
    return this.request<{
      user: any;
      accessToken: string;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getMe(token: string) {
    return this.request<any>('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

// Экспортируем готовый экземпляр
export const api = new ApiClient();

// Экспортируем класс для создания кастомных экземпляров
export default ApiClient;

