import React from 'react';
import { Camera, ShoppingBag, Heart, Search, Sparkles, SlidersHorizontal, Sun, Eye, ShieldAlert } from 'lucide-react';

export default function Header({
  cartCount,
  onOpenCart,
  onOpenTryOn,
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  onToggleFilters,
  wishlistCount
}) {
  const categories = [
    { id: 'all', label: 'All Eyewear', icon: Eye },
    { id: 'eyeglasses', label: 'Eyeglasses', icon: Eye },
    { id: 'sunglasses', label: 'Sunglasses', icon: Sun },
    { id: 'screenglasses', label: 'Screen Cut (Blu)', icon: ShieldAlert },
    { id: 'reading', label: 'Reading Glasses', icon: Eye }
  ];

  return (
    <header className="w-full sticky top-0 z-50 shadow-sm">
      {/* Top Banner */}
      <div className="header-top-bar">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-slate-900 font-bold px-1.5 py-0.5 rounded text-[10px]">
              LIMITED TIME
            </span>
            <span>Use Code <b>LENSKARTAI</b> for 20% OFF + Free AI Try-On Fitting!</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <span>📞 1800-111-LENS</span>
            <span>📍 Find a Store Nearby</span>
            <span>✨ 14-Day Free Returns</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="header-main px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-4">
            <a href="#" className="brand-logo">
              Lenskart<span className="text-teal-500">AI</span>
              <span className="badge-ai flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Live AR
              </span>
            </a>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl relative hidden md:block">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search Aviator, Round, Blu-Cut glasses, John Jacobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 focus:bg-white text-slate-800 text-sm pl-9 pr-4 py-2 rounded-full border border-slate-200 focus:border-teal-500 focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 text-xs"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Live AI Try-On Studio Button */}
            <button
              onClick={() => onOpenTryOn()}
              className="btn-ai-tryon pulse-glow"
              title="Launch Live Webcam AI Virtual Try-On"
            >
              <Camera className="w-4 h-4 text-sky-400 animate-pulse" />
              <span className="hidden sm:inline">Try On Live AI</span>
            </button>

            {/* Filter Toggle Button (Mobile) */}
            <button
              onClick={onToggleFilters}
              className="p-2 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-100 md:hidden"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <button className="relative p-2 rounded-full text-slate-700 hover:bg-slate-100 transition-colors">
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Drawer Launcher */}
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-all flex items-center justify-center"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-teal-400 text-slate-950 text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Category Navigation Bar */}
        <div className="max-w-7xl mx-auto mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="category-pills">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`category-pill ${activeCategory === cat.id ? 'active' : ''}`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-4 text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-full border border-teal-100">
            <span>✨ 3D AI Face-Fit Guaranteed</span>
          </div>
        </div>
      </div>
    </header>
  );
}
