// Official Jeeliz 3D Glasses Eyewear Catalog
import framesData from './frames.json';

export const PRODUCTS = framesData.map((frame, index) => ({
  id: frame.sku || frame.id,
  name: frame.name,
  brand: frame.brand,
  price: frame.price_inr,
  originalPrice: Math.round(frame.price_inr * 1.3),
  discount: `${Math.round((1 - 1 / 1.3) * 100)}% OFF`,
  category: frame.category || 'sunglasses',
  shape: (frame.shape || 'aviator').toLowerCase(),
  rimType: (frame.frame_type || 'Full Rim').toLowerCase().replace(' ', '-'),
  sizeCategory: frame.size_category || 'Medium',
  gender: frame.gender || 'unisex',
  colors: [frame.color || '#d4af37', "#0f172a"],
  rating: frame.rating || 4.8,
  reviewsCount: frame.reviews_count || 12000,
  bestFaceShapes: frame.target_face_shapes || ['Oval', 'Square'],
  isBestseller: index % 3 === 0,
  isNew: index % 4 === 0,
  specs: {
    frameWidth: `${frame.dimensions?.frame_width_mm || 140} mm`,
    bridgeWidth: `${frame.dimensions?.bridge_width_mm || 15} mm`,
    templeLength: `${frame.dimensions?.temple_length_mm || 145} mm`,
    lensWidth: `${frame.dimensions?.lens_width_mm || 55} mm`,
    material: frame.material || 'Metal & Acetate',
    weight: `${Math.round(14 + (index % 6))}g`
  },
  sku: frame.sku,
  image: frame.image || `/frames/frame${(index % 12) + 1}.jpg`,
  imageUrls: [frame.image || `/frames/frame${(index % 12) + 1}.jpg`],
  framePng: frame.framePng || frame.frame_path
}));

export const LENS_PACKAGES = [
  {
    id: "zero-power",
    name: "Classic UV400 G-15 Lenses",
    subtitle: "Original optical protection",
    price: 0,
    features: ["Anti-Glare Coating", "UV400 Shield", "Scratch Resistant"]
  },
  {
    id: "polarized",
    name: "Polarized Glare-Block Screen Lenses",
    subtitle: "High contrast polarization filter",
    price: 1199,
    features: ["Eliminates 99% Water/Road Glare", "Hydrophobic Dust Resistant", "True Color HD View"],
    recommended: true
  },
  {
    id: "custom-rx",
    name: "Prescription Sunglass Lenses",
    subtitle: "Custom Single Vision or Reading Power",
    price: 1499,
    features: ["Custom Prescription", "Thin & Lightweight", "Full UV400 Mirror Coating"]
  }
];

export const COUPONS = {
  LENSKARTAI: { discountPercent: 20, desc: "20% OFF AI Exclusive Discount" },
  FIRSTFRAME: { discountAmount: 500, desc: "₹500 OFF on your first purchase" },
  FREESHIP: { freeShipping: true, desc: "Free Express Home Delivery" }
};
