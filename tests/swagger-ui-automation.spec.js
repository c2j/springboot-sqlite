const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8080/ecommerce/api/v1';
const SWAGGER_URL = 'http://localhost:8080/ecommerce/api/v1/swagger-ui/index.html';

test.describe('Swagger UI Automation', () => {
  let page;
  let authToken;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    authToken = null;
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('Swagger UI page loads successfully', async () => {
    await page.goto(SWAGGER_URL);
    
    await expect(page).toHaveTitle(/Swagger UI/);
    
    const swaggerContainer = page.locator('#swagger-ui');
    await expect(swaggerContainer).toBeVisible();
  });

  test('Swagger UI displays all API controllers', async () => {
    await page.goto(SWAGGER_URL);
    
    await page.waitForSelector('.opblock', { timeout: 10000 });
    
    const controllers = await page.locator('.opblock-tag').allTextContents();
    console.log('Available controllers:', controllers);
    
    expect(controllers.length).toBeGreaterThan(0);
  });

  test('Swagger UI has Stock Controller endpoints', async () => {
    await page.goto(SWAGGER_URL);
    
    await page.waitForSelector('.opblock', { timeout: 10000 });
    
    const stockSection = page.locator('.opblock-tag').filter({ hasText: /stock/i });
    await expect(stockSection).toBeVisible();
    
    await stockSection.click();
    
    const methods = await page.locator('.opblock').all();
    expect(methods.length).toBeGreaterThan(0);
  });

  test('Swagger UI has User Controller endpoints', async () => {
    await page.goto(SWAGGER_URL);
    
    await page.waitForSelector('.opblock', { timeout: 10000 });
    
    const userSection = page.locator('.opblock-tag').filter({ hasText: /user/i });
    await expect(userSection).toBeVisible();
    
    await userSection.click();
    
    const loginEndpoint = page.locator('.opblock').filter({ hasText: /login/i });
    await expect(loginEndpoint).toBeVisible();
  });

  test('Swagger UI has Order Controller endpoints', async () => {
    await page.goto(SWAGGER_URL);
    
    await page.waitForSelector('.opblock', { timeout: 10000 });
    
    const orderSection = page.locator('.opblock-tag').filter({ hasText: /order/i });
    await expect(orderSection).toBeVisible();
    
    await orderSection.click();
    
    const methods = await page.locator('.opblock').all();
    expect(methods.length).toBeGreaterThan(0);
  });

  test('Swagger UI has Cart Controller endpoints', async () => {
    await page.goto(SWAGGER_URL);
    
    await page.waitForSelector('.opblock', { timeout: 10000 });
    
    const cartSection = page.locator('.opblock-tag').filter({ hasText: /cart/i });
    await expect(cartSection).toBeVisible();
    
    await cartSection.click();
    
    const methods = await page.locator('.opblock').all();
    expect(methods.length).toBeGreaterThan(0);
  });

  test('Try out GET /stocks endpoint from Swagger UI', async () => {
    await page.goto(SWAGGER_URL);
    
    await page.waitForSelector('.opblock', { timeout: 10000 });
    
    const stocksSection = page.locator('.opblock-tag').filter({ hasText: /stock/i });
    await stocksSection.click();
    
    const getStocks = page.locator('.opblock').filter({ hasText: /List products/i });
    await getStocks.click();
    
    const tryOutButton = page.locator('.try-out__btn');
    await tryOutButton.click();
    
    const executeButton = page.locator('.execute').filter({ hasText: /Execute/i });
    await executeButton.click();
    
    await page.waitForResponse(response => 
      response.url().includes('/stocks') && response.status() === 200
    );
    
    const responseBlock = page.locator('.responses-inner').first();
    await expect(responseBlock).toBeVisible();
  });

  test('Try out POST /users/login endpoint from Swagger UI', async () => {
    await page.goto(SWAGGER_URL);
    
    await page.waitForSelector('.opblock', { timeout: 10000 });
    
    const usersSection = page.locator('.opblock-tag').filter({ hasText: /user/i });
    await usersSection.click();
    
    const loginEndpoint = page.locator('.opblock').filter({ hasText: /Login user/i });
    await loginEndpoint.click();
    
    const tryOutButton = page.locator('.try-out__btn');
    await tryOutButton.click();
    
    await page.fill('input[placeholder="email"]', 'client@example.com');
    await page.fill('input[placeholder="password"]', 'password123');
    
    const executeButton = page.locator('.execute').filter({ hasText: /Execute/i });
    await executeButton.click();
    
    await page.waitForResponse(response => 
      response.url().includes('/login') && response.status() === 200
    );
    
    const responseBlock = page.locator('.responses-inner').first();
    await expect(responseBlock).toBeVisible();
  });

  test('Authorize with JWT token in Swagger UI', async () => {
    await page.goto(SWAGGER_URL);
    
    await page.waitForSelector('.opblock', { timeout: 10000 });
    
    const authorizeButton = page.locator('.auth-wrapper .btn authorize');
    await authorizeButton.click();
    
    const authModal = page.locator('.dialog-ux');
    await expect(authModal).toBeVisible();
    
    const tokenInput = page.locator('input[placeholder="Bearer {JWT}"]');
    await tokenInput.fill('Bearer eyJhbGciOiJIUzI1NiJ9.test');
    
    const authorizeModalButton = page.locator('.auth-btn-wrapper .btn-primary').filter({ hasText: /Authorize/i });
    await authorizeModalButton.click();
    
    const closeButton = page.locator('.btn-close').first();
    await closeButton.click();
    
    await expect(authModal).toBeHidden();
  });

  test('Download OpenAPI spec from Swagger UI', async () => {
    await page.goto(SWAGGER_URL);
    
    await page.waitForSelector('.opblock', { timeout: 10000 });
    
    const downloadPromise = page.waitForEvent('download');
    
    const linkTag = page.locator('link[rel="alternate"][type="application/json"]');
    if (await linkTag.count() > 0) {
      const specUrl = await linkTag.getAttribute('href');
      if (specUrl) {
        const specResponse = await page.request.get(specUrl);
        expect(specResponse.ok()).toBeTruthy();
        
        const specData = await specResponse.json();
        expect(specData).toHaveProperty('openapi');
        expect(specData).toHaveProperty('paths');
      }
    }
  });

  test('Search for specific endpoint in Swagger UI', async () => {
    await page.goto(SWAGGER_URL);
    
    await page.waitForSelector('.opblock', { timeout: 10000 });
    
    const searchInput = page.locator('input[placeholder^="Search"]');
    if (await searchInput.count() > 0) {
      await searchInput.fill('stocks');
      
      await page.waitForTimeout(1000);
      
      const visibleEndpoints = await page.locator('.opblock').all();
      expect(visibleEndpoints.length).toBeGreaterThan(0);
    }
  });

  test('View request body schema for POST /stocks', async () => {
    await page.goto(SWAGGER_URL);
    
    await page.waitForSelector('.opblock', { timeout: 10000 });
    
    const stocksSection = page.locator('.opblock-tag').filter({ hasText: /stock/i });
    await stocksSection.click();
    
    const addStock = page.locator('.opblock').filter({ hasText: /Add stock product/i });
    await addStock.click();
    
    await page.waitForSelector('.model-box', { timeout: 5000 });
    
    const schemaContainer = page.locator('.model-box').first();
    await expect(schemaContainer).toBeVisible();
    
    const schemaFields = await schemaContainer.allTextContents();
    console.log('Schema fields:', schemaFields);
  });
});

test.describe('Swagger UI Direct API Testing', () => {
  test.beforeAll(async () => {
  });

  test('GET /api-docs returns OpenAPI spec', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api-docs`);
    expect(response.ok()).toBeTruthy();
    
    const spec = await response.json();
    expect(spec).toHaveProperty('openapi');
    expect(spec).toHaveProperty('paths');
    expect(spec).toHaveProperty('info');
    expect(spec.info.title).toBe('Ecommerce Demo API');
  });

  test('OpenAPI spec has all required paths', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api-docs`);
    expect(response.ok()).toBeTruthy();
    
    const spec = await response.json();
    const paths = Object.keys(spec.paths);
    
    const expectedPaths = [
      '/stocks',
      '/stocks/{code}',
      '/users/login',
      '/users/clients/signup',
      '/users/employees/signup',
      '/carts',
      '/carts/{cartId}',
      '/carts/buy',
      '/orders',
      '/orders/{orderId}/details'
    ];
    
    for (const path of expectedPaths) {
      const found = paths.some(p => p === path);
      expect(found, `Path ${path} not found in spec`).toBeTruthy();
    }
  });

  test('OpenAPI spec has all HTTP methods', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api-docs`);
    expect(response.ok()).toBeTruthy();
    
    const spec = await response.json();
    
    expect(spec.paths['/stocks']).toHaveProperty('get');
    expect(spec.paths['/stocks']).toHaveProperty('post');
    expect(spec.paths['/stocks/{code}']).toHaveProperty('get');
    expect(spec.paths['/stocks/{code}']).toHaveProperty('put');
    expect(spec.paths['/stocks/{code}']).toHaveProperty('delete');
    expect(spec.paths['/users/login']).toHaveProperty('post');
    expect(spec.paths['/users/clients/signup']).toHaveProperty('post');
    expect(spec.paths['/users/employees/signup']).toHaveProperty('post');
    expect(spec.paths['/carts']).toHaveProperty('get');
    expect(spec.paths['/carts']).toHaveProperty('post');
    expect(spec.paths['/carts/{cartId}']).toHaveProperty('delete');
    expect(spec.paths['/carts/buy']).toHaveProperty('post');
    expect(spec.paths['/orders']).toHaveProperty('get');
    expect(spec.paths['/orders/{orderId}/details']).toHaveProperty('get');
  });

  test('OpenAPI spec has security schemes', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api-docs`);
    expect(response.ok()).toBeTruthy();
    
    const spec = await response.json();
    
    expect(spec).toHaveProperty('components');
    expect(spec.components).toHaveProperty('securitySchemes');
    expect(spec.components.securitySchemes).toHaveProperty('bearerAuth');
  });

  test('OpenAPI spec has all schemas', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api-docs`);
    expect(response.ok()).toBeTruthy();
    
    const spec = await response.json();
    
    expect(spec.components.schemas).toHaveProperty('StockResponseDTO');
    expect(spec.components.schemas).toHaveProperty('LoginRequestDTO');
    expect(spec.components.schemas).toHaveProperty('LoginResponseDTO');
    expect(spec.components.schemas).toHaveProperty('ClientSignupRequestDTO');
    expect(spec.components.schemas).toHaveProperty('EmployeeSignupRequestDTO');
    expect(spec.components.schemas).toHaveProperty('Order');
    expect(spec.components.schemas).toHaveProperty('ShoppingCart');
    expect(spec.components.schemas).toHaveProperty('ShoppingCartResultResponseDTO');
    expect(spec.components.schemas).toHaveProperty('OrderResultResponseDTO');
  });

  test('Verify OpenAPI spec version', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api-docs`);
    expect(response.ok()).toBeTruthy();
    
    const spec = await response.json();
    expect(spec.openapi).toBe('3.0.1');
    expect(spec.info.version).toBe('v1');
  });

  test('Verify server configuration in OpenAPI spec', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api-docs`);
    expect(response.ok()).toBeTruthy();
    
    const spec = await response.json();
    expect(spec.servers).toBeDefined();
    expect(spec.servers.length).toBeGreaterThan(0);
    expect(spec.servers[0].url).toBe(BASE_URL);
  });
});
