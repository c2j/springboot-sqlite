import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, Button, Typography, Empty, message, Modal, Select } from 'antd';
import { ShoppingOutlined, CreditCardOutlined } from '@ant-design/icons';
import { CartItemCard, LoadingSpinner, ErrorMessage } from '@/components';
import { cartApi } from '@/api';

const { Title, Text } = Typography;
const { Option } = Select;

export const ShoppingCartPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [paymentMethod, setPaymentMethod] = React.useState<string>('CASH');
  const [isCheckoutModalVisible, setIsCheckoutModalVisible] = React.useState(false);

  const { data: cart, isLoading, error, refetch } = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartApi.getShoppingCart(),
  });

  const removeMutation = useMutation({
    mutationFn: (cartId: number) => cartApi.removeFromCart(cartId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      message.success('已从购物车移除');
    },
    onError: (error: any) => {
      message.error(error.message || '移除失败');
    },
  });

  const buyMutation = useMutation({
    mutationFn: () =>
      cartApi.buyCart({
        paymentMethod: paymentMethod as 'CASH' | 'VISA' | 'MASTERCARD' | 'PAYPAL',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      message.success('订单创建成功！');
      setIsCheckoutModalVisible(false);
    },
    onError: (error: any) => {
      message.error(error.message || '结算失败');
    },
  });

  const handleRemove = (cartId: number) => {
    removeMutation.mutate(cartId);
  };

  const handleUpdateQuantity = (_cartId: number, _quantity: number) => {
    // TODO: Implement update quantity API
    message.info('数量更新功能开发中...');
  };

  const handleCheckout = () => {
    setIsCheckoutModalVisible(true);
  };

  const confirmCheckout = () => {
    buyMutation.mutate();
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message="加载购物车失败" onRetry={refetch} />;
  }

  const cartItems = cart?.items || [];
  const totalAmount = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div>
      <Title level={2}>
        <ShoppingOutlined /> 购物车
      </Title>

      {cartItems.length === 0 ? (
        <Empty description="购物车是空的" />
      ) : (
        <>
          {cartItems.map((item) => (
            <CartItemCard
              key={item.id}
              item={item}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemove}
            />
          ))}

          <Card style={{ marginTop: '24px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <Text>共 {cartItems.length} 件商品</Text>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Text style={{ fontSize: '16px', marginRight: '16px' }}>
                  合计:
                  <Text strong style={{ fontSize: '24px', color: '#f5222d' }}>
                    ¥{totalAmount.toFixed(2)}
                  </Text>
                </Text>
                <Button
                  type="primary"
                  size="large"
                  icon={<CreditCardOutlined />}
                  onClick={handleCheckout}
                  loading={buyMutation.isPending}
                >
                  去结算
                </Button>
              </div>
            </div>
          </Card>
        </>
      )}

      <Modal
        title="确认订单"
        open={isCheckoutModalVisible}
        onOk={confirmCheckout}
        onCancel={() => setIsCheckoutModalVisible(false)}
        confirmLoading={buyMutation.isPending}
      >
        <p>订单金额: <strong>¥{totalAmount.toFixed(2)}</strong></p>
        <div style={{ marginTop: '16px' }}>
          <label>支付方式:</label>
          <Select
            value={paymentMethod}
            onChange={setPaymentMethod}
            style={{ width: '100%', marginTop: '8px' }}
          >
            <Option value="CASH">现金</Option>
            <Option value="VISA">Visa</Option>
            <Option value="MASTERCARD">MasterCard</Option>
            <Option value="PAYPAL">PayPal</Option>
          </Select>
        </div>
      </Modal>
    </div>
  );
};
