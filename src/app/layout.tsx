import type { Metadata } from "next";
import Link from "next/link";
import { CartIcon } from "./_components/cart-icon";
import { CheckoutBackButton } from "./_components/checkout-back-button";
import { EmailBanner } from "./_components/email-banner";
import { LayoutGroupWrapper } from "./_components/layout-group-wrapper";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "YZY | Minimalist E-Commerce",
    template: "%s | YZY",
  },
  description: "Premium streetwear and accessories. Shop the latest Yeezy-inspired minimalist fashion, slides, and apparel. Discover exclusive designs with modern aesthetics.",
  keywords: [
    "yeezy",
    "streetwear",
    "minimalist fashion",
    "premium apparel",
    "slides",
    "sneakers",
    "accessories",
    "modern fashion",
    "contemporary style",
    "urban wear",
    "designer clothing",
    "fashion accessories",
    "ecommerce",
  ],
  authors: [{ name: "ryyott" }],
  creator: "ryyott",
  publisher: "YZY",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "YZY | Minimalist E-Commerce",
    description: "Premium streetwear and accessories. Shop the latest Yeezy-inspired minimalist fashion.",
    url: "/",
    siteName: "YZY",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "YZY - Minimalist E-Commerce",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YZY | Minimalist E-Commerce",
    description: "Premium streetwear and accessories. Shop the latest Yeezy-inspired minimalist fashion.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here when you set them up
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-helvetica font-bold text-foreground hide-scrollbar" suppressHydrationWarning>
        <LayoutGroupWrapper>
          <CheckoutBackButton />
          <CartIcon />
          <main className="hide-scrollbar">{children}</main>
          <EmailBanner />
          <Toaster position="bottom-center" />
          {/* Dev Footer */}
          <footer className="fixed bottom-4 right-4 z-50">
            <Link
              href="/auth/dashboard"
              className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors cursor-pointer"
            >
              /admin
            </Link>
          </footer>
        </LayoutGroupWrapper>
      </body>
    </html>
  );
}
