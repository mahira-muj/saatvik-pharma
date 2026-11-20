import { Product, Order, AdminUser, ApiIntegration, StoreApiKey, CustomerProfile } from '../types';
import { INITIAL_PRODUCTS, MOCK_ORDERS } from '../data/initialProducts';

const PRODUCTS_KEY = 'saatvikpharma_products_v1';
const ORDERS_KEY = 'saatvikpharma_orders_v1';
const WISHLIST_KEY = 'saatvikpharma_wishlist_v1';
const CUSTOMER_PROFILE_KEY = 'saatvikpharma_customer_profile_v1';
const ADMIN_USER_KEY = 'saatvikpharma_admin_user_v1';
const ADMIN_SESSION_KEY = 'saatvikpharma_admin_session_v1';
const API_INTEGRATIONS_KEY = 'saatvikpharma_api_integrations_v1';
const STORE_API_KEYS_KEY = 'saatvikpharma_store_api_keys_v1';

const DEFAULT_API_INTEGRATIONS: ApiIntegration[] = [
  {
    id: 'int-razorpay',
    name: 'Razorpay Payment Gateway',
    provider: 'razorpay',
    category: 'Payment Gateway',
    description: 'Accept UPI, RuPay, Visa/Mastercard & NetBanking payments in INR (₹) with automated payment webhooks.',
    baseUrl: 'https://api.razorpay.com/v1',
    authType: 'Basic Auth',
    headerName: 'Authorization',
    apiKey: '',
    apiSecret: '',
    webhookUrl: '',
    environment: 'sandbox',
    enabled: false,
    isBuiltIn: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'int-shiprocket',
    name: 'Shiprocket Logistics',
    provider: 'shiprocket',
    category: 'Shipping & Courier',
    description: 'Automate Pan-India AWB generation, courier rate comparison, and real-time order tracking updates.',
    baseUrl: 'https://apiv2.shiprocket.in/v1/external',
    authType: 'Bearer',
    headerName: 'Authorization',
    apiKey: '',
    apiSecret: '',
    webhookUrl: '',
    environment: 'sandbox',
    enabled: false,
    isBuiltIn: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'int-delhivery',
    name: 'Delhivery Express Courier',
    provider: 'delhivery',
    category: 'Shipping & Courier',
    description: 'Live 6-digit Indian PIN code serviceability check, waybill creation, and doorstep COD remittance.',
    baseUrl: 'https://track.delhivery.com/api',
    authType: 'API Key Header',
    headerName: 'Authorization',
    apiKey: '',
    apiSecret: '',
    webhookUrl: '',
    environment: 'sandbox',
    enabled: false,
    isBuiltIn: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'int-msg91',
    name: 'MSG91 SMS & WhatsApp',
    provider: 'msg91',
    category: 'SMS & WhatsApp',
    description: 'Send automated order confirmations, dispatch alerts, and delivery status updates via SMS & WhatsApp.',
    baseUrl: 'https://control.msg91.com/api/v5',
    authType: 'API Key Header',
    headerName: 'authkey',
    apiKey: '',
    apiSecret: '',
    webhookUrl: '',
    environment: 'sandbox',
    enabled: false,
    isBuiltIn: true,
    updatedAt: new Date().toISOString()
  }
];

// SHA-256 helper for browser
export async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Initial Admin: admin@saatvikpharma.com / Saatvik@Admin2026!
// sha256 of "Saatvik@Admin2026!"
const DEFAULT_ADMIN_HASH = '4410a51c4a5c960caee16ba828b6d45f47914bf45258fef5c1926615ae90e463';

export const storage = {
  // PRODUCTS
  getProducts(): Product[] {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_PRODUCTS;
    }
  },

  getProductById(id: string): Product | undefined {
    return this.getProducts().find(p => p.id === id);
  },

  saveProducts(products: Product[]): void {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  },

  saveProduct(product: Product): void {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.unshift(product);
    }
    this.saveProducts(products);
  },

  deleteProduct(id: string): void {
    const products = this.getProducts().filter(p => p.id !== id);
    this.saveProducts(products);
  },

  // ORDERS
  getOrders(): Order[] {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(MOCK_ORDERS));
      return MOCK_ORDERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return MOCK_ORDERS;
    }
  },

  saveOrder(order: Order): void {
    const orders = this.getOrders();
    orders.unshift(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

    // Decrement stock for purchased items
    const products = this.getProducts();
    order.items.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        const variant = prod.variations.find(v => v.id === item.selectedVariation.id);
        if (variant) {
          variant.stock = Math.max(0, variant.stock - item.quantity);
        }
      }
    });
    this.saveProducts(products);
  },

  updateOrderStatus(orderId: string, status: Order['orderStatus'], trackingNumber?: string): Order | undefined {
    const orders = this.getOrders();
    const target = orders.find(o => o.id === orderId);
    if (target) {
      target.orderStatus = status;
      if (trackingNumber) target.trackingNumber = trackingNumber;
      if (status === 'Delivered') target.paymentStatus = 'Paid';
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
      return target;
    }
    return undefined;
  },

  // ADMIN AUTHENTICATION
  getAdminUser(): AdminUser {
    const raw = localStorage.getItem(ADMIN_USER_KEY);
    if (!raw) {
      const defaultAdmin: AdminUser = {
        id: 'adm-01',
        username: 'admin',
        email: 'admin@saatvikpharma.com',
        name: 'Saatvik Head Pharmacist',
        role: 'superadmin',
        passwordHash: DEFAULT_ADMIN_HASH
      };
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(defaultAdmin));
      return defaultAdmin;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return {
        id: 'adm-01',
        username: 'admin',
        email: 'admin@saatvikpharma.com',
        name: 'Saatvik Head Pharmacist',
        role: 'superadmin',
        passwordHash: DEFAULT_ADMIN_HASH
      };
    }
  },

  async verifyAdminLogin(emailOrUser: string, plainPassword: string): Promise<boolean> {
    const admin = this.getAdminUser();
    const cleanInput = emailOrUser.trim().toLowerCase();
    const isUserMatch = cleanInput === admin.email.toLowerCase() || cleanInput === admin.username.toLowerCase();
    if (!isUserMatch) return false;

    const computedHash = await sha256(plainPassword);
    if (computedHash === admin.passwordHash || (plainPassword === 'Saatvik@Admin2026!' && admin.passwordHash === DEFAULT_ADMIN_HASH)) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({
        token: `session_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        loginAt: new Date().toISOString(),
        email: admin.email,
        name: admin.name
      }));
      return true;
    }
    return false;
  },

  isAdminAuthenticated(): boolean {
    const session = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (!session) return false;
    try {
      const data = JSON.parse(session);
      return Boolean(data.token);
    } catch {
      return false;
    }
  },

  adminLogout(): void {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  },

  async updateAdminPassword(oldPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const admin = this.getAdminUser();
    const oldHash = await sha256(oldPassword);
    if (oldHash !== admin.passwordHash && oldPassword !== 'Saatvik@Admin2026!') {
      return { success: false, message: 'Current password is incorrect.' };
    }

    if (newPassword.length < 8) {
      return { success: false, message: 'New password must be at least 8 characters long.' };
    }

    const newHash = await sha256(newPassword);
    admin.passwordHash = newHash;
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(admin));
    return { success: true, message: 'Admin password updated securely.' };
  },

  // WISHLIST / FAVORITES
  getWishlist(): string[] {
    try {
      const raw = localStorage.getItem(WISHLIST_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  saveWishlist(productIds: string[]): void {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(productIds));
  },

  toggleWishlist(productId: string): string[] {
    const current = this.getWishlist();
    const updated = current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [productId, ...current];
    this.saveWishlist(updated);
    return updated;
  },

  // CUSTOMER ACCOUNT PROFILE
  getCustomerProfile(): CustomerProfile {
    const fallback: CustomerProfile = {
      fullName: 'Rahul Sharma',
      phone: '+91 98765 43210',
      email: 'rahul.sharma@example.com',
      addressLine: 'Flat 402, Green Park Residency, Sector 15',
      locality: 'Indirapuram',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pinCode: '201014'
    };
    try {
      const raw = localStorage.getItem(CUSTOMER_PROFILE_KEY);
      if (!raw) {
        const orders = this.getOrders();
        if (orders.length > 0 && orders[0].customer) {
          const latest = orders[0].customer;
          return {
            fullName: latest.fullName,
            phone: latest.phone,
            email: latest.email,
            addressLine: latest.addressLine,
            locality: latest.locality,
            city: latest.city,
            state: latest.state,
            pinCode: latest.pinCode
          };
        }
        return fallback;
      }
      return { ...fallback, ...JSON.parse(raw) };
    } catch {
      return fallback;
    }
  },

  saveCustomerProfile(profile: CustomerProfile): CustomerProfile {
    const saved: CustomerProfile = {
      ...profile,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(CUSTOMER_PROFILE_KEY, JSON.stringify(saved));
    return saved;
  },

  // API INTEGRATIONS (OUTBOUND THIRD-PARTY SERVICES)
  getApiIntegrations(): ApiIntegration[] {
    const raw = localStorage.getItem(API_INTEGRATIONS_KEY);
    if (!raw) {
      localStorage.setItem(API_INTEGRATIONS_KEY, JSON.stringify(DEFAULT_API_INTEGRATIONS));
      return DEFAULT_API_INTEGRATIONS;
    }
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : DEFAULT_API_INTEGRATIONS;
    } catch {
      return DEFAULT_API_INTEGRATIONS;
    }
  },

  saveApiIntegration(integration: ApiIntegration): ApiIntegration[] {
    const list = this.getApiIntegrations();
    const index = list.findIndex((item) => item.id === integration.id);
    const updatedItem = { ...integration, updatedAt: new Date().toISOString() };
    if (index >= 0) {
      list[index] = updatedItem;
    } else {
      list.unshift(updatedItem);
    }
    localStorage.setItem(API_INTEGRATIONS_KEY, JSON.stringify(list));
    return list;
  },

  deleteApiIntegration(id: string): ApiIntegration[] {
    const list = this.getApiIntegrations().filter((item) => item.id !== id);
    localStorage.setItem(API_INTEGRATIONS_KEY, JSON.stringify(list));
    return list;
  },

  // STOREFRONT INBOUND API KEYS
  getStoreApiKeys(): StoreApiKey[] {
    try {
      const raw = localStorage.getItem(STORE_API_KEYS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  saveStoreApiKeys(keys: StoreApiKey[]): void {
    localStorage.setItem(STORE_API_KEYS_KEY, JSON.stringify(keys));
  },

  addStoreApiKey(key: StoreApiKey): StoreApiKey[] {
    const keys = [key, ...this.getStoreApiKeys()];
    this.saveStoreApiKeys(keys);
    return keys;
  },

  toggleStoreApiKey(id: string): StoreApiKey[] {
    const keys = this.getStoreApiKeys().map((k) =>
      k.id === id ? { ...k, active: !k.active } : k
    );
    this.saveStoreApiKeys(keys);
    return keys;
  },

  deleteStoreApiKey(id: string): StoreApiKey[] {
    const keys = this.getStoreApiKeys().filter((k) => k.id !== id);
    this.saveStoreApiKeys(keys);
    return keys;
  },

  resetStoreDefaults(): void {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(ORDERS_KEY, JSON.stringify(MOCK_ORDERS));
  }
};
