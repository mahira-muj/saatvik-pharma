import React, { useState } from 'react';
import { X, Search, Package, Truck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { storage } from '../services/storage';
import { Order } from '../types';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const [lookupQuery, setLookupQuery] = useState('');
  const [matchedOrder, setMatchedOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const clean = lookupQuery.trim().toLowerCase();
    const orders = storage.getOrders();
    const found = orders.find(
      (o) =>
        o.orderNumber.toLowerCase() === clean ||
        o.customer.phone.replace(/\D/g, '').includes(clean) ||
        (o.trackingNumber && o.trackingNumber.toLowerCase() === clean)
    );
    setMatchedOrder(found || null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Track Pharmacy Order</h3>
              <p className="text-[11px] text-slate-500">Enter your Order ID (e.g. SP-882910) or Mobile Number</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input form */}
        <form onSubmit={handleLookup} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              required
              value={lookupQuery}
              onChange={(e) => setLookupQuery(e.target.value)}
              placeholder="e.g. SP-882910 or 9876543210"
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#0F2C59] hover:bg-[#153a73] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Track Status
          </button>
        </form>

        {/* Results */}
        {searched && (
          <div>
            {matchedOrder ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400">Order</span>
                    <p className="font-mono font-bold text-slate-900">{matchedOrder.orderNumber}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400">Status</span>
                    <p className="font-bold text-emerald-700 capitalize">{matchedOrder.orderStatus}</p>
                  </div>
                </div>

                <div className="space-y-1 text-slate-600">
                  <p><span className="font-semibold text-slate-800">Recipient:</span> {matchedOrder.customer.fullName} ({matchedOrder.customer.phone})</p>
                  <p><span className="font-semibold text-slate-800">Destination:</span> {matchedOrder.customer.city}, {matchedOrder.customer.state} ({matchedOrder.customer.pinCode})</p>
                  {matchedOrder.trackingNumber && (
                    <p><span className="font-semibold text-slate-800">Courier Tracking:</span> <span className="font-mono text-emerald-800">{matchedOrder.trackingNumber}</span></p>
                  )}
                  <p><span className="font-semibold text-slate-800">Est. Delivery:</span> {matchedOrder.estimatedDeliveryDate}</p>
                </div>

                {/* Items */}
                <div className="pt-2 border-t border-slate-200">
                  <p className="font-semibold text-slate-800 mb-1">Package Contents:</p>
                  <ul className="space-y-1">
                    {matchedOrder.items.map((it) => (
                      <li key={it.cartItemId} className="flex justify-between text-slate-600">
                        <span>{it.quantity}x {it.productName} ({it.selectedVariation.size})</span>
                        <span className="font-mono tabular-nums">₹{(it.unitPrice * it.quantity).toLocaleString('en-IN')}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2 mt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                    <span>Total Amount:</span>
                    <span className="font-mono text-emerald-800 tabular-nums">₹{matchedOrder.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
                <p className="text-xs font-bold text-slate-900">No matching order found</p>
                <p className="text-[11px] text-slate-600 max-w-xs mx-auto">
                  Please verify the Order ID or phone number entered. If you placed the order recently, wait 5 minutes for dispatch sync.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
