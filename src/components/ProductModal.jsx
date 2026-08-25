import React, { useState } from 'react';
import { X, Camera, Check, ShieldCheck, Sparkles, Star, MapPin, RotateCw, Eye } from 'lucide-react';
import { LENS_PACKAGES } from '../data/products';

export default function ProductModal({ product, isOpen, onClose, onOpenTryOn, onAddToCart }) {
  if (!isOpen || !product) return null;

  const [selectedLens, setSelectedLens] = useState(LENS_PACKAGES[1]); // Blu-cut default
  const [prescriptionType, setPrescriptionType] = useState('upload'); // 'upload' | 'enter' | 'later'
  const [leftEyeSph, setLeftEyeSph] = useState('-1.25');
  const [rightEyeSph, setRightEyeSph] = useState('-1.50');
  const [uploadedFile, setUploadedFile] = useState(null);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const images = product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : [product.image];

  const totalPrice = product.price + selectedLens.price;

  const handleAdd = () => {
    onAddToCart({
      product,
      lensPackage: selectedLens,
      prescription: {
        type: prescriptionType,
        leftEyeSph,
        rightEyeSph,
        fileName: uploadedFile ? uploadedFile.name : null
      },
      totalPrice
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col md:flex-row relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Product Showcase */}
        <div className="md:w-1/2 bg-slate-50 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200 overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-teal-100 text-teal-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase">
                {product.brand}
              </span>
              <span className="text-xs text-slate-500 font-semibold uppercase">{product.shape}</span>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">{product.name}</h2>

            <div className="flex items-center gap-2 mt-2 text-sm text-slate-600">
              <div className="flex items-center gap-1 font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
              </div>
              <span>({product.reviewsCount} reviews)</span>
            </div>

            {/* Main Frame Visual with High-Res Studio Styling */}
            <div className="my-4 aspect-[16/10] bg-gradient-to-b from-white to-slate-50/70 rounded-2xl border border-slate-200/80 p-4 flex flex-col items-center justify-center relative shadow-sm overflow-hidden">
              <img
                src={images[activeImageIndex] || product.image}
                alt={product.name}
                className="max-h-40 max-w-[90%] object-contain transition-all duration-300"
                style={{
                  filter: 'drop-shadow(0 10px 8px rgba(0, 0, 0, 0.06)) drop-shadow(0 4px 3px rgba(0, 0, 0, 0.08))',
                  imageRendering: '-webkit-optimize-contrast'
                }}
              />
            </div>

            {/* Angle Gallery Thumbnails */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 mb-4 justify-center">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-14 h-10 p-1 bg-white rounded-lg border transition-all ${
                      activeImageIndex === idx ? 'border-2 border-teal-500 shadow-sm' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`Angle ${idx + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            {/* Lenskart Exact Action Buttons Below Product Image */}
            <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
              <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] text-slate-600 font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3 text-teal-600" /> In store 0.6 km
              </span>
              
              <button
                onClick={() => setActiveImageIndex((prev) => (prev + 1) % images.length)}
                className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] text-slate-700 font-semibold flex items-center gap-1 hover:bg-slate-200"
              >
                <RotateCw className="w-3 h-3" /> 360° View
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenTryOn(product);
                }}
                className="px-3 py-1 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-sm"
              >
                <Camera className="w-3 h-3" /> Try On
              </button>

              <button className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] text-slate-700 font-semibold flex items-center gap-1 hover:bg-slate-200">
                <Eye className="w-3 h-3" /> Similar
              </button>
            </div>

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-white p-3.5 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 block">Frame Width:</span>
                <span className="font-bold text-slate-700">{product.specs.frameWidth}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Bridge Width:</span>
                <span className="font-bold text-slate-700">{product.specs.bridgeWidth}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Material:</span>
                <span className="font-bold text-slate-700">{product.specs.material}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Frame Weight:</span>
                <span className="font-bold text-teal-600">{product.specs.weight}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 text-xs text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>1 Year Unconditional Frame & Lens Warranty</span>
          </div>
        </div>

        {/* Right Side: Lens Selection & Customization */}
        <div className="md:w-1/2 p-6 overflow-y-auto flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span>Step 1: Choose Lens Package</span>
            </h3>

            {/* Lens Packages List */}
            <div className="space-y-2.5">
              {LENS_PACKAGES.map((lens) => {
                const isSelected = selectedLens.id === lens.id;
                return (
                  <div
                    key={lens.id}
                    onClick={() => setSelectedLens(lens)}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{lens.name}</h4>
                          {lens.recommended && (
                            <span className="bg-amber-400 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded-full">
                              POPULAR
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{lens.subtitle}</p>
                      </div>
                      <span className="font-bold text-teal-700 text-sm">
                        {lens.price === 0 ? 'FREE' : `+₹${lens.price}`}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[11px] text-slate-600">
                      {lens.features.map((feat, fIdx) => (
                        <span key={fIdx} className="flex items-center gap-1">
                          <Check className="w-3 h-3 text-teal-600" /> {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Prescription Choice */}
            {selectedLens.id !== 'zero-power' && (
              <div className="mt-5 pt-4 border-t border-slate-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Step 2: Prescription Details
                </h3>

                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => setPrescriptionType('upload')}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg border ${
                      prescriptionType === 'upload' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Upload File
                  </button>
                  <button
                    onClick={() => setPrescriptionType('enter')}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg border ${
                      prescriptionType === 'enter' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Enter Manually
                  </button>
                  <button
                    onClick={() => setPrescriptionType('later')}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg border ${
                      prescriptionType === 'later' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Send Later
                  </button>
                </div>

                {prescriptionType === 'upload' && (
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center bg-slate-50">
                    <input
                      type="file"
                      id="presc-file"
                      className="hidden"
                      onChange={(e) => setUploadedFile(e.target.files[0])}
                    />
                    <label htmlFor="presc-file" className="cursor-pointer">
                      <span className="text-xs text-teal-600 font-bold block">
                        {uploadedFile ? uploadedFile.name : 'Click to Upload Doctor Prescription Photo/PDF'}
                      </span>
                      <span className="text-[11px] text-slate-400 block mt-1">Supports JPG, PNG, PDF up to 10MB</span>
                    </label>
                  </div>
                )}

                {prescriptionType === 'enter' && (
                  <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block">Left Eye SPH</label>
                      <input
                        type="text"
                        value={leftEyeSph}
                        onChange={(e) => setLeftEyeSph(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs text-slate-800 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block">Right Eye SPH</label>
                      <input
                        type="text"
                        value={rightEyeSph}
                        onChange={(e) => setRightEyeSph(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs text-slate-800 font-semibold"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Total & Add to Cart */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs text-slate-400 block">Total Price (Frame + Lens)</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-slate-900 font-['Outfit']">₹{totalPrice}</span>
                  <span className="text-xs text-slate-400 line-through">₹{product.originalPrice + selectedLens.price}</span>
                </div>
              </div>
              <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded">
                Inclusive of all taxes
              </span>
            </div>

            <button
              onClick={handleAdd}
              className="btn-primary w-full py-3.5 text-base rounded-2xl shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2"
            >
              <span>Add Eyewear To Cart</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
