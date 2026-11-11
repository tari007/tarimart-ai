export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  rating: number;
  featured: boolean;
  active: boolean;
  tag?: string;
};

export const products: Product[] = [];

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
