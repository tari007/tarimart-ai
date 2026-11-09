"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  TrendingUp,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { money } from "@/data/products";

type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  total: number;
  order_status: string;
  payment_status: string;
  created_at: string;
};

export default function SellerDashboard() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [message, setMessage] = useState("");

  async function loadDashboard() {
    setLoading(true);
    setMessage("");

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setAuthorized(false);
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !["seller", "admin"].includes(profile?.role)) {
      setAuthorized(false);
      setLoading(false);
      return;
    }

    setAuthorized(true);

    const { data, error } = await supabase
      .from("orders")
      .select(
        "id, order_number, customer_name, customer_email, total, order_status, payment_status, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("Unable to load orders. Please refresh.");
    } else {
      setOrders((data || []) as Order[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const totalSales = orders
    .filter((order) => order.payment_status === "demo_paid" || order.payment_status === "paid")
    .reduce((sum, order) => sum + Number(order.total), 0);

  const pendingOrders = orders.filter(
    (order) => order.order_status === "pending"
  ).length;

  const completedOrders = orders.filter(
    (order) => order.order_status === "delivered"
  ).length;

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading seller dashboard...</p>
      </main>
    );
  }

  if (!authorized) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 text-center">
        <ShieldAlert size={48} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900">
          Seller Access Required
        </h1>
        <p className="text-gray-600 mt-2">
          Please sign in with an authorised seller account.
        </p>
        <Link
          href="/login"
          className="mt-6 rounded-xl bg-black px-6 py-3 text-white"
        >
          Sign In
        </Link>
        <Link href="/" className="mt-4 text-sm text-gray-600">
          Return to Store
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-5 py-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">TariMart AI</p>
            <h1 className="text-2xl font-bold text-gray-900">
              Seller Dashboard
            </h1>
          </div>

          <button
            onClick={loadDashboard}
            className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-5 py-8">
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-900">
            DEMO MODE
          </p>
          <p className="text-sm text-amber-800 mt-1">
            TariMart is currently a demonstration platform. Order totals are
            demo records, not verified real payments or revenue.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Orders"
            value={orders.length.toString()}
            icon={<ShoppingBag size={22} />}
          />
          <StatCard
            title="Demo Sales"
            value={money(totalSales)}
            icon={<TrendingUp size={22} />}
          />
          <StatCard
            title="Pending Orders"
            value={pendingOrders.toString()}
            icon={<Package size={22} />}
          />
          <StatCard
            title="Delivered Orders"
            value={completedOrders.toString()}
            icon={<Users size={22} />}
          />
        </div>

        <section className="mt-8 rounded-2xl border bg-white overflow-hidden">
          <div className="flex items-center justify-between border-b px-5 py-5">
            <div>
              <h2 className="font-bold text-lg text-gray-900">
                Recent Orders
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Customer orders placed through TariMart.
              </p>
            </div>
            <LayoutDashboard className="text-gray-400" size={22} />
          </div>

          {message && (
            <p className="p-5 text-sm text-red-600">{message}</p>
          )}

          {orders.length === 0 ? (
            <p className="p-8 text-center text-gray-500">
              No orders have been placed yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="px-5 py-4">Order</th>
                    <th className="px-5 py-4">Customer</th>
                    <th className="px-5 py-4">Total</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Payment</th>
                    <th className="px-5 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-5 py-4 font-semibold text-gray-900">
                        {order.order_number}
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-800">
                          {order.customer_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.customer_email}
                        </p>
                      </td>
                      <td className="px-5 py-4 font-medium">
                        {money(Number(order.total))}
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700">
                          {order.order_status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {order.payment_status}
                      </td>
                      <td className="px-5 py-4 text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="mt-6">
          <Link href="/" className="text-sm font-medium text-gray-600 hover:text-black">
            ← Return to Store
          </Link>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5">
      <div className="flex items-center justify-between text-gray-500">
        <p className="text-sm">{title}</p>
        {icon}
      </div>
      <p className="mt-4 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
