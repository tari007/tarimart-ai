export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  tag?: string;
  description: string;
  stock: number;
};

export const products: Product[] = [
  {
    id: 1,
    name: "Wireless Noise Cancelling Headphones",
    category: "Electronics",
    price: 89500,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700",
    tag: "Popular",
    description:
      "Enjoy immersive sound with wireless noise cancelling headphones designed for music, calls and everyday entertainment.",
    stock: 24,
  },
  {
    id: 2,
    name: "Premium Smart Watch",
    category: "Electronics",
    price: 67500,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700",
    tag: "Trending",
    description:
      "A modern smart watch for everyday activity tracking, notifications and staying connected throughout your day.",
    stock: 18,
  },
  {
    id: 3,
    name: "Modern Leather Sneakers",
    category: "Fashion",
    price: 42000,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700",
    description:
      "Stylish and comfortable leather sneakers designed for everyday movement and casual outfits.",
    stock: 31,
  },
  {
    id: 4,
    name: "Minimalist Ladies Handbag",
    category: "Fashion",
    price: 38500,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=700",
    tag: "Popular",
    description:
      "A stylish minimalist handbag with a practical design for everyday use, work and special occasions.",
    stock: 16,
  },
  {
    id: 5,
    name: "Professional Digital Camera",
    category: "Electronics",
    price: 285000,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=700",
    description:
      "A professional digital camera designed for photography enthusiasts and content creators.",
    stock: 8,
  },
  {
    id: 6,
    name: "Modern Home Table Lamp",
    category: "Home & Kitchen",
    price: 27500,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=700",
    description:
      "A modern table lamp that adds practical lighting and a clean contemporary touch to your space.",
    stock: 27,
  },
  {
    id: 7,
    name: "Luxury Skincare Collection",
    category: "Beauty",
    price: 32000,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=700",
    tag: "New",
    description:
      "A premium skincare collection designed for a simple and refreshing everyday skincare routine.",
    stock: 20,
  },
  {
    id: 8,
    name: "Modern Office Chair",
    category: "Office",
    price: 112000,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1505843490701-5be5d1b2d4c4?w=700",
    description:
      "A comfortable modern office chair designed for productive work sessions and everyday use.",
    stock: 12,
  },
  {
    id: 9,
    name: "Portable Bluetooth Speaker",
    category: "Electronics",
    price: 24500,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=700",
    description:
      "A compact Bluetooth speaker designed for portable music playback at home, outdoors or on the go.",
    stock: 35,
  },
  {
    id: 10,
    name: "Classic Wristwatch",
    category: "Accessories",
    price: 55000,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=700",
    description:
      "A classic wristwatch with a timeless design suitable for everyday wear and special occasions.",
    stock: 14,
  },
  {
    id: 11,
    name: "Comfortable Living Room Sofa",
    category: "Home & Kitchen",
    price: 350000,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700",
    description:
      "A comfortable modern sofa designed to bring style and relaxation to your living room.",
    stock: 6,
  },
  {
    id: 12,
    name: "Modern Running Shoes",
    category: "Sports",
    price: 48000,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700",
    description:
      "Lightweight running shoes designed for training, exercise and comfortable everyday movement.",
    stock: 22,
  },
];

export const categories = [
  { name: "Electronics", icon: "🎧" },
  { name: "Phones & Tablets", icon: "📱" },
  { name: "Fashion", icon: "👕" },
  { name: "Beauty", icon: "✨" },
  { name: "Home & Kitchen", icon: "🏠" },
  { name: "Computers", icon: "💻" },
  { name: "Automotive", icon: "🚗" },
  { name: "Agriculture", icon: "🌱" },
  { name: "Sports", icon: "⚽" },
  { name: "Books", icon: "📚" },
  { name: "Office", icon: "🪑" },
  { name: "Accessories", icon: "⌚" },
];

export const money = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
