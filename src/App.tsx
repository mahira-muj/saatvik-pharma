import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { QuickServices } from './components/QuickServices';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { UserAccountModal } from './components/UserAccountModal';
import { DoctorConsultModal } from './components/DoctorConsultModal';
import { PolicyModal, PolicyType } from './components/PolicyModal';
import { AdminPortal } from './components/admin/AdminPortal';
import { Product, ProductVariation, CartItem, Order } from './types';
import { storage } from './services/storage';
import { Star, ArrowRight, ShieldCheck, Heart, Sparkles, Check } from 'lucide-react';

export default function App() {
  // Navigation / Route state: 'store' or 'admin'
  const [currentRoute, setCurrentRoute] = useState<'store' | 'admin'>('store');

  // Product catalog & search state
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('saatvikpharma_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist state (persisted in localStorage)
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => storage.getWishlist());

  // Customer Orders state (persisted in localStorage)
  const [orders, setOrders] = useState<Order[]>(() => storage.getOrders());

  // Modals state
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [activeVariation, setActiveVariation] = useState<ProductVariation | undefined>(undefined);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutDiscount, setCheckoutDiscount] = useState(0);
  const [checkoutDiscountCode, setCheckoutDiscountCode] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [isDoctorConsultOpen, setIsDoctorConsultOpen] = useState(false);
  const [policyModalType, setPolicyModalType] = useState<PolicyType | null>(null);

  // Sync route with URL hash or path
  useEffect(() => {
    const handleUrlChange = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      if (hash === '#admin' || hash.startsWith('#/admin') || path.startsWith('/admin')) {
        setCurrentRoute('admin');
      } else {
        setCurrentRoute('store');
      }
    };

    handleUrlChange();
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);

    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  // Save cart changes
  useEffect(() => {
    localStorage.setItem('saatvikpharma_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Load products from storage
  useEffect(() => {
    setProducts(storage.getProducts());
  }, []);

  // Add to cart handler
  const handleAddToCart = (product: Product, variation: ProductVariation, quantity: number = 1) => {
    const cartItemId = `${product.id}_${variation.id}`;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prev,
          {
            cartItemId,
            productId: product.id,
            productName: product.name,
            imageUrl: variation.imageUrl || product.defaultImageUrl,
            selectedVariation: variation,
            quantity,
            unitPrice: variation.price
          }
        ];
      }
    });
  };

  const handleUpdateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(cartItemId);
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item
        )
      );
    }
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  // Wishlist handlers
  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const updated = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [productId, ...prev];
      storage.saveWishlist(updated);
      return updated;
    });
  };

  const handleClearWishlist = () => {
    setWishlistIds([]);
    storage.saveWishlist([]);
  };

  const handleOpenProduct = (product: Product, initialVariation?: ProductVariation) => {
    setActiveProduct(product);
    setActiveVariation(initialVariation);
  };

  const handleBuyNow = (product: Product, variation: ProductVariation, quantity: number) => {
    handleAddToCart(product, variation, quantity);
    setActiveProduct(null);
    setCheckoutDiscount(0);
    setCheckoutDiscountCode('');
    setIsCheckoutOpen(true);
  };

  const handleProceedToCheckout = (appliedDiscount: number, discountCode: string) => {
    setCheckoutDiscount(appliedDiscount);
    setCheckoutDiscountCode(discountCode);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderPlaced = (order: Order) => {
    storage.saveOrder(order);
    storage.saveCustomerProfile({
      fullName: order.customer.fullName,
      phone: order.customer.phone,
      email: order.customer.email,
      addressLine: order.customer.addressLine,
      locality: order.customer.locality,
      city: order.customer.city,
      state: order.customer.state,
      pinCode: order.customer.pinCode
    });
    setOrders(storage.getOrders());
    setConfirmedOrder(order);
    setIsCheckoutOpen(false);
    setCartItems([]); // Clear cart
    // Refresh products to reflect updated inventory
    setProducts(storage.getProducts());
  };

  const handleOpenAccount = () => {
    setOrders(storage.getOrders());
    setIsAccountOpen(true);
  };

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      const liveProduct = products.find((p) => p.id === item.productId);
      if (liveProduct) {
        const liveVar =
          liveProduct.variations.find((v) => v.id === item.selectedVariation.id) ||
          liveProduct.variations[0] ||
          item.selectedVariation;
        handleAddToCart(liveProduct, liveVar, item.quantity);
      } else {
        // Fallback when product was edited/removed: restore recorded item directly to cart
        setCartItems((prev) => {
          const existing = prev.find((c) => c.cartItemId === item.cartItemId);
          if (existing) {
            return prev.map((c) =>
              c.cartItemId === item.cartItemId ? { ...c, quantity: c.quantity + item.quantity } : c
            );
          }
          return [...prev, { ...item }];
        });
      }
    });
  };

  const handleExitToStore = () => {
    window.location.hash = '';
    setOrders(storage.getOrders());
    setProducts(storage.getProducts());
    setCurrentRoute('store');
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'All' || p.category === selectedCategory;
    const matchesQuery =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.keyIngredients.some((ing) => ing.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  // ---------------------------------------------------------------------------
  // RENDER DEDICATED ADMIN PORTAL (Accessible ONLY at /admin or #admin)
  // ---------------------------------------------------------------------------
  if (currentRoute === 'admin') {
    return <AdminPortal onExitToStore={handleExitToStore} />;
  }

  // ---------------------------------------------------------------------------
  // RENDER PUBLIC PHARMACY STOREFRONT (Zero admin links anywhere)
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-800">
      {/* Public Header */}
      <Header
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        wishlistCount={wishlistProducts.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        ordersCount={orders.length}
        onOpenAccount={handleOpenAccount}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
        onSearch={(query, cat) => {
          setSearchQuery(query);
          if (cat !== 'All') setSelectedCategory(cat);
        }}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSearchQuery('');
        }}
        onNavigateHome={() => {
          setSelectedCategory('All');
          setSearchQuery('');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-6">
        {/* Hero Section */}
        {selectedCategory === 'All' && !searchQuery && (
          <>
            <Hero
              onExploreCatalog={() => {
                const el = document.getElementById('catalog-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenDoctorConsult={() => setIsDoctorConsultOpen(true)}
            />

            {/* Quick Healthcare Services Strip */}
            <QuickServices
              onOpenDoctorConsult={() => setIsDoctorConsultOpen(true)}
              onExploreCatalog={() => {
                const el = document.getElementById('catalog-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
            />
          </>
        )}

        {/* Catalog Section */}
        <div id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4 pb-3 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-mono">
                {selectedCategory === 'All' ? 'Curated Pharmacy Collection' : selectedCategory}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F2C59] mt-0.5">
                {selectedCategory === 'All' ? 'Trending Health & Ayurvedic Formulations' : `${selectedCategory} Products`}
              </h2>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Showing {filteredProducts.length} certified medicines & supplements</span>
            </div>
          </div>

          {/* Product Cards Grid with Color/Size Variation Previews */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
              <p className="text-base font-bold text-slate-800">No products found matching your search</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try searching for other Ayurvedic herbs like Ashwagandha, Omega-3, Kumkumadi oil, or clear filters.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="mt-2 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Reset Catalog Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={handleOpenProduct}
                  onAddToCart={(prod, variation) => handleAddToCart(prod, variation, 1)}
                  isWishlisted={wishlistIds.includes(product.id)}
                  onToggleWishlist={handleToggleWishlist}
                />
              ))}
            </div>
          )}
        </div>

        {/* Promotional Split Banner Section */}
        {selectedCategory === 'All' && !searchQuery && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Banner 1 */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-7 sm:p-8 flex flex-col justify-between shadow-lg">
                <div className="space-y-2 max-w-md z-10">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
                    Up to 25% Off
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
                    Pure Vedic Wellness & Herbal Immunity
                  </h3>
                  <p className="text-xs text-emerald-100/90 leading-relaxed">
                    Cold-pressed Ayurvedic elixirs, Chyawanprash, and organic adaptogenic capsules formulated under clinical Ayush supervision.
                  </p>
                </div>

                <div className="pt-4 z-10">
                  <button
                    onClick={() => setSelectedCategory('Ayurvedic & Herbal')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-emerald-950 rounded-xl text-xs font-bold hover:bg-emerald-50 transition-colors cursor-pointer"
                  >
                    <span>Shop Ayurvedic Range</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Banner 2 */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F2C59] to-slate-900 text-white p-7 sm:p-8 flex flex-col justify-between shadow-lg">
                <div className="space-y-2 max-w-md z-10">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-300">
                    Pharmacist Certified
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
                    Essential Vitamins, Minerals & Heart Care
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Triple-strength Omega 3, Vitamin D3 K2, plant calcium & joint nutrition with high bioavailability.
                  </p>
                </div>

                <div className="pt-4 z-10">
                  <button
                    onClick={() => setSelectedCategory('Vitamins & Supplements')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <span>Explore Supplements</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Customer Reviews Section */}
        {selectedCategory === 'All' && !searchQuery && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="text-center max-w-2xl mx-auto mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-mono">Verified Customer Trust</span>
              <h2 className="text-2xl font-serif font-bold text-[#0F2C59] mt-0.5">What Families Across India Say</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 italic leading-relaxed">
                  "The Saatvik Ashwagandha Gold and Omega-3 arrived in Delhi within 24 hours in sealed tamper-proof packaging. You can immediately feel the purity compared to ordinary brands."
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900">Dr. Alok Nath</p>
                    <p className="text-[10px] text-slate-400">South Delhi · Verified Buyer</p>
                  </div>
                  <span className="text-emerald-700 font-semibold text-[10px] bg-emerald-50 px-2 py-0.5 rounded">Verified Order</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 italic leading-relaxed">
                  "I was able to select the 120-capsule value pack easily and the product arrived on time! Truly authentic Ayurvedic quality with prompt delivery. Exceptional service."
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900">Meenakshi Sundaram</p>
                    <p className="text-[10px] text-slate-400">Chennai · Verified Buyer</p>
                  </div>
                  <span className="text-emerald-700 font-semibold text-[10px] bg-emerald-50 px-2 py-0.5 rounded">Verified Order</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 italic leading-relaxed">
                  "Kumkumadi Tailam with genuine Kashmiri saffron gave my skin an authentic natural glow within 3 weeks. Cash on delivery was seamless and the courier gave a proper printed GST bill."
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900">Pooja Deshmukh</p>
                    <p className="text-[10px] text-slate-400">Pune · Verified Buyer</p>
                  </div>
                  <span className="text-emerald-700 font-semibold text-[10px] bg-emerald-50 px-2 py-0.5 rounded">Verified Order</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Public Footer (Zero admin links) */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSearchQuery('');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAccount={handleOpenAccount}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
        onOpenDoctorConsult={() => setIsDoctorConsultOpen(true)}
        onOpenPolicy={(type) => setPolicyModalType(type)}
      />

      {/* ===================================================================== */}
      {/* ALL INTERACTIVE MODALS */}
      {/* ===================================================================== */}

      {/* Product Detail Modal (PDP) with dynamic image switching on variation change */}
      <ProductDetailModal
        product={activeProduct}
        initialVariation={activeVariation}
        onClose={() => setActiveProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        isWishlisted={activeProduct ? wishlistIds.includes(activeProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleProceedToCheckout}
      />

      {/* Wishlist / My Favorites Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        items={wishlistProducts}
        onRemoveItem={handleToggleWishlist}
        onClearAll={handleClearWishlist}
        onSelectProduct={handleOpenProduct}
        onAddToCart={(prod, variation) => handleAddToCart(prod, variation, 1)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        discount={checkoutDiscount}
        discountCode={checkoutDiscountCode}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Order Confirmation Screen */}
      <OrderConfirmationModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
        onViewOrderHistory={() => {
          setConfirmedOrder(null);
          handleOpenAccount();
        }}
      />

      {/* User Account / Profile Area with Order History */}
      <UserAccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        orders={orders}
        wishlistCount={wishlistProducts.length}
        onReorder={handleReorder}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
      />

      {/* Customer Order Tracker */}
      <OrderTrackerModal
        isOpen={isTrackOrderOpen}
        onClose={() => setIsTrackOrderOpen(false)}
      />

      {/* Doctor Consultation Booking */}
      <DoctorConsultModal
        isOpen={isDoctorConsultOpen}
        onClose={() => setIsDoctorConsultOpen(false)}
      />

      {/* Customer Policies & Information Modal */}
      <PolicyModal
        isOpen={policyModalType !== null}
        onClose={() => setPolicyModalType(null)}
        type={policyModalType || 'about'}
      />
    </div>
  );
}
