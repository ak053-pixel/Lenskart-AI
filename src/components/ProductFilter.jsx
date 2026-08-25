import React from 'react';
import { Filter, X, Check, RotateCcw } from 'lucide-react';

export default function ProductFilter({
  selectedShapes,
  setSelectedShapes,
  selectedRimTypes,
  setSelectedRimTypes,
  selectedGenders,
  setSelectedGenders,
  priceRange,
  setPriceRange,
  onResetFilters,
  isOpen,
  onClose
}) {
  const shapes = [
    { id: 'rectangle', label: 'Rectangle' },
    { id: 'round', label: 'Round' },
    { id: 'geometric', label: 'Geometric' },
    { id: 'square', label: 'Square' },
    { id: 'cateye', label: 'Cat-Eye' },
    { id: 'aviator', label: 'Aviator' },
    { id: 'clubmaster', label: 'Clubmaster' },
    { id: 'wayfarer', label: 'Wayfarer' }
  ];

  const rimTypes = [
    { id: 'full-rim', label: 'Full Rim' },
    { id: 'half-rim', label: 'Half Rim' },
    { id: 'rimless', label: 'Rimless' }
  ];

  const genders = [
    { id: 'unisex', label: 'Unisex' },
    { id: 'men', label: 'Men' },
    { id: 'women', label: 'Women' }
  ];

  const toggleItem = (list, setList, item) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const filterContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-base">
          <Filter className="w-4 h-4 text-teal-600" />
          <span>Filters</span>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs font-semibold text-teal-600 hover:text-teal-800 flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" /> Reset All
        </button>
      </div>

      {/* Price Range */}
      <div>
        <div className="flex justify-between items-center mb-2 text-xs font-semibold text-slate-700">
          <span>Max Price</span>
          <span className="text-teal-600 font-bold text-sm">₹{priceRange}</span>
        </div>
        <input
          type="range"
          min="1000"
          max="15000"
          step="500"
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          className="w-full accent-teal-500 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-slate-400 mt-1">
          <span>₹1,000</span>
          <span>₹15,000</span>
        </div>
      </div>

      {/* Frame Shape */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Frame Shape</h4>
        <div className="grid grid-cols-2 gap-2">
          {shapes.map((s) => {
            const isSelected = selectedShapes.includes(s.id);
            return (
              <button
                key={s.id}
                onClick={() => toggleItem(selectedShapes, setSelectedShapes, s.id)}
                className={`px-3 py-2 text-xs font-medium rounded-lg border text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-teal-50 border-teal-500 text-teal-900 font-semibold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{s.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-teal-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rim Type */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Rim Type</h4>
        <div className="space-y-2">
          {rimTypes.map((r) => {
            const isSelected = selectedRimTypes.includes(r.id);
            return (
              <button
                key={r.id}
                onClick={() => toggleItem(selectedRimTypes, setSelectedRimTypes, r.id)}
                className={`w-full px-3 py-2 text-xs font-medium rounded-lg border text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-slate-900 border-slate-900 text-white font-semibold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{r.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-teal-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Gender */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Gender</h4>
        <div className="flex gap-2">
          {genders.map((g) => {
            const isSelected = selectedGenders.includes(g.id);
            return (
              <button
                key={g.id}
                onClick={() => toggleItem(selectedGenders, setSelectedGenders, g.id)}
                className={`flex-1 py-2 text-xs font-medium rounded-lg border text-center transition-all ${
                  isSelected
                    ? 'bg-amber-500 border-amber-500 text-white font-bold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {g.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm h-fit sticky top-36">
        {filterContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm md:hidden flex justify-end">
          <div className="w-4/5 max-w-sm bg-white h-full p-6 overflow-y-auto shadow-2xl relative animate-slideLeft">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mt-4">{filterContent}</div>
          </div>
        </div>
      )}
    </>
  );
}
