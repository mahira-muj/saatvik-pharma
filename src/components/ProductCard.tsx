import React, { useState } from 'react';
import { Star, ShoppingBag, Eye, Check, Heart } from 'lucide-react';
import { Product, ProductVariation } from '../types';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product, initialVariation?: ProductVariation) => void;
  onAddToCart: (product: Product, variation: ProductVariation) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onAddToCart,
  isWishlisted = false,
  onToggleWishlist
}) => {
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation>(
    product.variations[0] || {
      id: 'default',
      size: 'Standard',
      price: product.basePrice,
      stock: 50,
      imageUrl: product.defaultImageUrl,
      sku: product.slug
    }
  );
  const [addedNotice, setAddedNotice] = useState(false);

  const discountPercent = selectedVariation.comparePrice
    ? Math.round(((selectedVariation.comparePrice - selectedVariation.price) / selectedVariation.comparePrice) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, selectedVariation);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 1500);
  };

  return (
    <div
      onClick={() => onSelectProduct(product, selectedVariation)}
      className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:border-emerald-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      <div>
        {/* Product Image Frame */}
        <div className="relative aspect-square w-full bg-slate-50/70 p-4 flex items-center justify-center overflow-hidden border-b border-slate-100">
          <img
            src={selectedVariation.imageUrl || product.defaultImageUrl}
            alt={`${product.name} - ${selectedVariation.size}`}
            className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
          />

          {/* Discount Badge */}
          {discountPercent > 0 && (
            <span className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              {discountPercent}% OFF
            </span>
          )}

          {/* Wishlist Heart Toggle Button */}
          {onToggleWishlist && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist(product.id);
              }}
              aria-label={isWishlisted ? 'Remove from Favorites' : 'Add to Favorites'}
              title={isWishlisted ? 'Remove from Favorites' : 'Save to Favorites'}
              className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm cursor-pointer ${
                isWishlisted
                  ? 'bg-rose-50 text-rose-600 border border-rose-200 scale-105'
                  : 'bg-white/90 backdrop-blur-xs text-slate-400 hover:text-rose-500 border border-slate-200/70'
              }`}
            >
              <Heart className={`w-4 h-4 transition-transform ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          )}

          {/* Quick View Button on Hover */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product, selectedVariation);
            }}
            className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-slate-700 hover:text-emerald-700 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Content Info */}
        <div className="p-4 space-y-2">
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium text-emerald-800 uppercase text-[10px] tracking-wide">
              {product.category}
            </span>
            <div className="flex items-center gap-1 font-medium text-slate-700">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-slate-400">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Short description */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Pack Options Selector */}
          {product.variations.length > 1 ? (
            <div className="pt-2">
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                <span>Select Pack:</span>
                <span className="font-semibold text-emerald-800 truncate max-w-[130px]">{selectedVariation.size}</span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                {product.variations.map((v) => (
                  <button
                    key={v.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVariation(v);
                    }}
                    className={`px-2 py-1 text-[10px] font-semibold rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                      selectedVariation.id === v.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600'
                    }`}
                  >
                    {v.size}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="pt-1">
              <span className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-medium">
                {selectedVariation.size}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Price in INR & Add to Cart */}
      <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-slate-900 tabular-nums">
              ₹{selectedVariation.price.toLocaleString('en-IN')}
            </span>
            {selectedVariation.comparePrice && selectedVariation.comparePrice > selectedVariation.price && (
              <span className="text-xs text-slate-400 line-through tabular-nums">
                ₹{selectedVariation.comparePrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-400">Incl. all taxes</span>
        </div>

        <button
          onClick={handleQuickAdd}
          disabled={selectedVariation.stock <= 0}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
            addedNotice
              ? 'bg-emerald-600 text-white'
              : selectedVariation.stock <= 0
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-600 hover:text-white border border-emerald-200 hover:border-emerald-600'
          }`}
        >
          {addedNotice ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added</span>
            </>
          ) : selectedVariation.stock <= 0 ? (
            <span>Out of Stock</span>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
