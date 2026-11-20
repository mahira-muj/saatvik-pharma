import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, QrCode, CreditCard, Banknote, Building2, Truck, ArrowRight } from 'lucide-react';
import { CartItem, CustomerDetails, PaymentMethod, Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  discount: number;
  discountCode: string;
  onOrderPlaced: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  discount,
  discountCode,
  onOrderPlaced
}) => {
  if (!isOpen) return null;

  const [customer, setCustomer] = useState<CustomerDetails>({
    fullName: '',
    phone: '',
    email: '',
    addressLine: '',
    locality: '',
    city: '',
    state: '',
    pinCode: '',
    notes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [shippingType, setShippingType] = useState<'standard' | 'express'>('standard');
  const [upiId, setUpiId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const baseShippingFee = subtotal >= 499 ? 0 : 49;
  const expressSurcharge = shippingType === 'express' ? 99 : 0;
  const totalShipping = baseShippingFee + expressSurcharge;
  const grandTotal = Math.max(0, subtotal - discount + totalShipping);

  // Auto PIN code assistant for Indian cities
  const handlePinChange = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 6);
    let autoCity = customer.city;
    let autoState = customer.state;

    if (clean.startsWith('11')) {
      autoCity = 'New Delhi';
      autoState = 'Delhi';
    } else if (clean.startsWith('40') || clean.startsWith('41')) {
      autoCity = 'Mumbai';
      autoState = 'Maharashtra';
    } else if (clean.startsWith('56')) {
      autoCity = 'Bengaluru';
      autoState = 'Karnataka';
    } else if (clean.startsWith('50')) {
      autoCity = 'Hyderabad';
      autoState = 'Telangana';
    } else if (clean.startsWith('60')) {
      autoCity = 'Chennai';
      autoState = 'Tamil Nadu';
    } else if (clean.startsWith('70')) {
      autoCity = 'Kolkata';
      autoState = 'West Bengal';
    } else if (clean.startsWith('38')) {
      autoCity = 'Ahmedabad';
      autoState = 'Gujarat';
    }

    setCustomer(prev => ({
      ...prev,
      pinCode: clean,
      city: autoCity || prev.city,
      state: autoState || prev.state
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validations
    if (!customer.fullName.trim()) {
      setFormError('Please enter recipient full name');
      return;
    }
    if (!customer.phone.trim() || customer.phone.replace(/\D/g, '').length < 10) {
      setFormError('Please enter a valid 10-digit Indian phone number');
      return;
    }
    if (!customer.addressLine.trim()) {
      setFormError('Please enter flat/house and street address');
      return;
    }
    if (!customer.city.trim() || !customer.state.trim()) {
      setFormError('Please enter city and state');
      return;
    }
    if (customer.pinCode.length !== 6) {
      setFormError('Please enter a valid 6-digit postal PIN code');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const orderNumber = `SP-${Math.floor(100000 + Math.random() * 900000)}`;
      const deliveryDays = shippingType === 'express' ? 2 : 4;
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);
      const estDateStr = deliveryDate.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });

      const newOrder: Order = {
        id: `ord_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        orderNumber,
        createdAt: new Date().toISOString(),
        customer,
        items,
        subtotal,
        discount,
        shippingFee: totalShipping,
        totalAmount: grandTotal,
        paymentMethod,
        paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
        orderStatus: 'Confirmed',
        trackingNumber: `SAATVIK-${Math.floor(1000000 + Math.random() * 9000000)}`,
        estimatedDeliveryDate: estDateStr
      };

      setIsSubmitting(false);
      onOrderPlaced(newOrder);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
              ₹
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Secure Pharmacy Checkout</h2>
              <p className="text-[11px] text-slate-500">Pan-India Express Dispatch with GST Invoice</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 sm:p-8 space-y-6 flex-1">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {formError}
            </div>
          )}

          {/* Section 1: Customer Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-mono flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px]">1</span>
              <span>Patient & Delivery Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Recipient Name *</label>
                <input
                  type="text"
                  required
                  value={customer.fullName}
                  onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                  placeholder="e.g. Ramesh Chandra Verma"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Phone (for delivery SMS) *</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-xs font-mono">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    placeholder="98765 43210"
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-r-xl focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address (for order receipt & tracking)</label>
                <input
                  type="email"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Flat, House No., Building, Street *</label>
                <input
                  type="text"
                  required
                  value={customer.addressLine}
                  onChange={(e) => setCustomer({ ...customer, addressLine: e.target.value })}
                  placeholder="e.g. Flat 301, Tower B, Palm Meadows, Outer Ring Road"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Locality / Sector / Landmark</label>
                <input
                  type="text"
                  value={customer.locality}
                  onChange={(e) => setCustomer({ ...customer, locality: e.target.value })}
                  placeholder="Near Apollo Clinic"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">6-Digit Indian PIN Code *</label>
                <input
                  type="text"
                  required
                  value={customer.pinCode}
                  onChange={(e) => handlePinChange(e.target.value)}
                  placeholder="e.g. 110001"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl font-mono focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City / District *</label>
                <input
                  type="text"
                  required
                  value={customer.city}
                  onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                  placeholder="e.g. New Delhi"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">State / UT *</label>
                <input
                  type="text"
                  required
                  value={customer.state}
                  onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                  placeholder="e.g. Delhi"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Speed */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-mono flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px]">2</span>
              <span>Delivery Speed & Priority</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  shippingType === 'standard'
                    ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingType === 'standard'}
                    onChange={() => setShippingType('standard')}
                    className="accent-emerald-600"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Standard Pharmacy Delivery</p>
                    <p className="text-[11px] text-slate-500">Delivered within 3-4 business days</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 tabular-nums">
                  {baseShippingFee === 0 ? 'FREE' : `₹${baseShippingFee}`}
                </span>
              </label>

              <label
                className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  shippingType === 'express'
                    ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingType === 'express'}
                    onChange={() => setShippingType('express')}
                    className="accent-emerald-600"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Express Priority Air Dispatch</p>
                    <p className="text-[11px] text-slate-500">Fastest 24-48 hours delivery</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-900 tabular-nums">
                  +₹99
                </span>
              </label>
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-mono flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px]">3</span>
              <span>Payment Option</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-3 rounded-xl border flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'UPI'
                    ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 ring-1 ring-emerald-600 font-semibold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <QrCode className="w-5 h-5 text-emerald-600" />
                <span className="text-xs">Instant UPI</span>
                <span className="text-[10px] text-slate-400">GPay, PhonePe</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('COD')}
                className={`p-3 rounded-xl border flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'COD'
                    ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 ring-1 ring-emerald-600 font-semibold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <Banknote className="w-5 h-5 text-emerald-600" />
                <span className="text-xs">Cash on Delivery</span>
                <span className="text-[10px] text-emerald-700">₹0 extra</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CARD')}
                className={`p-3 rounded-xl border flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'CARD'
                    ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 ring-1 ring-emerald-600 font-semibold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <span className="text-xs">Cards</span>
                <span className="text-[10px] text-slate-400">RuPay, Visa, MC</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('NETBANKING')}
                className={`p-3 rounded-xl border flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'NETBANKING'
                    ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 ring-1 ring-emerald-600 font-semibold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <Building2 className="w-5 h-5 text-emerald-600" />
                <span className="text-xs">NetBanking</span>
                <span className="text-[10px] text-slate-400">All Indian Banks</span>
              </button>
            </div>

            {/* Dynamic payment sub-view */}
            {paymentMethod === 'UPI' && (
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 flex flex-col sm:flex-row items-center gap-4 text-xs">
                <div className="w-28 h-28 rounded-xl bg-white p-2 border border-emerald-200 flex flex-col items-center justify-center shrink-0 shadow-xs">
                  <div className="w-full h-full bg-slate-900 text-white rounded p-1 flex items-center justify-center font-mono text-[9px] text-center">
                    [SAATVIK UPI QR]
                    <br />
                    Scan & Pay
                  </div>
                </div>
                <div className="space-y-2 flex-1">
                  <p className="font-semibold text-slate-900">Scan QR Code with any UPI App or Enter UPI ID:</p>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. mobile@okaxis or yourname@okhdfcbank"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                  />
                  <p className="text-[11px] text-slate-500">
                    Supports Google Pay, PhonePe, Paytm, BHIM, Amazon Pay & CRED.
                  </p>
                </div>
              </div>
            )}

            {paymentMethod === 'COD' && (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                <p className="font-semibold text-slate-900">Pay cash or UPI at the time of delivery.</p>
                <p className="text-slate-500 text-[11px]">
                  Our delivery courier will provide a printed GST tax invoice upon arrival.
                </p>
              </div>
            )}
          </div>

          {/* Section 4: Order Summary in INR */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 text-xs">Items to be Dispatched ({items.length}):</h4>
            <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1">
              {items.map((it) => (
                <div key={it.cartItemId} className="flex justify-between text-slate-600">
                  <span className="truncate max-w-[240px]">
                    {it.quantity}x {it.productName} ({it.selectedVariation.size})
                  </span>
                  <span className="font-mono tabular-nums">₹{(it.unitPrice * it.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 pt-2 space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount ({discountCode})</span>
                  <span className="font-mono tabular-nums">-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Delivery Charges</span>
                <span className="font-mono tabular-nums">
                  {totalShipping === 0 ? 'FREE' : `₹${totalShipping}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1.5 border-t border-slate-200">
                <span>Total Payable Amount</span>
                <span className="text-[#0F2C59] tabular-nums">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/15 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <span>Confirm Order & Pay ₹{grandTotal.toLocaleString('en-IN')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-slate-400 mt-2 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>By placing your order, you agree to Saatvik Pharma terms of pharmaceutical service.</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
