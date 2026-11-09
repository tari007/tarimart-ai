"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  CheckCircle2,
  Package,
  ShoppingBag,
  ArrowRight,
  Loader2,
  MapPin,
  CreditCard,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { money } from "@/data/products";

type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  phone: string;
  delivery_address: string;
  city: string;
  state: string;
  subtotal: number;
  shipping_fee: number;
  total: number;
  payment_provider: string;
  payment_method: string;
  payment_status: string;
  order_status: string;
  created_at: string;
};

type OrderItem = {
  id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  line_total: number;
};

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrder() {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          router.replace("/login");
          return;
        }

        const { data: orderData, error: orderError } =
          await supabase
            .from("orders")
            .select("*")
            .eq("id", orderId)
            .eq("user_id", user.id)
            .single();

        if (orderError) throw orderError;

        const { data: itemData, error: itemError } =
          await supabase
            .from("order_items")
            .select("*")
            .eq("order_id", orderId);

        if (itemError) throw itemError;

        setOrder(orderData);
        setItems(itemData ?? []);
      } catch (err) {
        console.error("Order confirmation error:", err);
        setError(
          "We could not find this order. Please check your order history."
        );
      } finally {
        setLoading(false);
      }
    }

    if (orderId) {
      loadOrder();
    }
  }, [orderId, router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2
            size={34}
            className="mx-auto mb-3 animate-spin text-green-700"
          />
          <p className="text-sm text-gray-600">
            Loading your order...
          </p>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <Package
            size={42}
            className="mx-auto mb-4 text-gray-400"
          />
          <h1 className="text-xl font-bold text-gray-900">
            Order not found
          </h1>
          <p className="mt-3 text-sm text-gray-600">
            {error}
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-green-700 px-5 py-3 font-semibold text-white"
          >
            Return to store
            <ArrowRight size={17} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-10">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2
              size={44}
              className="text-green-700"
            />
          </div>

          <p className="text-sm font-bold uppercase tracking-wider text-green-700">
            TariMart order confirmation
          </p>

          <h1 className="mt-3 text-3xl font-bold text-gray-900">
            Order placed successfully!
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-gray-600">
            Thank you, {order.customer_name}. Your demo order
            has been recorded successfully.
          </p>

          <div className="mt-7 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <strong>DEMO PAYMENT:</strong> This transaction
            was simulated for demonstration purposes.
            No real payment was processed or collected.
          </div>

          <div className="mt-7 rounded-xl bg-gray-50 p-5">
            <p className="text-sm text-gray-500">
              Order number
            </p>
            <p className="mt-1 text-xl font-bold text-gray-900">
              {order.order_number}
            </p>
            <p className="mt-2 text-xs text-gray-500">
              {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <MapPin className="text-green-700" size={22} />
              <h2 className="font-bold text-gray-900">
                Delivery details
              </h2>
            </div>

            <p className="font-semibold text-gray-900">
              {order.customer_name}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              {order.phone}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              {order.customer_email}
            </p>
            <p className="mt-3 text-sm text-gray-600">
              {order.delivery_address}
              <br />
              {order.city}, {order.state}
            </p>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <CreditCard className="text-green-700" size={22} />
              <h2 className="font-bold text-gray-900">
                Payment summary
              </h2>
            </div>

            <p className="text-sm text-gray-500">
              Provider
            </p>
            <p className="font-semibold capitalize text-gray-900">
              {order.payment_provider}
            </p>

            <p className="mt-3 text-sm text-gray-500">
              Method
            </p>
            <p className="font-semibold capitalize text-gray-900">
              {order.payment_method.replace("_", " ")}
            </p>

            <p className="mt-3 text-sm text-gray-500">
              Payment status
            </p>
            <p className="font-semibold text-green-700">
              Demo payment successful
            </p>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-bold text-gray-900">
            Items ordered
          </h2>

          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-semibold text-gray-900">
                    {item.product_name}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {money(item.unit_price)} × {item.quantity}
                  </p>
                </div>

                <p className="font-semibold text-gray-900">
                  {money(item.line_total)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 border-t border-gray-200 pt-5">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>{money(Number(order.subtotal))}</span>
            </div>

            <div className="mt-3 flex justify-between text-sm text-gray-600">
              <span>Delivery fee</span>
              <span>{money(Number(order.shipping_fee))}</span>
            </div>

            <div className="mt-5 flex justify-between border-t border-gray-200 pt-5">
              <span className="font-bold text-gray-900">
                Total
              </span>
              <span className="text-xl font-bold text-green-700">
                {money(Number(order.total))}
              </span>
            </div>
          </div>
        </section>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-4 font-bold text-white transition hover:bg-green-800"
          >
            <ShoppingBag size={18} />
            Continue shopping
          </Link>

          <Link
            href="/account"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-4 font-bold text-gray-700 transition hover:bg-gray-50"
          >
            My account
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </main>
  );
}
