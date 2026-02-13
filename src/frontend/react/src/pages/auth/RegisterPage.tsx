import React from 'react';
import { Form, Input, Button, Card, Typography, message, Tabs } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, HomeOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '@/api';
import type { ClientSignupRequest, EmployeeSignupRequest } from '@/types';

const { Title } = Typography;
const { TabPane } = Tabs;

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [clientForm] = Form.useForm();
  const [employeeForm] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('client');

  const onClientSubmit = async (values: ClientSignupRequest) => {
    setLoading(true);
    try {
      await authApi.signupClient(values);
      message.success('注册成功！请登录');
      navigate('/login');
    } catch (error: any) {
      message.error(error.message || '注册失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const onEmployeeSubmit = async (values: EmployeeSignupRequest) => {
    setLoading(true);
    try {
      await authApi.signupEmployee(values);
      message.success('注册成功！请登录');
      navigate('/login');
    } catch (error: any) {
      message.error(error.message || '注册失败，请稍后重试');
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
      <Card style={{ width: 450, padding: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Title level={2}>注册账户</Title>
          <Typography.Text type="secondary">创建新账户以开始使用</Typography.Text>
        </div>

        <Tabs activeKey={activeTab} onChange={setActiveTab} centered>
          <TabPane tab="客户注册" key="client">
            <Form
              form={clientForm}
              name="clientRegister"
              onFinish={onClientSubmit}
              autoComplete="off"
              layout="vertical"
            >
              <Form.Item
                label="姓名"
                name="name"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="请输入姓名"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="邮箱"
                name="email"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入有效的邮箱地址' },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="请输入邮箱"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="密码"
                name="password"
                rules={[
                  { required: true, message: '请输入密码' },
                  { min: 6, message: '密码至少6个字符' },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="请输入密码"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="地址"
                name="address"
              >
                <Input
                  prefix={<HomeOutlined />}
                  placeholder="请输入地址（可选）"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="电话"
                name="phone"
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="请输入电话（可选）"
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
                  注册
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane tab="员工注册" key="employee">
            <Form
              form={employeeForm}
              name="employeeRegister"
              onFinish={onEmployeeSubmit}
              autoComplete="off"
              layout="vertical"
            >
              <Form.Item
                label="姓名"
                name="name"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="请输入姓名"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="员工编号"
                name="employeeId"
                rules={[{ required: true, message: '请输入员工编号' }]}
              >
                <Input
                  placeholder="请输入员工编号"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="邮箱"
                name="email"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入有效的邮箱地址' },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="请输入邮箱"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="密码"
                name="password"
                rules={[
                  { required: true, message: '请输入密码' },
                  { min: 6, message: '密码至少6个字符' },
                ]}
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
                  注册
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>

        <div style={{ textAlign: 'center' }}>
          <Typography.Text>
            已有账户？ <Link to="/login">立即登录</Link>
          </Typography.Text>
        </div>
      </Card>
    </div>
  );
};
