import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, Tag, ShoppingBag, Check } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onCheckout: (appliedDiscount: number, discountCode: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}) => {
  if (!isOpen) return null;

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  // Free delivery threshold: ₹499
  const freeShippingThreshold = 499;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  // Discount calculation
  let discountAmount = 0;
  if (appliedCoupon === 'SAATVIK10') {
    discountAmount = Math.round(subtotal * 0.10); // 10% off
  } else if (appliedCoupon === 'HEALTH100') {
    discountAmount = Math.min(subtotal, 100); // ₹100 off
  }

  const deliveryFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 49;
  const finalTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    const code = couponCode.trim().toUpperCase();
    if (code === 'SAATVIK10' || code === 'HEALTH100') {
      setAppliedCoupon(code);
      setCouponCode('');
    } else {
      setCouponError('Invalid coupon. Try "SAATVIK10" or "HEALTH100"');
    }
  };

  const handleProceed = () => {
    onCheckout(discountAmount, appliedCoupon || '');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between">
        {/* Cart Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base font-bold text-slate-900">Your Pharmacy Bag</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {items.reduce((acc, it) => acc + it.quantity, 0)} items
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="bg-emerald-50/60 p-3.5 border-b border-emerald-100 text-xs">
          {remainingForFreeShipping > 0 ? (
            <p className="text-emerald-900 font-medium">
              Add <span className="font-bold">₹{remainingForFreeShipping.toLocaleString('en-IN')}</span> more to get <span className="font-bold uppercase text-emerald-700">Free Delivery</span>!
            </p>
          ) : (
            <p className="text-emerald-800 font-bold flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              You unlocked FREE Express Pan-India Delivery!
            </p>
          )}
          <div className="w-full h-1.5 bg-emerald-200/60 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 text-slate-400">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                <ShoppingBag className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-sm font-semibold text-slate-700">Your cart is currently empty</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Explore our catalog of authentic Ayurvedic supplements and wellness essentials.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.cartItemId}
                className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex gap-3.5 items-center justify-between"
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{item.productName}</h4>
                  
                  {/* Variation details */}
                  <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500">
                    <span className="font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
                      {item.selectedVariation.size}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-bold text-slate-900 tabular-nums">
                      ₹{item.unitPrice.toLocaleString('en-IN')}
                    </span>

                    {/* Quantity controls */}
                    <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden text-xs">
                      <button
                        onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                        className="px-2 py-0.5 text-slate-600 hover:bg-slate-100 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-0.5 font-bold text-slate-800 tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                        className="px-2 py-0.5 text-slate-600 hover:bg-slate-100 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => onRemoveItem(item.cartItemId)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer with Calculations & Checkout Action */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-white space-y-4">
            {/* Promo coupon input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Coupon "{appliedCoupon}" applied! (-₹{discountAmount})</span>
                  </div>
                  <button
                    onClick={() => setAppliedCoupon(null)}
                    className="text-slate-500 hover:text-rose-600 font-semibold cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon (e.g. SAATVIK10)"
                    className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-xl uppercase font-mono tracking-wider focus:outline-none focus:border-emerald-600"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>}
            </div>

            {/* Bill Summary */}
            <div className="space-y-1.5 text-xs text-slate-600 pt-1">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-medium text-slate-900 tabular-nums">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Coupon Discount</span>
                  <span className="font-semibold tabular-nums">-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Pan-India Delivery</span>
                <span className="font-medium text-slate-900 tabular-nums">
                  {deliveryFee === 0 ? <span className="text-emerald-700 font-bold uppercase">Free</span> : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="text-base text-[#0F2C59] tabular-nums">₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={handleProceed}
              className="w-full py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-900/15 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safe & Secure 256-Bit Encrypted Pharmacy Checkout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
