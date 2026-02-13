import React from 'react';
import { Card, Button, InputNumber, Typography, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import type { CartItem } from '@/types';
import { ImageWithFallback } from './ImageWithFallback';
import { productApi } from '@/api';

const { Text } = Typography;

interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (cartId: number, quantity: number) => void;
  onRemove: (cartId: number) => void;
}

export const CartItemCard: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const imageUrl = item.hasImage ? productApi.getProductImage(item.productCode) : '';

  return (
    <Card
      style={{ marginBottom: '16px' }}
      bodyStyle={{ padding: '16px' }}
    >
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <ImageWithFallback
          src={imageUrl}
          alt={item.description}
          width={100}
          height={100}
        />
        
        <div style={{ flex: 1 }}>
          <Text strong style={{ fontSize: '16px' }}>{item.description}</Text>
          <br />
          <Text type="secondary">商品编号: {item.productCode}</Text>
        </div>
        
        <Space direction="vertical" align="end">
          <Text strong style={{ fontSize: '18px', color: '#f5222d' }}>
            ¥{item.totalPrice.toFixed(2)}
          </Text>
          
          <Space>
            <InputNumber
              min={1}
              max={99}
              value={item.quantity}
              onChange={(value) => {
                if (value) {
                  onUpdateQuantity(item.id, value);
                }
              }}
              style={{ width: '80px' }}
            />
            
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onRemove(item.id)}
            >
              删除
            </Button>
          </Space>
        </Space>
      </div>
    </Card>
  );
};
