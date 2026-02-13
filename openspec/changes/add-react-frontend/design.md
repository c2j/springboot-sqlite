## Context

**Current State**: 现有项目是一个基于 Spring Boot + SQLite 的 RESTful API 后端服务，提供电商核心功能：
- 用户认证（登录/注册，支持客户端/员工角色）
- 商品管理（CRUD、分页查询、图片上传）
- 购物车（添加/删除商品、结算）
- 订单管理（查询订单详情）
- 基础数据查询（商品分类）

后端使用 JWT Bearer Token 进行认证，提供 Swagger/OpenAPI 文档。

**目标**: 在 `src/frontend/react/` 构建 React 前端应用，将上述 API 功能封装为用户友好的 Web 界面。

## Goals / Non-Goals

**Goals:**
- 构建现代化的 React SPA 前端，提供直观的用户界面
- 实现与现有 RESTful API 的无缝集成
- 支持用户登录、商品浏览、购物车、订单管理等核心功能
- 提供响应式设计，支持桌面和移动端
- 前端代码与后端项目统一管理，便于部署

**Non-Goals:**
- 不修改后端 API 接口（仅调用现有接口）
- 不引入微前端或 SSR 等复杂架构
- 暂不支持实时通知、WebSocket 等功能
- 不实现国际化（初始版本仅中文界面）

## Decisions

### 1. 技术栈选择

**React + TypeScript + Vite**
- **Rationale**: Vite 提供快速的开发体验和优化的生产构建；TypeScript 提供更好的类型安全和 IDE 支持
- **Alternatives considered**: Create React App（较慢）、Next.js（过度设计，不需要 SSR）

### 2. 状态管理

**React Context + useReducer + React Query**
- **Rationale**: 
  - 认证状态使用 Context + useReducer（简单全局状态）
  - 服务端数据使用 React Query（缓存、同步、加载状态管理）
- **Alternatives considered**: Redux（过重）、Zustand（轻量但 React Query 已覆盖大部分需求）

### 3. UI 组件库

**Ant Design 5.x**
- **Rationale**: 成熟的企业级 UI 库，丰富的组件（表格、表单、上传等），完善的 TypeScript 支持
- **Alternatives considered**: Material-UI（风格不符合国内习惯）、Tailwind + Headless UI（需要大量自定义）

### 4. 路由方案

**React Router v6**
- **Rationale**: 行业标准方案，支持嵌套路由、懒加载、路由守卫

### 5. HTTP 客户端

**Axios**
- **Rationale**: 支持拦截器（统一处理 JWT Token）、请求取消、更好的错误处理

### 6. 项目结构

```
src/frontend/react/
├── src/
│   ├── api/           # API 客户端和请求函数
│   ├── components/    # 通用组件
│   ├── context/       # React Context（认证等）
│   ├── hooks/         # 自定义 Hooks
│   ├── pages/         # 页面组件
│   ├── router/        # 路由配置
│   ├── types/         # TypeScript 类型定义
│   └── utils/         # 工具函数
├── public/            # 静态资源
└── package.json
```

### 7. 与后端集成方式

**开发环境**: 前端开发服务器代理到后端（Vite proxy）
**生产环境**: 构建为静态文件，由 Spring Boot 托管（`src/main/resources/static`）或独立部署

### 8. 认证方案

- 登录后存储 JWT Token 到 localStorage
- Axios 拦截器自动附加 Authorization Header
- React Context 管理登录状态
- Token 过期后自动跳转到登录页

## Risks / Trade-offs

**[Risk] JWT Token 安全性**
→ **Mitigation**: Token 存储在 localStorage 存在 XSS 风险，需确保前端代码无 XSS 漏洞；生产环境使用 HTTPS

**[Risk] 前后端耦合**
→ **Mitigation**: API 调用层抽象封装，所有 API 路径集中在 api/ 目录；接口变更时只需修改一处

**[Risk] 构建复杂度增加**
→ **Mitigation**: 提供清晰的 README 和 npm scripts；考虑将前端构建集成到 Maven/Gradle 生命周期

**[Trade-off] 不使用 SSR**
→ SEO 不友好，但电商后台管理类应用对 SEO 要求低，换取更简单的架构

## Migration Plan

**开发阶段**:
1. 初始化 React 项目（Vite + TypeScript）
2. 配置 Axios 和 API 客户端
3. 实现认证模块（登录/注册页面）
4. 实现商品浏览页面
5. 实现购物车功能
6. 实现订单管理

**部署阶段**:
1. 配置生产构建输出到 `src/main/resources/static`
2. 更新 Spring Boot 配置，确保静态资源正确托管
3. 验证前后端集成（API 代理、路由刷新）

## Open Questions

1. 是否需要将前端构建集成到 Maven 构建流程？（影响 CI/CD 配置）
2. 图片上传功能是否使用后端现有的 multipart/form-data 方式？
3. 是否需要实现员工端界面（目前 API 支持员工和客户两种角色）？
