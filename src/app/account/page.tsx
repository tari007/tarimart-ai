
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Package,
  Heart,
  MapPin,
  LogOut,
  ShoppingBag,
  Settings,
  Loader2,
  Save,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";

export default function AccountPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadAccount() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setUser(user);

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        setErrorMessage("Unable to load your profile.");
      }

      setFullName(
        profile?.full_name ||
        user.user_metadata?.full_name ||
        ""
      );

      setPhone(profile?.phone || "");

      setLoading(false);
    }

    loadAccount();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/login");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  
async function handleSaveProfile(
  event: React.FormEvent<HTMLFormElement>
) {
  event.preventDefault();

  if (!user) return;

  setSaving(true);
  setSuccessMessage("");
  setErrorMessage("");

  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        full_name: fullName.trim(),
        email: user.email ?? "",
        phone: phone.trim(),
      },
      { onConflict: "id" }
    )
    .select()
    .single();

  if (error) {
    console.error("Profile update error:", error);
    setErrorMessage(`Profile update failed: ${error.message}`);
    setSaving(false);
    return;
  }

  const { error: metadataError } = await supabase.auth.updateUser({
    data: { full_name: fullName.trim() },
  });

  if (metadataError) {
    setErrorMessage(
      `Profile saved, but account name sync failed: ${metadataError.message}`
    );
  } else {
    setSuccessMessage("Your profile has been updated successfully.");
  }

  setSaving(false);
}

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );
  }

  const menuItems = [
    {
      label: "My Orders",
      description: "View and track your purchases",
      icon: Package,
      href: "/account/orders",
    },
    {
      label: "My Wishlist",
      description: "Products you have saved",
      icon: Heart,
      href: "/account/wishlist",
    },
    {
      label: "My Addresses",
      description: "Manage your delivery addresses",
      icon: MapPin,
      href: "/account/addresses",
    },
    {
      label: "Account Settings",
      description: "Manage your personal information",
      icon: Settings,
      href: "/account/settings",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-yellow-100 text-black p-3 text-sm text-center">
  Connected Supabase project: {process.env.NEXT_PUBLIC_SUPABASE_URL}
</div>
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-5 py-5 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-orange-600">
            TariMart
          </Link>

          <Link
            href="/"
            className="text-sm font-medium text-gray-600 hover:text-orange-600"
          >
            Continue Shopping
          </Link>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-5 py-10">
        <div className="bg-white rounded-2xl border p-6 md:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
              <User className="w-8 h-8 text-orange-600" />
            </div>

            <div className="flex-1">
              <p className="text-sm text-gray-500">
                Welcome back
              </p>

              <h1 className="text-2xl font-bold text-gray-900 mt-1">
                {fullName || "Customer"}
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                {user?.email}
              </p>
            </div>

            <button
              onClick={handleSignOut}
              className="flex items-center justify-center gap-2 border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-6 md:p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Personal Information
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Update your TariMart customer profile.
            </p>
          </div>

          {successMessage && (
            <div className="flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 rounded-lg p-3 mb-5 text-sm">
              <CheckCircle className="w-5 h-5 shrink-0" />
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 mb-5 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>

              <input
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                value={user?.email || ""}
                readOnly
                className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-100 text-gray-500"
              />

              <p className="text-xs text-gray-400 mt-2">
                Your registered email address.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                placeholder="Enter your phone number"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 bg-orange-600 text-white rounded-lg px-6 py-3 font-semibold hover:bg-orange-700 disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}

              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            My Account
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Manage your TariMart shopping experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                className="bg-white border rounded-xl p-6 hover:border-orange-300 hover:shadow-sm transition"
              >
                <div className="w-11 h-11 rounded-lg bg-orange-50 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-orange-600" />
                </div>

                <h3 className="font-semibold text-gray-900">
                  {item.label}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  {item.description}
                </p>
              </Link>
            );
          })}
        </div>

        <div className="bg-orange-50 border border-orange-100 rounded-xl p-6 mt-8">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-orange-600" />

            <div>
              <h3 className="font-semibold text-gray-900">
                Enjoy shopping with TariMart
              </h3>

              <p className="text-sm text-gray-600 mt-1">
                Discover products and great deals from businesses across Africa.
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="inline-block mt-4 bg-orange-600 text-white rounded-lg px-5 py-2.5 text-sm font-semibold hover:bg-orange-700"
          >
            Explore Products
          </Link>
        </div>
      </section>
    </main>
  );
}
