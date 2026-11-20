import React, { useState, useEffect } from 'react';
import {
  Lock, KeyRound, ShieldAlert, Package, ShoppingCart, FileText,
  Server, Settings, LogOut, Plus, Edit2, Trash2, CheckCircle2,
  AlertTriangle, RefreshCw, Eye, Download, Copy, ExternalLink,
  Search, ArrowRight, Check, X, Printer, Plug
} from 'lucide-react';
import { Product, ProductVariation, Order, AdminUser } from '../../types';
import { storage } from '../../services/storage';
import {
  CPANEL_SQL_SCHEMA, CPANEL_CONFIG_PHP, CPANEL_API_PHP, CPANEL_HTACCESS,
  LARAVEL_ROUTES_PHP, LARAVEL_PRODUCT_CONTROLLER, README_DEPLOYMENT_TXT,
  downloadTextFile, downloadFullCpanelZip
} from '../../services/cpanelBundle';
import { ApiIntegrationsPanel } from './ApiIntegrationsPanel';

interface AdminPortalProps {
  onExitToStore: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onExitToStore }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(storage.isAdminAuthenticated());
  const [loginInput, setLoginInput] = useState('admin@saatvikpharma.com');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'integrations' | 'cpanel' | 'security'>('dashboard');

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [adminUser, setAdminUser] = useState<AdminUser>(storage.getAdminUser());
  const [activeIntegrationsCount, setActiveIntegrationsCount] = useState<number>(0);

  // Product CRUD states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productSearch, setProductSearch] = useState('');

  // Password change states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ success: boolean; text: string } | null>(null);

  // Copied indicator
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const loadData = () => {
    setProducts(storage.getProducts());
    setOrders(storage.getOrders());
    setAdminUser(storage.getAdminUser());
    setActiveIntegrationsCount(
      storage.getApiIntegrations().filter((i) => i.enabled && Boolean(i.apiKey)).length
    );
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    const success = await storage.verifyAdminLogin(loginInput, passwordInput);
    setIsLoggingIn(false);

    if (success) {
      setIsAuthenticated(true);
      loadData();
    } else {
      setLoginError('Invalid administrator credentials. Please check your username/password.');
    }
  };

  const handleLogout = () => {
    storage.adminLogout();
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['orderStatus']) => {
    storage.updateOrderStatus(orderId, status);
    loadData();
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete product "${name}"? This will remove all its variations.`)) {
      storage.deleteProduct(id);
      loadData();
    }
  };

  const handleSaveProduct = (p: Product) => {
    storage.saveProduct(p);
    setIsProductModalOpen(false);
    setEditingProduct(null);
    loadData();
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    const result = await storage.updateAdminPassword(oldPassword, newPassword);
    setPasswordMsg({ success: result.success, text: result.message });
    if (result.success) {
      setOldPassword('');
      setNewPassword('');
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Metrics
  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const lowStockCount = products.reduce((acc, p) => {
    const hasLow = p.variations.some(v => v.stock < 15);
    return hasLow ? acc + 1 : acc;
  }, 0);

  // -------------------------------------------------------------------------
  // LOGIN SCREEN (Dedicated private gate)
  // -------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-800 rounded-3xl border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Saatvik Pharma Administration</h1>
            <p className="text-xs text-slate-400">
              Dedicated private portal for inventory, orders & product variations.
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Admin Email / Username</label>
              <input
                type="text"
                required
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                placeholder="admin@saatvikpharma.com"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Password</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 font-mono text-xs"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 text-[11px] text-slate-400 space-y-1">
              <p className="font-semibold text-slate-300">Default Authorized Credentials:</p>
              <p className="font-mono text-slate-400">User: <span className="text-emerald-400">admin@saatvikpharma.com</span></p>
              <p className="font-mono text-slate-400">Pass: <span className="text-emerald-400">Saatvik@Admin2026!</span></p>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isLoggingIn ? 'Authenticating...' : 'Sign In to Portal'}</span>
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={onExitToStore}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            >
              ← Return to Public Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // AUTHENTICATED ADMIN DASHBOARD
  // -------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800">
      {/* Admin Top Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold font-serif text-lg">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white tracking-tight">Saatvik Pharma</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Control Center
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Private URL Portal: /admin</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onExitToStore}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Public Store</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-300 hover:text-white bg-rose-950/60 hover:bg-rose-900 border border-rose-900 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
          <nav className="flex items-center gap-1 overflow-x-auto py-2 text-xs">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Products & Variations ({products.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Orders ({orders.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('integrations')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'integrations'
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Plug className="w-3.5 h-3.5" />
              <span>API Integrations{activeIntegrationsCount > 0 ? ` (${activeIntegrationsCount})` : ''}</span>
            </button>
            <button
              onClick={() => setActiveTab('cpanel')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'cpanel'
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>cPanel Deployment Suite</span>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Admin Security</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Tab Views */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* ================================================================= */}
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {/* ================================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-xs text-slate-500 font-medium">Total Revenue</span>
                <p className="text-2xl font-extrabold text-[#0F2C59] mt-1 tabular-nums">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </p>
                <p className="text-[11px] text-emerald-700 font-medium mt-1">Across all confirmed customer orders</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-xs text-slate-500 font-medium">Customer Orders</span>
                <p className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
                  {orders.length}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  {orders.filter(o => o.orderStatus === 'Confirmed').length} processing dispatch
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-xs text-slate-500 font-medium">Active Catalog Products</span>
                <p className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
                  {products.length}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  {products.reduce((acc, p) => acc + p.variations.length, 0)} total size/pack variations
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-xs text-slate-500 font-medium">Inventory Alerts</span>
                <p className="text-2xl font-extrabold text-amber-600 mt-1 tabular-nums">
                  {lowStockCount}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">Products with stock under 15 units</p>
              </div>
            </div>

            {/* Quick Recent Orders */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Recent Pharmacy Orders</h3>
                  <p className="text-xs text-slate-500">Live order status management</p>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-emerald-700 font-semibold hover:underline cursor-pointer"
                >
                  View All Orders →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Order #</th>
                      <th className="px-4 py-3 font-semibold">Customer</th>
                      <th className="px-4 py-3 font-semibold">Items</th>
                      <th className="px-4 py-3 font-semibold">Total Amount</th>
                      <th className="px-4 py-3 font-semibold">Payment</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.slice(0, 5).map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50/70">
                        <td className="px-4 py-3 font-mono font-bold text-slate-900">{o.orderNumber}</td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-slate-900">{o.customer.fullName}</p>
                          <p className="text-[11px] text-slate-500">{o.customer.city}, {o.customer.state}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-medium">{o.items.length} items</span>
                          <p className="text-[11px] text-slate-500 truncate max-w-[150px]">
                            {o.items[0]?.productName} ({o.items[0]?.selectedVariation.size})
                          </p>
                        </td>
                        <td className="px-4 py-3 font-bold text-[#0F2C59] tabular-nums">
                          ₹{o.totalAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px]">
                            {o.paymentMethod}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-0.5 rounded-full font-semibold text-[10px] ${
                            o.orderStatus === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : o.orderStatus === 'Shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {o.orderStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={o.orderStatus}
                            onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as Order['orderStatus'])}
                            className="text-[11px] px-2 py-1 bg-white border border-slate-300 rounded-lg cursor-pointer"
                          >
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: PRODUCTS & VARIATIONS (FULL CRUD) */}
        {/* ================================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Pharmacy Product Catalog</h2>
                <p className="text-xs text-slate-500">Manage medicine details, images, stock, and color/size variations</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setIsProductModalOpen(true);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>

                <button
                  onClick={() => {
                    if (window.confirm('Reset all catalog and orders to fresh seed data?')) {
                      storage.resetStoreDefaults();
                      loadData();
                    }
                  }}
                  className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-medium flex items-center gap-1 cursor-pointer"
                  title="Reset to default seed products"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Demo</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Product</th>
                      <th className="px-4 py-3 font-semibold">Category</th>
                      <th className="px-4 py-3 font-semibold">Base Price</th>
                      <th className="px-4 py-3 font-semibold">Size Variations</th>
                      <th className="px-4 py-3 font-semibold">Total Stock</th>
                      <th className="px-4 py-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((p) => {
                      const totalStock = p.variations.reduce((sum, v) => sum + v.stock, 0);
                      return (
                        <tr key={p.id} className="hover:bg-slate-50/70">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shrink-0">
                                <img
                                  src={p.defaultImageUrl}
                                  alt={p.name}
                                  className="w-full h-full object-contain"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{p.name}</p>
                                <p className="text-[11px] text-slate-400 font-mono">SKU: {p.slug}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-600">{p.category}</td>
                          <td className="px-4 py-3 font-bold text-[#0F2C59] tabular-nums">
                            ₹{p.basePrice.toLocaleString('en-IN')}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {p.variations.map((v) => (
                                <span
                                  key={v.id}
                                  className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] text-slate-700 font-medium"
                                  title={`${v.size} (₹${v.price}, Stock: ${v.stock})`}
                                >
                                  {v.size} · ₹{v.price}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`font-semibold tabular-nums ${totalStock < 15 ? 'text-amber-600' : 'text-slate-800'}`}>
                              {totalStock} units
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setEditingProduct(p);
                                  setIsProductModalOpen(true);
                                }}
                                className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                title="Edit Product & Variations"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id, p.name)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: ORDER MANAGEMENT */}
        {/* ================================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Customer Orders & Dispatch</h2>
              <p className="text-xs text-slate-500">View real-time customer purchases, update order stages, and assign couriers</p>
            </div>

            <div className="space-y-4">
              {orders.map((ord) => (
                <div key={ord.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                  {/* Order Head */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-base font-bold text-slate-900">{ord.orderNumber}</span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-500">
                        {new Date(ord.createdAt).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Status:</span>
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as Order['orderStatus'])}
                        className="text-xs font-semibold px-3 py-1 bg-slate-50 border border-slate-300 rounded-lg cursor-pointer"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer & Address Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <p className="font-semibold text-slate-800">Customer Contact:</p>
                      <p className="text-slate-900 font-bold mt-0.5">{ord.customer.fullName}</p>
                      <p className="text-slate-600 font-mono">{ord.customer.phone}</p>
                      {ord.customer.email && <p className="text-slate-500">{ord.customer.email}</p>}
                    </div>

                    <div>
                      <p className="font-semibold text-slate-800">Delivery Address:</p>
                      <p className="text-slate-700 mt-0.5">{ord.customer.addressLine}, {ord.customer.locality}</p>
                      <p className="text-slate-700 font-semibold">{ord.customer.city}, {ord.customer.state} - {ord.customer.pinCode}</p>
                    </div>

                    <div>
                      <p className="font-semibold text-slate-800">Payment & Shipment:</p>
                      <p className="text-slate-700 mt-0.5">
                        Method: <span className="font-mono font-bold">{ord.paymentMethod}</span> ({ord.paymentStatus})
                      </p>
                      {ord.trackingNumber && (
                        <p className="text-emerald-800 font-mono font-semibold">AWB: {ord.trackingNumber}</p>
                      )}
                      <p className="text-slate-500">Est. Arrival: {ord.estimatedDeliveryDate}</p>
                    </div>
                  </div>

                  {/* Ordered Items with Variation Details */}
                  <div className="border-t border-slate-100 pt-3">
                    <p className="text-xs font-semibold text-slate-800 mb-2">Ordered Items ({ord.items.length}):</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {ord.items.map((it) => (
                        <div key={it.cartItemId} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center gap-3 text-xs">
                          <div className="w-10 h-10 rounded-lg bg-white p-1 border border-slate-200 shrink-0">
                            <img src={it.imageUrl} alt={it.productName} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-900 truncate">{it.productName}</p>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-600 mt-0.5">
                              <span className="font-medium text-slate-700">Pack: {it.selectedVariation.size}</span>
                              <span>·</span>
                              <span className="font-semibold">{it.quantity} units</span>
                            </div>
                          </div>
                          <span className="font-bold font-mono text-[#0F2C59] tabular-nums">
                            ₹{(it.unitPrice * it.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-3 mt-3 border-t border-slate-100 text-xs">
                      <span className="text-slate-500">
                        Subtotal: ₹{ord.subtotal.toLocaleString('en-IN')} · Discount: ₹{ord.discount} · Delivery: ₹{ord.shippingFee}
                      </span>
                      <span className="text-sm font-extrabold text-[#0F2C59] tabular-nums">
                        Total Amount: ₹{ord.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}



        {/* ================================================================= */}
        {/* TAB 5: CPANEL SHARED HOSTING DEPLOYMENT SUITE */}
        {/* ================================================================= */}
        {activeTab === 'cpanel' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">cPanel Shared Hosting & Laravel Deployment Suite</h2>
                <p className="text-xs text-slate-500">
                  Deploy directly to any standard cPanel shared hosting (Apache/LiteSpeed + PHP + MySQL) or Laravel environment with minimum technical effort.
                </p>
              </div>

              {/* 1-Click Complete Zip Downloads */}
              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href="/saatvikpharma_source_code.zip"
                  download="saatvikpharma_source_code.zip"
                  className="px-4 py-2.5 bg-[#0F2C59] hover:bg-[#153a73] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all hover:scale-[1.02]"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Download Full Project Code (.ZIP - 2.7MB)</span>
                </a>

                <button
                  onClick={() => downloadFullCpanelZip()}
                  className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm shadow-emerald-700/20 cursor-pointer shrink-0 transition-all hover:scale-[1.02]"
                >
                  <Download className="w-4 h-4" />
                  <span>Download cPanel Bundle (.ZIP)</span>
                </button>
              </div>
            </div>

            {/* Quick 1-Click File Downloads */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* SQL Schema */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-mono font-bold text-xs">
                      SQL
                    </span>
                    <span className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-full">Pre-Seeded</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">saatvikpharma_schema.sql</h4>
                  <p className="text-[11px] text-slate-500">MySQL schema with tables, all 6 products & sizes in ₹, plus default admin.</p>
                </div>
                <button
                  onClick={() => downloadTextFile('saatvikpharma_schema.sql', CPANEL_SQL_SCHEMA)}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .sql Schema</span>
                </button>
              </div>

              {/* config.php */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-mono font-bold text-xs">
                      PHP
                    </span>
                    <span className="text-[10px] bg-amber-50 text-amber-700 font-semibold px-2 py-0.5 rounded-full">Needs Config</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">config.php</h4>
                  <p className="text-[11px] text-slate-500">Single database settings file: enter your cPanel MySQL DB, user & password.</p>
                </div>
                <button
                  onClick={() => downloadTextFile('config.php', CPANEL_CONFIG_PHP)}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download config.php</span>
                </button>
              </div>

              {/* api.php */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-mono font-bold text-xs">
                      API
                    </span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">Zero Composer</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">api.php (Self-Contained)</h4>
                  <p className="text-[11px] text-slate-500">Standalone REST API handling products, orders, tracking, and admin actions.</p>
                </div>
                <button
                  onClick={() => downloadTextFile('api.php', CPANEL_API_PHP)}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download api.php</span>
                </button>
              </div>

              {/* .htaccess */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-mono font-bold text-xs">
                      HT
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-full">Apache Rules</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">.htaccess</h4>
                  <p className="text-[11px] text-slate-500">Enforces HTTPS, clean /api routing, private /admin route, and Gzip compression.</p>
                </div>
                <button
                  onClick={() => downloadTextFile('.htaccess', CPANEL_HTACCESS)}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .htaccess</span>
                </button>
              </div>

              {/* Laravel Routes */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-mono font-bold text-xs">
                      LAR
                    </span>
                    <span className="text-[10px] bg-rose-50 text-rose-700 font-semibold px-2 py-0.5 rounded-full">Laravel API</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">routes/api.php</h4>
                  <p className="text-[11px] text-slate-500">Standard Laravel route definitions for products, orders, and authentication.</p>
                </div>
                <button
                  onClick={() => downloadTextFile('routes_api.php', LARAVEL_ROUTES_PHP)}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download routes_api.php</span>
                </button>
              </div>

              {/* Laravel Product Controller */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-mono font-bold text-xs">
                      CTRL
                    </span>
                    <span className="text-[10px] bg-rose-50 text-rose-700 font-semibold px-2 py-0.5 rounded-full">Controller</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">ProductController.php</h4>
                  <p className="text-[11px] text-slate-500">Laravel Eloquent controller returning variations, pricing in ₹, and stock.</p>
                </div>
                <button
                  onClick={() => downloadTextFile('ProductController.php', LARAVEL_PRODUCT_CONTROLLER)}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Controller</span>
                </button>
              </div>
            </div>

            {/* Quick Visual Guide: What to Edit in config.php */}
            <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  <span>The ONLY 4 Lines You Need to Edit in config.php:</span>
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`define('DB_HOST', 'localhost');\ndefine('DB_NAME', 'yourcpanel_saatvik');\ndefine('DB_USER', 'yourcpanel_dbuser');\ndefine('DB_PASS', 'YOUR_STRONG_PASSWORD');`);
                    alert('Copied MySQL snippet to clipboard!');
                  }}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-950/80 rounded-xl font-mono text-[11px] text-emerald-300 overflow-x-auto leading-relaxed border border-slate-800">
{`define('DB_HOST', 'localhost');                  // Usually 'localhost' in cPanel
define('DB_NAME', 'yourcpanel_saatvikpharma');   // Your cPanel database name
define('DB_USER', 'yourcpanel_dbuser');          // Your cPanel database username
define('DB_PASS', 'YOUR_STRONG_PASSWORD_HERE');  // Database password`}
              </pre>
            </div>

            {/* Step-by-Step Deployment Guide Box */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 text-xs">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Simple 5-Step Shared Hosting Deployment Instructions:</span>
              </h3>

              <div className="space-y-3 text-slate-600 leading-relaxed">
                <p>
                  <strong className="text-slate-800">1. Upload Website Files to public_html:</strong> Open cPanel File Manager, go to <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">public_html</code> (or your domain directory). Upload all frontend static assets (<code className="bg-slate-100 px-1 py-0.5 rounded font-mono">index.html</code>, <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">assets/</code> folder, and <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">.htaccess</code>).
                </p>
                <p>
                  <strong className="text-slate-800">2. Create MySQL Database in cPanel:</strong> In cPanel, click <em>MySQL Databases</em>. Create a new database (e.g. <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">youruser_saatvik</code>) and create a database user with a strong password. Add the user to the database with <strong>ALL PRIVILEGES</strong>.
                </p>
                <p>
                  <strong className="text-slate-800">3. Import Database via phpMyAdmin:</strong> Open <em>phpMyAdmin</em> in cPanel, select your newly created database on the left sidebar, click the <em>Import</em> tab, choose <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">saatvikpharma_schema.sql</code>, and click <em>Go</em>. All tables, initial products, pack variations, and the default admin account are created automatically.
                </p>
                <p>
                  <strong className="text-slate-800">4. Place & Configure PHP Backend:</strong> Inside <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">public_html</code>, create a subfolder named <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">api/</code>. Upload <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">config.php</code> and <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">api.php</code> into <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">public_html/api/</code>. Right-click <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">config.php</code>, click <em>Edit</em>, and update the 4 database credential lines shown above.
                </p>
                <p>
                  <strong className="text-slate-800">5. Access Dedicated Private Admin:</strong> Visit <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">https://yourdomain.com/admin</code> (or <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">https://yourdomain.com/#admin</code>). Log in with:
                  <br />
                  <span className="font-mono text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded inline-block mt-1">
                    Username / Email: admin@saatvikpharma.com · Password: Saatvik@Admin2026!
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 6: ADMIN SECURITY & CREDENTIALS */}
        {/* ================================================================= */}
        {activeTab === 'security' && (
          <div className="max-w-xl space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Administrator Security & Password Management</h2>
              <p className="text-xs text-slate-500">Secure SHA-256 hashed password authentication for the private admin panel</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <p className="font-semibold text-slate-800">Current Administrator Profile:</p>
                <p className="text-slate-600">Email: <span className="font-mono text-slate-900">{adminUser.email}</span></p>
                <p className="text-slate-600">Username: <span className="font-mono text-slate-900">{adminUser.username}</span></p>
                <p className="text-slate-600">Access Level: <span className="font-mono text-emerald-700 font-semibold">{adminUser.role}</span></p>
              </div>

              {passwordMsg && (
                <div className={`p-3 rounded-xl text-xs font-semibold ${
                  passwordMsg.success
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border border-rose-200 text-rose-700'
                }`}>
                  {passwordMsg.text}
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Current Password *</label>
                  <input
                    type="password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">New Secure Password (Min 8 characters) *</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new strong password"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Update Admin Password Securely
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 6: API INTEGRATIONS & STORE API KEYS */}
        {/* ================================================================= */}
        {activeTab === 'integrations' && (
          <ApiIntegrationsPanel onIntegrationsChanged={loadData} />
        )}
      </main>

      {/* =================================================================== */}
      {/* ADD / EDIT PRODUCT MODAL (WITH VARIATION BUILDER) */}
      {/* =================================================================== */}
      {isProductModalOpen && (
        <ProductEditorModal
          product={editingProduct}
          onClose={() => {
            setIsProductModalOpen(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
};

// -------------------------------------------------------------------------
// Sub-component: Product & Variation Editor Modal
// -------------------------------------------------------------------------
interface ProductEditorModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: (product: Product) => void;
}

const ProductEditorModal: React.FC<ProductEditorModalProps> = ({
  product,
  onClose,
  onSave
}) => {
  const [name, setName] = useState(product?.name || '');
  const [category, setCategory] = useState<Product['category']>(product?.category || 'Ayurvedic & Herbal');
  const [shortDesc, setShortDesc] = useState(product?.shortDescription || '');
  const [desc, setDesc] = useState(product?.description || '');
  const [basePrice, setBasePrice] = useState(product?.basePrice || 499);
  const [defaultImg, setDefaultImg] = useState(product?.defaultImageUrl || '/src/assets/images/product_ashwagandha_gold_1794289670838.jpg');
  
  // Variations state
  const [variations, setVariations] = useState<ProductVariation[]>(
    product?.variations || [
      {
        id: `var_${Date.now()}_1`,
        size: '60 Capsules',
        price: 499,
        comparePrice: 699,
        stock: 50,
        imageUrl: '/src/assets/images/product_ashwagandha_gold_1794289670838.jpg',
        sku: 'SP-PROD-STD'
      }
    ]
  );

  const handleAddVariation = () => {
    const newVar: ProductVariation = {
      id: `var_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
      size: '120 Capsules',
      price: basePrice + 300,
      comparePrice: basePrice + 500,
      stock: 30,
      imageUrl: defaultImg,
      sku: `SP-${name.slice(0, 3).toUpperCase() || 'VAR'}-${Date.now().toString().slice(-4)}`
    };
    setVariations([...variations, newVar]);
  };

  const handleUpdateVariation = (id: string, updates: Partial<ProductVariation>) => {
    setVariations(variations.map(v => v.id === id ? { ...v, ...updates } : v));
  };

  const handleRemoveVariation = (id: string) => {
    if (variations.length <= 1) {
      alert('A product must have at least one variation.');
      return;
    }
    setVariations(variations.filter(v => v.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const saved: Product = {
      id: product?.id || `sp_${Date.now()}`,
      name: name.trim(),
      slug: product?.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category,
      shortDescription: shortDesc.trim(),
      description: desc.trim(),
      keyIngredients: product?.keyIngredients || ['Pure Ayurvedic Herbs', 'Bio-active Extract'],
      dosageInstructions: product?.dosageInstructions || 'Take 1-2 units daily with warm water.',
      benefits: product?.benefits || ['Supports vitality', 'Pure GMP compliant formulation'],
      rating: product?.rating || 4.8,
      reviewsCount: product?.reviewsCount || 1,
      featured: product?.featured ?? true,
      basePrice: Number(basePrice),
      baseComparePrice: Number(basePrice) * 1.3,
      defaultImageUrl: defaultImg,
      galleryImages: [defaultImg],
      variations
    };

    onSave(saved);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 max-h-[92vh] flex flex-col">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h3 className="text-base font-bold text-slate-900">
            {product ? `Edit Product: ${product.name}` : 'Add New Pharmacy Product'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1 text-xs">
          {/* Main Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Product Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Saatvik Pure Himalayan Shilajit Resin"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Product['category'])}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:border-emerald-600 focus:outline-none"
              >
                <option value="Ayurvedic & Herbal">Ayurvedic & Herbal</option>
                <option value="Vitamins & Supplements">Vitamins & Supplements</option>
                <option value="Daily Wellness">Daily Wellness</option>
                <option value="Skin & Haircare">Skin & Haircare</option>
                <option value="Pain Relief">Pain Relief</option>
                <option value="Health Devices">Health Devices</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Base Price in INR (₹) *</label>
              <input
                type="number"
                required
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Short Description</label>
              <input
                type="text"
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                placeholder="Brief one-line summary for product card"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Full Description</label>
              <textarea
                rows={3}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Detailed clinical background, benefits & formulation details"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Primary Image Path / URL</label>
              <input
                type="text"
                value={defaultImg}
                onChange={(e) => setDefaultImg(e.target.value)}
                placeholder="/src/assets/images/... or image URL"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Variations Section */}
          <div className="border-t border-slate-200 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-xs">Product Variations (Packs & Sizes)</h4>
                <p className="text-[11px] text-slate-500">Each variation has its own pack size, price, stock & specific image!</p>
              </div>
              <button
                type="button"
                onClick={handleAddVariation}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Variation</span>
              </button>
            </div>

            <div className="space-y-3">
              {variations.map((v, idx) => (
                <div key={v.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-[11px]">Variation #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveVariation(v.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-500 font-semibold mb-1">Size / Pack *</label>
                      <input
                        type="text"
                        required
                        value={v.size}
                        onChange={(e) => handleUpdateVariation(v.id, { size: e.target.value })}
                        placeholder="e.g. 60 Capsules or 100ml"
                        className="w-full px-2 py-1.5 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-500 font-semibold mb-1">Price in INR (₹) *</label>
                      <input
                        type="number"
                        required
                        value={v.price}
                        onChange={(e) => handleUpdateVariation(v.id, { price: Number(e.target.value) })}
                        className="w-full px-2 py-1.5 border border-slate-300 rounded-lg bg-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-500 font-semibold mb-1">Stock Quantity *</label>
                      <input
                        type="number"
                        required
                        value={v.stock}
                        onChange={(e) => handleUpdateVariation(v.id, { stock: Number(e.target.value) })}
                        className="w-full px-2 py-1.5 border border-slate-300 rounded-lg bg-white font-mono"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[10px] text-slate-500 font-semibold mb-1">
                        Variation Image URL (Auto swaps on customer select!)
                      </label>
                      <input
                        type="text"
                        value={v.imageUrl}
                        onChange={(e) => handleUpdateVariation(v.id, { imageUrl: e.target.value })}
                        placeholder="/src/assets/images/... or https://..."
                        className="w-full px-2 py-1.5 border border-slate-300 rounded-lg bg-white font-mono text-[11px]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer shadow-sm"
            >
              Save Product & Variations
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
