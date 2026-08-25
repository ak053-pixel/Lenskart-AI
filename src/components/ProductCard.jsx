import React, { useState } from 'react';
import { Camera, Star, ShoppingBag, Heart } from 'lucide-react';

export default function ProductCard({
  product,
  onOpenProductModal,
  onOpenTryOn,
  onAddToCart,
  isWishlisted,
  onToggleWishlist
}) {
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "#0f172a");

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative group">
      
      {/* Top Badges & Wishlist */}
      <div className="flex items-center justify-between w-full mb-2">
        <div className="flex items-center gap-1.5">
          {product.isBestseller && (
            <span className="bg-amber-400 text-slate-950 font-extrabold text-[10px] uppercase px-2 py-0.5 rounded shadow-sm">
              BESTSELLER
            </span>
          )}
          {product.isNew && (
            <span className="bg-teal-500 text-white font-extrabold text-[10px] uppercase px-2 py-0.5 rounded shadow-sm">
              NEW ARRIVAL
            </span>
          )}
        </div>

        <button
          onClick={() => onToggleWishlist(product.id)}
          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-rose-500 transition-colors"
          title="Save to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
      </div>

      {/* Real High-Resolution Studio Product Image with Fallback */}
      <div
        onClick={() => onOpenProductModal(product)}
        className="w-full flex items-center justify-center cursor-pointer py-2 overflow-hidden"
      >
        <img
          src={product.image}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/frames/frame1.jpg';
          }}
          className="w-full h-36 object-contain p-2 hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Product Information */}
      <div className="pt-2 border-t border-slate-100 space-y-2">
        
        {/* Brand & Shape/Size Specs */}
        <div>
          <div className="flex items-center justify-between text-xs mb-0.5">
            <span className="font-bold text-slate-900 uppercase tracking-wider">{product.brand}</span>
            <div className="flex items-center gap-1 font-bold text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded text-[11px]">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
            </div>
          </div>

          <h3
            onClick={() => onOpenProductModal(product)}
            className="font-semibold text-slate-800 text-sm hover:text-teal-600 transition-colors line-clamp-1 cursor-pointer"
          >
            {product.name}
          </h3>

          <p className="text-xs text-slate-500 uppercase mt-0.5">
            {product.shape} • {product.sizeCategory || 'Medium'} • {product.specs?.material || 'Acetate'}
          </p>
        </div>

        {/* Price & BLU Tag */}
        <div className="flex items-baseline justify-between pt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-extrabold text-slate-900">₹{product.price}</span>
            <span className="text-xs text-slate-400 line-through">₹{product.originalPrice}</span>
            <span className="text-[10px] font-bold text-teal-600">{product.discount}</span>
          </div>
          <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-1.5 py-0.5 rounded">
            Free BLU Lenses
          </span>
        </div>

        {/* Action Buttons: 3D Try On & Select Lens */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={() => onOpenTryOn(product)}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-teal-400 hover:text-teal-300 font-bold text-xs shadow-sm transition-all active:scale-95"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Try On AI</span>
          </button>

          <button
            onClick={() => onOpenProductModal(product)}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-xs shadow-sm transition-all active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Select Lens</span>
          </button>
        </div>

      </div>

    </div>
  );
}
