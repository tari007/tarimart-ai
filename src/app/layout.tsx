import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TariMart AI | Shop Smarter",
  description:
    "Discover products, shop smarter and experience AI-powered shopping with TariMart AI.",
  applicationName: "TariMart AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
