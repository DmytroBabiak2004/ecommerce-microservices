export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: string;
  categoryId: number;
  categoryName: string;
}

export interface OrderItemResponse {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderResponse {
  id: number;
  userId: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  orderItems: OrderItemResponse[];
}

export interface OrderItemRequest {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderRequest {
  userId: string;
  orderItems: OrderItemRequest[];
}

export interface AuthResponse {
  token: string;
  expiration: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface RegisterModel {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginModel {
  email: string;
  password: string;
}

export interface CartItem {
  product: ProductResponse;
  quantity: number;
}
