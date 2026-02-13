// Product and stock types

export interface Category {
  id: number;
  description: string;
}

export interface Product {
  code: number;
  description: string;
  category: number;
  price: number;
  quantity: number;
  status: 'active' | 'inactive' | 'out_of_stock' | 'deleted';
  image?: string;
}

export interface ProductResponseDTO {
  code: number;
  description: string;
  category: number;
  categoryName?: string;
  price: number;
  quantity: number;
  status: string;
  hasImage: boolean;
}

export interface ProductListResponse {
  content: ProductResponseDTO[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ProductCreateRequest {
  description: string;
  category: number;
  price: number;
  quantity: number;
  status: string;
  image?: File;
}

export interface ProductUpdateRequest extends ProductCreateRequest {
  code: number;
}
