# Ecommerce Demo using Spring Boot and SQLite

[![CI Build](https://github.com/opcruz/springboot-sqlite/actions/workflows/build-and-test.yml/badge.svg?branch=master)](https://github.com/opcruz/springboot-sqlite/actions/workflows/build-and-test.yml)

This is a simple demo of an ecommerce application built with Spring Boot and SQLite. The API provides endpoints for managing products, customers, and orders, following the principles of REST (Representational State Transfer).

Now includes a React frontend for a complete user experience!

## Features

- CRUD operations for products, customers, and orders
- Product search functionality
- Basic authentication and authorization
- React frontend with modern UI

## Technologies Used

### Backend
- Java
- Spring Boot
- Spring Data JPA
- SQLite

### Frontend
- React 19
- TypeScript
- Vite
- Ant Design 5.x
- React Router v6
- React Query
- Axios

## Getting Started

### Prerequisites

- Java 17 or above
- Maven
- Node.js 18 or above
- npm or yarn

### Backend Setup

1. Clone the repository:

```shell
git clone https://github.com/opcruz/springboot-sqlite.git
```

2. Navigate to the project directory:

```shell
cd springboot-sqlite
```

3. Build the project:

```shell
mvn clean package
```

4. Run the application:

```shell
mvn spring-boot:run
```

5. Access the API:

- [API testing](http://localhost:8080/ecommerce/api/v1/swagger-ui/index.html)

### Frontend Setup

1. Navigate to the frontend directory:

```shell
cd src/frontend/react
```

2. Install dependencies:

```shell
npm install
```

3. Start the development server:

```shell
npm run dev
```

4. Access the frontend:

- Open http://localhost:5173 in your browser

### Frontend Build (Production)

1. Build the frontend:

```shell
cd src/frontend/react
npm run build
```

2. The build output will be in `src/frontend/react/dist/`

3. To integrate with Spring Boot, copy the build to static resources:

```shell
npm run build:prod
```

## Frontend Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:prod` - Build and copy to Spring Boot static resources
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run preview` - Preview production build

### Project Structure

```
src/frontend/react/src/
├── api/           # API client and request functions
├── components/    # Reusable UI components
├── context/       # React Context (AuthContext)
├── hooks/         # Custom React hooks
├── pages/         # Page components
│   ├── auth/      # Login and Register pages
│   ├── products/  # Product list, detail, create, edit pages
│   ├── cart/      # Shopping cart page
│   └── orders/    # Order list and detail pages
├── router/        # React Router configuration
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

### Features

- **Authentication**: Login and registration for clients and employees
- **Product Management**: Browse products, view details, create and edit (admin)
- **Shopping Cart**: Add items, remove items, checkout
- **Order Management**: View order history and details
- **Responsive Design**: Works on desktop and mobile devices

## GraalVM Native Image

```shell
mvn -Pnative native:compile
```
