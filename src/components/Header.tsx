import React, { useState } from 'react';
import { Search, ShoppingBag, Truck, PhoneCall, ShieldCheck, Clock, MapPin, X, Heart, User } from 'lucide-react';
import { CartItem } from '../types';

interface HeaderProps {
  cartItems: CartItem[];
  onOpenCart: () => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
  ordersCount: number;
  onOpenAccount: () => void;
  onOpenTrackOrder: () => void;
  onSearch: (query: string, category: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onNavigateHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartItems,
  onOpenCart,
  wishlistCount,
  onOpenWishlist,
  ordersCount,
  onOpenAccount,
  onOpenTrackOrder,
  onSearch,
  selectedCategory,
  onSelectCategory,
  onNavigateHome,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCat, setSearchCat] = useState('All');

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery, searchCat);
  };

  const navCategories = [
    'All Products',
    'Ayurvedic & Herbal',
    'Vitamins & Supplements',
    'Daily Wellness',
    'Skin & Haircare',
    'Pain Relief',
    'Health Devices'
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">
      {/* Top Utility Announcement Bar */}
      <div className="bg-[#0F2C59] text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-200">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              Delivering Pan-India · PIN code verified
            </span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:flex items-center gap-1.5 text-slate-200">
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
              Free Delivery on orders above ₹499
            </span>
          </div>

          <div className="flex items-center gap-5 text-slate-200">
            <button
              onClick={onOpenTrackOrder}
              className="hover:text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              Track Order
            </button>
            <span className="text-slate-500">·</span>
            <a href="tel:18002667288" className="hover:text-emerald-300 transition-colors flex items-center gap-1">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              Help: 1800-266-7288
            </a>
          </div>
        </div>
      </div>

      {/* Main Brand & Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 md:gap-8">
        {/* Brand Wordmark (No admin link) */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 text-left shrink-0 cursor-pointer group"
          aria-label="Saatvik Pharma Homepage"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-[#0F2C59] flex items-center justify-center text-white shadow-md shadow-emerald-900/10 group-hover:scale-105 transition-transform">
            <span className="font-serif font-black text-xl tracking-tighter">S</span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold tracking-tight text-[#0F2C59] font-serif">Saatvik</span>
              <span className="text-xl font-semibold tracking-tight text-emerald-700">Pharma</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">Pure Health · Authentic Care</p>
          </div>
        </button>

        {/* Global Search with Category Filter */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-2xl items-center bg-slate-50 border border-slate-300 rounded-xl overflow-hidden focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100 transition-all"
        >
          <div className="pl-3 text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              onSearch(e.target.value, searchCat);
            }}
            placeholder="Search medicines, ayurvedic herbs, vitamins, wellness..."
            className="w-full px-3 py-2 text-sm text-slate-800 bg-transparent focus:outline-none placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                onSearch('', searchCat);
              }}
              className="p-1 text-slate-400 hover:text-slate-600 mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <select
            value={searchCat}
            onChange={(e) => {
              setSearchCat(e.target.value);
              onSearch(searchQuery, e.target.value);
            }}
            className="border-l border-slate-200 bg-slate-100/70 text-slate-700 text-xs px-3 py-2 font-medium focus:outline-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Ayurvedic & Herbal">Ayurvedic</option>
            <option value="Vitamins & Supplements">Vitamins</option>
            <option value="Daily Wellness">Wellness</option>
            <option value="Skin & Haircare">Skincare</option>
            <option value="Pain Relief">Pain Relief</option>
            <option value="Health Devices">Devices</option>
          </select>
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-semibold tracking-wide transition-colors"
          >
            Search
          </button>
        </form>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* My Account & Order History Trigger */}
          <button
            onClick={onOpenAccount}
            className="relative flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-emerald-50/70 text-slate-800 border border-slate-200 hover:border-emerald-200 rounded-xl text-xs font-semibold transition-all shadow-2xs cursor-pointer group"
            aria-label="My Account and Order History"
          >
            <User className="w-4 h-4 text-[#0F2C59] group-hover:text-emerald-700 transition-colors" />
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-[10px] text-slate-500 font-normal leading-tight">My Account</span>
              <span className="font-semibold text-slate-800 leading-tight whitespace-nowrap">Order History</span>
            </div>
            {ordersCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-emerald-700 text-white font-bold text-[10px] min-w-5 h-5 px-1 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                {ordersCount}
              </span>
            )}
          </button>

          {/* My Favorites Trigger */}
          <button
            onClick={onOpenWishlist}
            className="relative flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-rose-50/70 text-slate-800 border border-slate-200 hover:border-rose-200 rounded-xl text-xs font-semibold transition-all shadow-2xs cursor-pointer group"
            aria-label="My Favorites"
          >
            <Heart
              className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : 'text-rose-500'
              }`}
            />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[10px] text-slate-500 font-normal leading-tight">Wishlist</span>
              <span className="font-semibold text-slate-800 leading-tight whitespace-nowrap">My Favorites</span>
            </div>
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white font-bold text-[10px] min-w-5 h-5 px-1 rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-in zoom-in">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Drawer Trigger */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2.5 px-3.5 py-2 bg-[#0F2C59] hover:bg-[#153a73] text-white rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer group"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-slate-300 font-normal leading-tight">My Cart</span>
              <span className="font-semibold text-emerald-300 leading-tight">₹{cartSubtotal.toLocaleString('en-IN')}</span>
            </div>
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white font-bold text-[10px] min-w-5 h-5 px-1 rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-in zoom-in">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center bg-slate-50 border border-slate-300 rounded-lg overflow-hidden focus-within:border-emerald-600"
        >
          <div className="pl-3 text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              onSearch(e.target.value, searchCat);
            }}
            placeholder="Search medicines or herbs..."
            className="w-full px-2.5 py-2 text-xs text-slate-800 bg-transparent focus:outline-none"
          />
        </form>
      </div>

      {/* Category Navigation Strip */}
      <div className="border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none text-xs font-medium">
            {navCategories.map((cat) => {
              const isActive = (cat === 'All Products' && selectedCategory === 'All') || selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat === 'All Products' ? 'All' : cat)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
