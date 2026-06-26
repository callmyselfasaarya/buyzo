export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  features: string[];
  description: string;
  // Real-data extensions
  buy_url?: string;         // direct Amazon link
  price_drop?: number;      // ₹ dropped vs last week
  price_drop_days?: number; // days since it was higher
  source?: string;          // "amazon" | "local"
}

export const products: Product[] = [
  {
    id: "p1",
    name: "Galaxy S25 Ultra",
    brand: "Samsung",
    category: "phone",
    price: 134999,
    originalPrice: 144999,
    rating: 4.7,
    reviewCount: 12450,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
    features: ["200MP Camera", "Snapdragon 8 Gen 4", "5000mAh", "S Pen"],
    description: "Flagship phone with the best camera system and AI features."
  },
  {
    id: "p2",
    name: "iPhone 17 Pro Max",
    brand: "Apple",
    category: "phone",
    price: 159900,
    rating: 4.8,
    reviewCount: 28300,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
    features: ["48MP ProRAW", "A19 Pro Chip", "Titanium Design", "Action Button"],
    description: "Apple's most advanced iPhone with breakthrough camera technology."
  },
  {
    id: "p3",
    name: "Pixel 10 Pro",
    brand: "Google",
    category: "phone",
    price: 99999,
    originalPrice: 106999,
    rating: 4.6,
    reviewCount: 8920,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop",
    features: ["Tensor G5", "AI Photography", "7 Years Updates", "Magic Eraser"],
    description: "The smartest phone with Google AI built in."
  },
  {
    id: "p4",
    name: "OnePlus 14",
    brand: "OnePlus",
    category: "phone",
    price: 49999,
    originalPrice: 54999,
    rating: 4.5,
    reviewCount: 15600,
    image: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400&h=400&fit=crop",
    features: ["Hasselblad Camera", "100W Charging", "Snapdragon 8 Gen 4", "AMOLED 120Hz"],
    description: "Never Settle. Flagship killer with incredible value."
  },
  {
    id: "p5",
    name: "Redmi Note 15 Pro",
    brand: "Xiaomi",
    category: "phone",
    price: 19999,
    originalPrice: 22999,
    rating: 4.3,
    reviewCount: 42100,
    image: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop",
    features: ["108MP Camera", "5000mAh", "AMOLED Display", "67W Charging"],
    description: "Best mid-range phone with flagship camera capabilities."
  },
  {
    id: "p6",
    name: "MacBook Pro M5 16\"",
    brand: "Apple",
    category: "laptop",
    price: 249900,
    rating: 4.9,
    reviewCount: 9800,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
    features: ["M5 Pro Chip", "36GB RAM", "Liquid Retina XDR", "22hr Battery"],
    description: "The most powerful MacBook Pro ever with the M5 chip."
  },
  {
    id: "p7",
    name: "ASUS ROG Strix G16",
    brand: "ASUS",
    category: "laptop",
    price: 89990,
    originalPrice: 109990,
    rating: 4.5,
    reviewCount: 5600,
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=400&fit=crop",
    features: ["RTX 5070", "Intel Core i9", "16GB DDR5", "240Hz Display"],
    description: "Ultimate gaming laptop with RTX 5070 and blazing fast display."
  },
  {
    id: "p8",
    name: "HP Pavilion 15",
    brand: "HP",
    category: "laptop",
    price: 54990,
    originalPrice: 64990,
    rating: 4.2,
    reviewCount: 18200,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
    features: ["Intel i7 13th Gen", "16GB RAM", "512GB SSD", "FHD IPS"],
    description: "Reliable everyday laptop for work and entertainment."
  },
  {
    id: "p9",
    name: "Sony WH-1000XM6",
    brand: "Sony",
    category: "headphones",
    price: 29990,
    rating: 4.8,
    reviewCount: 32400,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    features: ["Industry-leading ANC", "40hr Battery", "LDAC Hi-Res", "Multipoint"],
    description: "The gold standard in noise-cancelling headphones."
  },
  {
    id: "p10",
    name: "Apple AirPods Pro 3",
    brand: "Apple",
    category: "headphones",
    price: 24900,
    rating: 4.7,
    reviewCount: 45200,
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop",
    features: ["Adaptive ANC", "Spatial Audio", "USB-C", "6hr Battery"],
    description: "Immersive audio with Apple's best noise cancellation."
  },
  {
    id: "p11",
    name: "Samsung Galaxy Watch 7",
    brand: "Samsung",
    category: "smartwatch",
    price: 27999,
    originalPrice: 31999,
    rating: 4.4,
    reviewCount: 7800,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    features: ["BIA Sensor", "Wear OS 5", "Sapphire Crystal", "GPS"],
    description: "Advanced health tracking in a sleek design."
  },
  {
    id: "p12",
    name: "iPad Air M3",
    brand: "Apple",
    category: "tablet",
    price: 69900,
    rating: 4.7,
    reviewCount: 11300,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop",
    features: ["M3 Chip", "Liquid Retina", "Apple Pencil Pro", "10hr Battery"],
    description: "Powerful and portable. The perfect creative companion."
  },
];

export function searchProducts(filters: {
  category?: string;
  maxPrice?: number;
  minPrice?: number;
  brand?: string;
  features?: string[];
  query?: string;
}): Product[] {
  let results = [...products];

  if (filters.category) {
    results = results.filter(p => p.category.toLowerCase() === filters.category!.toLowerCase());
  }
  if (filters.maxPrice) {
    results = results.filter(p => p.price <= filters.maxPrice!);
  }
  if (filters.minPrice) {
    results = results.filter(p => p.price >= filters.minPrice!);
  }
  if (filters.brand) {
    results = results.filter(p => p.brand.toLowerCase() === filters.brand!.toLowerCase());
  }
  if (filters.query) {
    const q = filters.query.toLowerCase();
    results = results.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.features.some(f => f.toLowerCase().includes(q))
    );
  }

  return results.sort((a, b) => b.rating - a.rating);
}
