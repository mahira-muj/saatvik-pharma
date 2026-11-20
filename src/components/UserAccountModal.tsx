import React, { useState, useEffect } from 'react';
import {
  X, User, Package, MapPin, Heart, Truck, CheckCircle2, Save, Phone, Mail
} from 'lucide-react';
import { CustomerProfile, Order } from '../types';
import { storage } from '../services/storage';
import { OrderHistory } from './OrderHistory';

interface UserAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  wishlistCount: number;
  onReorder: (order: Order) => void;
  onOpenWishlist: () => void;
  onOpenTrackOrder: () => void;
  initialTab?: 'orders' | 'profile';
}

export const UserAccountModal: React.FC<UserAccountModalProps> = ({
  isOpen,
  onClose,
  orders,
  wishlistCount,
  onReorder,
  onOpenWishlist,
  onOpenTrackOrder,
  initialTab = 'orders'
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>(initialTab);
  const [profile, setProfile] = useState<CustomerProfile>(() => storage.getCustomerProfile());
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setProfile(storage.getCustomerProfile());
      setSaveNotice(null);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = storage.saveCustomerProfile(profile);
    setProfile(updated);
    setSaveNotice('Your profile and delivery address have been saved.');
    setTimeout(() => setSaveNotice(null), 3000);
  };

  const initials = profile.fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'SP';

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 lg:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Account Header */}
        <div className="bg-[#0F2C59] text-white px-5 sm:px-7 py-5 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-serif font-bold text-base shrink-0 shadow-sm">
              {initials}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-serif font-bold text-white truncate">
                {profile.fullName || 'Saatvik Member'}
              </h2>
              <p className="text-xs text-slate-300 truncate">
                {profile.email || 'My Saatvik Account'} · {profile.city || 'India'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            aria-label="Close My Account"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Account Navigation Tabs & Quick Shortcuts */}
        <div className="px-5 sm:px-7 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'bg-white text-[#0F2C59] shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Order History ({orders.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'bg-white text-[#0F2C59] shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Profile & Address</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenWishlist();
              }}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-white border border-slate-200 rounded-xl inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span>Favorites ({wishlistCount})</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenTrackOrder();
              }}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-emerald-700 hover:bg-white border border-slate-200 rounded-xl inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Truck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Lookup by ID</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7">
          {activeTab === 'orders' ? (
            <OrderHistory
              orders={orders}
              onReorder={onReorder}
              onStartShopping={onClose}
            />
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-5 max-w-2xl">
              <div>
                <h3 className="text-base font-bold text-[#0F2C59]">Personal Details & Saved Address</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Stored securely in your browser for faster checkouts and delivery tracking.
                </p>
              </div>

              {saveNotice && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{saveNotice}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Number</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3.5 py-2.5 border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full pl-9 pr-3.5 py-2.5 border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none text-slate-900"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    Default Pan-India Delivery Address
                  </p>
                  <label className="block font-semibold text-slate-700 mb-1">Flat / House No., Building, Street</label>
                  <input
                    type="text"
                    required
                    value={profile.addressLine}
                    onChange={(e) => setProfile({ ...profile, addressLine: e.target.value })}
                    placeholder="Flat 402, Green Park Residency"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Locality / Area</label>
                  <input
                    type="text"
                    required
                    value={profile.locality}
                    onChange={(e) => setProfile({ ...profile, locality: e.target.value })}
                    placeholder="Indirapuram"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={profile.city}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    placeholder="Noida"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={profile.state}
                    onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                    placeholder="Uttar Pradesh"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">6-Digit PIN Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    pattern="[0-9]{6}"
                    value={profile.pinCode}
                    onChange={(e) => setProfile({ ...profile, pinCode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                    placeholder="201014"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none font-mono text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile Changes</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
