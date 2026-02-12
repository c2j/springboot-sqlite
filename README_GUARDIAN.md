# Ecommerce Guardian - Playwright 监控脚本

这是一个用于守护 Spring Boot + SQLite Ecommerce Demo 项目功能的 Playwright Node.js 脚本。

## 项目结构

```
springboot-sqlite/
├── e2e-guardian.js              # 核心守护类
├── monitoring-daemon.js         # 持续监控守护进程
├── daemon-ctl.js                # 守护进程控制脚本
├── tests/
│   └── ecommerce-guardian.spec.js  # Playwright 测试套件
├── playwright.config.js         # Playwright 配置文件
├── package.json                 # Node.js 依赖配置
├── quick-start.sh              # Linux/Mac 快速启动脚本
├── quick-start.bat             # Windows 快速启动脚本
├── .env.example                 # 环境变量示例
└── README_GUARDIAN.md           # 本文档
```

## 功能特性

### 测试覆盖范围

- **用户认证**
  - 客户注册/登录
  - 员工注册/登录
  - JWT token 管理

- **产品库存**
  - 列出产品列表
  - 搜索产品
  - 获取产品详情
  - 添加产品
  - 更新产品
  - 删除产品

- **购物车**
  - 添加产品到购物车
  - 查看购物车
  - 从购物车删除产品
  - 结账购物车

- **订单管理**
  - 查看订单列表
  - 查看订单详情

## 快速开始

### 方式一：使用快速启动脚本

**Linux/Mac:**
```bash
./quick-start.sh
```

**Windows:**
```cmd
quick-start.bat
```

脚本会自动安装依赖并提供交互式菜单来选择要执行的操作。

### 方式二：手动安装

#### 1. 安装依赖

```bash
npm install
```

#### 2. 安装 Playwright 浏览器

```bash
npx playwright install
```

#### 3. 启动后端服务

```bash
mvn spring-boot:run
```

确保服务运行在 `http://localhost:8080/ecommerce/api/v1`

## 使用方法

### 运行完整测试套件

```bash
npm test
```

### 以 GUI 模式运行测试

```bash
npm run test:headed
```

### 以 UI 模式运行测试（推荐用于调试）

```bash
npm run test:ui
```

### 调试模式

```bash
npm run test:debug
```

### 查看测试报告

```bash
npm run report
```

### 直接运行守护脚本

```bash
node e2e-guardian.js
```

## 持续监控守护进程

### 启动守护进程

```bash
npm run daemon
```

或使用守护进程控制脚本:

```bash
node daemon-ctl.js start
```

### 查看监控状态

```bash
node daemon-ctl.js stats
```

### 生成监控报告

```bash
node daemon-ctl.js report
```

### 停止守护进程

按 `Ctrl+C` 或发送 `SIGTERM` 信号来停止守护进程。

### 环境变量配置

复制 `.env.example` 到 `.env` 并配置:

```bash
cp .env.example .env
```

可配置的环境变量:
- `API_BASE_URL` - API 基础 URL（默认: `http://localhost:8080/ecommerce/api/v1`）
- `SWAGGER_URL` - Swagger UI URL（默认: `http://localhost:8080/swagger-ui.html`）
- `CHECK_INTERVAL` - 检查间隔（毫秒，默认: `30000`）
- `LOG_FILE` - 日志文件路径（默认: `monitoring.log`）
- `ALERT_THRESHOLD` - 连续失败警告阈值（默认: `3`）

### 守护进程功能

1. **服务器健康检查**: 定期检查后端服务是否在线
2. **API 端点监控**: 监控关键 API 端点的可用性
3. **数据变化监控**: 追踪库存和订单数据的变化
4. **日志记录**: 所有监控活动都会被记录到日志文件
5. **警报机制**: 连续失败次数超过阈值时触发警报

### 监控日志

监控日志会保存在 `monitoring.log` 文件中，包含:
- 服务器健康状态
- API 端点响应状态
- 数据变化记录
- 错误和警报信息

## 配置

### API 基础路径

默认: `http://localhost:8080/ecommerce/api/v1`

可在 `e2e-guardian.js` 中修改:

```javascript
const BASE_URL = 'http://localhost:8080/ecommerce/api/v1';
const SWAGGER_URL = 'http://localhost:8080/swagger-ui.html';
```

### Playwright 配置

编辑 `playwright.config.js`:

```javascript
export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:8080/ecommerce/api/v1',
  },
  webServer: {
    command: 'mvn spring-boot:run',
    url: 'http://localhost:8080',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
```

## API 端点映射

| 功能 | 端点 | 方法 | 认证 |
|------|------|------|------|
| 客户登录 | `/users/login?role=client` | POST | 否 |
| 员工登录 | `/users/login?role=employee` | POST | 否 |
| 客户注册 | `/users/clients/signup` | POST | 否 |
| 员工注册 | `/users/employees/signup` | POST | 否 |
| 列出产品 | `/stocks` | GET | 否 |
| 产品详情 | `/stocks/{code}` | GET | 否 |
| 产品图片 | `/stocks/{code}/image` | GET | 否 |
| 添加产品 | `/stocks` | POST | 是 |
| 更新产品 | `/stocks/{code}` | PUT | 是 |
| 删除产品 | `/stocks/{code}` | DELETE | 是 |
| 购物车 | `/carts` | GET | 是 |
| 添加到购物车 | `/carts` | POST | 是 |
| 删除购物车项 | `/carts/{cartId}` | DELETE | 是 |
| 购买购物车 | `/carts/buy` | POST | 是 |
| 订单列表 | `/orders` | GET | 是 |
| 订单详情 | `/orders/{orderId}/details` | GET | 是 |

## 持续监控

### 使用 cron 定时运行

```bash
# 编辑 crontab
crontab -e

# 每小时运行一次
0 * * * * cd /path/to/springboot-sqlite && node e2e-guardian.js >> guardian.log 2>&1
```

### 使用 PM2 管理进程

```bash
# 安装 PM2
npm install -g pm2

# 启动守护进程
pm2 start e2e-guardian.js --name ecommerce-guardian

# 设置定时重启
pm2 restart ecommerce-guardian --cron "0 */1 * * *"

# 查看日志
pm2 logs ecommerce-guardian

# 停止
pm2 stop ecommerce-guardian

# 删除
pm2 delete ecommerce-guardian
```

## 自定义测试

### 创建自定义测试用例

```javascript
const { EcommerceGuardian } = require('./e2e-guardian');

async function customTest() {
  const guardian = new EcommerceGuardian();
  try {
    await guardian.init();
    
    // 执行登录
    await guardian.login('user@example.com', 'password');
    
    // 自定义测试逻辑
    const stocks = await guardian.testGetStocks(null, 0, 20);
    console.log(`Found ${stocks.length} stocks`);
    
  } finally {
    await guardian.close();
  }
}

customTest();
```

## 故障排除

### 问题: 连接被拒绝

**解决方案:** 确保后端服务正在运行

```bash
mvn spring-boot:run
```

### 问题: Playwright 浏览器未安装

**解决方案:** 安装 Playwright 浏览器

```bash
npx playwright install
```

### 问题: JWT 认证失败

**解决方案:** 检查用户是否已注册，密码是否正确

## 测试报告

测试运行后，HTML 报告会生成在:

```
playwright-report/index.html
```

运行以下命令查看:

```bash
npm run report
```

## 技术栈

- **Playwright**: 1.40.0+
- **Node.js**: 18+
- **Spring Boot**: 3.2.4
- **Java**: 17

## 许可证

MIT
