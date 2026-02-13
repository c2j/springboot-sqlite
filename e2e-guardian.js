const { chromium } = require('playwright');
const { expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8080/ecommerce/api/v1';
const SWAGGER_URL = 'http://localhost:8080/swagger-ui.html';

class EcommerceGuardian {
  constructor() {
    this.token = null;
    this.browser = null;
    this.context = null;
    this.page = null;
  }

  async init() {
    this.browser = await chromium.launch({ headless: false });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
  }

  async close() {
    await this.browser.close();
  }

  async login(email, password, role = 'client') {
    const response = await this.page.request.post(`${BASE_URL}/users/login?role=${role}`, {
      headers: { 'Content-Type': 'application/json' },
      data: { email, password }
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    this.token = data.token;
    return data;
  }

  get authHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
  }

  async checkServerStatus() {
    console.log('✓ Checking server status...');
    const response = await this.page.request.get(SWAGGER_URL);
    expect(response.ok()).toBeTruthy();
    console.log('  Server is running');
  }

  async testClientSignup(email, name, password) {
    console.log('✓ Testing client signup...');
    const response = await this.page.request.post(`${BASE_URL}/users/clients/signup`, {
      headers: { 'Content-Type': 'application/json' },
      data: { email, name, password }
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    console.log(`  Client registered: ${data.id} - ${data.name}`);
    return data;
  }

  async testEmployeeSignup(email, name, password, position, department) {
    console.log('✓ Testing employee signup...');
    const response = await this.page.request.post(`${BASE_URL}/users/employees/signup`, {
      headers: { 'Content-Type': 'application/json' },
      data: { email, name, password, position, department }
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    console.log(`  Employee registered: ${data.id} - ${data.name}`);
    return data;
  }

  async testLogin(email, password, role = 'client') {
    console.log(`✓ Testing ${role} login...`);
    const data = await this.login(email, password, role);
    console.log(`  Login successful for ${role}: ${data.userId}`);
    return data;
  }

  async testGetStocks(searchPhrase = null, page = 0, size = 10) {
    console.log('✓ Testing get stocks...');
    let url = `${BASE_URL}/stocks?page=${page}&size=${size}`;
    if (searchPhrase) {
      url += `&searchPhrase=${searchPhrase}`;
    }
    const response = await this.page.request.get(url);
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    console.log(`  Retrieved ${data.length} stocks`);
    return data;
  }

  async testGetStockByCode(code) {
    console.log(`✓ Testing get stock by code ${code}...`);
    const response = await this.page.request.get(`${BASE_URL}/stocks/${code}`);
    if (response.ok()) {
      const data = await response.json();
      console.log(`  Stock found: ${data.description}`);
      return data;
    } else {
      console.log(`  Stock not found: ${code}`);
      return null;
    }
  }

  async testAddStock(description, category, price, quantity, status, imageFile = null) {
    console.log('✓ Testing add stock...');
    let formData = {
      description: description,
      category: category.toString(),
      price: price.toString(),
      quantity: quantity.toString(),
      status: status
    };

    if (imageFile) {
      const formDataObj = new FormData();
      formDataObj.append('description', description);
      formDataObj.append('category', category.toString());
      formDataObj.append('price', price.toString());
      formDataObj.append('quantity', quantity.toString());
      formDataObj.append('status', status);
      formDataObj.append('image', imageFile);
      formData = formDataObj;
    }

    const response = await this.page.request.post(`${BASE_URL}/stocks`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      },
      multipart: formData
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    console.log(`  Stock added: code=${data.code}, ${data.description}`);
    return data;
  }

  async testUpdateStock(code, description, category, price, quantity, status, imageFile = null) {
    console.log(`✓ Testing update stock ${code}...`);
    let formData = {
      description: description,
      category: category.toString(),
      price: price.toString(),
      quantity: quantity.toString(),
      status: status
    };

    if (imageFile) {
      const formDataObj = new FormData();
      formDataObj.append('description', description);
      formDataObj.append('category', category.toString());
      formDataObj.append('price', price.toString());
      formDataObj.append('quantity', quantity.toString());
      formDataObj.append('status', status);
      formDataObj.append('image', imageFile);
      formData = formDataObj;
    }

    const response = await this.page.request.put(`${BASE_URL}/stocks/${code}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      },
      multipart: formData
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    console.log(`  Stock updated: code=${data.code}, ${data.description}`);
    return data;
  }

  async testDeleteStock(code) {
    console.log(`✓ Testing delete stock ${code}...`);
    const response = await this.page.request.delete(`${BASE_URL}/stocks/${code}`, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    expect(response.ok()).toBeTruthy();
    console.log(`  Stock deleted: ${code}`);
  }

  async testAddToCart(productCode, quantity) {
    console.log(`✓ Testing add to cart (product ${code}, qty ${quantity})...`);
    const response = await this.page.request.post(`${BASE_URL}/carts?productCode=${productCode}&quantity=${quantity}`, {
      headers: this.authHeaders
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    console.log(`  Added to cart: cartId=${data.id}`);
    return data;
  }

  async testGetShoppingCart() {
    console.log('✓ Testing get shopping cart...');
    const response = await this.page.request.get(`${BASE_URL}/carts`, {
      headers: this.authHeaders
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    console.log(`  Cart has ${data.items?.length || 0} items`);
    return data;
  }

  async testDeleteFromCart(cartId) {
    console.log(`✓ Testing delete from cart (cartId ${cartId})...`);
    const response = await this.page.request.delete(`${BASE_URL}/carts/${cartId}`, {
      headers: this.authHeaders
    });
    expect(response.ok()).toBeTruthy();
    console.log(`  Removed from cart: ${cartId}`);
  }

  async testBuyCart(paymentMethod = 'CASH') {
    console.log(`✓ Testing buy cart (${paymentMethod})...`);
    const response = await this.page.request.post(`${BASE_URL}/carts/buy?payment_method=${paymentMethod}`, {
      headers: this.authHeaders
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    console.log(`  Order created: orderId=${data.id}`);
    return data;
  }

  async testGetOrders() {
    console.log('✓ Testing get orders...');
    const response = await this.page.request.get(`${BASE_URL}/orders`, {
      headers: this.authHeaders
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    console.log(`  Found ${data.length} orders`);
    return data;
  }

  async testGetOrderDetails(orderId) {
    console.log(`✓ Testing get order details (orderId ${orderId})...`);
    const response = await this.page.request.get(`${BASE_URL}/orders/${orderId}/details`, {
      headers: this.authHeaders
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    console.log(`  Order details retrieved for order ${orderId}`);
    return data;
  }

  async runFullTestSuite() {
    try {
      console.log('\n=== Starting E-commerce Guardian Test Suite ===\n');

      await this.checkServerStatus();

      const timestamp = Date.now();
      const clientEmail = `testclient${timestamp}@example.com`;
      const employeeEmail = `testemployee${timestamp}@example.com`;

      const client = await this.testClientSignup(clientEmail, 'Test Client', 'password123');
      const employee = await this.testEmployeeSignup(employeeEmail, 'Test Employee', 'password123', 'Manager', 'Sales');

      await this.testLogin(clientEmail, 'password123', 'client');
      await this.testLogin(employeeEmail, 'password123', 'employee');

      const stocks = await this.testGetStocks(null, 0, 5);
      if (stocks.length > 0) {
        const firstStockCode = stocks[0].code;
        await this.testGetStockByCode(firstStockCode);
      }

      await this.testAddStock('Test Product', 1, 29.99, 100, 'active');

      const testStocks = await this.testGetStocks('Test Product', 0, 10);
      if (testStocks.length > 0) {
        const testStockCode = testStocks[0].code;

        await this.testUpdateStock(testStockCode, 'Updated Test Product', 2, 39.99, 50, 'active');

        await this.testAddToCart(testStockCode, 2);
        await this.testGetShoppingCart();

        await this.testBuyCart('CASH');
        await this.testGetOrders();

        const orders = await this.testGetOrders();
        if (orders.length > 0) {
          await this.testGetOrderDetails(orders[0].id);
        }

        await this.testDeleteStock(testStockCode);
      }

      console.log('\n=== All Tests Passed ✓ ===\n');

    } catch (error) {
      console.error('\n✗ Test failed:', error.message);
      console.error(error);
      throw error;
    }
  }
}

async function main() {
  const guardian = new EcommerceGuardian();
  try {
    await guardian.init();
    await guardian.runFullTestSuite();
  } finally {
    await guardian.close();
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { EcommerceGuardian };
