import React from 'react';
import { Form, Input, Button, Card, Typography, message, Radio } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context';
import type { LoginRequest } from '@/types';

const { Title } = Typography;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [role, setRole] = React.useState<'client' | 'employee'>('client');

  const onFinish = async (values: LoginRequest) => {
    setLoading(true);
    try {
      await login(values, role);
      message.success('登录成功！');
      navigate('/products');
    } catch (error: any) {
      message.error(error.message || '登录失败，请检查邮箱和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f0f2f5',
      }}
    >
      <Card style={{ width: 400, padding: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Title level={2}>商城系统</Title>
          <Typography.Text type="secondary">请登录您的账户</Typography.Text>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Radio.Group value={role} onChange={(e) => setRole(e.target.value)}>
            <Radio.Button value="client">客户</Radio.Button>
            <Radio.Button value="employee">员工</Radio.Button>
          </Radio.Group>
        </div>

        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="请输入邮箱"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
            >
              登录
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Typography.Text>
              还没有账户？ <Link to="/register">立即注册</Link>
            </Typography.Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};
