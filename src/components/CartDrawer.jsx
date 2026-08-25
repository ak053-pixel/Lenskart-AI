import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Tag, Check, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { COUPONS } from '../data/products';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  if (!isOpen) return null;

  // Calculate financials
  const subtotal = cartItems.reduce((acc, item) => acc + item.totalPrice * item.quantity, 0);

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discountAmount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.discountAmount) {
      discountAmount = Math.min(subtotal, appliedCoupon.discountAmount);
    }
  }

  const shipping = subtotal > 1500 || (appliedCoupon && appliedCoupon.freeShipping) ? 0 : 99;
  const finalTotal = Math.max(0, subtotal - discountAmount + shipping);

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (COUPONS[code]) {
      setAppliedCoupon({ code, ...COUPONS[code] });
      setCouponError('');
    } else {
      setCouponError('Invalid Coupon. Try LENSKARTAI or FIRSTFRAME');
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderSuccess(true);
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 1200);
  };

  const handleFinishOrder = () => {
    onClearCart();
    setOrderSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div className="w-full max-w-md bg-white h-full flex flex-col justify-between shadow-2xl relative">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2 font-bold text-base font-['Outfit']">
            <ShoppingBag className="w-5 h-5 text-teal-400" />
            <span>Your Eyewear Cart ({cartItems.length})</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Success Modal State */}
        {orderSuccess ? (
          <div className="p-8 flex-1 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center animate-bounce">
              <Check className="w-10 h-10 stroke-[3]" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">Order Placed Successfully!</h3>
            <p className="text-sm text-slate-600">
              Thank you for ordering with LenskartAI! Your glasses are now entering 3D custom fitting and lens surfacing.
            </p>
            <div className="bg-slate-50 p-4 rounded-2xl w-full border border-slate-200 text-xs text-left space-y-1">
              <p><b>Order ID:</b> #LK-AI-84920</p>
              <p><b>Estimated Delivery:</b> 3 Days (Express Delivery)</p>
              <p><b>AI Fit Check:</b> Approved (100% Alignment)</p>
            </div>
            <button
              onClick={handleFinishOrder}
              className="btn-primary w-full py-3 text-sm rounded-xl font-bold mt-4"
            >
              Continue Shopping
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="p-8 flex-1 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Your Cart is Empty</h3>
            <p className="text-xs text-slate-500 max-w-xs">
              Explore our designer glasses collection or try on frames live with your camera!
            </p>
            <button
              onClick={onClose}
              className="btn-primary py-2.5 px-6 text-xs rounded-full font-bold"
            >
              Browse Glasses Catalog
            </button>
          </div>
        ) : (
          /* Cart Items List */
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cartItems.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex gap-3 relative group"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 object-contain bg-white rounded-xl border border-slate-200 p-1"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{item.product.name}</h4>
                      <button
                        onClick={() => onRemoveItem(idx)}
                        className="text-slate-400 hover:text-rose-500 p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-teal-700 font-semibold mt-0.5">
                      Lens: {item.lensPackage.name}
                    </p>

                    {item.prescription && item.prescription.fileName && (
                      <span className="inline-block mt-1 text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                        📄 Prescription Uploaded
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200">
                    <span className="font-extrabold text-slate-900 text-sm">₹{item.totalPrice * item.quantity}</span>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 bg-white px-2 py-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
                      <button
                        onClick={() => onUpdateQuantity(idx, item.quantity - 1)}
                        className="text-slate-500 hover:text-slate-900"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                        className="text-slate-500 hover:text-slate-900"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Promo Coupon Box */}
            <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-2">
                <Tag className="w-4 h-4 text-amber-600" />
                <span>Apply Promo Code</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Try LENSKARTAI"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 bg-white border border-amber-300 text-slate-800 text-xs px-3 py-1.5 rounded-xl uppercase font-semibold focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-1.5 rounded-xl transition-colors"
                >
                  Apply
                </button>
              </div>

              {couponError && <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>}
              {appliedCoupon && (
                <p className="text-[11px] text-emerald-700 font-bold mt-1.5 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Code {appliedCoupon.code} Applied: {appliedCoupon.desc}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Footer Financial Summary & Checkout Button */}
        {!orderSuccess && cartItems.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">₹{subtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-slate-900">
                  {shipping === 0 ? <span className="text-teal-600 font-bold">FREE</span> : `₹${shipping}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="text-teal-700 font-['Outfit'] text-base">₹{finalTotal}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="btn-primary w-full py-3.5 text-sm rounded-xl font-bold flex items-center justify-center gap-2"
            >
              {isCheckingOut ? (
                <span>Processing Order...</span>
              ) : (
                <>
                  <span>Proceed to Secure Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
