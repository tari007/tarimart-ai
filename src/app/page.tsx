"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Heart,
  Search,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Truck,
  Headphones,
  X,
  Plus,
  Minus,
  MessageCircle,
} from "lucide-react";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  tag?: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "Wireless Noise Cancelling Headphones",
    category: "Electronics",
    price: 89500,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700",
    tag: "Popular",
  },
  {
    id: 2,
    name: "Premium Smart Watch",
    category: "Electronics",
    price: 67500,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700",
    tag: "Trending",
  },
  {
    id: 3,
    name: "Modern Leather Sneakers",
    category: "Fashion",
    price: 42000,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700",
  },
  {
    id: 4,
    name: "Minimalist Ladies Handbag",
    category: "Fashion",
    price: 38500,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=700",
    tag: "Popular",
  },
  {
    id: 5,
    name: "Professional Digital Camera",
    category: "Electronics",
    price: 285000,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=700",
  },
  {
    id: 6,
    name: "Modern Home Table Lamp",
    category: "Home & Kitchen",
    price: 27500,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=700",
  },
  {
    id: 7,
    name: "Luxury Skincare Collection",
    category: "Beauty",
    price: 32000,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=700",
    tag: "New",
  },
  {
    id: 8,
    name: "Modern Office Chair",
    category: "Office",
    price: 112000,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1505843490701-5be5d1b2d4c4?w=700",
  },
  {
    id: 9,
    name: "Portable Bluetooth Speaker",
    category: "Electronics",
    price: 24500,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=700",
  },
  {
    id: 10,
    name: "Classic Wristwatch",
    category: "Accessories",
    price: 55000,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=700",
  },
  {
    id: 11,
    name: "Comfortable Living Room Sofa",
    category: "Home & Kitchen",
    price: 350000,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700",
  },
  {
    id: 12,
    name: "Modern Running Shoes",
    category: "Sports",
    price: 48000,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700",
  },
];

const categories = [
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

const money = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

export default function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState<number[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [sort, setSort] = useState("featured");
  const [showCart, setShowCart] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [toast, setToast] = useState("");

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  };

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || product.category === category;

      return matchesSearch && matchesCategory;
    });

    if (sort === "low") {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    if (sort === "rating") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [search, category, sort]);

  const cartProducts = cart
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is Product => Boolean(product));

  const wishlistProducts = products.filter((product) =>
    wishlist.includes(product.id)
  );

  const cartTotal = cartProducts.reduce(
    (total, product) => total + product.price,
    0
  );

  const addToCart = (id: number) => {
    setCart((current) => [...current, id]);
    notify("Product added to your cart!");
  };

  const toggleWishlist = (id: number) => {
    const exists = wishlist.includes(id);

    setWishlist((current) =>
      exists
        ? current.filter((item) => item !== id)
        : [...current, id]
    );

    notify(exists ? "Removed from wishlist" : "Added to wishlist!");
  };

  const removeFromCart = (id: number) => {
    setCart((current) => {
      const index = current.indexOf(id);
      if (index === -1) return current;

      return current.filter((_, i) => i !== index);
    });
  };

  return (
<>
      <header className="site-header">
        <div className="header-inner">
          <a href="#" className="brand">
            <span className="brand-mark">T</span>
            Tari<span>Mart</span>
          </a>

          <nav className="nav-links">
            <a href="#">Home</a>
            <a href="#categories">Categories</a>
            <a href="#products">Shop</a>
            <a href="#about">About</a>
          </nav>

          <div className="header-actions">
            <button
              className="icon-button"
              aria-label="Open wishlist"
              onClick={() => setShowWishlist(true)}
            >
              <Heart size={19} />
              {wishlist.length > 0 && (
                <span className="count">{wishlist.length}</span>
              )}
            </button>

            <button
              className="icon-button"
              aria-label="Open shopping cart"
              onClick={() => setShowCart(true)}
            >
              <ShoppingBag size={19} />
              {cart.length > 0 && (
                <span className="count">{cart.length}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-panel">
            <div className="hero-content">
              <span className="eyebrow">
                <Sparkles size={14} />
                THE SMARTER WAY TO SHOP
              </span>

              <h1>
                Shop smarter.
                <br />
                Live <span>better.</span>
              </h1>

              <p>
                Discover amazing products, find what you need and enjoy
                a smarter shopping experience powered by AI.
              </p>

              <a href="#products" className="primary-button">
                Explore products <ArrowRight size={17} />
              </a>
            </div>
          </div>
        </section>

        <section className="section" id="categories">
          <div className="section-heading">
            <div>
              <h2>Explore categories</h2>
              <p>Find everything you need in one place.</p>
            </div>
            <a href="#products" className="text-link">
              Explore all →
            </a>
          </div>

          <div className="category-grid">
            {categories.map((item) => (
              <button
                key={item.name}
                className={`category-card ${
                  category === item.name ? "active" : ""
                }`}
                onClick={() => {
                  setCategory(item.name);
                  document
                    .getElementById("products")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <span className="category-icon">{item.icon}</span>
                {item.name}
              </button>
            ))}
          </div>
        </section>

        <section className="section" id="products">
          <div className="section-heading">
            <div>
              <h2>Discover products</h2>
              <p>Explore products selected for your shopping experience.</p>
            </div>

            <button
              className="text-link"
              onClick={() => {
                setCategory("All");
                setSearch("");
              }}
            >
              View all products →
            </button>
          </div>

          <div className="search-row">
            <div className="search-box">
              <Search size={19} color="#718078" />
              <input
                type="search"
                placeholder="Search products, categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="filter-button"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort products"
            >
              <option value="featured">Featured</option>
              <option value="low">Price: Low to high</option>
              <option value="high">Price: High to low</option>
              <option value="rating">Top rated</option>
            </select>
          </div>

          {category !== "All" && (
            <p style={{ fontSize: 13, color: "#718078", marginBottom: 18 }}>
              Showing: <strong>{category}</strong>{" "}
              <button
                className="text-link"
                onClick={() => setCategory("All")}
              >
                Clear filter
              </button>
            </p>
          )}

          <div className="product-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <article className="product-card" key={product.id}>
                  <div className="product-image">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                    />

                    {product.tag && (
                      <span className="product-tag">{product.tag}</span>
                    )}

                    <button
                      className={`wishlist-button ${
                        wishlist.includes(product.id) ? "selected" : ""
                      }`}
                      aria-label="Toggle wishlist"
                      onClick={() => toggleWishlist(product.id)}
                    >
                      <Heart
                        size={17}
                        fill={
                          wishlist.includes(product.id)
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>
                  </div>

                  <div className="product-info">
                    <span className="product-category">
                      {product.category}
                    </span>

                    <h3>{product.name}</h3>

                    <div className="product-rating">
                      ★★★★★ <span>({product.rating})</span>
                    </div>

                    <div className="product-bottom">
                      <span className="product-price">
                        {money(product.price)}
                      </span>

                      <button
                        className="add-button"
                        aria-label={`Add ${product.name} to cart`}
                        onClick={() => addToCart(product.id)}
                      >
                        <Plus size={19} />
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="empty-state">
                <Search size={30} />
                <h3>No products found</h3>
                <p>Try another search or select a different category.</p>
                <button
                  className="primary-button"
                  onClick={() => {
                    setSearch("");
                    setCategory("All");
                  }}
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </section>
                <section className="section">
          <div className="trust-strip">
            <div className="trust-item">
              <div className="trust-icon">
                <ShieldCheck />
              </div>
              <div>
                <strong>Shop with confidence</strong>
                <span>A better shopping experience.</span>
              </div>
            </div>

            <div className="trust-item">
              <div className="trust-icon">
                <Truck />
              </div>
              <div>
                <strong>Convenient shopping</strong>
                <span>Discover products with ease.</span>
              </div>
            </div>

            <div className="trust-item">
              <div className="trust-icon">
                <Headphones />
              </div>
              <div>
                <strong>Smart assistance</strong>
                <span>Get help finding products.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="about">
          <div className="ai-banner">
            <div>
              <h2>
                Meet your AI shopping assistant <Sparkles size={20} />
              </h2>
              <p>
                Looking for something specific? Our planned AI shopping
                assistant will help you discover products and make
                informed purchasing decisions.
              </p>
            </div>

            <button
              className="primary-button"
              onClick={() => setShowAI(true)}
            >
              <MessageCircle size={17} />
              Ask TariMart AI
            </button>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div>
            <a href="#" className="brand">
              <span className="brand-mark">T</span>
              Tari<span>Mart</span>
            </a>
            <p>
              Discover more. Shop smarter. Experience a new way to
              connect with products and businesses.
            </p>
          </div>

          <div>
            <strong>Explore TariMart</strong>
            <p>Products · Categories · Smart Shopping</p>
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} TariMart AI. All rights reserved.
          <br />
          Demo storefront. Product listings and prices are sample data.
        </div>
      </footer>

      {showCart && (
        <div className="modal-backdrop" onClick={() => setShowCart(false)}>
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-heading">
              <h2>Your shopping cart</h2>
              <button
                className="icon-button"
                onClick={() => setShowCart(false)}
                aria-label="Close cart"
              >
                <X />
              </button>
            </div>

            {cartProducts.length === 0 ? (
              <div className="empty-state">
                <ShoppingBag size={30} />
                <p>Your cart is empty.</p>
              </div>
            ) : (
              <>
                {cartProducts.map((product, index) => (
                  <div className="cart-row" key={`${product.id}-${index}`}>
                    <img src={product.image} alt={product.name} />
                    <div>
                      <strong>{product.name}</strong>
                      <p>{money(product.price)}</p>
                    </div>
                    <button
                      className="icon-button"
                      onClick={() => removeFromCart(product.id)}
                      aria-label="Remove one item"
                    >
                      <Minus size={16} />
                    </button>
                  </div>
                ))}

                <div className="cart-total">
                  <strong>Subtotal</strong>
                  <strong>{money(cartTotal)}</strong>
                </div>

                <p className="modal-note">
                  Checkout will be added in a later development phase.
                </p>
              </>
            )}
          </div>
        </div>
      )}
            {showWishlist && (
        <div
          className="modal-backdrop"
          onClick={() => setShowWishlist(false)}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-heading">
              <h2>Your wishlist</h2>
              <button
                className="icon-button"
                onClick={() => setShowWishlist(false)}
                aria-label="Close wishlist"
              >
                <X />
</button>
            </div>

            {wishlistProducts.length === 0 ? (
              <div className="empty-state">
                <Heart size={30} />
                <p>You haven&apos;t saved any products yet.</p>
              </div>
            ) : (
              wishlistProducts.map((product) => (
                <div className="cart-row" key={product.id}>
                  <img src={product.image} alt={product.name} />
                  <div>
                    <strong>{product.name}</strong>
                    <p>{money(product.price)}</p>
                  </div>
                  <button
                    className="add-button"
                    onClick={() => addToCart(product.id)}
                    aria-label="Add to cart"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {showAI && (
        <div className="modal-backdrop" onClick={() => setShowAI(false)}>
          <div
            className="modal ai-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-heading">
              <div>
                <h2>
                  <Sparkles size={20} /> TariMart AI
                </h2>
                <p>Your smart shopping companion.</p>
              </div>

              <button
                className="icon-button"
                onClick={() => setShowAI(false)}
                aria-label="Close AI assistant"
              >
                <X />
              </button>
            </div>

            <div className="ai-message">
              <strong>Hello! 👋</strong>
              <p>
                I&apos;m TariMart AI. In a future phase, I&apos;ll help you
                compare products, discover recommendations and make
                smarter shopping decisions.
              </p>
              <span>AI assistant interface preview</span>
            </div>

            <form
              className="ai-input"
              onSubmit={(e) => {
                e.preventDefault();
                if (aiMessage.trim()) {
                  notify("AI integration is coming in a later phase.");
                  setAiMessage("");
                }
              }}
            >
              <input
                placeholder="Ask about a product..."
                value={aiMessage}
                onChange={(e) => setAiMessage(e.target.value)}
              />
              <button
                className="primary-button"
                type="submit"
                aria-label="Send message"
              >
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
