import React, { useState } from 'react';
import { Sparkles, ShieldCheck, RefreshCw, Truck, HeartHandshake, ArrowRight, Check } from 'lucide-react';

export default function Footer({ onOpenTryOn }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer className="bg-slate-950 text-white pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        
        {/* Top Trust Badges Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-500/10 text-teal-400 rounded-2xl border border-teal-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">100% Authentic</h4>
              <p className="text-xs text-slate-400">Certified Premium Lenses</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-sky-500/10 text-sky-400 rounded-2xl border border-sky-500/20">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">14 Days Return</h4>
              <p className="text-xs text-slate-400">No Questions Asked</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Free Doorstep Fit</h4>
              <p className="text-xs text-slate-400">Express Delivery Nationwide</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">1 Year Warranty</h4>
              <p className="text-xs text-slate-400">Full Coverage Guarantee</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <a href="#" className="brand-logo text-white">
              Lenskart<span className="text-teal-400">AI</span>
            </a>
            <p className="text-xs text-slate-400 leading-relaxed">
              India's premier AI-powered eyewear destination. Experience real-time 3D Virtual Try-On, precision prescription lenses, and high-fashion frame designs.
            </p>
            <button
              onClick={onOpenTryOn}
              className="btn-ai-tryon text-xs py-2 px-4"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch AI Try-On</span>
            </button>
          </div>

          {/* Eyewear Categories */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-slate-300 mb-4">Eyewear Catalog</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#" className="hover:text-teal-400 transition-colors">Men's Eyeglasses</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Women's Eyeglasses</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Polarized Sunglasses</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Blu-Cut Computer Glasses</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Progressive & Bifocal</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Reading Glasses</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-slate-300 mb-4">Help & Service</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#" className="hover:text-teal-400 transition-colors">Track Your Order</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Book Free Home Try-On</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Lenskart Store Locator</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Prescription Guide</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Face Shape Finder AI</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Returns & Refunds</a></li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-wider text-slate-300">Stay Visionary</h4>
            <p className="text-xs text-slate-400">
              Subscribe to get ₹500 OFF voucher & exclusive preview of new designer frames.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-teal-400"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 p-1.5 rounded-lg transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {subscribed && (
                <p className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Subscribed! Check email for your ₹500 voucher.
                </p>
              )}
            </form>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} LenskartAI Technologies Ltd. All Rights Reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-400">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400">Terms of Service</a>
            <a href="#" className="hover:text-slate-400">Sitemap</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
