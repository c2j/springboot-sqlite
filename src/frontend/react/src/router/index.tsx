import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// Layouts
import { MainLayout } from '@/components/layout/MainLayout';

// Pages
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ProductListPage } from '@/pages/products/ProductListPage';
import { ProductDetailPage } from '@/pages/products/ProductDetailPage';
import { ProductCreatePage } from '@/pages/products/ProductCreatePage';
import { ProductEditPage } from '@/pages/products/ProductEditPage';
import { ShoppingCartPage } from '@/pages/cart/ShoppingCartPage';
import { OrderListPage } from '@/pages/orders/OrderListPage';
import { OrderDetailPage } from '@/pages/orders/OrderDetailPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/products" replace />,
      },
      {
        path: 'products',
        children: [
          {
            index: true,
            element: <ProductListPage />,
          },
          {
            path: ':id',
            element: <ProductDetailPage />,
          },
          {
            path: 'create',
            element: <ProductCreatePage />,
          },
          {
            path: 'edit/:id',
            element: <ProductEditPage />,
          },
        ],
      },
      {
        path: 'cart',
        element: <ShoppingCartPage />,
      },
      {
        path: 'orders',
        children: [
          {
            index: true,
            element: <OrderListPage />,
          },
          {
            path: ':id',
            element: <OrderDetailPage />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
