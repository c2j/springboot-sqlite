import { test, expect } from '@playwright/test';

test.describe('Swagger UI Interactive Tests', () => {
  test('should display API documentation correctly', async ({ page }) => {
    await page.goto('/swagger-ui/index.html');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveTitle('Swagger UI');
    await expect(page.locator('#swagger-ui')).toBeVisible();
  });

  test('should expand stock-controller endpoints', async ({ page }) => {
    await page.goto('/swagger-ui/index.html');
    await page.waitForLoadState('networkidle');
    
    await page.click('text=stock-controller');
    await page.waitForTimeout(500);
    
    await expect(page.locator('.opblock-tag-section')).toContainText('stock-controller');
  });

  test('should have Try it out functionality available', async ({ page }) => {
    await page.goto('/swagger-ui/index.html');
    await page.waitForLoadState('networkidle');
    
    await page.click('text=stock-controller');
    await page.waitForTimeout(500);
    
    const tryItOutButton = page.locator('.try-out-btn').first();
    await expect(tryItOutButton).toBeVisible();
  });

  test('should show response schemas', async ({ page }) => {
    await page.goto('/swagger-ui/index.html');
    await page.waitForLoadState('networkidle');
    
    await page.click('text=stock-controller');
    await page.waitForTimeout(500);
    
    await page.click('button:has-text("Model")');
    
    await expect(page.locator('.model-box')).toBeVisible();
  });
});

test.describe('Swagger UI Authentication', () => {
  test('should display authorize button', async ({ page }) => {
    await page.goto('/swagger-ui/index.html');
    await page.waitForLoadState('networkidle');
    
    const authorizeButton = page.locator('.authorize');
    await expect(authorizeButton).toBeVisible();
  });

  test('should open authorize modal', async ({ page }) => {
    await page.goto('/swagger-ui/index.html');
    await page.waitForLoadState('networkidle');
    
    await page.click('.authorize');
    await page.waitForSelector('.modal-container');
    
    await expect(page.locator('.modal-container')).toBeVisible();
  });
});

test.describe('Swagger UI Performance', () => {
  test('should load within reasonable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/swagger-ui/index.html');
    await page.waitForLoadState('networkidle');
    
    const endTime = Date.now();
    const loadTime = endTime - startTime;
    
    expect(loadTime).toBeLessThan(5000);
  });
});
