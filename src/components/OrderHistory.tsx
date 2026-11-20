import React, { useState, useEffect, useMemo } from 'react';
import {
  Package, Truck, CheckCircle2, Clock, XCircle, Search,
  ChevronDown, ChevronUp, MapPin, Copy, Check, RotateCcw,
  ShoppingBag, CreditCard, RefreshCw, AlertCircle
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { storage } from '../services/storage';

interface OrderHistoryProps {
  /** Optional externally synced orders; falls back to reading localStorage directly. */
  orders?: Order[];
  onReorder?: (order: Order) => void;
  onStartShopping?: () => void;
}

type StatusFilter = 'All' | 'Active' | 'Delivered' | 'Cancelled';

const TRACKING_STAGES: { status: OrderStatus; label: string; shortLabel: string }[] = [
  { status: 'Pending', label: 'Order Placed', shortLabel: 'Placed' },
  { status: 'Confirmed', label: 'Confirmed', shortLabel: 'Confirmed' },
  { status: 'Processing', label: 'Packing at Pharmacy', shortLabel: 'Packing' },
  { status: 'Shipped', label: 'Shipped via Courier', shortLabel: 'Shipped' },
  { status: 'Out for Delivery', label: 'Out for Delivery', shortLabel: 'Out' },
  { status: 'Delivered', label: 'Delivered', shortLabel: 'Delivered' }
];

function getStageIndex(status: OrderStatus): number {
  const idx = TRACKING_STAGES.findIndex((s) => s.status === status);
  return idx >= 0 ? idx : 0;
}

function formatOrderDate(isoDate: string): string {
  try {
    return new Date(isoDate).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return isoDate;
  }
}

function getStatusDisplay(status: OrderStatus) {
  switch (status) {
    case 'Delivered':
      return {
        icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />,
        textClass: 'text-emerald-800',
        label: 'Delivered'
      };
    case 'Cancelled':
      return {
        icon: <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />,
        textClass: 'text-rose-700',
        label: 'Cancelled'
      };
    case 'Shipped':
    case 'Out for Delivery':
      return {
        icon: <Truck className="w-3.5 h-3.5 text-[#0F2C59] shrink-0" />,
        textClass: 'text-[#0F2C59]',
        label: status
      };
    case 'Processing':
    case 'Confirmed':
      return {
        icon: <Package className="w-3.5 h-3.5 text-amber-700 shrink-0" />,
        textClass: 'text-amber-800',
        label: status
      };
    default:
      return {
        icon: <Clock className="w-3.5 h-3.5 text-slate-600 shrink-0" />,
        textClass: 'text-slate-700',
        label: 'Pending'
      };
  }
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({
  orders: externalOrders,
  onReorder,
  onStartShopping
}) => {
  const [localOrders, setLocalOrders] = useState<Order[]>(() => externalOrders ?? storage.getOrders());
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [copiedTrackingId, setCopiedTrackingId] = useState<string | null>(null);
  const [reorderedId, setReorderedId] = useState<string | null>(null);

  // Keep synced with external prop or fresh localStorage reads
  useEffect(() => {
    const loaded = externalOrders ?? storage.getOrders();
    setLocalOrders(loaded);
    if (loaded.length > 0 && !expandedOrderId) {
      setExpandedOrderId(loaded[0].id);
    }
  }, [externalOrders]);

  // Listen for cross-tab localStorage updates (e.g. if admin updates status in another tab)
  useEffect(() => {
    const handleStorageChange = () => {
      setLocalOrders(storage.getOrders());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleRefresh = () => {
    setLocalOrders(storage.getOrders());
  };

  const handleCopyTracking = (orderId: string, trackingNumber: string) => {
    navigator.clipboard?.writeText(trackingNumber).catch(() => {});
    setCopiedTrackingId(orderId);
    setTimeout(() => setCopiedTrackingId(null), 1800);
  };

  const handleReorderClick = (order: Order) => {
    if (onReorder) {
      onReorder(order);
      setReorderedId(order.id);
      setTimeout(() => setReorderedId(null), 2000);
    }
  };

  const summary = useMemo(() => {
    const activeCount = localOrders.filter(
      (o) => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled'
    ).length;
    const totalSpent = localOrders
      .filter((o) => o.orderStatus !== 'Cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0);
    return {
      total: localOrders.length,
      activeCount,
      totalSpent
    };
  }, [localOrders]);

  const filteredOrders = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return localOrders.filter((order) => {
      if (statusFilter === 'Active') {
        if (order.orderStatus === 'Delivered' || order.orderStatus === 'Cancelled') return false;
      } else if (statusFilter === 'Delivered') {
        if (order.orderStatus !== 'Delivered') return false;
      } else if (statusFilter === 'Cancelled') {
        if (order.orderStatus !== 'Cancelled') return false;
      }

      if (!q) return true;
      return (
        order.orderNumber.toLowerCase().includes(q) ||
        (order.trackingNumber && order.trackingNumber.toLowerCase().includes(q)) ||
        order.customer.fullName.toLowerCase().includes(q) ||
        order.items.some((item) => item.productName.toLowerCase().includes(q))
      );
    });
  }, [localOrders, statusFilter, searchQuery]);

  return (
    <div className="space-y-5">
      {/* Compact Account Summary Row */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
        <div>
          <p className="text-[11px] font-medium text-slate-500">Total Orders</p>
          <p className="text-lg sm:text-xl font-bold text-[#0F2C59] tabular-nums mt-0.5">
            {summary.total}
          </p>
        </div>
        <div className="border-l border-slate-200 pl-3 sm:pl-4">
          <p className="text-[11px] font-medium text-slate-500">Active Shipments</p>
          <p className="text-lg sm:text-xl font-bold text-emerald-700 tabular-nums mt-0.5">
            {summary.activeCount}
          </p>
        </div>
        <div className="border-l border-slate-200 pl-3 sm:pl-4">
          <p className="text-[11px] font-medium text-slate-500">Total Spent</p>
          <p className="text-lg sm:text-xl font-bold text-slate-900 tabular-nums mt-0.5">
            ₹{summary.totalSpent.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit">
          {(['All', 'Active', 'Delivered', 'Cancelled'] as StatusFilter[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                statusFilter === tab
                  ? 'bg-white text-[#0F2C59] font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-1 sm:max-w-xs">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Order ID, medicine, AWB..."
              className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-emerald-600 focus:outline-none text-slate-800 placeholder:text-slate-400"
            />
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            title="Refresh order statuses"
            aria-label="Refresh order history"
            className="p-2 text-slate-500 hover:text-[#0F2C59] hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Empty States */}
      {localOrders.length === 0 ? (
        <div className="py-12 px-6 text-center bg-slate-50/70 border border-slate-200 rounded-2xl space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-emerald-700">
            <Package className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-900">No previous orders yet</p>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              Once you place an order on Saatvik Pharma, your receipts, courier tracking numbers, and live delivery stages will appear here.
            </p>
          </div>
          {onStartShopping && (
            <button
              type="button"
              onClick={onStartShopping}
              className="mt-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Browse Medicines & Wellness
            </button>
          )}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-10 px-6 text-center bg-slate-50/70 border border-slate-200 rounded-2xl space-y-2">
          <AlertCircle className="w-6 h-6 text-slate-400 mx-auto" />
          <p className="text-sm font-semibold text-slate-800">No orders match this filter</p>
          <p className="text-xs text-slate-500">
            Try clearing your search or switching back to All orders.
          </p>
          <button
            type="button"
            onClick={() => {
              setStatusFilter('All');
              setSearchQuery('');
            }}
            className="mt-1 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        /* Orders List */
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const statusInfo = getStatusDisplay(order.orderStatus);
            const stageIdx = getStageIndex(order.orderStatus);
            const isCancelled = order.orderStatus === 'Cancelled';
            const totalUnits = order.items.reduce((sum, it) => sum + it.quantity, 0);

            return (
              <article
                key={order.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-colors hover:border-slate-300"
              >
                {/* Order Top Header Row */}
                <div className="px-4 sm:px-5 py-3.5 bg-slate-50/80 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className="font-mono text-sm font-bold text-[#0F2C59]">
                        {order.orderNumber}
                      </span>
                      <span className="text-slate-300" aria-hidden="true">·</span>
                      <span className="text-xs text-slate-500">
                        {formatOrderDate(order.createdAt)}
                      </span>
                      <span className="text-slate-300" aria-hidden="true">·</span>
                      <span className="text-xs text-slate-500">
                        {totalUnits} {totalUnits === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <CreditCard className="w-3 h-3 text-slate-400" />
                        {order.paymentMethod} ({order.paymentStatus})
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>Est. delivery: {order.estimatedDeliveryDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className={`inline-flex items-center gap-1.5 text-xs font-semibold ${statusInfo.textClass}`}>
                        {statusInfo.icon}
                        <span>{statusInfo.label}</span>
                      </div>
                      <p className="text-sm font-bold text-slate-900 tabular-nums mt-0.5">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items Preview List */}
                <div className="px-4 sm:px-5 py-3.5 divide-y divide-slate-100">
                  {order.items.map((item) => (
                    <div key={item.cartItemId} className="py-2.5 first:pt-0 last:pb-0 flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/70 p-1.5 shrink-0 flex items-center justify-center overflow-hidden">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="w-full h-full object-contain"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <Package className="w-5 h-5 text-slate-400" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                          {item.productName}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Pack: {item.selectedVariation.size}
                          <span className="mx-1.5" aria-hidden="true">·</span>
                          Qty: <span className="tabular-nums font-medium text-slate-700">{item.quantity}</span>
                          <span className="mx-1.5" aria-hidden="true">·</span>
                          <span className="tabular-nums">₹{item.unitPrice.toLocaleString('en-IN')} each</span>
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-xs sm:text-sm font-bold text-[#0F2C59] tabular-nums">
                          ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Footer Bar */}
                <div className="px-4 sm:px-5 py-3 border-t border-slate-100 bg-white flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 min-w-0">
                    {order.trackingNumber ? (
                      <>
                        <Truck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="truncate">
                          AWB: <span className="font-mono font-semibold text-slate-800">{order.trackingNumber}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyTracking(order.id, order.trackingNumber!)}
                          className="p-1 text-slate-400 hover:text-emerald-700 transition-colors cursor-pointer"
                          title="Copy tracking number"
                          aria-label={`Copy tracking number ${order.trackingNumber}`}
                        >
                          {copiedTrackingId === order.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </>
                    ) : (
                      <span className="text-slate-400">Courier AWB will be assigned upon dispatch</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {onReorder && (
                      <button
                        type="button"
                        onClick={() => handleReorderClick(order)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/70 text-slate-700 hover:text-emerald-800 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        {reorderedId === order.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Added to Cart</span>
                          </>
                        ) : (
                          <>
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reorder</span>
                          </>
                        )}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                      className="px-3 py-1.5 rounded-xl bg-[#0F2C59] hover:bg-[#153a73] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <span>{isExpanded ? 'Hide Tracking' : 'Track Order'}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Tracking Timeline & Delivery Details */}
                {isExpanded && (
                  <div className="px-4 sm:px-5 py-4 bg-slate-50/70 border-t border-slate-200/80 space-y-4">
                    {/* Shipment Progress Stepper */}
                    {isCancelled ? (
                      <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800">
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">This order was cancelled</p>
                          <p className="text-rose-700/90 mt-0.5">
                            Any prepaid amount is refunded to the original payment source within 3–5 business days.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-800">Shipment Progress</span>
                          <span className="text-slate-500">
                            Expected by <span className="font-semibold text-slate-800">{order.estimatedDeliveryDate}</span>
                          </span>
                        </div>

                        {/* Progress Track */}
                        <div className="relative pt-1">
                          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                              style={{
                                width: `${Math.max(8, (stageIdx / (TRACKING_STAGES.length - 1)) * 100)}%`
                              }}
                            />
                          </div>

                          <div className="grid grid-cols-6 gap-1 mt-2.5">
                            {TRACKING_STAGES.map((stage, i) => {
                              const completed = i <= stageIdx;
                              const current = i === stageIdx;
                              return (
                                <div key={stage.status} className="text-center">
                                  <div
                                    className={`w-5 h-5 rounded-full mx-auto flex items-center justify-center text-[10px] font-bold transition-colors ${
                                      completed
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-slate-200 text-slate-500'
                                    } ${current ? 'ring-4 ring-emerald-100' : ''}`}
                                  >
                                    {completed ? <Check className="w-3 h-3" /> : i + 1}
                                  </div>
                                  <p
                                    className={`text-[10px] mt-1 leading-tight ${
                                      current
                                        ? 'font-bold text-emerald-800'
                                        : completed
                                          ? 'font-medium text-slate-700'
                                          : 'text-slate-400'
                                    }`}
                                  >
                                    <span className="hidden sm:inline">{stage.label}</span>
                                    <span className="sm:hidden">{stage.shortLabel}</span>
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Delivery Address & Price Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-200/80 text-xs">
                      <div className="space-y-1 text-slate-600">
                        <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                          Delivery Address
                        </p>
                        <p className="font-medium text-slate-900">{order.customer.fullName}</p>
                        <p>{order.customer.addressLine}</p>
                        <p>
                          {order.customer.locality}, {order.customer.city}, {order.customer.state} – {order.customer.pinCode}
                        </p>
                        <p className="text-slate-500 pt-0.5">
                          {order.customer.phone} · {order.customer.email}
                        </p>
                      </div>

                      <div className="space-y-1.5 md:border-l md:border-slate-200 md:pl-4">
                        <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <ShoppingBag className="w-3.5 h-3.5 text-emerald-700" />
                          Payment Summary
                        </p>
                        <div className="flex justify-between text-slate-600">
                          <span>Items Subtotal</span>
                          <span className="tabular-nums">₹{order.subtotal.toLocaleString('en-IN')}</span>
                        </div>
                        {order.discount > 0 && (
                          <div className="flex justify-between text-emerald-700">
                            <span>Promo Discount</span>
                            <span className="tabular-nums">-₹{order.discount.toLocaleString('en-IN')}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-slate-600">
                          <span>Shipping Fee</span>
                          <span className="tabular-nums">
                            {order.shippingFee === 0 ? 'Free' : `₹${order.shippingFee.toLocaleString('en-IN')}`}
                          </span>
                        </div>
                        <div className="pt-1.5 mt-1 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                          <span>Order Total ({order.paymentMethod})</span>
                          <span className="text-[#0F2C59] tabular-nums">
                            ₹{order.totalAmount.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
