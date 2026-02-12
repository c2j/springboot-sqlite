import { test, expect } from '@playwright/test';

test.describe('Stock API Endpoints', () => {
  test('should get all stocks', async ({ request }) => {
    const response = await request.get('/stocks');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('should handle non-existent stock code', async ({ request }) => {
    const response = await request.get('/stocks/99999');
    expect(response.status()).toBe(404);
  });

  test('should get categories', async ({ request }) => {
    const response = await request.get('/lookup/categories');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
  });
});

test.describe('User Authentication', () => {
  const validUser = {
    email: 'employee@test.com',
    password: 'password123'
  };

  test('should fail with invalid credentials', async ({ request }) => {
    const invalidUser = {
      email: 'invalid@test.com',
      password: 'wrongpassword'
    };
    
    const response = await request.post('/users/login', {
      data: invalidUser
    });
    
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('should create new client signup', async ({ request }) => {
    const newUser = {
      name: 'Test Client',
      email: `client${Date.now()}@test.com`,
      password: 'password123'
    };
    
    const response = await request.post('/users/clients/signup', {
      data: newUser
    });
    
    expect([200, 201, 400]).toContain(response.status());
  });
});

test.describe('Cart API Endpoints', () => {
  test('should get empty carts list', async ({ request }) => {
    const response = await request.get('/carts');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
  });
});

test.describe('Order API Endpoints', () => {
  test('should get orders', async ({ request }) => {
    const response = await request.get('/orders');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
  });
});

test.describe('API Response Time', () => {
  test('should respond within acceptable time', async ({ request }) => {
    const startTime = Date.now();
    
    await request.get('/stocks');
    await request.get('/lookup/categories');
    await request.get('/orders');
    await request.get('/carts');
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    expect(duration).toBeLessThan(2000);
  });
});
