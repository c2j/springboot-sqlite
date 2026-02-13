const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

class EcommerceMonitoringDaemon {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || 'http://localhost:8080/ecommerce/api/v1';
    this.swaggerUrl = options.swaggerUrl || 'http://localhost:8080/swagger-ui.html';
    this.checkInterval = options.checkInterval || 60000;
    this.logFile = options.logFile || 'monitoring.log';
    this.alertThreshold = options.alertThreshold || 3;
    this.consecutiveFailures = 0;
    this.browser = null;
    this.context = null;
    this.page = null;
    this.token = null;
    this.isRunning = false;
    this.stocksCache = new Map();
    this.ordersCache = new Map();
  }

  async init() {
    this.browser = await chromium.launch({ headless: true });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
    this.log('Daemon initialized');
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.log('Daemon closed');
    }
  }

  log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}\n`;
    console.log(logMessage.trim());
    fs.appendFileSync(this.logFile, logMessage);
  }

  async login(email, password, role = 'client') {
    try {
      const response = await this.page.request.post(`${this.baseUrl}/users/login?role=${role}`, {
        headers: { 'Content-Type': 'application/json' },
        data: { email, password }
      });

      if (response.ok()) {
        const data = await response.json();
        this.token = data.token;
        this.log(`Login successful: ${email} (${role})`);
        return data;
      } else {
        this.log(`Login failed: ${email} (${role}) - ${response.status()}`, 'ERROR');
        return null;
      }
    } catch (error) {
      this.log(`Login error: ${error.message}`, 'ERROR');
      return null;
    }
  }

  async checkServerHealth() {
    try {
      const response = await this.page.request.get(this.swaggerUrl, {
        timeout: 5000
      });

      if (response.ok()) {
        this.log('Server health: OK');
        this.consecutiveFailures = 0;
        return true;
      } else {
        this.log(`Server health: FAILED (${response.status()})`, 'WARN');
        this.consecutiveFailures++;
        return false;
      }
    } catch (error) {
      this.log(`Server health: ${error.message}`, 'ERROR');
      this.consecutiveFailures++;
      return false;
    }
  }

  async checkAPIEndpoint(endpoint, method = 'GET', data = null, auth = false) {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (auth && this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }

      let response;
      switch (method) {
        case 'POST':
          response = await this.page.request.post(`${this.baseUrl}${endpoint}`, {
            headers,
            data
          });
          break;
        case 'PUT':
          response = await this.page.request.put(`${this.baseUrl}${endpoint}`, {
            headers,
            data
          });
          break;
        case 'DELETE':
          response = await this.page.request.delete(`${this.baseUrl}${endpoint}`, {
            headers
          });
          break;
        default:
          response = await this.page.request.get(`${this.baseUrl}${endpoint}`, {
            headers
          });
      }

      const status = response.ok() ? 'OK' : 'FAILED';
      const message = `API ${method} ${endpoint}: ${status} (${response.status()})`;
      
      if (response.ok()) {
        this.log(message);
        return await response.json();
      } else {
        this.log(message, 'WARN');
        return null;
      }
    } catch (error) {
      this.log(`API ${method} ${endpoint}: ${error.message}`, 'ERROR');
      return null;
    }
  }

  async monitorStocks() {
    const stocks = await this.checkAPIEndpoint('/stocks?page=0&size=100', 'GET');
    
    if (stocks) {
      const currentStockCount = stocks.length;
      const previousStockCount = this.stocksCache.get('total') || 0;

      if (currentStockCount !== previousStockCount) {
        this.log(`Stock count changed: ${previousStockCount} -> ${currentStockCount}`, 'INFO');
        this.stocksCache.set('total', currentStockCount);
      }

      stocks.forEach(stock => {
        const cacheKey = `stock_${stock.code}`;
        const previousStock = this.stocksCache.get(cacheKey);

        if (previousStock && previousStock.quantity !== stock.quantity) {
          this.log(`Stock quantity changed: ${stock.code} - ${stock.description}: ${previousStock.quantity} -> ${stock.quantity}`, 'INFO');
        }

        this.stocksCache.set(cacheKey, stock);
      });
    }
  }

  async monitorOrders() {
    if (!this.token) {
      return;
    }

    const orders = await this.checkAPIEndpoint('/orders', 'GET', null, true);
    
    if (orders) {
      const currentOrderCount = orders.length;
      const previousOrderCount = this.ordersCache.get('total') || 0;

      if (currentOrderCount !== previousOrderCount) {
        this.log(`Order count changed: ${previousOrderCount} -> ${currentOrderCount}`, 'INFO');
        this.ordersCache.set('total', currentOrderCount);
      }

      orders.forEach(order => {
        const cacheKey = `order_${order.id}`;
        if (!this.ordersCache.has(cacheKey)) {
          this.log(`New order created: ${order.id} - ${order.paymentMethod}`, 'INFO');
        }
        this.ordersCache.set(cacheKey, order);
      });
    }
  }

  async checkCriticalEndpoints() {
    const criticalEndpoints = [
      { endpoint: '/stocks', method: 'GET' },
      { endpoint: '/users/login?role=client', method: 'POST', data: { email: 'test@example.com', password: 'test' } },
    ];

    let allOk = true;
    for (const { endpoint, method, data } of criticalEndpoints) {
      const result = await this.checkAPIEndpoint(endpoint, method, data);
      if (!result) {
        allOk = false;
      }
    }

    return allOk;
  }

  async performHealthCheck() {
    this.log('--- Performing Health Check ---');

    const serverHealthy = await this.checkServerHealth();
    if (!serverHealthy) {
      this.log('Server is down!', 'CRITICAL');
      return false;
    }

    const endpointsHealthy = await this.checkCriticalEndpoints();
    if (!endpointsHealthy) {
      this.log('Critical endpoints are failing!', 'CRITICAL');
      return false;
    }

    await this.monitorStocks();
    await this.monitorOrders();

    this.log('--- Health Check Complete ---');
    return true;
  }

  async start() {
    if (this.isRunning) {
      this.log('Daemon is already running', 'WARN');
      return;
    }

    this.isRunning = true;
    this.log('Starting daemon...');

    try {
      await this.init();

      await this.login('client@example.com', 'password123', 'client');

      const runCheck = async () => {
        if (!this.isRunning) return;

        await this.performHealthCheck();

        if (this.consecutiveFailures >= this.alertThreshold) {
          this.log(`ALERT: ${this.consecutiveFailures} consecutive failures!`, 'CRITICAL');
        }

        if (this.isRunning) {
          setTimeout(runCheck, this.checkInterval);
        }
      };

      runCheck();

    } catch (error) {
      this.log(`Daemon startup error: ${error.message}`, 'ERROR');
      this.isRunning = false;
    }
  }

  stop() {
    this.log('Stopping daemon...');
    this.isRunning = false;
    this.close();
  }

  async getMonitoringStats() {
    return {
      isRunning: this.isRunning,
      consecutiveFailures: this.consecutiveFailures,
      totalStocks: this.stocksCache.get('total') || 0,
      totalOrders: this.ordersCache.get('total') || 0,
      uptime: process.uptime(),
    };
  }

  async generateReport() {
    const stats = await this.getMonitoringStats();
    const report = {
      timestamp: new Date().toISOString(),
      stats,
      stocksSnapshot: Array.from(this.stocksCache.entries()).filter(([key]) => key.startsWith('stock_')).map(([key, stock]) => ({
        code: stock.code,
        description: stock.description,
        quantity: stock.quantity,
        price: stock.price,
        status: stock.status
      })),
      ordersSnapshot: Array.from(this.ordersCache.entries()).filter(([key]) => key.startsWith('order_')).map(([key, order]) => ({
        id: order.id,
        paymentMethod: order.paymentMethod,
        totalAmount: order.totalAmount
      }))
    };

    const reportPath = path.join(__dirname, `monitoring-report-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    this.log(`Report generated: ${reportPath}`);

    return report;
  }
}

module.exports = { EcommerceMonitoringDaemon };

if (require.main === module) {
  const daemon = new EcommerceMonitoringDaemon({
    checkInterval: 30000,
    logFile: 'monitoring.log',
    alertThreshold: 3
  });

  daemon.start();

  process.on('SIGINT', () => {
    daemon.stop();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    daemon.stop();
    process.exit(0);
  });
}
