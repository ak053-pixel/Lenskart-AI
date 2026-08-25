import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import ProductCard from './components/ProductCard';
import ProductFilter from './components/ProductFilter';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import TryOnStudio from './components/TryOnStudio';
import Footer from './components/Footer';
import { PRODUCTS } from './data/products';
import { Sparkles, SlidersHorizontal, Eye } from 'lucide-react';

export default function App() {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Filter States
  const [selectedShapes, setSelectedShapes] = useState([]);
  const [selectedRimTypes, setSelectedRimTypes] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [priceRange, setPriceRange] = useState(15000);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // E-Commerce Modals & Cart
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState(['lk-001', 'lk-004']);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [activeModalProduct, setActiveModalProduct] = useState(null);
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);
  const [tryOnProduct, setTryOnProduct] = useState(null);

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((prod) => {
      // Category check
      if (activeCategory !== 'all' && prod.category !== activeCategory) {
        return false;
      }

      // Search query check
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = prod.name.toLowerCase().includes(q);
        const matchesBrand = prod.brand.toLowerCase().includes(q);
        const matchesShape = prod.shape.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesShape) return false;
      }

      // Shape check
      if (selectedShapes.length > 0 && !selectedShapes.includes(prod.shape)) {
        return false;
      }

      // Rim type check
      if (selectedRimTypes.length > 0 && !selectedRimTypes.includes(prod.rimType)) {
        return false;
      }

      // Gender check
      if (selectedGenders.length > 0 && !selectedGenders.includes(prod.gender)) {
        return false;
      }

      // Price check
      if (prod.price > priceRange) {
        return false;
      }

      return true;
    });
  }, [activeCategory, searchQuery, selectedShapes, selectedRimTypes, selectedGenders, priceRange]);

  // Handlers
  const handleResetFilters = () => {
    setSelectedShapes([]);
    setSelectedRimTypes([]);
    setSelectedGenders([]);
    setPriceRange(15000);
    setSearchQuery('');
  };

  const handleToggleWishlist = (id) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((item) => item !== id));
    } else {
      setWishlist([...wishlist, id]);
    }
  };

  const handleAddToCart = (cartPayload) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.product.id === cartPayload.product.id && i.lensPackage.id === cartPayload.lensPackage.id
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += cartPayload.quantity || 1;
        return updated;
      }
      return [...prev, { ...cartPayload, quantity: cartPayload.quantity || 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (idx, newQty) => {
    if (newQty <= 0) {
      handleRemoveCartItem(idx);
    } else {
      setCartItems((prev) => {
        const updated = [...prev];
        updated[idx].quantity = newQty;
        return updated;
      });
    }
  };

  const handleRemoveCartItem = (idx) => {
    setCartItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleOpenTryOn = (product = null) => {
    setTryOnProduct(product || PRODUCTS[0]);
    setIsTryOnOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-['Plus_Jakarta_Sans']">
      
      {/* Top Header */}
      <Header
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTryOn={handleOpenTryOn}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        onToggleFilters={() => setIsMobileFilterOpen(true)}
        wishlistCount={wishlist.length}
      />

      {/* Hero Banner */}
      <HeroBanner onOpenTryOn={handleOpenTryOn} />

      {/* Main Product Catalog Section */}
      <main id="product-grid" className="max-w-7xl mx-auto px-4 w-full flex-1 pb-16">
        
        {/* Section Title & Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 font-['Outfit'] flex items-center gap-2">
              <span>Explore Eyewear Collection</span>
              <span className="text-sm font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                {filteredProducts.length} Frames Found
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select any frame to test on your camera with live 3D AI alignment.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="md:hidden btn-primary text-xs py-2 px-3 flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>

            <button
              onClick={() => handleOpenTryOn()}
              className="btn-ai-tryon text-xs py-2 px-4 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" /> Try On Studio
            </button>
          </div>
        </div>

        {/* Layout: Sidebar Filter + Product Cards Grid */}
        <div className="flex gap-8 items-start">
          
          {/* Desktop Filter Sidebar */}
          <ProductFilter
            selectedShapes={selectedShapes}
            setSelectedShapes={setSelectedShapes}
            selectedRimTypes={selectedRimTypes}
            setSelectedRimTypes={setSelectedRimTypes}
            selectedGenders={selectedGenders}
            setSelectedGenders={setSelectedGenders}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            onResetFilters={handleResetFilters}
            isOpen={isMobileFilterOpen}
            onClose={() => setIsMobileFilterOpen(false)}
          />

          {/* Product Grid */}
          <div className="flex-1 w-full">
            {filteredProducts.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3 my-8">
                <Eye className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-lg font-bold text-slate-800">No frames match your filters</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your price range, frame shapes, or search terms to see more glasses.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="btn-primary text-xs py-2.5 px-6 rounded-full font-bold mt-2"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpenProductModal={(p) => setActiveModalProduct(p)}
                    onOpenTryOn={(p) => handleOpenTryOn(p)}
                    onAddToCart={(p) => handleAddToCart({ product: p, lensPackage: { name: 'Zero Power', price: 0 }, totalPrice: p.price })}
                    isWishlisted={wishlist.includes(product.id)}
                    onToggleWishlist={handleToggleWishlist}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Product Detail Modal */}
      <ProductModal
        product={activeModalProduct}
        isOpen={Boolean(activeModalProduct)}
        onClose={() => setActiveModalProduct(null)}
        onOpenTryOn={(p) => handleOpenTryOn(p)}
        onAddToCart={handleAddToCart}
      />

      {/* Shopping Cart Sliding Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={() => setCartItems([])}
      />

      {/* Live AI Virtual Frame Try-On Studio Overlay Modal */}
      <TryOnStudio
        isOpen={isTryOnOpen}
        onClose={() => setIsTryOnOpen(false)}
        selectedProduct={tryOnProduct}
        onSelectProduct={(p) => setTryOnProduct(p)}
        onAddToCart={(item) => handleAddToCart(item)}
      />

      {/* Footer */}
      <Footer onOpenTryOn={() => handleOpenTryOn()} />

    </div>
  );
}
