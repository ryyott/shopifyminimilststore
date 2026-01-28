"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useNavigationStore } from "@/stores/navigation-store";
import type { Product } from "@/types/shop";

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const router = useRouter();
  const { direction, startTransition, endTransition, setSelectedProduct } =
    useNavigationStore();
  const [isExiting, setIsExiting] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isExiting) return;

    setIsExiting(true);
    setSelectedProduct(product.id);
    startTransition("forward", "/", `/product/${product.slug}`);

    // Navigate immediately to let layoutId animate the morphing
    router.push(`/product/${product.slug}`);

    // Cleanup after enter animation
    setTimeout(() => {
      endTransition();
      setSelectedProduct(null);
      setIsExiting(false);
    }, 600);
  };

  // Skip entrance animation when navigating back
  const shouldAnimate = direction !== "back";

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
      whileInView={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        delay: shouldAnimate ? index * 0.05 : 0,
        ease: "easeOut",
      }}
      viewport={{ once: true }}
    >
      <div onClick={handleClick} className="group cursor-pointer">
        <motion.div
          layoutId={`product-${product.id}`}
          className="relative aspect-square overflow-hidden"
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        >
          <Image
            src={product.images[0]}
            alt={product.code}
            fill
            className="object-contain transition-transform duration-150 ease-out group-hover:scale-103"
            loading="lazy"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </motion.div>
        <div className="mt-3 text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-black">
            {product.code}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
