import { test, expect } from '@playwright/test';
import { EcommerceGuardian } from '../e2e-guardian';

test.describe('Ecommerce API Guardian', () => {
  let guardian;
  let clientEmail;
  let employeeEmail;

  test.beforeAll(async () => {
    guardian = new EcommerceGuardian();
    await guardian.init();
    const timestamp = Date.now();
    clientEmail = `client${timestamp}@example.com`;
    employeeEmail = `employee${timestamp}@example.com`;
  });

  test.afterAll(async () => {
    await guardian.close();
  });

  test('Server is running', async () => {
    await guardian.checkServerStatus();
  });

  test('Client signup', async () => {
    const client = await guardian.testClientSignup(clientEmail, 'Test Client', 'password123');
    expect(client.id).toBeDefined();
    expect(client.name).toBe('Test Client');
    expect(client.email).toBe(clientEmail);
  });

  test('Employee signup', async () => {
    const employee = await guardian.testEmployeeSignup(
      employeeEmail,
      'Test Employee',
      'password123',
      'Manager',
      'Sales'
    );
    expect(employee.id).toBeDefined();
    expect(employee.name).toBe('Test Employee');
    expect(employee.email).toBe(employeeEmail);
  });

  test('Client login', async () => {
    await guardian.testLogin(clientEmail, 'password123', 'client');
    expect(guardian.token).toBeDefined();
  });

  test('Employee login', async () => {
    await guardian.testLogin(employeeEmail, 'password123', 'employee');
    expect(guardian.token).toBeDefined();
  });

  test('Get stocks list', async () => {
    await guardian.login(clientEmail, 'password123', 'client');
    const stocks = await guardian.testGetStocks(null, 0, 10);
    expect(Array.isArray(stocks)).toBeTruthy();
  });

  test('Search stocks', async () => {
    await guardian.login(clientEmail, 'password123', 'client');
    const stocks = await guardian.testGetStocks('test', 0, 10);
    expect(Array.isArray(stocks)).toBeTruthy();
  });

  test('Add stock product', async () => {
    await guardian.login(employeeEmail, 'password123', 'employee');
    const stock = await guardian.testAddStock(
      'Guardian Test Product',
      1,
      99.99,
      50,
      'active'
    );
    expect(stock.code).toBeDefined();
    expect(stock.description).toBe('Guardian Test Product');
    expect(stock.price).toBe(99.99);
  });

  test('Update stock product', async () => {
    await guardian.login(employeeEmail, 'password123', 'employee');
    const stocks = await guardian.testGetStocks('Guardian Test Product', 0, 1);
    if (stocks.length > 0) {
      const updatedStock = await guardian.testUpdateStock(
        stocks[0].code,
        'Updated Guardian Test Product',
        2,
        149.99,
        30,
        'active'
      );
      expect(updatedStock.description).toBe('Updated Guardian Test Product');
      expect(updatedStock.price).toBe(149.99);
    }
  });

  test('Add product to cart', async () => {
    await guardian.login(clientEmail, 'password123', 'client');
    const stocks = await guardian.testGetStocks(null, 0, 1);
    if (stocks.length > 0) {
      const cartItem = await guardian.testAddToCart(stocks[0].code, 2);
      expect(cartItem.id).toBeDefined();
    }
  });

  test('Get shopping cart', async () => {
    await guardian.login(clientEmail, 'password123', 'client');
    const cart = await guardian.testGetShoppingCart();
    expect(cart).toBeDefined();
  });

  test('Buy cart', async () => {
    await guardian.login(clientEmail, 'password123', 'client');
    const order = await guardian.testBuyCart('CASH');
    expect(order.id).toBeDefined();
    expect(order.paymentMethod).toBe('CASH');
  });

  test('Get orders list', async () => {
    await guardian.login(clientEmail, 'password123', 'client');
    const orders = await guardian.testGetOrders();
    expect(Array.isArray(orders)).toBeTruthy();
  });

  test('Get order details', async () => {
    await guardian.login(clientEmail, 'password123', 'client');
    const orders = await guardian.testGetOrders();
    if (orders.length > 0) {
      const orderDetails = await guardian.testGetOrderDetails(orders[0].id);
      expect(orderDetails).toBeDefined();
    }
  });

  test('Delete stock product', async () => {
    await guardian.login(employeeEmail, 'password123', 'employee');
    const stocks = await guardian.testGetStocks('Guardian Test Product', 0, 10);
    if (stocks.length > 0) {
      await guardian.testDeleteStock(stocks[0].code);
    }
  });
});

test.describe('Ecommerce API Guardian - Full Suite', () => {
  test('Complete e2e workflow', async () => {
    const guardian = new EcommerceGuardian();
    await guardian.init();
    try {
      await guardian.runFullTestSuite();
    } finally {
      await guardian.close();
    }
  });
});
