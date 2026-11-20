import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingBag, Zap, ShieldCheck, Truck, RotateCcw, Check, Sparkles, AlertCircle, Heart } from 'lucide-react';
import { Product, ProductVariation } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  initialVariation?: ProductVariation;
  onClose: () => void;
  onAddToCart: (product: Product, variation: ProductVariation, quantity: number) => void;
  onBuyNow: (product: Product, variation: ProductVariation, quantity: number) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  initialVariation,
  onClose,
  onAddToCart,
  onBuyNow,
  isWishlisted = false,
  onToggleWishlist
}) => {
  if (!product) return null;

  const [selectedVariation, setSelectedVariation] = useState<ProductVariation>(
    initialVariation || product.variations[0]
  );
  const [activeImage, setActiveImage] = useState<string>(
    initialVariation?.imageUrl || product.variations[0]?.imageUrl || product.defaultImageUrl
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'benefits' | 'ingredients' | 'usage' | 'certifications'>('benefits');
  const [pincode, setPincode] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState(false);

  // Sync image when variation changes
  useEffect(() => {
    if (initialVariation) {
      setSelectedVariation(initialVariation);
      setActiveImage(initialVariation.imageUrl || product.defaultImageUrl);
    } else if (product.variations.length > 0) {
      setSelectedVariation(product.variations[0]);
      setActiveImage(product.variations[0].imageUrl || product.defaultImageUrl);
    }
    setQuantity(1);
  }, [product, initialVariation]);

  const handleVariationChange = (variation: ProductVariation) => {
    setSelectedVariation(variation);
    // AUTOMATIC IMAGE SWITCHING BASED ON SELECTED COLOR/VARIATION
    if (variation.imageUrl) {
      setActiveImage(variation.imageUrl);
    }
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      setDeliveryStatus(`Express 24-48h Delivery available for PIN ${pincode} (Free over ₹499)`);
    } else {
      setDeliveryStatus('Please enter a valid 6-digit Indian PIN code.');
    }
  };

  const handleAdd = () => {
    onAddToCart(product, selectedVariation, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleBuy = () => {
    onBuyNow(product, selectedVariation, quantity);
  };

  const discountAmount = selectedVariation.comparePrice
    ? selectedVariation.comparePrice - selectedVariation.price
    : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 max-h-[92vh] flex flex-col">
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-emerald-800 uppercase tracking-wide">{product.category}</span>
            <span>/</span>
            <span className="truncate max-w-[200px] text-slate-700">{product.name}</span>
          </div>
          <div className="flex items-center gap-2">
            {onToggleWishlist && (
              <button
                type="button"
                onClick={() => onToggleWishlist(product.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-colors cursor-pointer ${
                  isWishlisted
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : 'bg-white text-slate-600 hover:text-rose-600 border-slate-200'
                }`}
                aria-label={isWishlisted ? 'Remove from Favorites' : 'Save to Favorites'}
              >
                <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span className="hidden sm:inline">{isWishlisted ? 'Saved' : 'Save'}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Image Showcase with Dynamic Switcher */}
            <div className="lg:col-span-6 space-y-4">
              {/* Main Image Stage */}
              <div className="relative aspect-square rounded-2xl bg-slate-50 border border-slate-200/80 overflow-hidden flex items-center justify-center p-6 shadow-inner">
                <img
                  src={activeImage}
                  alt={`${product.name} - ${selectedVariation.size}`}
                  className="w-full h-full object-contain transition-all duration-300"
                  referrerPolicy="no-referrer"
                />

                {discountAmount > 0 && (
                  <div className="absolute top-4 left-4 bg-emerald-700 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                    Save ₹{discountAmount.toLocaleString('en-IN')}
                  </div>
                )}

                {/* Variation Tag Badge */}
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 shadow-sm flex items-center gap-1.5">
                  <span className="text-emerald-700">Size:</span>
                  <span>{selectedVariation.size}</span>
                </div>
              </div>

              {/* Pack & Size Options Thumbnails */}
              {product.variations.length > 1 && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Available Pack Options ({product.variations.length})
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {product.variations.map((v) => {
                      const isSelected = selectedVariation.id === v.id;
                      return (
                        <button
                          key={v.id}
                          onClick={() => handleVariationChange(v)}
                          className={`p-2 rounded-xl border text-left transition-all flex flex-col items-center gap-1 cursor-pointer ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="w-12 h-12 rounded-lg bg-slate-50 overflow-hidden flex items-center justify-center">
                            <img
                              src={v.imageUrl || product.defaultImageUrl}
                              alt={v.size}
                              className="w-full h-full object-contain"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <span className="text-[10px] font-bold text-slate-800 line-clamp-1 text-center">
                            {v.size}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-800 font-semibold">
                            ₹{v.price.toLocaleString('en-IN')}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Contiguous Purchase Module */}
            <div className="lg:col-span-6 space-y-6">
              {/* Title & Ratings */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <div className="flex items-center gap-1 font-semibold text-slate-800 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200/60">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{product.rating.toFixed(1)}</span>
                  </div>
                  <span>·</span>
                  <span className="text-slate-600 font-medium">{product.reviewsCount} verified customer reviews</span>
                </div>

                <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 leading-tight">
                  {product.name}
                </h1>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {product.shortDescription}
                </p>
              </div>

              {/* Price Block in INR (₹) */}
              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#0F2C59] tabular-nums">
                    ₹{selectedVariation.price.toLocaleString('en-IN')}
                  </span>
                  {selectedVariation.comparePrice && selectedVariation.comparePrice > selectedVariation.price && (
                    <span className="text-base text-slate-400 line-through tabular-nums">
                      ₹{selectedVariation.comparePrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  {discountAmount > 0 && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      {Math.round(((selectedVariation.comparePrice! - selectedVariation.price) / selectedVariation.comparePrice!) * 100)}% Discount
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  Inclusive of all Indian taxes · Free Express Shipping on orders above ₹499
                </p>
              </div>

              {/* Variation 2: Size / Pack Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 uppercase tracking-wide">
                    Select Size / Dosage Pack:
                  </span>
                  <span className="font-medium text-slate-600">
                    SKU: {selectedVariation.sku}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.variations.map((v) => {
                    const isSelected = selectedVariation.id === v.id;
                    return (
                      <button
                        key={`size-${v.id}`}
                        onClick={() => handleVariationChange(v)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-600 text-white font-semibold shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700'
                        }`}
                      >
                        {v.size} — ₹{v.price.toLocaleString('en-IN')}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Stock Status Indicator */}
              <div className="flex items-center gap-2 text-xs">
                {selectedVariation.stock > 0 ? (
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>In Stock · Ready for Immediate Dispatch ({selectedVariation.stock} left)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-rose-600 font-semibold">
                    <AlertCircle className="w-4 h-4" />
                    <span>Temporarily Out of Stock in this variation</span>
                  </div>
                )}
              </div>

              {/* Quantity Stepper & Buy Actions */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-700">Quantity:</span>
                  <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-xs font-bold text-slate-900 tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(selectedVariation.stock, quantity + 1))}
                      disabled={quantity >= selectedVariation.stock}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-semibold disabled:opacity-40 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={handleAdd}
                    disabled={selectedVariation.stock <= 0}
                    className={`py-3.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      justAdded
                        ? 'bg-emerald-600 text-white'
                        : selectedVariation.stock <= 0
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-300'
                    }`}
                  >
                    {justAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-emerald-700" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleBuy}
                    disabled={selectedVariation.stock <= 0}
                    className="py-3.5 px-4 rounded-xl text-xs font-bold text-white bg-[#0F2C59] hover:bg-[#153a73] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                  >
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>

              {/* PIN Code Delivery Checker */}
              <div className="pt-2">
                <form onSubmit={handleCheckPincode} className="flex gap-2">
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit PIN code"
                    className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                  >
                    Check
                  </button>
                </form>
                {deliveryStatus && (
                  <p className="text-[11px] text-emerald-800 font-medium mt-1.5 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" />
                    <span>{deliveryStatus}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Tabbed In-Depth Clinical Information */}
          <div className="border-t border-slate-200 pt-6">
            <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('benefits')}
                className={`pb-3 transition-colors cursor-pointer ${
                  activeTab === 'benefits'
                    ? 'border-b-2 border-emerald-600 text-emerald-800'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Key Health Benefits
              </button>
              <button
                onClick={() => setActiveTab('ingredients')}
                className={`pb-3 transition-colors cursor-pointer ${
                  activeTab === 'ingredients'
                    ? 'border-b-2 border-emerald-600 text-emerald-800'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Ayurvedic Ingredients
              </button>
              <button
                onClick={() => setActiveTab('usage')}
                className={`pb-3 transition-colors cursor-pointer ${
                  activeTab === 'usage'
                    ? 'border-b-2 border-emerald-600 text-emerald-800'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Dosage & Instructions
              </button>
              <button
                onClick={() => setActiveTab('certifications')}
                className={`pb-3 transition-colors cursor-pointer ${
                  activeTab === 'certifications'
                    ? 'border-b-2 border-emerald-600 text-emerald-800'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Quality Assurance
              </button>
            </div>

            <div className="py-4 text-xs text-slate-700 leading-relaxed">
              {activeTab === 'benefits' && (
                <ul className="space-y-2">
                  {product.benefits.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}

              {activeTab === 'ingredients' && (
                <div className="space-y-3">
                  <p className="font-medium text-slate-900">Each serving contains standard therapeutic potencies:</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.keyIngredients.map((ing, idx) => (
                      <li key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200/60 font-mono text-[11px] text-slate-800">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{ing}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'usage' && (
                <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-slate-800 space-y-2">
                  <p className="font-semibold text-[#0F2C59]">Recommended Usage:</p>
                  <p>{product.dosageInstructions}</p>
                  <p className="text-[11px] text-slate-500 pt-1">
                    *Consult your physician if you are pregnant, nursing, taking blood pressure medication, or preparing for surgery.
                  </p>
                </div>
              )}

              {activeTab === 'certifications' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 mb-1" />
                    <p className="font-bold text-slate-900 text-xs">Ayush Certified</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Approved under Ayurvedic drug manufacturing standards.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <Truck className="w-5 h-5 text-emerald-600 mb-1" />
                    <p className="font-bold text-slate-900 text-xs">GMP Compliant Facility</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Automated batch testing for purity, heavy metals & microbes.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <RotateCcw className="w-5 h-5 text-emerald-600 mb-1" />
                    <p className="font-bold text-slate-900 text-xs">Tamper Evident Seal</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">UV-protected pharmaceutical amber container.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
