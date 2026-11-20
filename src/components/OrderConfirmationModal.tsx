import React from 'react';
import { CheckCircle2, Package, Printer, ArrowRight, Truck, MapPin } from 'lucide-react';
import { Order } from '../types';

interface OrderConfirmationModalProps {
  order: Order | null;
  onClose: () => void;
  onViewOrderHistory?: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose,
  onViewOrderHistory
}) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 p-6 sm:p-8 space-y-6">
        {/* Top Success Icon */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#0F2C59]">Order Confirmed!</h2>
          <p className="text-xs text-slate-500">
            Thank you for ordering with Saatvik Pharma. We have sent a confirmation SMS to{' '}
            <span className="font-semibold text-slate-800">{order.customer.phone}</span>.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
            <div>
              <span className="text-slate-400">Order Reference</span>
              <p className="font-mono font-bold text-slate-900 text-sm">{order.orderNumber}</p>
            </div>
            <div>
              <span className="text-slate-400">Tracking Code</span>
              <p className="font-mono font-semibold text-emerald-800">{order.trackingNumber}</p>
            </div>
            <div>
              <span className="text-slate-400">Expected Delivery</span>
              <p className="font-bold text-slate-900">{order.estimatedDeliveryDate}</p>
            </div>
          </div>

          {/* Delivery Timeline */}
          <div className="py-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 mb-2">
              <span className="text-emerald-700">✓ Order Placed</span>
              <span className="text-emerald-700">✓ Pharmacist Audited</span>
              <span className="text-slate-400">Packing</span>
              <span className="text-slate-400">Dispatched</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div className="w-1/2 h-full bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-2 pt-2 text-slate-600 border-t border-slate-200/80">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900">{order.customer.fullName}</p>
              <p>{order.customer.addressLine}, {order.customer.locality}</p>
              <p>{order.customer.city}, {order.customer.state} - {order.customer.pinCode}</p>
            </div>
          </div>
        </div>

        {/* Itemized summary */}
        <div className="space-y-2 text-xs">
          <h4 className="font-bold text-slate-800">Items Ordered ({order.items.length})</h4>
          <div className="divide-y divide-slate-100 max-h-36 overflow-y-auto">
            {order.items.map((it) => (
              <div key={it.cartItemId} className="py-2 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{it.productName}</p>
                  <p className="text-[11px] text-slate-500">
                    Pack: {it.selectedVariation.size} · Qty: {it.quantity}
                  </p>
                </div>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  ₹{(it.unitPrice * it.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-sm text-slate-900">
            <span>Total Amount Paid ({order.paymentMethod})</span>
            <span className="text-base text-[#0F2C59] tabular-nums">₹{order.totalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Packing Slip</span>
          </button>

          {onViewOrderHistory && (
            <button
              onClick={onViewOrderHistory}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#0F2C59] text-[#0F2C59] hover:bg-slate-50 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Package className="w-4 h-4" />
              <span>View Order History</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full sm:flex-1 py-3 px-6 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
