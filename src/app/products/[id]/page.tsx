"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import { useParams } from "next/navigation";
import { products, money } from "../../../data/products";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = Number(params.id);

  const product = useMemo(
    () => products.find((item) => item.id === productId),
    [productId]
  );

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  if (!product) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Product not found
        </h1>
        <p className="mt-3 text-gray-600">
          This product may have been removed or is unavailable.
        </p>
        <Link
          href="/#products"
          className="mt-6 inline-flex rounded-xl bg-gray-900 px-6 py-3 font-semibold text-white"
        >
          Return to Shop
        </Link>
      </main>
    );
  }

  const relatedProducts = products
    .filter(
      (item) =>
        item.category === product.category && item.id !== product.id
    )
    .slice(0, 4);

  const increaseQuantity = () => {
    setQuantity((current) =>
      Math.min(current + 1, product.stock)
    );
  };

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const handleAddToCart = () => {
    const existingCart = JSON.parse(
      localStorage.getItem("tarimart-cart") || "[]"
    );

    const updatedCart = [...existingCart];

    for (let index = 0; index < quantity; index++) {
      updatedCart.push(product.id);
    }

    localStorage.setItem(
      "tarimart-cart",
      JSON.stringify(updatedCart)
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };
    return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/#products"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-gray-900"
        >
          <ArrowLeft size={18} />
          Back to Shop
        </Link>

        <div className="grid gap-10 rounded-3xl bg-white p-5 shadow-sm md:grid-cols-2 md:p-8">
          <div className="relative min-h-[320px] overflow-hidden rounded-2xl bg-gray-100 sm:min-h-[480px]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />

            {product.tag && (
              <span className="absolute left-4 top-4 rounded-full bg-gray-900 px-4 py-2 text-xs font-bold text-white">
                {product.tag}
              </span>
            )}
          </div>

          <div className="flex flex-col justify-center py-3">
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
              {product.category}
            </p>

            <h1 className="mt-3 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-4 flex items-center gap-2">
              <div className="flex items-center gap-1 text-amber-500">
                <Star size={18} fill="currentColor" />
                <span className="font-bold text-gray-900">
                  {product.rating}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                Customer rating
              </span>
            </div>

            <p className="mt-6 text-3xl font-extrabold text-gray-900">
              {money(product.price)}
            </p>

            <p className="mt-5 leading-7 text-gray-600">
              {product.description}
            </p>

            <div className="mt-6 flex items-center gap-2 text-sm">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  product.stock > 0 ? "bg-emerald-500" : "bg-red-500"
                }`}
              />
              <span className="font-medium text-gray-700">
                {product.stock > 0
                  ? `${product.stock} units available`
                  : "Currently out of stock"}
              </span>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="flex items-center rounded-xl border border-gray-200">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className="p-3 text-gray-700 disabled:opacity-40"
                >
                  <Minus size={17} />
                </button>

                <span className="min-w-10 text-center font-bold text-gray-900">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock}
                  aria-label="Increase quantity"
                  className="p-3 text-gray-700 disabled:opacity-40"
                >
                  <Plus size={17} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock < 1}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3.5 font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingBag size={19} />
                Add to Cart
              </button>

              <button
                type="button"
                onClick={() => setWishlisted(!wishlisted)}
                aria-label="Toggle wishlist"
                className={`rounded-xl border p-3.5 transition ${
                  wishlisted
                    ? "border-red-200 bg-red-50 text-red-600"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Heart
                  size={20}
                  fill={wishlisted ? "currentColor" : "none"}
                />
              </button>
            </div>

            {added && (
              <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">
                Added {quantity} item(s) to your cart.
              </p>
            )}

            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
              <div className="flex items-center gap-3">
                <Truck className="shrink-0 text-emerald-700" size={22} />
                <span className="text-xs font-medium text-gray-600">
                  Convenient delivery
                </span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck
                  className="shrink-0 text-emerald-700"
                  size={22}
                />
                <span className="text-xs font-medium text-gray-600">
                  Secure shopping
                </span>
              </div>
            </div>
          </div>
        </div>
                {relatedProducts.length > 0 && (
          <section className="mt-16">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
                  You may also like
                </p>
                <h2 className="mt-2 text-2xl font-extrabold text-gray-900">
                  Related Products
                </h2>
              </div>

              <Link
                href="/#products"
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900"
              >
                View all
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {relatedProducts.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.id}`}
                  className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="relative aspect-square bg-gray-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-4">
                    <p className="text-xs text-gray-500">
                      {item.category}
                    </p>
                    <h3 className="mt-2 line-clamp-2 text-sm font-bold text-gray-900">
                      {item.name}
                    </h3>
                    <p className="mt-3 font-extrabold text-emerald-700">
                      {money(item.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
      
