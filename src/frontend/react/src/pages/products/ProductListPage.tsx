import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Input, Row, Col, Pagination, Empty, message, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { ProductCard, LoadingSpinner, ErrorMessage } from '@/components';
import { productApi, lookupApi } from '@/api';
import type { ProductResponseDTO } from '@/types';

const { Search } = Input;
const { Option } = Select;

export const ProductListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchPhrase, setSearchPhrase] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const pageSize = 12;

  const { data: products, isLoading, error, refetch } = useQuery({
    queryKey: ['products', searchPhrase, currentPage],
    queryFn: () => productApi.getAllProducts(searchPhrase, currentPage - 1, pageSize),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => lookupApi.getCategories(),
  });

  const handleSearch = (value: string) => {
    setSearchPhrase(value);
    setCurrentPage(1);
  };

  const handleViewProduct = (code: number) => {
    navigate(`/products/${code}`);
  };

  const handleAddToCart = (_code: number) => {
    // TODO: Implement add to cart functionality
    message.success('已添加到购物车');
  };

  const filteredProducts = selectedCategory
    ? products?.content.filter((p) => p.category === selectedCategory)
    : products?.content;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message="加载商品失败" onRetry={refetch} />;
  }

  return (
    <div>
      <div style={{ marginBottom: '24px', display: 'flex', gap: '16px' }}>
        <Search
          placeholder="搜索商品"
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          onSearch={handleSearch}
          style={{ width: 300 }}
        />

        <Select
          placeholder="选择分类"
          allowClear
          style={{ width: 200 }}
          onChange={(value) => setSelectedCategory(value)}
        >
          {categories?.map((cat) => (
            <Option key={cat.id} value={cat.id}>
              {cat.description}
            </Option>
          ))}
        </Select>
      </div>

      {filteredProducts?.length === 0 ? (
        <Empty description="暂无商品" />
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {filteredProducts?.map((product: ProductResponseDTO) => (
              <Col key={product.code} xs={24} sm={12} md={8} lg={6}>
                <ProductCard
                  product={product}
                  onView={handleViewProduct}
                  onAddToCart={handleAddToCart}
                />
              </Col>
            ))}
          </Row>

          {products && products.totalPages > 1 && (
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <Pagination
                current={currentPage}
                total={products.totalElements}
                pageSize={pageSize}
                onChange={setCurrentPage}
                showSizeChanger={false}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
