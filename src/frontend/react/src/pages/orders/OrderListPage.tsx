import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Table, Card, Button, Tag, Typography } from 'antd';
import { EyeOutlined, FileTextOutlined } from '@ant-design/icons';
import { LoadingSpinner, ErrorMessage } from '@/components';
import { orderApi } from '@/api';
import type { Order } from '@/types';

const { Title } = Typography;

export const OrderListPage: React.FC = () => {
  const navigate = useNavigate();

  const { data: orders, isLoading, error, refetch } = useQuery({
    queryKey: ['orders'],
    queryFn: () => orderApi.getOrders(),
  });

  const columns = [
    {
      title: '订单编号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '下单日期',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '总金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => `¥${amount.toFixed(2)}`,
    },
    {
      title: '支付方式',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (method: string) => {
        const methodMap: Record<string, string> = {
          CASH: '现金',
          VISA: 'Visa',
          MASTERCARD: 'MasterCard',
          PAYPAL: 'PayPal',
        };
        return methodMap[method] || method;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'completed' ? 'success' : 'processing'}>
          {status === 'completed' ? '已完成' : '处理中'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: Order) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/orders/${record.id}`)}
        >
          查看详情
        </Button>
      ),
    },
  ];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message="加载订单失败" onRetry={refetch} />;
  }

  return (
    <div>
      <Title level={2}>
        <FileTextOutlined /> 我的订单
      </Title>

      <Card>
        <Table
          dataSource={orders}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};
