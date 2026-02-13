import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingCartOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  LogoutOutlined,
  UserOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useAuth } from '@/context';

const { Header, Sider, Content } = Layout;

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems = [
    {
      key: '/products',
      icon: <ShoppingOutlined />,
      label: '商品列表',
    },
    {
      key: '/products/create',
      icon: <PlusOutlined />,
      label: '添加商品',
    },
    {
      key: '/cart',
      icon: <ShoppingCartOutlined />,
      label: '购物车',
    },
    {
      key: '/orders',
      icon: <FileTextOutlined />,
      label: '我的订单',
    },
  ];

  const handleMenuClick = (key: string) => {
    navigate(key);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const selectedKeys = [location.pathname];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible theme="light">
        <div style={{ padding: '16px', fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}>
          商城系统
        </div>
        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          items={menuItems.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: item.label,
            onClick: () => handleMenuClick(item.key),
          }))}
        />
      </Sider>
      
      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 1px 4px rgba(0,21,41,0.08)',
          }}
        >
          <div></div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>
              <UserOutlined /> {user?.name || '用户'}
            </span>
            <Button icon={<LogoutOutlined />} onClick={handleLogout}>
              退出登录
            </Button>
          </div>
        </Header>
        
        <Content style={{ margin: '24px', padding: '24px', background: '#fff', minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
