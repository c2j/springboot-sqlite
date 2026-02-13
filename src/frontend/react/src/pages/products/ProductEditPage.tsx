import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Form, Input, InputNumber, Select, Button, Upload, message } from 'antd';
import { UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { productApi, lookupApi } from '@/api';
import { LoadingSpinner, ErrorMessage, ImageWithFallback } from '@/components';

const { TextArea } = Input;
const { Option } = Select;

export const ProductEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const productCode = parseInt(id || '0', 10);
  const [fileList, setFileList] = React.useState<any[]>([]);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', productCode],
    queryFn: () => productApi.getProduct(productCode),
    enabled: !!productCode,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => lookupApi.getCategories(),
  });

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        description: product.description,
        category: product.category,
        price: product.price,
        quantity: product.quantity,
        status: product.status,
      });
    }
  }, [product, form]);

  const updateMutation = useMutation({
    mutationFn: (values: any) => {
      return productApi.updateProduct(productCode, {
        description: values.description,
        category: values.category,
        price: values.price,
        quantity: values.quantity,
        status: values.status,
        image: fileList[0]?.originFileObj,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', productCode] });
      message.success('商品更新成功！');
      navigate('/products');
    },
    onError: (error: any) => {
      message.error(error.message || '更新失败');
    },
  });

  const handleSubmit = (values: any) => {
    updateMutation.mutate(values);
  };

  const handleUploadChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !product) {
    return <ErrorMessage message="加载商品失败" />;
  }

  const imageUrl = product.hasImage ? productApi.getProductImage(product.code) : '';

  return (
    <div>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/products')}
        style={{ marginBottom: '16px' }}
      >
        返回列表
      </Button>

      <Card title={`编辑商品: ${product.description}`}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="商品名称"
            name="description"
            rules={[{ required: true, message: '请输入商品名称' }]}
          >
            <TextArea rows={2} placeholder="请输入商品名称" />
          </Form.Item>

          <Form.Item
            label="分类"
            name="category"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Select placeholder="请选择分类">
              {categories?.map((cat) => (
                <Option key={cat.id} value={cat.id}>
                  {cat.description}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="价格"
            name="price"
            rules={[{ required: true, message: '请输入价格' }]}
          >
            <InputNumber
              min={0}
              precision={2}
              style={{ width: '100%' }}
              placeholder="请输入价格"
              prefix="¥"
            />
          </Form.Item>

          <Form.Item
            label="库存数量"
            name="quantity"
            rules={[{ required: true, message: '请输入库存数量' }]}
          >
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              placeholder="请输入库存数量"
            />
          </Form.Item>

          <Form.Item
            label="状态"
            name="status"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value="active">在售</Option>
              <Option value="inactive">下架</Option>
              <Option value="out_of_stock">缺货</Option>
            </Select>
          </Form.Item>

          <Form.Item label="当前图片">
            {product.hasImage && (
              <ImageWithFallback
                src={imageUrl}
                alt={product.description}
                width={200}
                height={200}
              />
            )}
          </Form.Item>

          <Form.Item label="更换图片" name="image">
            <Upload
              listType="picture"
              maxCount={1}
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>选择新图片</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={updateMutation.isPending}
            >
              保存修改
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
