"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  Package,
  X,
  RefreshCw,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  featured: boolean;
  active: boolean;
};

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  image: "",
  stock: "0",
  featured: false,
  active: true,
};

export default function SellerProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function loadProducts() {
    setLoading(true);
    setMessage("");

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setAuthorized(false);
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!["seller", "admin"].includes(profile?.role)) {
      setAuthorized(false);
      setLoading(false);
      return;
    }

    setAuthorized(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
    } else {
      setProducts((data || []) as Product[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function startAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
    setShowForm(true);
  }

  function startEdit(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description || "",
      price: String(product.price),
      category: product.category,
      image: product.image || "",
      stock: String(product.stock),
      featured: product.featured,
      active: product.active,
    });
    setMessage("");
    setShowForm(true);
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const price = Number(form.price);
    const stock = Number(form.stock);

    if (
      !form.name.trim() ||
      !form.category.trim() ||
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      setMessage("Enter a valid product name, category, price and stock.");
      setSaving(false);
      return;
    }

    const productData = {
      name: form.name.trim(),
      description: form.description.trim(),
      price,
      category: form.category.trim(),
      image: form.image.trim(),
      stock,
      featured: form.featured,
      active: form.active,
    };

    const result = editingId
      ? await supabase
          .from("products")
          .update(productData)
          .eq("id", editingId)
      : await supabase
          .from("products")
          .insert(productData);

    if (result.error) {
      setMessage(result.error.message);
      setSaving(false);
      return;
    }

    setShowForm(false);
    setForm(emptyForm);
    setEditingId(null);
    setSaving(false);
    await loadProducts();
    setMessage("Product saved successfully.");
  }

  async function deleteProduct(product: Product) {
    const confirmed = window.confirm(
      `Delete "${product.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setProducts((current) =>
      current.filter((item) => item.id !== product.id)
    );
    setMessage("Product deleted successfully.");
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Loading products...
      </main>
    );
  }

  if (!authorized) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <Package size={42} className="mb-4 text-red-500" />
        <h1 className="text-2xl font-bold">Seller Access Required</h1>
        <p className="mt-2 text-gray-500">
          Sign in with an authorised seller account.
        </p>
        <Link
          href="/login"
          className="mt-5 rounded-xl bg-black px-6 py-3 text-white"
        >
          Sign In
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <div>
            <Link
              href="/seller"
              className="mb-2 flex items-center gap-2 text-sm text-gray-500"
            >
              <ArrowLeft size={16} />
              Seller Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              Product Management
            </h1>
          </div>

          <button
            onClick={loadProducts}
            className="rounded-xl border bg-white p-3"
            aria-label="Refresh products"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Your Products ({products.length})
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Add, edit and manage your product catalogue.
            </p>
          </div>

          <button
            onClick={startAdd}
            className="flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>

        {message && (
          <div className="mb-5 rounded-xl border bg-white p-4 text-sm text-gray-700">
            {message}
          </div>
        )}

        {products.length === 0 ? (
          <div className="rounded-2xl border bg-white p-12 text-center">
            <Package size={42} className="mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-bold">No products yet</h3>
            <p className="mt-2 text-sm text-gray-500">
              Add your first product to begin building your catalogue.
            </p>
            <button
              onClick={startAdd}
              className="mt-5 rounded-xl bg-black px-6 py-3 text-white"
            >
              Add Your First Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="overflow-hidden rounded-2xl border bg-white"
              >
                {product.image ? (
                  <div className="relative h-48 bg-gray-100">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-48 items-center justify-center bg-gray-100">
                    <Package size={42} className="text-gray-400" />
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500">
                        {product.category}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        product.active
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {product.active ? "Active" : "Hidden"}
                    </span>
                  </div>

                  <p className="mt-3 text-lg font-bold">
                    ₦{Number(product.price).toLocaleString("en-NG")}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Stock: {product.stock}
                  </p>

                  <div className="mt-5 flex gap-2">
                    <button
                      onClick={() => startEdit(product)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium"
                    >
                      <Pencil size={15} />
                      Edit
                    </button>

                    <button
                      onClick={() => deleteProduct(product)}
                      className="flex items-center justify-center rounded-xl border border-red-200 px-4 py-2.5 text-red-600"
                      aria-label={`Delete ${product.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-6 w-full max-w-xl rounded-2xl bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingId ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg p-2 hover:bg-gray-100"
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Product Name
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="w-full rounded-xl border px-4 py-3"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full rounded-xl border px-4 py-3"
                  placeholder="Describe your product"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Price (₦)
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    className="w-full rounded-xl border px-4 py-3"
                    placeholder="25000"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Stock Quantity
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    step="1"
                    value={form.stock}
                    onChange={(e) =>
                      setForm({ ...form, stock: e.target.value })
                    }
                    className="w-full rounded-xl border px-4 py-3"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Category
                </label>
                <input
                  required
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full rounded-xl border px-4 py-3"
                  placeholder="Electronics, Fashion, Home..."
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Product Image URL
                </label>
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) =>
                    setForm({ ...form, image: e.target.value })
                  }
                  className="w-full rounded-xl border px-4 py-3"
                  placeholder="https://example.com/product-image.jpg"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Use a publicly accessible image URL for now.
                </p>
              </div>

              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) =>
                    setForm({ ...form, featured: e.target.checked })
                  }
                />
                Feature this product
              </label>

              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) =>
                    setForm({ ...form, active: e.target.checked })
                  }
                />
                Make product visible
              </label>

              {message && (
                <p className="text-sm text-red-600">{message}</p>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-black py-3.5 font-semibold text-white disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Save Changes"
                    : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
