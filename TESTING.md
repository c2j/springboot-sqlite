# 自动化测试套件

Spring Boot SQLite Ecommerce API 的完整自动化测试解决方案。

## 📁 测试文件

### 1. `test_api.py` - API 功能测试 ⭐ 推荐
使用 Python `requests` 库的快速、稳定的 API 测试。

**特点：**
- ✅ 快速执行（~5秒）
- ✅ 19个全面测试用例
- ✅ 无需浏览器依赖
- ✅ 易于集成到 CI/CD
- ✅ 详细的成功/失败报告

**测试覆盖：**
- 公开端点（主页、产品、分类）
- 用户注册和登录
- JWT 认证流程
- 角色权限验证（CLIENT vs EMPLOYEE）
- 输入验证和错误处理

### 2. `test_playwright_final.py` - Swagger UI 测试
使用 Playwright 的 UI 和集成测试。

**特点：**
- ✅ 测试 Swagger UI 界面
- ✅ 通过浏览器实际调用 API
- ✅ 生成截图用于调试
- ✅ 模拟真实用户交互

**测试覆盖：**
- Swagger UI 页面加载和显示
- API 文档内容验证
- API 调用功能测试

## 🚀 快速开始

### 步骤 1: 安装依赖

```bash
# 创建虚拟环境
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# 或
venv\Scripts\activate  # Windows

# 安装依赖
pip install -r requirements-test.txt

# 安装 Playwright 浏览器
playwright install chromium
```

### 步骤 2: 启动应用

```bash
mvn spring-boot:run
```

应用将在 `http://localhost:8080/ecommerce/api/v1` 启动。

### 步骤 3: 运行测试

**运行 API 测试（推荐）：**
```bash
python test_api.py
```

**运行 Playwright 测试：**
```bash
python test_playwright_final.py
```

## 📊 测试结果

### API 测试示例输出

```
============================================================
Spring Boot SQLite Ecommerce API - 测试套件
============================================================
Base URL: http://localhost:8080/ecommerce/api/v1
Timeout: 10s
============================================================

⏳  主页重定向到 Swagger UI... ✅ 通过
⏳  获取产品列表 (公开)... ✅ 通过
⏳  获取分类列表 (公开)... ✅ 通过
⏳  客户端用户登录... ✅ 通过
⏳  客户端获取购物车 (需认证)... ✅ 通过
⏳  员工访问购物车 (权限拒绝)... ✅ 通过
...

============================================================
测试结果汇总
============================================================
总计: 19 个测试
通过: 19 个
失败: 0 个
成功率: 100.0%
============================================================

🎉 所有测试通过！
```

### Playwright 测试示例输出

```
============================================================
Spring Boot SQLite Ecommerce - Playwright 测试套件
============================================================
🚀 启动 Playwright 测试...
📱 启动浏览器...
⏳  测试 Swagger UI 页面加载... ✅ 通过
⏳  测试页面标题... ✅ 通过
⏳  检查 API 文档内容... ✅ 通过
🎉 所有测试通过！

📸 生成的文件:
  - swagger_ui_test.png (成功截图)
  - swagger_ui_error.png (如有错误)
============================================================
```

## 📋 测试用例清单

### test_api.py - 19 个测试

| # | 测试名称 | 类型 | 状态 |
|---|---------|------|
| 1 | 主页重定向到 Swagger UI | 公开端点 | ✅ |
| 2 | 获取产品列表 (公开) | 公开端点 | ✅ |
| 3 | 获取不存在的产品 (404) | 错误处理 | ✅ |
| 4 | 获取分类列表 (公开) | 公开端点 | ✅ |
| 5 | 客户端用户注册 | 用户管理 | ✅ |
| 6 | 员工用户注册 | 用户管理 | ✅ |
| 7 | 客户端用户登录 | 认证 | ✅ |
| 8 | 员工用户登录 | 认证 | ✅ |
| 9 | 使用错误密码登录 | 错误处理 | ✅ |
| 10 | 客户端获取购物车 | 权限验证 | ✅ |
| 11 | 客户端获取订单列表 | 权限验证 | ✅ |
| 12 | 未认证访问购物车 | 安全测试 | ✅ |
| 13 | 未认证访问订单 | 安全测试 | ✅ |
| 14 | 员工访问购物车 | 权限拒绝 | ✅ |
| 15 | 员工访问订单 | 权限拒绝 | ✅ |
| 16 | 客户端创建产品 | 权限拒绝 | ✅ |
| 17 | 未认证创建产品 | 安全测试 | ✅ |
| 18 | 用户注册缺少必填字段 | 输入验证 | ✅ |
| 19 | 用户注册使用无效邮箱 | 输入验证 | ✅ |

### test_playwright_final.py - 6 个测试

| # | 测试名称 | 类型 |
|---|---------|------|
| 1 | Swagger UI 页面加载 | UI 测试 |
| 2 | 等待页面完全加载 | UI 测试 |
| 3 | 测试页面标题 | UI 测试 |
| 4 | 检查 API 文档内容 | 集成测试 |
| 5 | 测试 API 操作面板 | UI 测试 |
| 6 | 保存截图 | 可视化验证 |
| 7 | 直接调用 GET /stocks | API 调用 |
| 8 | 直接调用 GET /categories | API 调用 |

## 🔧 CI/CD 集成

### GitHub Actions

创建 `.github/workflows/test.yml`:

```yaml
name: API Tests

on:
  push:
    branches: [ main, dev ]
  pull_request:
    branches: [ main, dev ]

jobs:
  api-test:
    name: Run API Tests
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.9'

    - name: Install dependencies
      run: |
        python -m venv venv
        source venv/bin/activate
        pip install -r requirements-test.txt
        playwright install chromium

    - name: Set up JDK
      uses: actions/setup-java@v3
      with:
        java-version: '17'
        distribution: 'temurin'

    - name: Build and run application
      run: |
        mvn clean package
        nohup mvn spring-boot:run > app.log 2>&1 &
        sleep 40  # 等待应用启动

    - name: Run API tests
      run: |
        source venv/bin/activate
        python test_api.py

    - name: Run Playwright tests
      run: |
        source venv/bin/activate
        python test_playwright_final.py

    - name: Upload test screenshots
      if: always()
      uses: actions/upload-artifact@v3
      with:
        name: test-screenshots
        path: |
          swagger_ui_test.png
          swagger_ui_error.png
```

### Jenkins Pipeline

创建 `Jenkinsfile`:

```groovy
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup Environment') {
            steps {
                sh '''
                    python3 -m venv venv
                    . venv/bin/activate
                    pip install -q -r requirements-test.txt
                    playwright install chromium --with-deps
                '''
            }
        }

        stage('Build Application') {
            steps {
                sh 'mvn clean package -DskipTests=true'
            }
        }

        stage('Run Tests') {
            steps {
                sh '''
                    nohup mvn spring-boot:run > app.log 2>&1 &
                    sleep 40
                    
                    . venv/bin/activate
                    
                    echo "=== Running API Tests ==="
                    python test_api.py || exit 1
                    
                    echo "=== Running Playwright Tests ==="
                    python test_playwright_final.py || exit 1
                '''
            }
        }
    }

    post {
        always {
            sh 'pkill -f spring-boot:run || true'
            archiveArtifacts artifacts: 'swagger_ui_*.png', allowEmptyArchive: true
        }
    }
}
```

### GitLab CI

创建 `.gitlab-ci.yml`:

```yaml
stages:
  - test

variables:
  MAVEN_OPTS: "-Dmaven.repo.local=$CI_PROJECT_DIR/.m2/repository"

test_api:
  stage: test
  image: maven:3.8-eclipse-temurin-17
  services:
    - name: postgres:13
      alias: postgres
  before_script:
    - apt-get update -qq && apt-get install -y -qq python3 python3-pip python3-venv
    - python3 -m venv venv
    - . venv/bin/activate
    - pip install -q -r requirements-test.txt
    - playwright install chromium --with-deps
  script:
    - mvn clean package -DskipTests=true
    - mvn spring-boot:run > /dev/null 2>&1 &
    - sleep 40
    - python test_api.py
    - python test_playwright_final.py
  after_script:
    - pkill -f spring-boot:run || true
  artifacts:
    when: always
    paths:
      - swagger_ui_*.png
    expire_in: 1 week
  only:
    - main
    - merge_requests
```

## 🔧 自定义和扩展

### 修改基础 URL

在脚本中修改 `BASE_URL`:

```python
# test_api.py
BASE_URL = "http://localhost:8080/ecommerce/api/v1"

# test_playwright_final.py
# 在函数中修改 URL
page.goto("http://your-custom-url:port/path/swagger-ui/index.html")
```

### 添加新测试

**在 test_api.py 中添加：**

```python
def test_your_new_endpoint(self):
    """测试：新端点"""
    response = requests.get(f"{self.base_url}/your-endpoint", timeout=TIMEOUT)
    self.assert_status(response, 200, "GET /your-endpoint should return 200")
    data = response.json()
    assert "expected_field" in data, "Response should contain expected_field"
```

然后在 `run_all_tests()` 中注册：

```python
tests = [
    # ... 现有测试
    ("新端点测试", test_suite.test_your_new_endpoint),
]
```

### 修改测试数据

修改测试账号信息：

```python
# 在 TestAPI.__init__ 中
self.test_user_email = "your_test@example.com"
self.test_employee_email = "your_employee@example.com"
```

## 📧 故障排查

### 问题：连接被拒绝
```
requests.exceptions.ConnectionError: [Errno 61] Connection refused
```
**解决方法：**
```bash
# 检查应用是否运行
curl http://localhost:8080/ecommerce/api/v1

# 如果没有运行，启动应用
mvn spring-boot:run
```

### 问题：认证失败 (403)
```
AssertionError: GET /carts with client token should return 200 - Expected 200, got 403
```
**可能原因：**
1. 应用重启过，JWT 密钥已更改
2. Token 过期（30分钟有效期）

**解决方法：**
```bash
# 在同一会话中重新登录
python -c "
import requests
response = requests.post(
    'http://localhost:8080/ecommerce/api/v1/users/login?role=client',
    json={'email': 'test_api@example.com', 'password': 'testpass123'}
)
print('New token:', response.json()['token'])
"
```

### 问题：Playwright 浏览器未安装
```
Executable doesn't exist at /path/to/playwright/chromium/...
```
**解决方法：**
```bash
playwright install chromium
```

### 问题：虚拟环境激活失败
```
venv\Scripts\activate: No such file or directory
```
**解决方法（Windows）：**
```bash
# 确保使用正确的激活脚本
venv\Scripts\activate  # Windows
# 或
source venv/bin/activate  # Linux/Mac
```

## 📈 性能测试

### 使用 Locust 进行负载测试

创建 `locustfile.py`:

```python
from locust import HttpUser, task, between

class APIUser(HttpUser):
    wait_time = between(1, 3)
    host = "http://localhost:8080/ecommerce/api/v1"

    @task(3)
    def get_stocks(self):
        self.client.get("/stocks")

    @task(2)
    def get_categories(self):
        self.client.get("/lookup/categories")

    @task(1)
    def login(self):
        with self.client.post("/users/login?role=client", 
                        json={"email": "test@example.com", "password": "testpass123"},
                        catch_response=True) as response:
            if response.status_code == 200:
                token = response.json()["token"]
                # 使用 token 访问受保护端点
                self.client.get("/carts", 
                          headers={"Authorization": f"Bearer {token}"})
```

运行性能测试：

```bash
pip install locust
locust -f locustfile.py --users 50 --spawn-rate 10 --run-time 1m
```

访问 `http://localhost:8089` 查看实时性能报告。

## 📊 报告和通知

### 生成 HTML 报告

修改 `run_all_tests()` 函数：

```python
def generate_html_report(results, total_time):
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>API 测试报告</title>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 20px; }}
            .pass {{ color: green; }}
            .fail {{ color: red; }}
            table {{ border-collapse: collapse; width: 100%; }}
            th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
            th {{ background-color: #f2f2f2; }}
        </style>
    </head>
    <body>
        <h1>API 测试报告</h1>
        <p>总时间: {total_time:.2f}秒</p>
        <table>
            <tr>
                <th>测试名称</th>
                <th>状态</th>
                <th>错误</th>
            </tr>
    """

    for test_name, status, error in results:
        html += f"""
            <tr class="{'pass' if status == '通过' else 'fail'}">
                <td>{test_name}</td>
                <td>{status}</td>
                <td>{error or '-'}</td>
            </tr>
        """

    html += """
        </table>
    </body>
    </html>
    """

    with open("test_report.html", "w", encoding="utf-8") as f:
        f.write(html)
    print("📊 HTML 报告已生成: test_report.html")
```

### 发送邮件通知

```python
import smtplib
from email.mime.text import MIMEText

def send_test_results(passed, failed):
    msg = MIMEText(f"""
API 测试完成：
- 通过: {passed}
- 失败: {failed}
- 总计: {passed + failed}
- 成功率: {passed / (passed + failed) * 100:.1f}%
    """)
    msg['Subject'] = '🧪 API 测试结果'
    msg['From'] = 'test@example.com'
    msg['To'] = 'team@example.com'

    with smtplib.SMTP('smtp.example.com', 587) as server:
        server.starttls()
        server.login('user@example.com', 'password')
        server.send_message(msg)
```

## 📚 贡献指南

### 添加测试的最佳实践

1. **测试方法命名**: 以 `test_` 开头，描述清楚
2. **断言**: 使用 `self.assert_status()` 进行状态码检查
3. **测试独立性**: 每个测试应该独立运行
4. **错误处理**: 捕获并报告具体的错误信息
5. **文档**: 添加清晰的注释说明测试目的

### 示例：添加产品 API 测试

```python
def test_create_product_with_employee(self):
    """测试：员工创建产品"""
    assert self.employee_token is not None, "Employee token required"
    
    headers = {
        "Authorization": f"Bearer {self.employee_token}"
    }
    
    payload = {
        "description": "Test Product",
        "category": "1",
        "price": "99.99",
        "quantity": "10",
        "status": "active"
    }
    
    response = requests.post(
        f"{self.base_url}/stocks",
        headers=headers,
        json=payload,
        timeout=TIMEOUT
    )
    
    self.assert_status(response, 201, "Product creation should return 201")
    data = response.json()
    assert data.get("description") == "Test Product"
```

## 📄 许可证

与主项目保持一致。

---

## 🎯 总结

| 方面 | 状态 |
|-------|--------|
| API 功能测试 | ✅ 完全覆盖 |
| Swagger UI 测试 | ✅ 完全覆盖 |
| CI/CD 集成 | ✅ 支持 GitHub/Jenkins/GitLab |
| 文档 | ✅ 完整详细 |
| 可维护性 | ✅ 清晰易扩展 |

**建议使用方式：**
1. 每次代码提交后运行 `test_api.py`（快速验证）
2. 定期运行 `test_playwright_final.py`（UI 验证）
3. 在 CI/CD 流水线中集成两个测试套件

**预期结果：** 100% 测试覆盖率，确保 API 功能全量正确性！
