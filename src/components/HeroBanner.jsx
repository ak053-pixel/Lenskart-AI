import React from 'react';
import { Camera, Sparkles, ShieldCheck, RefreshCw, Truck, ArrowRight } from 'lucide-react';

export default function HeroBanner({ onOpenTryOn }) {
  return (
    <div className="w-full bg-slate-950 text-white relative overflow-hidden py-12 px-4 mb-8">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-sky-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left Hero Text Column */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 bg-teal-950/80 border border-teal-500/30 px-3 py-1.5 rounded-full text-teal-300 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-teal-400 animate-spin" />
            <span>Next-Gen 3D AI Virtual Try-On Engine</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-['Outfit']">
            See how glasses look on <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-sky-300 to-amber-300">
              YOUR face in real-time
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-xl font-normal">
            No more guessing! Turn on your webcam or upload a photo to test 100+ designer frames with instant 3D face mesh alignment, automatic face shape analysis, and lens tint previews.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onOpenTryOn}
              className="btn-primary px-6 py-3.5 text-base rounded-full shadow-lg shadow-teal-500/25 flex items-center gap-3 group"
            >
              <Camera className="w-5 h-5 text-sky-200 group-hover:scale-110 transition-transform" />
              <span>Launch Live AI Try-On</span>
              <ArrowRight className="w-4 h-4 text-teal-200 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="#product-grid"
              className="px-6 py-3.5 rounded-full border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 font-semibold text-sm transition-all"
            >
              Explore Frame Catalog
            </a>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 max-w-lg">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
              <span>100% Fit Guarantee</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <RefreshCw className="w-4 h-4 text-sky-400 shrink-0" />
              <span>14-Day Free Exchange</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Truck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Free Doorstep Delivery</span>
            </div>
          </div>
        </div>

        {/* Right Interactive Try-On Visual Teaser Card */}
        <div className="lg:col-span-5 relative">
          <div className="relative mx-auto max-w-sm rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 p-4 border border-slate-800 shadow-2xl overflow-hidden group">
            
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80"
                alt="AI Virtual Try On Demo"
                className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
              />

              {/* Simulated AR Overlay Glasses */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <svg viewBox="0 0 300 120" className="w-56 h-24 filter drop-shadow-xl animate-pulse">
                  <path d="M 60 50 Q 85 30 110 50 L 110 75 Q 85 95 60 75 Z" fill="rgba(56, 189, 248, 0.25)" stroke="#d4af37" strokeWidth="6" />
                  <path d="M 190 50 Q 215 30 240 50 L 240 75 Q 215 95 190 75 Z" fill="rgba(56, 189, 248, 0.25)" stroke="#d4af37" strokeWidth="6" />
                  <path d="M 110 55 Q 150 45 190 55" stroke="#d4af37" strokeWidth="5" fill="none" strokeLinecap="round" />
                </svg>
              </div>

              {/* Face Shape Badge */}
              <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-teal-500/40 text-[11px] text-teal-300 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                AI Face Shape: Oval Detected
              </div>

              {/* Realtime Tracking Badge */}
              <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-sky-500/40 text-[11px] text-sky-300 font-medium">
                ⚡ 60 FPS Real-time Tracking
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">Vincent Chase Urban Classic</h4>
                <p className="text-xs text-slate-400">Match score: <span className="text-teal-400 font-bold">98% Perfect Fit</span></p>
              </div>
              <button
                onClick={onOpenTryOn}
                className="px-3 py-1.5 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-semibold transition-all"
              >
                Try On
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
