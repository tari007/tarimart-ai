"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Package,
  ShoppingBag,
  Loader2,
  CalendarDays,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { money } from "@/data/products";

type Order = {
  id: string;
  order_number: string;
  total: number;
  payment_status: string;
  order_status: string;
  created_at: string;
};

export default function OrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadOrders() {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          router.replace("/login");
          return;
        }

        const { data, error: ordersError } = await supabase
          .from("orders")
          .select(
            "id, order_number, total, payment_status, order_status, created_at"
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (ordersError) {
          throw ordersError;
        }

        if (!cancelled) {
          setOrders((data ?? []) as Order[]);
        }
      } catch (err) {
        console.error("Order history error:", err);

        if (!cancelled) {
          setError(
            "We could not load your orders. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadOrders();

    return () => {
      cancelled = true;
    };
  }, [router]);
    function statusStyle(status: string) {
    switch (status.toLowerCase()) {
      case "delivered":
      case "demo_paid":
      case "paid":
        return "bg-green-100 text-green-800";

      case "cancelled":
      case "failed":
        return "bg-red-100 text-red-800";

      case "shipped":
      case "processing":
        return "bg-blue-100 text-blue-800";

      case "refunded":
        return "bg-purple-100 text-purple-800";

      default:
        return "bg-amber-100 text-amber-800";
    }
  }

  function formatStatus(status: string) {
    return status.replace(/_/g, " ");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2
            size={34}
            className="mx-auto mb-3 animate-spin text-green-700"
          />

          <p className="text-sm text-gray-600">
            Loading your orders...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/account"
          className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-green-700"
        >
          <ArrowLeft size={17} />
          Back to account
        </Link>

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
            Customer account
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            My orders
          </h1>

          <p className="mt-2 text-gray-600">
            View and track your TariMart orders.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
                {orders.length === 0 && !error ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <ShoppingBag
              size={44}
              className="mx-auto mb-4 text-gray-400"
            />

            <h2 className="text-xl font-bold text-gray-900">
              No orders yet
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Your orders will appear here after checkout.
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-green-700 px-6 py-3 font-semibold text-white hover:bg-green-800"
            >
              Start shopping
              <ArrowRight size={17} />
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                      Order number
                    </p>

                    <h2 className="mt-1 text-lg font-bold text-gray-900">
                      {order.order_number}
                    </h2>

                    <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                      <CalendarDays size={15} />
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(
                        order.order_status
                      )}`}
                    >
                      {formatStatus(order.order_status)}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(
                        order.payment_status
                      )}`}
                    >
                      {order.payment_status === "demo_paid"
                        ? "Demo payment"
                        : formatStatus(order.payment_status)}
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex flex-col justify-between gap-4 border-t border-gray-100 pt-5 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-sm text-gray-500">
                      Order total
                    </p>

                    <p className="mt-1 text-xl font-bold text-green-700">
                      {money(Number(order.total))}
                    </p>
                  </div>

                  <Link
                    href={`/order-confirmation/${order.id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-green-700 px-5 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-50"
                  >
                    <Package size={17} />
                    View order
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
        
  
