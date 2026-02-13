import { test, expect } from '@playwright/test';

test.describe('API Health Check', () => {
  test('should check Swagger UI accessibility', async ({ page }) => {
    const response = await page.goto('/swagger-ui/index.html');
    expect(response?.status()).toBe(200);
    
    await expect(page).toHaveTitle('Swagger UI');
    
    const swaggerElement = page.locator('#swagger-ui');
    await expect(swaggerElement).toBeVisible();
  });

  test('should check API documentation', async ({ request }) => {
    const response = await request.get('/api-docs');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.openapi).toBeDefined();
    expect(data.paths).toBeDefined();
    expect(Object.keys(data.paths).length).toBeGreaterThan(0);
  });

  test('should verify all endpoints are documented', async ({ request }) => {
    const response = await request.get('/api-docs');
    const data = await response.json();
    
    const expectedEndpoints = [
      '/stocks/{code}',
      '/users/login',
      '/users/employees/signup',
      '/users/clients/signup',
      '/stocks',
      '/carts',
      '/carts/buy',
      '/stocks/{code}/image',
      '/orders',
      '/orders/{orderId}/details',
      '/lookup/categories',
      '/carts/{cartId}'
    ];
    
    const documentedPaths = Object.keys(data.paths);
    for (const endpoint of expectedEndpoints) {
      expect(documentedPaths).toContain(endpoint);
    }
  });
});
