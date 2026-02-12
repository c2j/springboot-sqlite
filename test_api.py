"""
Spring Boot SQLite Ecommerce API 测试套件
使用 Playwright 进行 API 功能测试
"""

import pytest
import requests
import json
from typing import Dict, Optional

# 基础配置
BASE_URL = "http://localhost:8080/ecommerce/api/v1"
TIMEOUT = 10


class TestAPI:
    """API 端点测试套件"""

    def __init__(self):
        self.base_url = BASE_URL
        self.client_token: Optional[str] = None
        self.employee_token: Optional[str] = None
        self.test_user_email = "test_api@example.com"
        self.test_employee_email = "test_employee_api@example.com"

    @staticmethod
    def assert_status(
        response: requests.Response, expected_status: int, message: str = ""
    ):
        """辅助函数：断言状态码"""
        assert response.status_code == expected_status, (
            f"{message} - Expected {expected_status}, got {response.status_code}. Response: {response.text}"
        )

    def test_home_page_redirects_to_swagger(self):
        """测试：主页重定向到 Swagger UI"""
        response = requests.get(
            f"{self.base_url}/", allow_redirects=False, timeout=TIMEOUT
        )
        self.assert_status(response, 302, "Home page should redirect")
        assert "/swagger-ui" in response.headers.get("Location", ""), (
            "Should redirect to Swagger UI"
        )

    def test_get_stocks_public(self):
        """测试：获取产品列表（公开端点）"""
        response = requests.get(f"{self.base_url}/stocks", timeout=TIMEOUT)
        self.assert_status(response, 200, "GET /stocks should return 200")
        data = response.json()
        assert isinstance(data, list), "Response should be a list"

    def test_get_stock_by_code_not_found(self):
        """测试：获取不存在的产品返回404"""
        response = requests.get(f"{self.base_url}/stocks/99999", timeout=TIMEOUT)
        self.assert_status(response, 404, "GET /stocks/99999 should return 404")

    def test_get_categories_public(self):
        """测试：获取分类列表（公开端点）"""
        response = requests.get(f"{self.base_url}/lookup/categories", timeout=TIMEOUT)
        self.assert_status(response, 200, "GET /lookup/categories should return 200")
        data = response.json()
        assert isinstance(data, list), "Response should be a list"
        assert len(data) == 10, "Should return 10 categories"
        assert data[0].get("id") == 1, "First category should have id 1"

    def test_client_signup(self):
        """测试：客户端用户注册"""
        payload = {
            "name": "Test",
            "surnames": "API",
            "direction": "123 Test St",
            "state": "California",
            "postal_code": "90210",
            "phone": "1234567890",
            "email": self.test_user_email,
            "password": "testpass123",
        }
        response = requests.post(
            f"{self.base_url}/users/clients/signup", json=payload, timeout=TIMEOUT
        )
        # 可能是201（新建）或409（已存在）
        assert response.status_code in [201, 409], (
            f"Client signup should return 201 or 409, got {response.status_code}"
        )

        if response.status_code == 201:
            data = response.json()
            assert "id" in data, "Response should contain id"
            assert data.get("email") == self.test_user_email, "Email should match"

    def test_employee_signup(self):
        """测试：员工用户注册"""
        payload = {
            "name": "Test",
            "surnames": "Employee",
            "email": self.test_employee_email,
            "password": "testpass123",
        }
        response = requests.post(
            f"{self.base_url}/users/employees/signup", json=payload, timeout=TIMEOUT
        )
        # 可能是201（新建）或409（已存在）
        assert response.status_code in [201, 409], (
            f"Employee signup should return 201 or 409, got {response.status_code}"
        )

        if response.status_code == 201:
            data = response.json()
            assert "id" in data, "Response should contain id"
            assert data.get("email") == self.test_employee_email, "Email should match"

    def test_client_login(self):
        """测试：客户端用户登录"""
        payload = {"email": self.test_user_email, "password": "testpass123"}
        response = requests.post(
            f"{self.base_url}/users/login?role=client", json=payload, timeout=TIMEOUT
        )
        self.assert_status(response, 200, "Client login should return 200")
        data = response.json()
        assert "token" in data, "Response should contain token"
        assert data.get("type") == "Bearer", "Token type should be Bearer"
        self.client_token = data.get("token")
        assert self.client_token is not None, "Client token should be set"

    def test_employee_login(self):
        """测试：员工用户登录"""
        payload = {"email": self.test_employee_email, "password": "testpass123"}
        response = requests.post(
            f"{self.base_url}/users/login?role=employee", json=payload, timeout=TIMEOUT
        )
        self.assert_status(response, 200, "Employee login should return 200")
        data = response.json()
        assert "token" in data, "Response should contain token"
        assert data.get("type") == "Bearer", "Token type should be Bearer"
        self.employee_token = data.get("token")
        assert self.employee_token is not None, "Employee token should be set"

    def test_login_with_wrong_password(self):
        """测试：使用错误密码登录应失败"""
        payload = {"email": self.test_user_email, "password": "wrongpassword"}
        response = requests.post(
            f"{self.base_url}/users/login?role=client", json=payload, timeout=TIMEOUT
        )
        self.assert_status(response, 401, "Login with wrong password should return 401")

    def test_get_carts_with_client_token(self):
        """测试：客户端使用token获取购物车"""
        assert self.client_token is not None, "Client token should be set from login"
        headers = {"Authorization": f"Bearer {self.client_token}"}
        response = requests.get(
            f"{self.base_url}/carts", headers=headers, timeout=TIMEOUT
        )
        self.assert_status(
            response, 200, "GET /carts with client token should return 200"
        )
        data = response.json()
        assert "clientId" in data, "Response should contain clientId"
        assert "products" in data, "Response should contain products list"

    def test_get_orders_with_client_token(self):
        """测试：客户端使用token获取订单列表"""
        assert self.client_token is not None, "Client token should be set from login"
        headers = {"Authorization": f"Bearer {self.client_token}"}
        response = requests.get(
            f"{self.base_url}/orders", headers=headers, timeout=TIMEOUT
        )
        self.assert_status(
            response, 200, "GET /orders with client token should return 200"
        )
        data = response.json()
        assert isinstance(data, list), "Response should be a list"

    def test_get_carts_without_token(self):
        """测试：未认证访问购物车应被拒绝"""
        response = requests.get(f"{self.base_url}/carts", timeout=TIMEOUT)
        self.assert_status(response, 403, "GET /carts without token should return 403")

    def test_get_orders_without_token(self):
        """测试：未认证访问订单应被拒绝"""
        response = requests.get(f"{self.base_url}/orders", timeout=TIMEOUT)
        self.assert_status(response, 403, "GET /orders without token should return 403")

    def test_get_carts_with_employee_token(self):
        """测试：员工访问购物车应被拒绝（仅客户端可访问）"""
        assert self.employee_token is not None, (
            "Employee token should be set from login"
        )
        headers = {"Authorization": f"Bearer {self.employee_token}"}
        response = requests.get(
            f"{self.base_url}/carts", headers=headers, timeout=TIMEOUT
        )
        self.assert_status(
            response, 403, "GET /carts with employee token should return 403"
        )

    def test_get_orders_with_employee_token(self):
        """测试：员工访问订单应被拒绝（仅客户端可访问）"""
        assert self.employee_token is not None, (
            "Employee token should be set from login"
        )
        headers = {"Authorization": f"Bearer {self.employee_token}"}
        response = requests.get(
            f"{self.base_url}/orders", headers=headers, timeout=TIMEOUT
        )
        self.assert_status(
            response, 403, "GET /orders with employee token should return 403"
        )

    def test_post_stocks_with_client_token(self):
        """测试：客户端创建产品应被拒绝（仅员工可访问）"""
        assert self.client_token is not None, "Client token should be set from login"
        headers = {"Authorization": f"Bearer {self.client_token}"}
        response = requests.post(
            f"{self.base_url}/stocks", headers=headers, timeout=TIMEOUT
        )
        self.assert_status(
            response, 403, "POST /stocks with client token should return 403"
        )

    def test_post_stocks_without_token(self):
        """测试：未认证创建产品应被拒绝"""
        response = requests.post(f"{self.base_url}/stocks", timeout=TIMEOUT)
        self.assert_status(
            response, 403, "POST /stocks without token should return 403"
        )

    def test_user_validation_missing_fields(self):
        """测试：用户注册缺少必填字段应失败"""
        payload = {"name": "Test", "password": "testpass123"}
        response = requests.post(
            f"{self.base_url}/users/clients/signup", json=payload, timeout=TIMEOUT
        )
        self.assert_status(
            response, 400, "Signup with missing fields should return 400"
        )
        data = response.json()
        assert "email" in str(data).lower() or "required" in str(data).lower(), (
            "Error should mention required fields"
        )

    def test_user_validation_invalid_email(self):
        """测试：用户注册使用无效邮箱应失败"""
        payload = {
            "name": "Test",
            "surnames": "User",
            "direction": "123 Test St",
            "state": "California",
            "postal_code": "90210",
            "phone": "1234567890",
            "email": "invalid-email",
            "password": "testpass123",
        }
        response = requests.post(
            f"{self.base_url}/users/clients/signup", json=payload, timeout=TIMEOUT
        )
        self.assert_status(response, 400, "Signup with invalid email should return 400")


def run_all_tests():
    """运行所有测试"""
    print("=" * 60)
    print("Spring Boot SQLite Ecommerce API - 测试套件")
    print("=" * 60)
    print(f"Base URL: {BASE_URL}")
    print(f"Timeout: {TIMEOUT}s")
    print("=" * 60)
    print()

    test_suite = TestAPI()
    tests = [
        ("主页重定向到 Swagger UI", test_suite.test_home_page_redirects_to_swagger),
        ("获取产品列表 (公开)", test_suite.test_get_stocks_public),
        ("获取不存在的产品 (404)", test_suite.test_get_stock_by_code_not_found),
        ("获取分类列表 (公开)", test_suite.test_get_categories_public),
        ("客户端用户注册", test_suite.test_client_signup),
        ("员工用户注册", test_suite.test_employee_signup),
        ("客户端用户登录", test_suite.test_client_login),
        ("员工用户登录", test_suite.test_employee_login),
        ("使用错误密码登录", test_suite.test_login_with_wrong_password),
        ("客户端获取购物车 (需认证)", test_suite.test_get_carts_with_client_token),
        ("客户端获取订单列表 (需认证)", test_suite.test_get_orders_with_client_token),
        ("未认证访问购物车", test_suite.test_get_carts_without_token),
        ("未认证访问订单", test_suite.test_get_orders_without_token),
        ("员工访问购物车 (权限拒绝)", test_suite.test_get_carts_with_employee_token),
        ("员工访问订单 (权限拒绝)", test_suite.test_get_orders_with_employee_token),
        ("客户端创建产品 (权限拒绝)", test_suite.test_post_stocks_with_client_token),
        ("未认证创建产品", test_suite.test_post_stocks_without_token),
        ("用户注册缺少必填字段", test_suite.test_user_validation_missing_fields),
        ("用户注册使用无效邮箱", test_suite.test_user_validation_invalid_email),
    ]

    passed = 0
    failed = 0
    results = []

    for test_name, test_func in tests:
        try:
            print(f"⏳  {test_name}...", end=" ")
            test_func()
            print("✅ 通过")
            passed += 1
            results.append((test_name, "通过", None))
        except AssertionError as e:
            print(f"❌ 失败")
            print(f"   原因: {str(e)}")
            failed += 1
            results.append((test_name, "失败", str(e)))
        except requests.exceptions.RequestException as e:
            print(f"❌ 失败")
            print(f"   网络错误: {str(e)}")
            failed += 1
            results.append((test_name, "失败", f"网络错误: {str(e)}"))
        except Exception as e:
            print(f"❌ 失败")
            print(f"   未知错误: {str(e)}")
            failed += 1
            results.append((test_name, "失败", f"未知错误: {str(e)}"))

    print()
    print("=" * 60)
    print("测试结果汇总")
    print("=" * 60)
    print(f"总计: {len(tests)} 个测试")
    print(f"通过: {passed} 个")
    print(f"失败: {failed} 个")
    print(f"成功率: {passed / len(tests) * 100:.1f}%")
    print("=" * 60)

    if failed > 0:
        print("\n失败的测试:")
        for test_name, status, error in results:
            if status == "失败":
                print(f"  - {test_name}")
                print(f"    {error}")
        return 1
    else:
        print("\n🎉 所有测试通过！")
        return 0


if __name__ == "__main__":
    exit_code = run_all_tests()
    exit(exit_code)
