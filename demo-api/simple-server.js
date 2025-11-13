const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Для Swagger UI
}));
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));
// Увеличиваем лимит для загрузки изображений (Base64)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Хранилище данных (в памяти)
const categories = [
  { id: '1', name: 'Би-светодиодные линзы', slug: 'bi-led-lenses', description: 'Би-светодиодные линзы для фар головного света', isVisible: true },
  { id: '2', name: 'LED лампы', slug: 'led-lamps', description: 'Светодиодные лампы различных типов цоколей', isVisible: true },
  { id: '3', name: 'LED ленты', slug: 'led-strips', description: 'Светодиодные ленты для декоративной подсветки', isVisible: true },
  { id: '4', name: 'DRL модули', slug: 'drl-modules', description: 'Модули дневных ходовых огней', isVisible: true }
];

let products = []; // Пустой массив - товары будут добавляться через админку

const orders = [
  {
    id: '1',
    email: 'customer@example.com',
    status: 'PENDING',
    total: 16000,
    createdAt: new Date().toISOString(),
    items: []
  }
];

// Баннеры для главной страницы
let banners = [
  {
    id: '1',
    title: 'Новинка! Би-LED линзы',
    subtitle: 'Яркий свет для вашего автомобиля',
    image: '',
    link: '/catalog/bi-led-lenses',
    buttonText: 'Смотреть каталог',
    isActive: true,
    order: 1,
    createdAt: new Date().toISOString()
  }
];

// Счетчики для ID
let productIdCounter = 1;
let categoryIdCounter = 5;
let bannerIdCounter = 2;

// Routes
app.get('/', (req, res) => {
  res.json({
    message: '🚀 ALed Store API работает!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      docs: '/docs',
      categories: '/api/v1/categories',
      products: '/api/v1/products',
      orders: '/api/v1/orders',
      banners: '/api/v1/banners'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    database: 'connected',
    redis: 'connected',
    s3: 'connected',
    timestamp: new Date().toISOString()
  });
});

// ==================== КАТЕГОРИИ ====================

app.get('/api/v1/categories', (req, res) => {
  // Добавляем подсчет товаров в каждой категории
  const categoriesWithCount = categories.map(cat => ({
    ...cat,
    productsCount: products.filter(p => p.categoryId === cat.id).length
  }));
  res.json({ data: categoriesWithCount });
});

app.get('/api/v1/categories/:id', (req, res) => {
  const category = categories.find(c => c.id === req.params.id);
  if (!category) {
    return res.status(404).json({ error: 'Категория не найдена' });
  }
  res.json({ data: category });
});

app.post('/api/v1/categories', (req, res) => {
  const { name, description } = req.body;
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  const newCategory = {
    id: String(categoryIdCounter++),
    name,
    slug,
    description: description || '',
    isVisible: true,
    createdAt: new Date().toISOString()
  };
  
  categories.push(newCategory);
  res.status(201).json({ data: newCategory });
});

app.patch('/api/v1/categories/:id', (req, res) => {
  const index = categories.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Категория не найдена' });
  }
  
  categories[index] = { ...categories[index], ...req.body, updatedAt: new Date().toISOString() };
  res.json({ data: categories[index] });
});

app.delete('/api/v1/categories/:id', (req, res) => {
  const index = categories.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Категория не найдена' });
  }
  
  categories.splice(index, 1);
  res.json({ data: { message: 'Категория удалена' } });
});

// ==================== ТОВАРЫ ====================

app.get('/api/v1/products', (req, res) => {
  const { page = 1, limit = 24, search, categoryId } = req.query;
  
  let filtered = [...products];
  
  // Поиск
  if (search) {
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  // Фильтр по категории
  if (categoryId) {
    filtered = filtered.filter(p => p.categoryId === categoryId);
  }
  
  // Пагинация
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const paginatedProducts = filtered.slice(start, start + parseInt(limit));
  
  res.json({
    data: paginatedProducts,
    meta: { 
      page: parseInt(page), 
      limit: parseInt(limit), 
      total, 
      totalPages 
    }
  });
});

app.get('/api/v1/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id || p.slug === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Товар не найден' });
  }
  res.json({ data: product });
});

app.post('/api/v1/products', (req, res) => {
  const { name, description, price, oldPrice, stock, categoryId, sku, images, characteristics, isPublished = true } = req.body;
  
  // Валидация
  if (!name || !price || !sku) {
    return res.status(400).json({ error: 'Обязательные поля: name, price, sku' });
  }
  
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-а-я]/g, '');
  
  const category = categories.find(c => c.id === categoryId);
  
  const newProduct = {
    id: String(productIdCounter++),
    name,
    slug,
    sku,
    description: description || '',
    price: parseFloat(price),
    oldPrice: oldPrice ? parseFloat(oldPrice) : null,
    stock: parseInt(stock) || 0,
    categoryId,
    category: category ? { id: category.id, name: category.name } : null,
    images: images || [],
    characteristics: characteristics || {},
    isPublished,
    rating: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  products.push(newProduct);
  console.log('✅ Товар создан с характеристиками:', newProduct.characteristics);
  res.status(201).json({ data: newProduct });
});

app.patch('/api/v1/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Товар не найден' });
  }
  
  // Обновляем категорию если изменилась
  if (req.body.categoryId) {
    const category = categories.find(c => c.id === req.body.categoryId);
    if (category) {
      req.body.category = { id: category.id, name: category.name };
    }
  }
  
  products[index] = { 
    ...products[index], 
    ...req.body,
    characteristics: req.body.characteristics !== undefined ? req.body.characteristics : products[index].characteristics,
    updatedAt: new Date().toISOString() 
  };
  
  console.log('✅ Товар обновлен с характеристиками:', products[index].characteristics);
  res.json({ data: products[index] });
});

app.delete('/api/v1/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Товар не найден' });
  }
  
  products.splice(index, 1);
  res.json({ data: { message: 'Товар удален' } });
});

// ==================== ЗАКАЗЫ ====================

app.get('/api/v1/orders', (req, res) => {
  res.json({
    data: orders,
    meta: { page: 1, limit: 10, total: orders.length, totalPages: 1 }
  });
});

// ==================== БАННЕРЫ ====================

app.get('/api/v1/banners', (req, res) => {
  // Для фронтенда - возвращаем только активные баннеры, отсортированные по order
  const activeBanners = banners
    .filter(b => b.isActive)
    .sort((a, b) => a.order - b.order);
  res.json({ data: activeBanners });
});

app.get('/api/v1/banners/all', (req, res) => {
  // Для админки - возвращаем все баннеры
  const sortedBanners = [...banners].sort((a, b) => a.order - b.order);
  res.json({ data: sortedBanners });
});

app.get('/api/v1/banners/:id', (req, res) => {
  const banner = banners.find(b => b.id === req.params.id);
  if (!banner) {
    return res.status(404).json({ error: 'Баннер не найден' });
  }
  res.json({ data: banner });
});

app.post('/api/v1/banners', (req, res) => {
  const { title, subtitle, image, link, buttonText, isActive, order } = req.body;
  
  const newBanner = {
    id: String(bannerIdCounter++),
    title,
    subtitle: subtitle || '',
    image: image || '',
    link: link || '',
    buttonText: buttonText || 'Подробнее',
    isActive: isActive !== undefined ? isActive : true,
    order: order !== undefined ? order : banners.length + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  banners.push(newBanner);
  console.log('✅ Создан баннер:', newBanner);
  res.status(201).json({ data: newBanner });
});

app.put('/api/v1/banners/:id', (req, res) => {
  const index = banners.findIndex(b => b.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Баннер не найден' });
  }
  
  const updatedBanner = {
    ...banners[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  banners[index] = updatedBanner;
  console.log('✅ Обновлен баннер:', updatedBanner);
  res.json({ data: updatedBanner });
});

app.delete('/api/v1/banners/:id', (req, res) => {
  const index = banners.findIndex(b => b.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Баннер не найден' });
  }
  
  banners.splice(index, 1);
  console.log('✅ Удален баннер:', req.params.id);
  res.json({ message: 'Баннер успешно удален' });
});

// ==================== АВТОРИЗАЦИЯ ====================

app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Демо авторизация
  if (email === 'admin@aled.local' && password === 'admin123') {
    return res.json({
      data: {
        user: {
          id: '1',
          email: 'admin@aled.local',
          role: 'SUPER_ADMIN',
          firstName: 'Админ',
          lastName: 'ALed'
        },
        accessToken: 'demo-jwt-token-12345'
      }
    });
  }
  
  res.status(401).json({ error: 'Неверные учетные данные' });
});

app.get('/api/v1/users', (req, res) => {
  res.json({
    data: [
      { id: '1', email: 'admin@aled.local', role: 'SUPER_ADMIN', firstName: 'Админ', lastName: 'ALed' },
      { id: '2', email: 'manager@aled.local', role: 'MANAGER', firstName: 'Менеджер', lastName: 'ALed' },
      { id: '3', email: 'customer@aled.local', role: 'CUSTOMER', firstName: 'Клиент', lastName: 'Тест' }
    ],
    meta: { page: 1, limit: 10, total: 3, totalPages: 1 }
  });
});

app.get('/api/v1/settings/public', (req, res) => {
  res.json({
    data: {
      'store.name': 'ALed Store',
      'store.description': 'Интернет-магазин светодиодной продукции',
      'store.currency': 'RUB'
    }
  });
});

// Улучшенная Swagger-подобная документация
app.get('/docs', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>ALed Store API - Документация</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          padding: 20px;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px;
          text-align: center;
        }
        .header h1 { font-size: 42px; margin-bottom: 10px; }
        .header p { font-size: 18px; opacity: 0.9; }
        .stats {
          display: flex;
          justify-content: center;
          gap: 30px;
          margin-top: 20px;
          flex-wrap: wrap;
        }
        .stat {
          background: rgba(255,255,255,0.2);
          padding: 15px 30px;
          border-radius: 10px;
          backdrop-filter: blur(10px);
        }
        .stat strong { font-size: 24px; display: block; }
        .stat span { font-size: 14px; opacity: 0.9; }
        .content { padding: 40px; }
        .section {
          margin-bottom: 40px;
          border-left: 4px solid #667eea;
          padding-left: 20px;
        }
        .section h2 {
          font-size: 28px;
          margin-bottom: 20px;
          color: #667eea;
        }
        .endpoint {
          background: #f8f9fa;
          border-radius: 12px;
          margin-bottom: 15px;
          overflow: hidden;
          border: 1px solid #e9ecef;
          transition: all 0.3s;
        }
        .endpoint:hover {
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          transform: translateY(-2px);
        }
        .endpoint-header {
          padding: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .method {
          font-weight: bold;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 12px;
          letter-spacing: 1px;
        }
        .method.get { background: #61affe; color: white; }
        .method.post { background: #49cc90; color: white; }
        .method.patch { background: #fca130; color: white; }
        .method.delete { background: #f93e3e; color: white; }
        .path {
          font-family: 'Courier New', monospace;
          font-size: 16px;
          color: #333;
          flex: 1;
        }
        .description {
          color: #6c757d;
          font-size: 14px;
        }
        .endpoint-details {
          padding: 20px;
          border-top: 1px solid #e9ecef;
          background: white;
          display: none;
        }
        .endpoint.active .endpoint-details { display: block; }
        .params, .response {
          margin-top: 15px;
        }
        .params h4, .response h4 {
          font-size: 14px;
          color: #667eea;
          margin-bottom: 10px;
        }
        pre {
          background: #f1f3f5;
          padding: 15px;
          border-radius: 8px;
          overflow-x: auto;
          font-size: 13px;
          border: 1px solid #dee2e6;
        }
        .try-button {
          background: #667eea;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          margin-top: 10px;
        }
        .try-button:hover { background: #5568d3; }
        .badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 12px;
          margin-left: 10px;
        }
        .badge.required { background: #f93e3e; color: white; }
        .badge.optional { background: #adb5bd; color: white; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 ALed Store API</h1>
          <p>Полная документация REST API для интернет-магазина светодиодной продукции</p>
          <div class="stats">
            <div class="stat">
              <strong>${categories.length}</strong>
              <span>Категорий</span>
            </div>
            <div class="stat">
              <strong>${products.length}</strong>
              <span>Товаров</span>
            </div>
            <div class="stat">
              <strong>${orders.length}</strong>
              <span>Заказов</span>
            </div>
          </div>
        </div>

        <div class="content">
          <!-- КАТЕГОРИИ -->
          <div class="section">
            <h2>📁 Категории</h2>
            
            <div class="endpoint" onclick="this.classList.toggle('active')">
              <div class="endpoint-header">
                <span class="method get">GET</span>
                <span class="path">/api/v1/categories</span>
                <span class="description">Получить все категории</span>
              </div>
              <div class="endpoint-details">
                <div class="response">
                  <h4>Ответ (200 OK):</h4>
                  <pre>{
  "data": [
    {
      "id": "1",
      "name": "Би-светодиодные линзы",
      "slug": "bi-led-lenses",
      "description": "..."
    }
  ]
}</pre>
                </div>
              </div>
            </div>

            <div class="endpoint" onclick="this.classList.toggle('active')">
              <div class="endpoint-header">
                <span class="method post">POST</span>
                <span class="path">/api/v1/categories</span>
                <span class="description">Создать категорию</span>
              </div>
              <div class="endpoint-details">
                <div class="params">
                  <h4>Параметры:</h4>
                  <pre>{
  "name": "Название" <span class="badge required">обязательно</span>,
  "description": "Описание" <span class="badge optional">опционально</span>
}</pre>
                </div>
              </div>
            </div>
          </div>

          <!-- ТОВАРЫ -->
          <div class="section">
            <h2>📦 Товары</h2>
            
            <div class="endpoint" onclick="this.classList.toggle('active')">
              <div class="endpoint-header">
                <span class="method get">GET</span>
                <span class="path">/api/v1/products</span>
                <span class="description">Получить список товаров</span>
              </div>
              <div class="endpoint-details">
                <div class="params">
                  <h4>Query параметры:</h4>
                  <pre>?page=1&limit=24&search=...&categoryId=...</pre>
                </div>
                <div class="response">
                  <h4>Ответ (200 OK):</h4>
                  <pre>{
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 24,
    "total": ${products.length},
    "totalPages": 1
  }
}</pre>
                </div>
              </div>
            </div>

            <div class="endpoint" onclick="this.classList.toggle('active')">
              <div class="endpoint-header">
                <span class="method get">GET</span>
                <span class="path">/api/v1/products/:id</span>
                <span class="description">Получить товар по ID</span>
              </div>
            </div>

            <div class="endpoint" onclick="this.classList.toggle('active')">
              <div class="endpoint-header">
                <span class="method post">POST</span>
                <span class="path">/api/v1/products</span>
                <span class="description">Создать товар</span>
              </div>
              <div class="endpoint-details">
                <div class="params">
                  <h4>Параметры:</h4>
                  <pre>{
  "name": "Название товара" <span class="badge required">обязательно</span>,
  "sku": "ALED-001" <span class="badge required">обязательно</span>,
  "price": 12500 <span class="badge required">обязательно</span>,
  "description": "Описание",
  "oldPrice": 15000,
  "stock": 25,
  "categoryId": "1",
  "images": [],
  "isPublished": true
}</pre>
                </div>
                <div class="response">
                  <h4>Ответ (201 Created):</h4>
                  <pre>{
  "data": {
    "id": "1",
    "name": "...",
    "slug": "...",
    "price": 12500,
    ...
  }
}</pre>
                </div>
              </div>
            </div>

            <div class="endpoint" onclick="this.classList.toggle('active')">
              <div class="endpoint-header">
                <span class="method patch">PATCH</span>
                <span class="path">/api/v1/products/:id</span>
                <span class="description">Обновить товар</span>
              </div>
              <div class="endpoint-details">
                <div class="params">
                  <h4>Параметры (все опциональны):</h4>
                  <pre>{
  "name": "Новое название",
  "price": 13000,
  "stock": 30,
  ...
}</pre>
                </div>
              </div>
            </div>

            <div class="endpoint" onclick="this.classList.toggle('active')">
              <div class="endpoint-header">
                <span class="method delete">DELETE</span>
                <span class="path">/api/v1/products/:id</span>
                <span class="description">Удалить товар</span>
              </div>
            </div>
          </div>

          <!-- ЗАКАЗЫ -->
          <div class="section">
            <h2>🛒 Заказы</h2>
            
            <div class="endpoint" onclick="this.classList.toggle('active')">
              <div class="endpoint-header">
                <span class="method get">GET</span>
                <span class="path">/api/v1/orders</span>
                <span class="description">Получить список заказов</span>
              </div>
            </div>
          </div>

          <!-- АВТОРИЗАЦИЯ -->
          <div class="section">
            <h2>🔐 Авторизация</h2>
            
            <div class="endpoint" onclick="this.classList.toggle('active')">
              <div class="endpoint-header">
                <span class="method post">POST</span>
                <span class="path">/api/v1/auth/login</span>
                <span class="description">Войти в систему</span>
              </div>
              <div class="endpoint-details">
                <div class="params">
                  <h4>Параметры:</h4>
                  <pre>{
  "email": "admin@aled.local",
  "password": "admin123"
}</pre>
                </div>
                <div class="response">
                  <h4>Ответ (200 OK):</h4>
                  <pre>{
  "data": {
    "user": {
      "id": "1",
      "email": "admin@aled.local",
      "role": "SUPER_ADMIN"
    },
    "accessToken": "..."
  }
}</pre>
                </div>
              </div>
            </div>

            <div class="endpoint" onclick="this.classList.toggle('active')">
              <div class="endpoint-header">
                <span class="method get">GET</span>
                <span class="path">/api/v1/users</span>
                <span class="description">Получить пользователей</span>
              </div>
            </div>
          </div>

          <!-- СИСТЕМНОЕ -->
          <div class="section">
            <h2>⚙️ Системное</h2>
            
            <div class="endpoint" onclick="this.classList.toggle('active')">
              <div class="endpoint-header">
                <span class="method get">GET</span>
                <span class="path">/health</span>
                <span class="description">Проверка здоровья системы</span>
              </div>
            </div>

            <div class="endpoint" onclick="this.classList.toggle('active')">
              <div class="endpoint-header">
                <span class="method get">GET</span>
                <span class="path">/api/v1/settings/public</span>
                <span class="description">Публичные настройки</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`\n🚀 ALed Store Demo API запущен!`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`📚 Документация: http://localhost:${PORT}/docs`);
  console.log(`💾 Health: http://localhost:${PORT}/health`);
  console.log(`\n🔑 Тестовые данные:`);
  console.log(`• Категории: ${categories.length} шт.`);
  console.log(`• Товары: ${products.length} шт.`);
  console.log(`• Заказы: ${orders.length} шт.`);
  console.log(`\n🛑 Для остановки: Ctrl+C`);
});
