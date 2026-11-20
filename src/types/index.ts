export interface ProductVariation {
  id: string;
  size: string;      // e.g. "60 Veggie Capsules", "120 Veggie Capsules", "30ml", "100g"
  price: number;     // in INR (₹)
  comparePrice?: number;
  stock: number;
  imageUrl?: string;
  sku: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'Ayurvedic & Herbal' | 'Vitamins & Supplements' | 'Daily Wellness' | 'Skin & Haircare' | 'Pain Relief' | 'Health Devices';
  shortDescription: string;
  description: string;
  keyIngredients: string[];
  dosageInstructions: string;
  benefits: string[];
  rating: number;
  reviewsCount: number;
  featured: boolean;
  basePrice: number;
  baseComparePrice?: number;
  defaultImageUrl: string;
  galleryImages: string[];
  variations: ProductVariation[];
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  productName: string;
  imageUrl: string;
  selectedVariation: ProductVariation;
  quantity: number;
  unitPrice: number;
}

export interface CustomerDetails {
  fullName: string;
  phone: string;
  email: string;
  addressLine: string;
  locality: string;
  city: string;
  state: string;
  pinCode: string;
  notes?: string;
}

export interface CustomerProfile {
  fullName: string;
  phone: string;
  email: string;
  addressLine: string;
  locality: string;
  city: string;
  state: string;
  pinCode: string;
  updatedAt?: string;
}

export type PaymentMethod = 'COD' | 'UPI' | 'CARD' | 'NETBANKING';
export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  orderNumber: string; // e.g. "SP-728190"
  createdAt: string;
  customer: CustomerDetails;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Pending' | 'Paid';
  orderStatus: OrderStatus;
  trackingNumber?: string;
  estimatedDeliveryDate: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  passwordHash: string; // SHA-256
  name: string;
  role: 'superadmin' | 'pharmacist';
  lastLogin?: string;
}

export type ApiIntegrationCategory =
  | 'Payment Gateway'
  | 'Shipping & Courier'
  | 'SMS & WhatsApp'
  | 'ERP & Inventory'
  | 'Analytics & Custom';

export type ApiAuthType = 'Bearer' | 'API Key Header' | 'Basic Auth';

export interface ApiIntegration {
  id: string;
  name: string;
  provider: string;
  category: ApiIntegrationCategory;
  description: string;
  baseUrl: string;
  authType: ApiAuthType;
  headerName: string;
  apiKey: string;
  apiSecret?: string;
  webhookUrl?: string;
  environment: 'sandbox' | 'live';
  enabled: boolean;
  isBuiltIn?: boolean;
  lastTestedAt?: string;
  lastTestStatus?: 'success' | 'error';
  lastTestMessage?: string;
  updatedAt: string;
}

export type StoreApiScope =
  | 'products:read'
  | 'products:write'
  | 'orders:read'
  | 'orders:write'
  | 'inventory:sync';

export interface StoreApiKey {
  id: string;
  label: string;
  apiKey: string;
  environment: 'sandbox' | 'live';
  scopes: StoreApiScope[];
  active: boolean;
  createdAt: string;
  lastUsedAt?: string;
}

