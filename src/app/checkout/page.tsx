"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Landmark,
  Smartphone,
  ShieldCheck,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { products, money } from "@/data/products";

type CartItem = {
  product_id: string;
  quantity: number;
};

type PaymentProvider = "paystack" | "flutterwave";
type PaymentMethod = "card" | "bank_transfer" | "ussd";

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const [provider, setProvider] =
    useState<PaymentProvider>("paystack");

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("card");

  const [message, setMessage] = useState("");
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    async function loadCheckout() {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          router.replace("/login");
          return;
        }

        setUserEmail(user.email ?? "");

        setCustomerName(
          user.user_metadata?.full_name ??
            user.user_metadata?.name ??
            ""
        );

        const { data: cartItems, error: cartError } =
          await supabase
            .from("cart_items")
            .select("product_id, quantity")
            .eq("user_id", user.id);

        if (cartError) {
          throw cartError;
        }

        setCart(cartItems ?? []);
      } catch (error) {
        console.error("Checkout loading error:", error);
        setMessage(
          "We could not load your cart. Please refresh the page."
        );
      } finally {
        setLoading(false);
      }
    }

    loadCheckout();
  }, [router]);

  const orderItems = useMemo(() => {
    return cart
      .map((item) => {
        const product = products.find(
          (product) =>
            String(product.id) === String(item.product_id)
        );

        if (!product) return null;

        return {
          ...product,
          quantity: item.quantity,
          lineTotal: product.price * item.quantity,
        };
      })
      .filter((item) => item !== null);
  }, [cart]);

  const subtotal = orderItems.reduce(
    (total, item) => total + item.lineTotal,
    0
  );

  const shipping = subtotal > 0 ? 2500 : 0;
  const total = subtotal + shipping;

  async function handleCheckout(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setMessage("");

    if (checking) return;

    if (orderItems.length === 0) {
      setMessage(
        "Your cart is empty. Add products before checking out."
      );
      return;
    }

    if (
      !customerName.trim() ||
      !phone.trim() ||
      !address.trim() ||
      !city.trim() ||
      !state.trim()
    ) {
      setMessage("Please complete all delivery details.");
      return;
    }

    setChecking(true);

    let orderId: string | null = null;

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.replace("/login");
        return;
      }

      const orderNumber = `TM-${Date.now()}`;

      const { data: order, error: orderError } =
        await supabase
          .from("orders")
          .insert({
            user_id: user.id,
            order_number: orderNumber,
            customer_name: customerName.trim(),
            customer_email: userEmail,
            phone: phone.trim(),
            delivery_address: address.trim(),
            city: city.trim(),
            state: state.trim(),
            subtotal,
            shipping_fee: shipping,
            total,
            payment_provider: provider,
            payment_method: paymentMethod,
            payment_status: "demo_paid",
            order_status: "processing",
          })
          .select("id")
          .single();

      if (orderError) {
        throw orderError;
      }

      orderId = order.id;

      const itemsToSave = orderItems.map((item) => ({
        order_id: order.id,
        product_id: String(item.id),
        product_name: item.name,
        unit_price: item.price,
        quantity: item.quantity,
        line_total: item.lineTotal,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(itemsToSave);

      if (itemsError) {
        throw itemsError;
      }

      const { error: cartError } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id);

      if (cartError) {
        throw cartError;
      }

      setCart([]);

      router.push(`/order-confirmation/${order.id}`);
    } catch (error) {
      console.error("Order creation error:", error);

      if (orderId) {
        const { error: rollbackError } = await supabase
          .from("orders")
          .delete()
          .eq("id", orderId);

        if (rollbackError) {
          console.error("Order rollback error:", rollbackError);
        }
      }

      setMessage(
        "We could not complete your order. Your cart has been retained where possible. Please try again."
      );
    } finally {
      setChecking(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2
            className="mx-auto mb-3 animate-spin text-green-700"
            size={32}
          />
          <p className="text-sm text-gray-600">
            Loading your checkout...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-green-700"
        >
          <ArrowLeft size={17} />
          Continue shopping
        </Link>

        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-green-700">
            TariMart secure checkout
          </p>

          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Complete your order
          </h1>

          <p className="mt-2 text-gray-600">
            Enter your delivery details and select your preferred payment option.
          </p>
        </div>

        {orderItems.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <ShoppingBag
              className="mx-auto mb-4 text-gray-400"
              size={42}
            />

            <h2 className="text-xl font-bold text-gray-900">
              Your cart is empty
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Add some products to your cart before checking out.
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
          <form onSubmit={handleCheckout}>
            <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
              <div className="space-y-7">
                                <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-xl bg-green-50 p-3 text-green-700">
                      <Landmark size={22} />
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        Delivery information
                      </h2>

                      <p className="text-sm text-gray-500">
                        Where should we deliver your order?
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Full name
                      </label>

                      <input
                        value={customerName}
                        onChange={(event) =>
                          setCustomerName(event.target.value)
                        }
                        required
                        placeholder="Enter your full name"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Email address
                      </label>

                      <input
                        type="email"
                        value={userEmail}
                        readOnly
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-600"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Phone number
                      </label>

                      <input
                        type="tel"
                        value={phone}
                        onChange={(event) =>
                          setPhone(event.target.value)
                        }
                        required
                        placeholder="e.g. 08012345678"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Delivery address
                      </label>

                      <textarea
                        value={address}
                        onChange={(event) =>
                          setAddress(event.target.value)
                        }
                        required
                        rows={3}
                        placeholder="House number, street name and area"
                        className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        City
                      </label>

                      <input
                        value={city}
                        onChange={(event) =>
                          setCity(event.target.value)
                        }
                        required
                        placeholder="Your city"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        State
                      </label>

                      <input
                        value={state}
                        onChange={(event) =>
                          setState(event.target.value)
                        }
                        required
                        placeholder="Your state"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                      />
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900">
                      Payment provider
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Select a provider for this checkout demonstration.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setProvider("paystack")}
                      className={`rounded-xl border-2 p-4 text-left transition ${
                        provider === "paystack"
                          ? "border-green-700 bg-green-50"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900">
                          Paystack
                        </span>

                        {provider === "paystack" && (
                          <CheckCircle2
                            className="text-green-700"
                            size={20}
                          />
                        )}
                      </div>

                      <p className="mt-2 text-xs text-gray-500">
                        Future payment integration option.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setProvider("flutterwave")}
                      className={`rounded-xl border-2 p-4 text-left transition ${
                        provider === "flutterwave"
                          ? "border-green-700 bg-green-50"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900">
                          Flutterwave
                        </span>

                        {provider === "flutterwave" && (
                          <CheckCircle2
                            className="text-green-700"
                            size={20}
                          />
                        )}
                      </div>

                      <p className="mt-2 text-xs text-gray-500">
                        Future payment integration option.
                      </p>
                    </button>
                  </div>

                  <div className="mb-4 mt-7">
                    <h3 className="font-bold text-gray-900">
                      Payment method
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Choose a method for this simulated transaction.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left ${
                        paymentMethod === "card"
                          ? "border-green-700 bg-green-50"
                          : "border-gray-200"
                      }`}
                    >
                      <CreditCard
                        className="text-green-700"
                        size={23}
                      />

                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          Debit or credit card
                        </p>

                        <p className="text-xs text-gray-500">
                          Card payment simulation
                        </p>
                      </div>

                      {paymentMethod === "card" && (
                        <CheckCircle2
                          className="text-green-700"
                          size={20}
                        />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setPaymentMethod("bank_transfer")
                      }
                      className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left ${
                        paymentMethod === "bank_transfer"
                          ? "border-green-700 bg-green-50"
                          : "border-gray-200"
                      }`}
                    >
                      <Landmark
                        className="text-green-700"
                        size={23}
                      />

                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          Bank transfer
                        </p>

                        <p className="text-xs text-gray-500">
                          Bank transfer simulation
                        </p>
                      </div>

                      {paymentMethod === "bank_transfer" && (
                        <CheckCircle2
                          className="text-green-700"
                          size={20}
                        />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("ussd")}
                      className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left ${
                        paymentMethod === "ussd"
                          ? "border-green-700 bg-green-50"
                          : "border-gray-200"
                      }`}
                    >
                      <Smartphone
                        className="text-green-700"
                        size={23}
                      />

                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          USSD
                        </p>

                        <p className="text-xs text-gray-500">
                          USSD payment simulation
                        </p>
                      </div>

                      {paymentMethod === "ussd" && (
                        <CheckCircle2
                          className="text-green-700"
                          size={20}
                        />
                      )}
                    </button>
                  </div>

                  <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                    <strong>DEMO MODE:</strong> This is a simulated checkout.
                    No real payment will be processed or collected.
                    Do not enter card details, PINs or banking credentials.
                  </div>

                  <div className="mt-4 flex gap-3 rounded-xl bg-blue-50 p-4 text-sm text-blue-900">
                    <ShieldCheck
                      className="mt-0.5 shrink-0"
                      size={20}
                    />

                    <p>
                      Payment provider options are displayed for demonstration
                      purposes only. Live payment processing has not been
                      connected.
                    </p>
                  </div>
                </section>
              </div>
                            <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7 lg:sticky lg:top-6">
                <h2 className="mb-6 text-lg font-bold text-gray-900">
                  Order summary
                </h2>

                <div className="space-y-5">
                  {orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900">
                          {item.name}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <p className="shrink-0 text-sm font-semibold text-gray-900">
                        {money(item.lineTotal)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="my-6 border-t border-gray-200" />

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{money(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Delivery fee</span>
                    <span>{money(shipping)}</span>
                  </div>
                </div>

                <div className="my-5 border-t border-gray-200" />

                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-gray-900">
                    Total
                  </span>

                  <span className="text-2xl font-bold text-green-700">
                    {money(total)}
                  </span>
                </div>

                <p className="mt-3 text-xs text-gray-500">
                  Delivery fee is an initial estimate and may be
                  adjusted when delivery arrangements are confirmed.
                </p>

                {message && (
                  <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={checking}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-4 font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {checking ? (
                    <>
                      <Loader2
                        className="animate-spin"
                        size={18}
                      />
                      Processing demo order...
                    </>
                  ) : (
                    <>
                      Complete demo order
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <p className="mt-4 text-center text-xs text-gray-500">
                  This checkout is for demonstration purposes.
                  No real payment will be collected.
                </p>
              </aside>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
                
