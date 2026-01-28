"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PlusIcon } from "@/components/ui/plus";

const categories = [
  { value: "new", label: "NEW" },
  { value: "mens", label: "MENS" },
  { value: "womens", label: "WOMENS" },
  { value: "slides", label: "SLIDES" },
  { value: "accessories", label: "ACCESSORIES" },
];

interface CategoryNavProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  isFilterOpen: boolean;
  onFilterToggle: () => void;
}

export function CategoryNav({
  activeCategory,
  onCategoryChange,
  isFilterOpen,
  onFilterToggle,
}: CategoryNavProps) {
  const handleCategoryClick = (category: string) => {
    onCategoryChange(category);
  };

  return (
    <nav className="fixed left-0 right-0 top-0 z-40 bg-white border-b border-border/40">
      <div className="relative flex items-center justify-center px-4 py-3">
        {/* Animated Plus icon - left side */}
        <motion.div
          className="absolute left-4"
          animate={{ rotate: isFilterOpen ? 45 : 0 }}
          transition={{
            duration: 0.25,
            ease: [0.21, 0.8, 0.25, 1],
          }}
        >
          <button
            onClick={onFilterToggle}
            className="text-black transition-opacity hover:opacity-60"
          >
            <PlusIcon size={20} />
          </button>
        </motion.div>

        {/* Centered categories - two lines */}
        <div className="flex flex-col items-center gap-2">
          {/* First line: NEW MENS WOMENS */}
          <div className="flex items-center gap-6">
            {categories.slice(0, 3).map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategoryClick(cat.value)}
                className={cn(
                  "whitespace-nowrap text-sm uppercase tracking-wider transition-colors duration-150",
                  activeCategory === cat.value
                    ? "text-black"
                    : "text-[#E5E5E5] hover:text-black/60"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
          {/* Second line: SLIDES ACCESSORIES */}
          <div className="flex items-center gap-6">
            {categories.slice(3).map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategoryClick(cat.value)}
                className={cn(
                  "whitespace-nowrap text-sm uppercase tracking-wider transition-colors duration-150",
                  activeCategory === cat.value
                    ? "text-black"
                    : "text-[#E5E5E5] hover:text-black/60"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cart icon placeholder - actual CartIcon component renders separately */}
      </div>
    </nav>
  );
}
