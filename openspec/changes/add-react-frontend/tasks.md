## 1. Project Initialization

- [x] 1.1 Initialize React project with Vite in `src/frontend/react/`
- [x] 1.2 Install and configure TypeScript
- [x] 1.3 Install Ant Design 5.x and configure theme
- [x] 1.4 Install React Router v6
- [x] 1.5 Install and configure Axios
- [x] 1.6 Install and configure React Query (@tanstack/react-query)
- [x] 1.7 Install dev dependencies: ESLint, Prettier, TypeScript types
- [x] 1.8 Configure Vite proxy for API requests to backend

## 2. Project Structure & Configuration

- [x] 2.1 Create directory structure: `src/api/`, `src/components/`, `src/context/`, `src/hooks/`, `src/pages/`, `src/router/`, `src/types/`, `src/utils/`
- [x] 2.2 Configure ESLint with React and TypeScript rules
- [x] 2.3 Configure Prettier with consistent formatting rules
- [x] 2.4 Create `.env` files for development and production
- [x] 2.5 Add npm scripts: `dev`, `build`, `lint`, `format`, `preview`

## 3. Type Definitions

- [x] 3.1 Define TypeScript interfaces for User/Client/Employee
- [x] 3.2 Define TypeScript interfaces for Product/Stock
- [x] 3.3 Define TypeScript interfaces for ShoppingCart
- [x] 3.4 Define TypeScript interfaces for Order/OrderDetails
- [x] 3.5 Define TypeScript interfaces for Category
- [x] 3.6 Define TypeScript interfaces for API request/response types
- [x] 3.7 Define TypeScript interfaces for authentication state

## 4. API Client Layer

- [x] 4.1 Create Axios instance with base URL configuration
- [x] 4.2 Implement request interceptor to inject JWT token
- [x] 4.3 Implement response interceptor for error handling (401/403/404)
- [x] 4.4 Create authentication API functions (login, signup)
- [x] 4.5 Create product API functions (list, get, create, update, delete)
- [x] 4.6 Create shopping cart API functions (get, add, delete, buy)
- [x] 4.7 Create order API functions (list, get details)
- [x] 4.8 Create lookup API functions (categories)
- [x] 4.9 Implement image upload support with multipart/form-data

## 5. State Management

- [x] 5.1 Create AuthContext with user state
- [x] 5.2 Implement login function in AuthContext
- [x] 5.3 Implement logout function in AuthContext
- [x] 5.4 Implement token storage in localStorage
- [x] 5.5 Create useAuth hook for accessing auth state
- [x] 5.6 Configure React Query client with default options

## 6. Routing & Navigation

- [x] 6.1 Create route configuration with all defined routes
- [x] 6.2 Implement ProtectedRoute component for authenticated routes
- [x] 6.3 Create MainLayout component with navigation menu
- [x] 6.4 Implement navigation guards (redirect to login if not authenticated)
- [x] 6.5 Add route for 404 Not Found page

## 7. Core Components

- [x] 7.1 Create LoadingSpinner component
- [x] 7.2 Create ErrorMessage component
- [x] 7.3 Create ImageWithFallback component for product images
- [ ] 7.4 Create SearchInput component with debounce
- [ ] 7.5 Create Pagination component
- [x] 7.6 Create ProductCard component for product display
- [x] 7.7 Create CartItem component for shopping cart items

## 8. Authentication Pages

- [x] 8.1 Create LoginPage with form validation
- [x] 8.2 Implement login form submission with error handling
- [x] 8.3 Create RegisterPage with form validation
- [x] 8.4 Implement client registration form
- [x] 8.5 Add role selection (client/employee) if needed
- [x] 8.6 Implement form validation with Ant Design Form

## 9. Product Pages

- [x] 9.1 Create ProductListPage with pagination and search
- [x] 9.2 Implement product grid layout with ProductCard
- [x] 9.3 Add category filter functionality
- [x] 9.4 Create ProductDetailPage with full product info
- [x] 9.5 Display product image with ImageWithFallback
- [ ] 9.6 Add "Add to Cart" button on product pages
- [x] 9.7 Create ProductForm component for create/edit
- [x] 9.8 Implement image upload in product form
- [x] 9.9 Create ProductCreatePage (admin only)
- [x] 9.10 Create ProductEditPage (admin only)

## 10. Shopping Cart Pages

- [x] 10.1 Create ShoppingCartPage with cart items list
- [x] 10.2 Display cart total and item count
- [ ] 10.3 Implement quantity update functionality
- [x] 10.4 Implement remove item from cart
- [x] 10.5 Create checkout flow with payment method selection
- [x] 10.6 Implement "Buy Cart" functionality
- [x] 10.7 Show success/error messages after checkout

## 11. Order Pages

- [x] 11.1 Create OrderListPage with order history
- [x] 11.2 Display order summary information
- [x] 11.3 Create OrderDetailPage with full order information
- [x] 11.4 Display order items and totals

## 12. Build & Integration

- [x] 12.1 Configure production build output directory
- [ ] 12.2 Copy build output to `src/main/resources/static/`
- [ ] 12.3 Configure Spring Boot to serve static files
- [ ] 12.4 Add SPA fallback configuration for React Router
- [ ] 12.5 Test end-to-end integration (build + run JAR)
- [x] 12.6 Update project README with frontend setup instructions
- [x] 12.7 Add .gitignore for node_modules and build artifacts

## 13. Testing & Quality

- [x] 13.1 Run ESLint and fix any code style issues
- [x] 13.2 Verify TypeScript compilation with no errors
- [ ] 13.3 Test all API endpoints integration
- [ ] 13.4 Test authentication flow (login/logout/token refresh)
- [ ] 13.5 Test responsive design on different screen sizes
- [x] 13.6 Verify build output includes all required assets
