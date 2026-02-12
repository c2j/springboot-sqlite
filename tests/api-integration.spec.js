const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8080/ecommerce/api/v1';

class SwaggerAPIClient {
  constructor(request) {
    this.request = request;
    this.authToken = null;
  }

  setAuthToken(token) {
    this.authToken = token;
  }

  getHeaders(additionalHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...additionalHeaders
    };
    
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }
    
    return headers;
  }

  async login(email, password, role = 'client') {
    const response = await this.request.post(`${BASE_URL}/users/login?role=${role}`, {
      headers: this.getHeaders(),
      data: { email, password }
    });
    
    if (response.ok()) {
      const data = await response.json();
      this.setAuthToken(data.token);
      return data;
    }
    
    throw new Error(`Login failed: ${response.status()}`);
  }

  async signupClient(email, name, password) {
    const response = await this.request.post(`${BASE_URL}/users/clients/signup`, {
      headers: this.getHeaders(),
      data: { email, name, password }
    });
    
    if (!response.ok()) {
      throw new Error(`Signup failed: ${response.status()}`);
    }
    
    return await response.json();
  }

  async signupEmployee(email, name, password, position, department) {
    const response = await this.request.post(`${BASE_URL}/users/employees/signup`, {
      headers: this.getHeaders(),
      data: { email, name, password, position, department }
    });
    
    if (!response.ok()) {
      throw new Error(`Signup failed: ${response.status()}`);
    }
    
    return await response.json();
  }

  async getStocks(searchPhrase = null, page = 0, size = 10) {
    let url = `${BASE_URL}/stocks?page=${page}&size=${size}`;
    if (searchPhrase) {
      url += `&searchPhrase=${encodeURIComponent(searchPhrase)}`;
    }
    
    const response = await this.request.get(url, {
      headers: this.getHeaders()
    });
    
    if (!response.ok()) {
      throw new Error(`Get stocks failed: ${response.status()}`);
    }
    
    return await response.json();
  }

  async getStockByCode(code) {
    const response = await this.request.get(`${BASE_URL}/stocks/${code}`, {
      headers: this.getHeaders()
    });
    
    if (response.status() === 404) {
      return null;
    }
    
    if (!response.ok()) {
      throw new Error(`Get stock failed: ${response.status()}`);
    }
    
    return await response.json();
  }

  async addStock(description, category, price, quantity, status, imagePath = null) {
    const formData = new FormData();
    formData.append('description', description);
    formData.append('category', category.toString());
    formData.append('price', price.toString());
    formData.append('quantity', quantity.toString());
    formData.append('status', status);
    
    if (imagePath) {
      formData.append('image', imagePath);
    }
    
    const response = await this.request.post(`${BASE_URL}/stocks`, {
      headers: {
        'Authorization': `Bearer ${this.authToken}`
      },
      multipart: {
        description: description,
        category: category.toString(),
        price: price.toString(),
        quantity: quantity.toString(),
        status: status,
        ...(imagePath && { image: imagePath })
      }
    });
    
    if (!response.ok()) {
      const error = await response.text();
      throw new Error(`Add stock failed: ${response.status()} - ${error}`);
    }
    
    return await response.json();
  }

  async updateStock(code, description, category, price, quantity, status, imagePath = null) {
    const response = await this.request.put(`${BASE_URL}/stocks/${code}`, {
      headers: {
        'Authorization': `Bearer ${this.authToken}`
      },
      multipart: {
        description,
        category: category.toString(),
        price: price.toString(),
        quantity: quantity.toString(),
        status,
        ...(imagePath && { image: imagePath })
      }
    });
    
    if (response.status() === 404) {
      return null;
    }
    
    if (!response.ok()) {
      throw new Error(`Update stock failed: ${response.status()}`);
    }
    
    return await response.json();
  }

  async deleteStock(code) {
    const response = await this.request.delete(`${BASE_URL}/stocks/${code}`, {
      headers: this.getHeaders()
    });
    
    return response.ok();
  }

  async getShoppingCart() {
    const response = await this.request.get(`${BASE_URL}/carts`, {
      headers: this.getHeaders()
    });
    
    if (!response.ok()) {
      throw new Error(`Get cart failed: ${response.status()}`);
    }
    
    return await response.json();
  }

  async addToCart(productCode, quantity) {
    const response = await this.request.post(
      `${BASE_URL}/carts?productCode=${productCode}&quantity=${quantity}`,
      {
        headers: this.getHeaders()
      }
    );
    
    if (!response.ok()) {
      throw new Error(`Add to cart failed: ${response.status()}`);
    }
    
    return await response.json();
  }

  async removeFromCart(cartId) {
    const response = await this.request.delete(`${BASE_URL}/carts/${cartId}`, {
      headers: this.getHeaders()
    });
    
    if (response.status() === 404) {
      return false;
    }
    
    return response.ok();
  }

  async buyCart(paymentMethod = 'CASH') {
    const response = await this.request.post(
      `${BASE_URL}/carts/buy?payment_method=${paymentMethod}`,
      {
        headers: this.getHeaders()
      }
    );
    
    if (!response.ok()) {
      throw new Error(`Buy cart failed: ${response.status()}`);
    }
    
    return await response.json();
  }

  async getOrders() {
    const response = await this.request.get(`${BASE_URL}/orders`, {
      headers: this.getHeaders()
    });
    
    if (!response.ok()) {
      throw new Error(`Get orders failed: ${response.status()}`);
    }
    
    return await response.json();
  }

  async getOrderDetails(orderId) {
    const response = await this.request.get(`${BASE_URL}/orders/${orderId}/details`, {
      headers: this.getHeaders()
    });
    
    if (response.status() === 404) {
      return null;
    }
    
    if (!response.ok()) {
      throw new Error(`Get order details failed: ${response.status()}`);
    }
    
    return await response.json();
  }
}

test.describe('API Integration Tests via Swagger', () => {
  let apiClient;
  let testData = {};

  test.beforeAll(async () => {
    testData = {
      timestamp: Date.now(),
      clientEmail: `client${Date.now()}@example.com`,
      clientPassword: 'Test123!',
      employeeEmail: `employee${Date.now()}@example.com`,
      employeePassword: 'Test123!'
    };
  });

  test.beforeEach(async ({ request }) => {
    apiClient = new SwaggerAPIClient(request);
  });

  test.describe('Authentication APIs', () => {
    test('POST /users/clients/signup - Register new client', async ({ request }) => {
      const apiClient = new SwaggerAPIClient(request);
      
      const result = await apiClient.signupClient(
        testData.clientEmail,
        'Test Client',
        testData.clientPassword
      );
      
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name', 'Test Client');
      expect(result).toHaveProperty('email', testData.clientEmail);
      
      testData.clientId = result.id;
    });

    test('POST /users/employees/signup - Register new employee', async ({ request }) => {
      const apiClient = new SwaggerAPIClient(request);
      
      const result = await apiClient.signupEmployee(
        testData.employeeEmail,
        'Test Employee',
        testData.employeePassword,
        'Manager',
        'Sales'
      );
      
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name', 'Test Employee');
      expect(result).toHaveProperty('email', testData.employeeEmail);
      
      testData.employeeId = result.id;
    });

    test('POST /users/login - Client login', async ({ request }) => {
      const apiClient = new SwaggerAPIClient(request);
      
      await apiClient.signupClient(
        `login${Date.now()}@example.com`,
        'Login Client',
        'password123'
      );
      
      const result = await apiClient.login('login@example.com', 'password123', 'client');
      
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('userId');
      expect(result).toHaveProperty('role', 'client');
      expect(apiClient.authToken).toBeTruthy();
    });

    test('POST /users/login - Employee login', async ({ request }) => {
      const apiClient = new SwaggerAPIClient(request);
      
      await apiClient.signupEmployee(
        `loginemp${Date.now()}@example.com`,
        'Login Employee',
        'password123',
        'Manager',
        'Sales'
      );
      
      const result = await apiClient.login('loginemp@example.com', 'password123', 'employee');
      
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('userId');
      expect(result).toHaveProperty('role', 'employee');
      expect(apiClient.authToken).toBeTruthy();
    });

    test('POST /users/login - Invalid credentials should fail', async ({ request }) => {
      const apiClient = new SwaggerAPIClient(request);
      
      await expect(
        apiClient.login('invalid@example.com', 'wrongpassword', 'client')
      ).rejects.toThrow();
    });
  });

  test.describe('Stock APIs', () => {
    test.beforeAll(async ({ request }) => {
      const apiClient = new SwaggerAPIClient(request);
      await apiClient.signupClient(
        testData.clientEmail,
        'Test Client',
        testData.clientPassword
      );
    });

    test.beforeEach(async ({ request }) => {
      apiClient = new SwaggerAPIClient(request);
      await apiClient.login(testData.clientEmail, testData.clientPassword, 'client');
    });

    test('GET /stocks - List all stocks', async () => {
      const stocks = await apiClient.getStocks();
      
      expect(Array.isArray(stocks)).toBeTruthy();
      expect(stocks.length).toBeGreaterThanOrEqual(0);
    });

    test('GET /stocks - Search stocks by phrase', async () => {
      const allStocks = await apiClient.getStocks(null, 0, 100);
      
      if (allStocks.length > 0) {
        const searchPhrase = allStocks[0].description.substring(0, 3);
        const results = await apiClient.getStocks(searchPhrase);
        
        expect(Array.isArray(results)).toBeTruthy();
      }
    });

    test('GET /stocks/{code} - Get specific stock', async () => {
      const stocks = await apiClient.getStocks(null, 0, 1);
      
      if (stocks.length > 0) {
        const stockCode = stocks[0].code;
        const stock = await apiClient.getStockByCode(stockCode);
        
        expect(stock).toBeTruthy();
        expect(stock).toHaveProperty('code', stockCode);
        expect(stock).toHaveProperty('description');
        expect(stock).toHaveProperty('price');
      }
    });

    test('GET /stocks/{code} - Non-existent stock returns 404', async () => {
      const stock = await apiClient.getStockByCode(999999);
      
      expect(stock).toBeNull();
    });

    test('POST /stocks - Add new stock (requires employee)', async ({ request }) => {
      const apiClient = new SwaggerAPIClient(request);
      
      await apiClient.signupEmployee(
        `stockemp${Date.now()}@example.com`,
        'Stock Employee',
        'password123',
        'Manager',
        'Sales'
      );
      
      await apiClient.login('stockemp@example.com', 'password123', 'employee');
      
      const result = await apiClient.addStock(
        'Test Product',
        1,
        29.99,
        100,
        'active'
      );
      
      expect(result).toHaveProperty('code');
      expect(result).toHaveProperty('description', 'Test Product');
      expect(result).toHaveProperty('price', 29.99);
      expect(result).toHaveProperty('quantity', 100);
      expect(result).toHaveProperty('status', 'active');
      
      testData.testStockCode = result.code;
    });

    test('PUT /stocks/{code} - Update stock (requires employee)', async ({ request }) => {
      const apiClient = new SwaggerAPIClient(request);
      
      await apiClient.signupEmployee(
        `updateemp${Date.now()}@example.com`,
        'Update Employee',
        'password123',
        'Manager',
        'Sales'
      );
      
      await apiClient.login('updateemp@example.com', 'password123', 'employee');
      
      const newStock = await apiClient.addStock(
        'Update Test Product',
        1,
        29.99,
        100,
        'active'
      );
      
      const updatedStock = await apiClient.updateStock(
        newStock.code,
        'Updated Product',
        2,
        39.99,
        50,
        'inactive'
      );
      
      expect(updatedStock).toBeTruthy();
      expect(updatedStock).toHaveProperty('code', newStock.code);
      expect(updatedStock).toHaveProperty('description', 'Updated Product');
      expect(updatedStock).toHaveProperty('price', 39.99);
      expect(updatedStock).toHaveProperty('quantity', 50);
      expect(updatedStock).toHaveProperty('status', 'inactive');
    });

    test('DELETE /stocks/{code} - Delete stock (requires employee)', async ({ request }) => {
      const apiClient = new SwaggerAPIClient(request);
      
      await apiClient.signupEmployee(
        `deleteemp${Date.now()}@example.com`,
        'Delete Employee',
        'password123',
        'Manager',
        'Sales'
      );
      
      await apiClient.login('deleteemp@example.com', 'password123', 'employee');
      
      const newStock = await apiClient.addStock(
        'Delete Test Product',
        1,
        29.99,
        100,
        'active'
      );
      
      const deleted = await apiClient.deleteStock(newStock.code);
      
      expect(deleted).toBeTruthy();
      
      const stock = await apiClient.getStockByCode(newStock.code);
      expect(stock).toBeNull();
    });
  });

  test.describe('Shopping Cart APIs', () => {
    let testStockCode;

    test.beforeAll(async ({ request }) => {
      const apiClient = new SwaggerAPIClient(request);
      
      await apiClient.signupClient(
        testData.clientEmail,
        'Test Client',
        testData.clientPassword
      );
      
      await apiClient.signupEmployee(
        `cartemp${Date.now()}@example.com`,
        'Cart Employee',
        'password123',
        'Manager',
        'Sales'
      );
      
      await apiClient.login('cartemp@example.com', 'password123', 'employee');
      
      const stock = await apiClient.addStock(
        'Cart Test Product',
        1,
        49.99,
        100,
        'active'
      );
      
      testStockCode = stock.code;
      testData.testStockCode = stock.code;
    });

    test.beforeEach(async ({ request }) => {
      apiClient = new SwaggerAPIClient(request);
      await apiClient.login(testData.clientEmail, testData.clientPassword, 'client');
    });

    test('GET /carts - Get shopping cart', async () => {
      const cart = await apiClient.getShoppingCart();
      
      expect(cart).toBeTruthy();
      expect(cart).toHaveProperty('items');
      expect(Array.isArray(cart.items)).toBeTruthy();
    });

    test('POST /carts - Add product to cart', async () => {
      const cartItem = await apiClient.addToCart(testData.testStockCode, 2);
      
      expect(cartItem).toBeTruthy();
      expect(cartItem).toHaveProperty('id');
      expect(cartItem).toHaveProperty('productCode');
      expect(cartItem).toHaveProperty('quantity', 2);
      
      testData.cartItemId = cartItem.id;
    });

    test('DELETE /carts/{cartId} - Remove product from cart', async () => {
      const cartItem = await apiClient.addToCart(testData.testStockCode, 1);
      
      const removed = await apiClient.removeFromCart(cartItem.id);
      
      expect(removed).toBeTruthy();
    });

    test('POST /carts/buy - Buy cart', async () => {
      await apiClient.addToCart(testData.testStockCode, 1);
      
      const order = await apiClient.buyCart('CASH');
      
      expect(order).toBeTruthy();
      expect(order).toHaveProperty('id');
      expect(order).toHaveProperty('paymentMethod', 'CASH');
      expect(order).toHaveProperty('totalAmount');
      
      testData.orderId = order.id;
    });

    test('POST /carts/buy - Different payment methods', async ({ request }) => {
      const apiClient = new SwaggerAPIClient(request);
      
      await apiClient.signupClient(
        `payment${Date.now()}@example.com`,
        'Payment Client',
        'password123'
      );
      
      await apiClient.login('payment@example.com', 'password123', 'client');
      
      await apiClient.addToCart(testData.testStockCode, 1);
      
      const order = await apiClient.buyCart('VISA');
      
      expect(order).toBeTruthy();
      expect(order).toHaveProperty('paymentMethod', 'VISA');
    });
  });

  test.describe('Order APIs', () => {
    test.beforeAll(async ({ request }) => {
      const apiClient = new SwaggerAPIClient(request);
      
      await apiClient.signupClient(
        testData.clientEmail,
        'Test Client',
        testData.clientPassword
      );
      
      await apiClient.signupEmployee(
        `orderemp${Date.now()}@example.com`,
        'Order Employee',
        'password123',
        'Manager',
        'Sales'
      );
      
      await apiClient.login('orderemp@example.com', 'password123', 'employee');
      
      const stock = await apiClient.addStock(
        'Order Test Product',
        1,
        99.99,
        100,
        'active'
      );
      
      testData.testStockCode = stock.code;
      
      await apiClient.login(testData.clientEmail, testData.clientPassword, 'client');
      await apiClient.addToCart(testData.testStockCode, 2);
      await apiClient.buyCart('MASTERCARD');
    });

    test.beforeEach(async ({ request }) => {
      apiClient = new SwaggerAPIClient(request);
      await apiClient.login(testData.clientEmail, testData.clientPassword, 'client');
    });

    test('GET /orders - Get all orders', async () => {
      const orders = await apiClient.getOrders();
      
      expect(Array.isArray(orders)).toBeTruthy();
      expect(orders.length).toBeGreaterThan(0);
      
      const order = orders[0];
      expect(order).toHaveProperty('id');
      expect(order).toHaveProperty('paymentMethod');
      expect(order).toHaveProperty('totalAmount');
      
      testData.orderId = order.id;
    });

    test('GET /orders/{orderId}/details - Get order details', async () => {
      const orders = await apiClient.getOrders();
      
      if (orders.length > 0) {
        const orderDetails = await apiClient.getOrderDetails(orders[0].id);
        
        expect(orderDetails).toBeTruthy();
        expect(orderDetails).toHaveProperty('order');
        expect(orderDetails).toHaveProperty('details');
      }
    });

    test('GET /orders/{orderId}/details - Non-existent order returns 404', async () => {
      const orderDetails = await apiClient.getOrderDetails(999999);
      
      expect(orderDetails).toBeNull();
    });
  });

  test.describe('End-to-End Scenarios', () => {
    test('Complete customer journey: Register -> Browse -> Add to Cart -> Checkout', async ({ request }) => {
      const apiClient = new SwaggerAPIClient(request);
      
      const email = `journey${Date.now()}@example.com`;
      const password = 'password123';
      
      await apiClient.signupClient(email, 'Journey Client', password);
      await apiClient.login(email, password, 'client');
      
      const stocks = await apiClient.getStocks();
      expect(stocks.length).toBeGreaterThanOrEqual(0);
      
      if (stocks.length > 0) {
        await apiClient.addToCart(stocks[0].code, 1);
        
        const order = await apiClient.buyCart('PAYPAL');
        expect(order).toBeTruthy();
        
        const orders = await apiClient.getOrders();
        expect(orders.length).toBeGreaterThan(0);
      }
    });

    test('Complete employee journey: Register -> Add Product -> Update Product -> Delete Product', async ({ request }) => {
      const apiClient = new SwaggerAPIClient(request);
      
      const email = `empjourney${Date.now()}@example.com`;
      const password = 'password123';
      
      await apiClient.signupEmployee(email, 'Journey Employee', password, 'Manager', 'Sales');
      await apiClient.login(email, password, 'employee');
      
      const product = await apiClient.addStock(
        'Journey Product',
        1,
        99.99,
        100,
        'active'
      );
      
      const updated = await apiClient.updateStock(
        product.code,
        'Updated Journey Product',
        2,
        149.99,
        50,
        'inactive'
      );
      
      expect(updated.description).toBe('Updated Journey Product');
      
      const deleted = await apiClient.deleteStock(product.code);
      expect(deleted).toBeTruthy();
    });
  });

  test.describe('Error Handling and Validation', () => {
    test('Unauthorized access to protected endpoints', async ({ request }) => {
      const apiClient = new SwaggerAPIClient(request);
      
      await expect(
        apiClient.getOrders()
      ).rejects.toThrow();
      
      await expect(
        apiClient.getShoppingCart()
      ).rejects.toThrow();
    });

    test('Validation errors in API requests', async ({ request }) => {
      const apiClient = new SwaggerAPIClient(request);
      
      await apiClient.signupClient(
        testData.clientEmail,
        'Test Client',
        testData.clientPassword
      );
      
      await expect(
        apiClient.login(testData.clientEmail, 'wrongpassword', 'client')
      ).rejects.toThrow();
    });

    test('Rate limiting behavior', async ({ request }) => {
      const apiClient = new SwaggerAPIClient(request);
      
      const promises = [];
      for (let i = 0; i < 20; i++) {
        promises.push(apiClient.getStocks());
      }
      
      const results = await Promise.allSettled(promises);
      
      const failed = results.filter(r => r.status === 'rejected');
      console.log(`Rate limit test: ${failed.length} requests failed out of ${promises.length}`);
    });
  });
});
