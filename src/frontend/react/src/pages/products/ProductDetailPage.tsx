import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, Descriptions, Button, Tag, Space, message } from 'antd';
import { ArrowLeftOutlined, ShoppingCartOutlined, EditOutlined } from '@ant-design/icons';
import { ImageWithFallback, LoadingSpinner, ErrorMessage } from '@/components';
import { productApi } from '@/api';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const productCode = parseInt(id || '0', 10);

  const { data: product, isLoading, error, refetch } = useQuery({
    queryKey: ['product', productCode],
    queryFn: () => productApi.getProduct(productCode),
    enabled: !!productCode,
  });

  const handleAddToCart = () => {
    message.success('已添加到购物车');
  };

  const handleEdit = () => {
    navigate(`/products/edit/${productCode}`);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !product) {
    return <ErrorMessage message="加载商品详情失败" onRetry={refetch} />;
  }

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
    <div>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/products')}
        style={{ marginBottom: '16px' }}
      >
        返回列表
      </Button>

      <Card>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <div>
            <ImageWithFallback
              src={imageUrl}
              alt={product.description}
              width={300}
              height={300}
            />
          </div>

          <div style={{ flex: 1, minWidth: '300px' }}>
            <Descriptions title={product.description} column={1}>
              <Descriptions.Item label="商品编号">{product.code}</Descriptions.Item>
              <Descriptions.Item label="价格">
                <span style={{ fontSize: '24px', color: '#f5222d', fontWeight: 'bold' }}>
                  ¥{product.price.toFixed(2)}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="库存">{product.quantity}</Descriptions.Item>
              <Descriptions.Item label="分类">{product.categoryName || `分类${product.category}`}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={getStatusColor(product.status)}>{getStatusText(product.status)}</Tag>
              </Descriptions.Item>
            </Descriptions>

            <Space style={{ marginTop: '24px' }}>
              <Button
                type="primary"
                icon={<ShoppingCartOutlined />}
                size="large"
                onClick={handleAddToCart}
                disabled={product.status !== 'active' || product.quantity === 0}
              >
                加入购物车
              </Button>
              
              <Button
                icon={<EditOutlined />}
                size="large"
                onClick={handleEdit}
              >
                编辑商品
              </Button>
            </Space>
          </div>
        </div>
      </Card>
    </div>
  );
};
