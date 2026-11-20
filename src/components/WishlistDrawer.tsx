import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight, Star } from 'lucide-react';
import { Product, ProductVariation } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: Product[];
  onRemoveItem: (productId: string) => void;
  onClearAll: () => void;
  onSelectProduct: (product: Product, initialVariation?: ProductVariation) => void;
  onAddToCart: (product: Product, variation: ProductVariation) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onClearAll,
  onSelectProduct,
  onAddToCart
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Favorites Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h2 className="text-base font-bold text-slate-900">My Favorites</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
              {items.length} saved
            </span>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-[11px] font-semibold text-slate-500 hover:text-rose-600 transition-colors cursor-pointer px-2 py-1"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              aria-label="Close favorites drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Saved Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 text-slate-400">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mb-3">
                <Heart className="w-8 h-8 text-rose-400" />
              </div>
              <p className="text-sm font-semibold text-slate-700">Your favorites list is empty</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                Tap the heart icon on any medicine or Ayurvedic formulation to save it here for quick reordering.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Browse Products
              </button>
            </div>
          ) : (
            items.map((product) => {
              const defaultVariation: ProductVariation = product.variations[0] || {
                id: 'default',
                size: 'Standard',
                price: product.basePrice,
                comparePrice: product.baseComparePrice,
                stock: 50,
                imageUrl: product.defaultImageUrl,
                sku: product.slug
              };

              return (
                <div
                  key={product.id}
                  className="p-3.5 rounded-2xl border border-slate-200/80 bg-white hover:border-emerald-200 transition-colors flex gap-3.5 items-start shadow-2xs"
                >
                  {/* Thumbnail */}
                  <button
                    onClick={() => {
                      onSelectProduct(product, defaultVariation);
                      onClose();
                    }}
                    className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-200/70 p-2 shrink-0 flex items-center justify-center cursor-pointer"
                  >
                    <img
                      src={defaultVariation.imageUrl || product.defaultImageUrl}
                      alt={product.name}
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </button>

                  {/* Details & Actions */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-emerald-800">
                        {product.category}
                      </span>
                      <button
                        onClick={() => onRemoveItem(product.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer p-0.5"
                        title="Remove from Favorites"
                        aria-label={`Remove ${product.name} from Favorites`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        onSelectProduct(product, defaultVariation);
                        onClose();
                      }}
                      className="text-left text-xs font-bold text-slate-900 hover:text-emerald-800 line-clamp-2 leading-snug cursor-pointer"
                    >
                      {product.name}
                    </button>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="inline-flex items-center gap-0.5 text-slate-700 font-medium">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {product.rating.toFixed(1)}
                      </span>
                      <span>·</span>
                      <span className="truncate">{defaultVariation.size}</span>
                    </div>

                    <div className="pt-1.5 flex items-center justify-between gap-2">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-bold text-[#0F2C59] tabular-nums">
                          ₹{defaultVariation.price.toLocaleString('en-IN')}
                        </span>
                        {defaultVariation.comparePrice && defaultVariation.comparePrice > defaultVariation.price && (
                          <span className="text-[11px] text-slate-400 line-through tabular-nums">
                            ₹{defaultVariation.comparePrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => onAddToCart(product, defaultVariation)}
                        disabled={defaultVariation.stock <= 0}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>{defaultVariation.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/70">
            <button
              onClick={onClose}
              className="w-full py-3 px-4 bg-[#0F2C59] hover:bg-[#153a73] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
