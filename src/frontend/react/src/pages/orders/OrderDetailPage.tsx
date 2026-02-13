import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, Descriptions, Button, Table, Typography } from 'antd';
import { ArrowLeftOutlined, FileTextOutlined } from '@ant-design/icons';
import { LoadingSpinner, ErrorMessage } from '@/components';
import { orderApi } from '@/api';
import type { OrderItem } from '@/types';

const { Title } = Typography;

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const orderId = parseInt(id || '0', 10);

  const { data: order, isLoading, error, refetch } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderApi.getOrderDetails(orderId),
    enabled: !!orderId,
  });

  const columns = [
    {
      title: '商品编号',
      dataIndex: 'productCode',
      key: 'productCode',
    },
    {
      title: '商品名称',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: '单价',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (price: number) => `¥${price.toFixed(2)}`,
    },
    {
      title: '小计',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price: number) => `¥${price.toFixed(2)}`,
    },
  ];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !order) {
    return <ErrorMessage message="加载订单详情失败" onRetry={refetch} />;
  }

  const paymentMethodMap: Record<string, string> = {
    CASH: '现金',
    VISA: 'Visa',
    MASTERCARD: 'MasterCard',
    PAYPAL: 'PayPal',
  };

  return (
    <div>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/orders')}
        style={{ marginBottom: '16px' }}
      >
        返回订单列表
      </Button>

      <Title level={2}>
        <FileTextOutlined /> 订单详情
      </Title>

      <Card style={{ marginBottom: '24px' }}>
        <Descriptions title={`订单编号: ${order.orderId}`} column={2}>
          <Descriptions.Item label="下单日期">
            {new Date(order.orderDate).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="支付方式">
            {paymentMethodMap[order.paymentMethod] || order.paymentMethod}
          </Descriptions.Item>
          <Descriptions.Item label="订单总额">
            <span style={{ fontSize: '20px', color: '#f5222d', fontWeight: 'bold' }}>
              ¥{order.totalAmount.toFixed(2)}
            </span>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="订单商品">
        <Table
          dataSource={order.items}
          columns={columns}
          rowKey="productCode"
          pagination={false}
          summary={(data: readonly OrderItem[]) => {
            const total = data.reduce((sum, item) => sum + item.totalPrice, 0);
            return (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={4}>
                  <strong>总计</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <strong style={{ color: '#f5222d' }}>¥{total.toFixed(2)}</strong>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            );
          }}
        />
      </Card>
    </div>
  );
};
