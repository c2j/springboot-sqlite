import React from 'react';
import { Card, Button, Typography, Tag } from 'antd';
import { ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';
import type { ProductResponseDTO } from '@/types';
import { ImageWithFallback } from './ImageWithFallback';
import { productApi } from '@/api';

const { Meta } = Card;
const { Text } = Typography;

interface ProductCardProps {
  product: ProductResponseDTO;
  onView: (code: number) => void;
  onAddToCart: (code: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onView,
  onAddToCart,
}) => {
  const imageUrl = product.hasImage ? productApi.getProductImage(product.code) : '';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      case 'out_of_stock':
        return 'warning';
      case 'deleted':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '在售';
      case 'inactive':
        return '下架';
      case 'out_of_stock':
        return '缺货';
      case 'deleted':
        return '已删除';
      default:
        return status;
    }
  };

  return (
    <Card
      hoverable
      cover={
        <div style={{ padding: '10px', display: 'flex', justifyContent: 'center' }}>
          <ImageWithFallback
            src={imageUrl}
            alt={product.description}
            width={180}
            height={180}
          />
        </div>
      }
      actions={[
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => onView(product.code)}
        >
          查看
        </Button>,
        <Button
          type="text"
          icon={<ShoppingCartOutlined />}
          onClick={() => onAddToCart(product.code)}
          disabled={product.status !== 'active' || product.quantity === 0}
        >
          加入购物车
        </Button>,
      ]}
    >
      <Meta
        title={product.description}
        description={
          <div>
            <div style={{ marginBottom: '8px' }}>
              <Text strong style={{ fontSize: '16px', color: '#f5222d' }}>
                ¥{product.price.toFixed(2)}
              </Text>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <Tag color={getStatusColor(product.status)}>
                {getStatusText(product.status)}
              </Tag>
              <Text type="secondary">库存: {product.quantity}</Text>
            </div>
            <div>
              <Text type="secondary">分类: {product.categoryName || `分类${product.category}`}</Text>
            </div>
          </div>
        }
      />
    </Card>
  );
};
