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
              <h2>Discover our products</h2>
              <p>Quality products selected for your everyday needs.</p>
            </div>

            <span className="product-count">
              {filteredProducts.length} products
            </span>
          </div>

          <div className="shop-toolbar">
            <div className="search-box">
              <Search size={18} />
              <input
                type="search"
                placeholder="Search products..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <select
              className="sort-select"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              aria-label="Sort products"
            >
              <option value="featured">Featured</option>
              <option value="low">Price: Low to high</option>
              <option value="high">Price: High to low</option>
              <option value="rating">Top rated</option>
            </select>
          </div>

          <div className="active-filter">
            <span>
              Showing: <strong>{category}</strong>
            </span>

            {(category !== "All" || search !== "") && (
              <button
                className="clear-filter"
                onClick={() => {
                  setCategory("All");
                  setSearch("");
                }}
              >
                Clear filters
              </button>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <Search size={32} />
              <h3>No products found</h3>
              <p>Try another search term or category.</p>
              <button
                className="primary-button"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
              >
                View all products
              </button>
            </div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <article className="product-card" key={product.id}>
                  <div className="product-image">
                    <Link href={`/products/${product.id}`}>
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={500}
                        height={500}
                      />
                    </Link>

                    {product.tag && (
                      <span className="product-tag">{product.tag}</span>
                    )}

                    <button
                      className={`wishlist-button ${
                        wishlist.includes(product.id) ? "selected" : ""
                      }`}
                      aria-label="Add to wishlist"
                      onClick={() => toggleWishlist(product.id)}
                    >
                      <Heart
                        size={18}
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

                    <Link
                      href={`/products/${product.id}`}
                      className="product-name"
                    >
                      {product.name}
                    </Link>

                    <div className="product-rating">
                      <span>★</span>
                      {product.rating}
                    </div>

                    <div className="product-card-bottom">
                      <strong className="product-price">
                        {money(product.price)}
                      </strong>

                      <button
                        className="add-button"
                        onClick={() => addToCart(product.id)}
                        aria-label={`Add ${product.name} to cart`}
                      >
                        <ShoppingBag size={17} />
                        Add
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="trust-strip">
          <div className="trust-item">
            <Truck size={25} />
            <div>
              <strong>Reliable delivery</strong>
              <p>Convenient delivery to your doorstep.</p>
            </div>
          </div>

          <div className="trust-item">
            <ShieldCheck size={25} />
            <div>
              <strong>Secure shopping</strong>
              <p>Your shopping experience matters to us.</p>
            </div>
          </div>

          <div className="trust-item">
            <Headphones size={25} />
            <div>
              <strong>Customer support</strong>
              <p>We are here to help when you need us.</p>
            </div>
          </div>
        </section>

        <section className="ai-banner" id="about">
          <div className="ai-banner-content">
            <span className="eyebrow">
              <Sparkles size={15} />
              SHOPPING POWERED BY AI
            </span>

            <h2>Not sure what you need?</h2>

            <p>
              Tell our AI shopping assistant what you are looking for.
              It can help you explore products and make smarter choices.
            </p>

            <button
              className="primary-button"
              onClick={() => setShowAI(true)}
            >
              Meet your AI assistant
              <ArrowRight size={17} />
            </button>
          </div>

          <div className="ai-banner-icon">
            <Sparkles size={72} />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <a href="#" className="brand">
              <span className="brand-mark">T</span>
              Tari<span>Mart</span>
            </a>

            <p>
              A smarter way to discover and shop for everyday products.
            </p>
          </div>

          <div className="footer-links">
            <a href="#categories">Categories</a>
            <a href="#products">Shop</a>
            <a href="#about">About us</a>
          </div>

          <p className="footer-copy">
            © {new Date().getFullYear()} TariMart AI. All rights reserved.
          </p>
        </div>
      </footer>

      {showCart && (
        <div
          className="modal-backdrop"
          onClick={() => setShowCart(false)}
        >
          <div
            className="side-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-heading">
              <div>
                <h2>Your shopping cart</h2>
                <p>{cart.length} item(s) in your cart</p>
              </div>

              <button
                className="icon-button"
                onClick={() => setShowCart(false)}
                aria-label="Close cart"
              >
                <X size={21} />
              </button>
            </div>

            {cartProducts.length === 0 ? (
              <div className="empty-state">
                <ShoppingBag size={36} />
                <h3>Your cart is empty</h3>
                <p>Explore our products and add something you love.</p>
                <button
                  className="primary-button"
                  onClick={() => setShowCart(false)}
                >
                  Continue shopping
                </button>
              </div>
            ) : (
              <>
                <div className="modal-items">
                  {cartProducts.map((product, index) => (
                    <div
                      className="cart-item"
                      key={`${product.id}-${index}`}
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={80}
                        height={80}
                      />

                      <div className="cart-item-info">
                        <strong>{product.name}</strong>
                        <span>{money(product.price)}</span>

                        <button
                          className="remove-button"
                          onClick={() => removeFromCart(product.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-total">
                  <strong>Subtotal</strong>
                  <strong>{money(cartTotal)}</strong>
                </div>

                <p className="cart-note">
                  Delivery charges and payment will be calculated at checkout.
                </p>

                <button
                  className="primary-button checkout-button"
                  onClick={() =>
                    notify("Checkout will be available in a future update.")
                  }
                >
                  Continue to checkout
                  <ArrowRight size={17} />
                </button>
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
            className="side-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-heading">
              <div>
                <h2>Your wishlist</h2>
                <p>{wishlist.length} saved product(s)</p>
              </div>

              <button
                className="icon-button"
                onClick={() => setShowWishlist(false)}
                aria-label="Close wishlist"
              >
                <X size={21} />
              </button>
            </div>

            {wishlistProducts.length === 0 ? (
              <div className="empty-state">
                <Heart size={36} />
                <h3>Your wishlist is empty</h3>
                <p>Save products you like to find them easily later.</p>
                <button
                  className="primary-button"
                  onClick={() => setShowWishlist(false)}
                >
                  Explore products
                </button>
              </div>
            ) : (
              <div className="modal-items">
                {wishlistProducts.map((product) => (
                  <div className="cart-item" key={product.id}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={80}
                      height={80}
                    />

                    <div className="cart-item-info">
                      <strong>{product.name}</strong>
                      <span>{money(product.price)}</span>

                      <div className="wishlist-item-actions">
                        <button
                          className="remove-button"
                          onClick={() => toggleWishlist(product.id)}
                        >
                          Remove
                        </button>

                        <button
                          className="remove-button"
                          onClick={() => {
                            addToCart(product.id);
                            setShowWishlist(false);
                          }}
                        >
                          Add to cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
            className="ai-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-heading">
              <div className="ai-modal-title">
                <span className="ai-avatar">
                  <Sparkles size={20} />
                </span>

                <div>
                  <h2>TariMart AI Assistant</h2>
                  <p>Your shopping companion</p>
                </div>
              </div>

              <button
                className="icon-button"
                onClick={() => setShowAI(false)}
                aria-label="Close AI assistant"
              >
                <X size={21} />
              </button>
            </div>

            <div className="ai-chat-content">
              <div className="ai-message">
                Hello! 👋 I am your TariMart shopping assistant.
                Tell me what you need, and I will help you explore
                available products.
              </div>

              {aiMessage && (
                <div className="user-message">
                  {aiMessage}
                </div>
              )}

              {aiMessage && (
                <div className="ai-message">
                  Thanks for sharing that! Our AI shopping
                  recommendations are being developed. For now,
                  you can use the product search and categories
                  to find matching items.
                </div>
              )}
            </div>

            <form
              className="ai-input"
              onSubmit={(event) => {
                event.preventDefault();

                const form = event.currentTarget;
                const input = form.elements.namedItem(
                  "ai-question"
                ) as HTMLInputElement;

                if (input.value.trim()) {
                  setAiMessage(input.value.trim());
                  input.value = "";
                }
              }}
            >
              <input
                type="text"
                name="ai-question"
                placeholder="What are you looking for?"
                aria-label="Ask the AI shopping assistant"
              />

              <button
                type="submit"
                className="primary-button"
                aria-label="Send message"
              >
                <MessageCircle size={18} />
              </button>
            </form>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}


        
