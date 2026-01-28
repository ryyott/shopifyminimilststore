"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useCartStore } from "@/stores/cart-store";
import { CartIcon as AnimatedCartIcon } from "@/components/ui/cart";

export function CartIcon() {
  const totalItems = useCartStore((state) => state.totalItems);
  const pathname = usePathname();

  // Hide cart icon on auth routes
  if (pathname?.startsWith("/auth")) {
    return null;
  }

  return (
    <Link href="/cart" className="fixed right-4 top-[15px] z-50 text-black">
      <div className="relative">
        <AnimatedCartIcon size={20} />
        {totalItems > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] text-white"
          >
            {totalItems}
          </motion.span>
        )}
      </div>
    </Link>
  );
}
