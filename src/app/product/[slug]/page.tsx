"use client";

import { useState, use } from "react";
import { notFound, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { ProductImageGallery } from "../../_components/product-image-gallery";
import { ProductInfoDrawer } from "../../_components/product-info-drawer";
import { useCartStore } from "@/stores/cart-store";
import { useProductStore } from "@/stores/product-store";
import { useNavigationStore } from "@/stores/navigation-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const getProductBySlug = useProductStore((state) => state.getProductBySlug);
  const decreaseStock = useProductStore((state) => state.decreaseStock);
  const getStockQuantity = useProductStore((state) => state.getStockQuantity);
  const product = getProductBySlug(slug);

  const { direction, isTransitioning, startTransition, endTransition } =
    useNavigationStore();
  const [isExiting, setIsExiting] = useState(false);

  const [selectedImage, setSelectedImage] = useState(0);
  const [sizeDrawerOpen, setSizeDrawerOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  if (!product) {
    notFound();
  }

  const handleBack = async () => {
    setIsExiting(true);
    startTransition("back", `/product/${slug}`, "/");

    // Wait for exit animation - shortened for snappier feel
    await new Promise((resolve) => setTimeout(resolve, 180));

    // Navigate
    router.back();

    // Cleanup
    setTimeout(() => {
      endTransition();
      setIsExiting(false);
    }, 100);
  };

  const handleSizeClick = (size: string) => {
    // Check stock availability
    const stockQty = getStockQuantity(product.id, size);
    if (stockQty <= 0) {
      toast.error("Out of stock", {
        description: `${product.code} - SIZE ${size} is currently out of stock`,
        duration: 2000,
      });
      return;
    }

    // Decrease stock
    const success = decreaseStock(product.id, size, 1);

    if (!success) {
      toast.error("Unable to add to cart", {
        description: "This item is out of stock",
        duration: 2000,
      });
      return;
    }

    // Add to cart
    addItem({
      productId: product.id,
      code: product.code,
      slug: product.slug,
      price: product.price,
      size: size,
      qty: 1,
      image: product.images[0],
    });

    toast.success("Added to cart", {
      description: `${product.code} - SIZE ${size}`,
      duration: 2000,
    });

    setSizeDrawerOpen(false);
  };

  return (
    <>
      <div className="fixed inset-0 overflow-hidden">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="fixed left-4 top-[13px] z-50 text-black transition-opacity hover:opacity-60"
          aria-label="Go back"
        >
          <ChevronLeft className="h-6 w-6" strokeWidth={1.5} />
        </button>

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={
            isExiting
              ? {
                  scale: 0.95,
                  opacity: 0,
                }
              : {
                  scale: 1,
                  opacity: 1,
                }
          }
          transition={{
            duration: isExiting ? 0.2 : 0.35,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="flex h-screen items-center justify-center p-4 md:p-8"
        >
          <div className="relative w-full max-w-3xl max-h-[calc(100vh-2rem)] md:max-h-[calc(100vh-4rem)]">
            <motion.div layoutId={`product-${product.id}`}>
              <ProductImageGallery
                images={product.images}
                code={product.code}
                selectedImage={selectedImage}
                onSelectImage={setSelectedImage}
              />
            </motion.div>

          <div className="relative mt-2 text-center">
            {/* SKU / SELECT SIZE */}
            <div className="relative mb-3 h-5">
              <AnimatePresence mode="wait">
                {sizeDrawerOpen ? (
                  <>
                    <motion.p
                      key="select-size"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm font-medium uppercase tracking-widest"
                    >
                      SELECT SIZE
                    </motion.p>
                    <div className="absolute left-0 right-0 top-0 flex justify-between" style={{ paddingLeft: "calc(16.666% - 10px)", paddingRight: "calc(16.666% - 10px)" }}>
                      <button
                        className="transition-opacity hover:opacity-60"
                      >
                        <svg width="10" height="13" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="block">
                          <path d="M5.5 8L5.5 9" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M1.5 4.5C1.5 2 4 1 5.5 1C7 1 9.5 2 9.5 4.5C9.5 7 5.5 8 5.5 8" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M5.5 13.5C5.3619 13.5 5.25 13.3881 5.25 13.25C5.25 13.1119 5.3619 13 5.5 13" stroke="black" strokeWidth="2"/>
                          <path d="M5.5 13.5C5.6381 13.5 5.75 13.3881 5.75 13.25C5.75 13.1119 5.6381 13 5.5 13" stroke="black" strokeWidth="2"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => setSizeDrawerOpen(false)}
                        className="transition-opacity hover:opacity-60"
                      >
                        <svg width="13" height="13" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="block">
                          <path d="M1.5 1.5L13.5 13.5" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M13.5 1.5L1.5 13.5" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  </>
                ) : (
                  <motion.p
                    key="sku"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-medium uppercase tracking-widest"
                  >
                    {product.code}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Price */}
            <p className="mb-4 text-center text-xl">${product.price}</p>

            {/* Plus button / Size grid */}
            <AnimatePresence mode="wait">
              {!sizeDrawerOpen ? (
                <motion.button
                  key="plus"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSizeDrawerOpen(true)}
                  className="text-4xl font-light transition-transform hover:scale-105"
                >
                  +
                </motion.button>
              ) : (
                <motion.div
                  key="sizes"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="mb-6 grid grid-cols-3 gap-4">
                    {product.sizes.slice(0, 3).map((size, idx) => {
                      const stockQty = getStockQuantity(product.id, size.value);
                      const isLowStock = stockQty > 0 && stockQty <= 3;
                      const isOutOfStock = stockQty <= 0;

                      // Calculate the offset from center for each button
                      // Button 0 (left): move from center-right to left
                      // Button 1 (center): stays in place
                      // Button 2 (right): move from center-left to right
                      const getInitialX = () => {
                        if (idx === 0) return 120; // Left button starts from center
                        if (idx === 2) return -120; // Right button starts from center
                        return 0; // Center button stays in place
                      };

                      return (
                        <motion.div
                          key={size.value}
                          className="relative"
                          initial={{
                            opacity: 0,
                            x: getInitialX(),
                            scale: 0.3
                          }}
                          animate={{
                            opacity: 1,
                            x: 0,
                            scale: 1
                          }}
                          transition={{
                            duration: 0.4,
                            ease: [0.19, 1, 0.22, 1]
                          }}
                        >
                          <button
                            onClick={() => handleSizeClick(size.value)}
                            disabled={isOutOfStock}
                            className={cn(
                              "relative h-10 w-full text-sm uppercase tracking-widest transition-opacity flex items-center justify-center",
                              !isOutOfStock
                                ? "hover:opacity-60"
                                : "opacity-30 cursor-not-allowed"
                            )}
                          >
                            {size.value}
                          </button>
                          {isLowStock && (
                            <motion.p
                              className="mt-1 text-xs text-orange-600"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3, delay: 0.2 }}
                            >
                              Only {stockQty} left
                            </motion.p>
                          )}
                          {isOutOfStock && (
                            <motion.p
                              className="mt-1 text-xs text-red-600"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3, delay: 0.2 }}
                            >
                              Out of stock
                            </motion.p>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setShowInfo(true)}
                    className="w-full text-center text-xs uppercase tracking-widest transition-opacity hover:opacity-60"
                  >
                    INFORMATION
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showInfo && (
          <ProductInfoDrawer product={product} onClose={() => setShowInfo(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
