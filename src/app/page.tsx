"use client";

import Image from "next/image";
import Link from "next/link";
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

import {
  products,
  categories,
  money,
} from "../data/products";

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
    .filter((product) => product !== undefined);

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

      if (index === -1) {
        return current;
      }

      return current.filter((_, i) => i !== index);
    });
  };

  return (
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
              <p>
                Explore products selected for your shopping experience.
              </p>
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
            <p
              style={{
                fontSize: 13,
                color: "#718078",
                marginBottom: 18,
              }}
            >
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
        <Link
          href={`/products/${product.id}`}
          className="block"
          aria-label={`View ${product.name}`}
        >
          <div className="product-image">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 600px) 50vw, (max-width: 900px) 50vw, 25vw"
            />

            {product.tag && (
              <span className="product-tag">
                {product.tag}
              </span>
            )}
          </div>
        </Link>

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

        <div className="product-info">
          <Link
            href={`/products/${product.id}`}
            className="block"
          >
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
            </div>
          </Link>

          <button
            className="add-button"
            aria-label={`Add ${product.name} to cart`}
            onClick={() => addToCart(product.id)}
          >
            <Plus size={19} />
          </button>
        </div>
      </article>
    ))
  ) : (
    <div className="empty-state">
      <Search size={30} />

      <h3>No products found</h3>

      <p>
        Try another search or select a different category.
      </p>

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
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={58}
                    height={58}
                  />

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
        <div
          className="modal-backdrop"
          onClick={() => setShowAI(false)}
        >
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
                I&apos;m TariMart AI. In a future phase, I&apos;ll help
                you compare products, discover recommendations and make
                smarter shopping decisions.
              </p>

              <span>AI assistant interface preview</span>
            </div>

            <form
              className="ai-input"
              onSubmit={(e) => {
                e.preventDefault();

                if (aiMessage.trim()) {
                  notify(
                    "AI integration is coming in a later phase."
                  );
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

    
