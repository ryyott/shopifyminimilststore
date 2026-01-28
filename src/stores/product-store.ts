import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, Category } from "@/types/shop";
import { products as initialProducts } from "@/data/shop/products";

interface ProductStore {
  products: Product[];
  initialized: boolean;

  // CRUD Operations
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;

  // Inventory Management
  decreaseStock: (productId: string, size: string, quantity: number) => boolean;
  increaseStock: (productId: string, size: string, quantity: number) => void;
  getStockQuantity: (productId: string, size: string) => number;

  // Utility Methods
  getProductById: (id: string) => Product | undefined;
  getProductBySlug: (slug: string) => Product | undefined;
  getAllProducts: () => Product[];
  getProductsByCategory: (category: Category) => Product[];

  // Initialization
  initializeFromHardcodedData: () => void;
}

// Helper function to generate unique product ID
const generateProductId = (products: Product[]): string => {
  const maxId = products.reduce((max, p) => {
    const id = parseInt(p.id);
    return id > max ? id : max;
  }, 0);
  return String(maxId + 1);
};

// Helper function to generate slug from name and code
export const generateSlug = (name: string, code: string): string => {
  const nameSlug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${code.toLowerCase()}-${nameSlug}`;
};

// Helper function to migrate products to include stockQuantity
const migrateProductsToIncludeStock = (products: Product[]): Product[] => {
  return products.map(product => ({
    ...product,
    sizes: product.sizes.map(size => ({
      ...size,
      // Add stockQuantity if it doesn't exist
      // Set to 0 if not available, otherwise default to 10 for available sizes
      stockQuantity: (size as any).stockQuantity ?? (size.available ? 10 : 0),
    })),
  }));
};

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: [],
      initialized: false,

      addProduct: (product) =>
        set((state) => {
          const newProduct: Product = {
            ...product,
            id: generateProductId(state.products),
            slug: product.slug || generateSlug(product.name, product.code),
            dateAdded: product.dateAdded || new Date().toISOString().split("T")[0],
          };
          return { products: [...state.products, newProduct] };
        }),

      updateProduct: (id, updates) =>
        set((state) => {
          const updatedProducts = state.products.map((p) =>
            p.id === id
              ? {
                  ...p,
                  ...updates,
                  // Auto-generate slug if name or code changed
                  slug:
                    updates.name || updates.code
                      ? generateSlug(
                          updates.name || p.name,
                          updates.code || p.code
                        )
                      : p.slug,
                }
              : p
          );
          return { products: updatedProducts };
        }),

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      duplicateProduct: (id) =>
        set((state) => {
          const product = state.products.find((p) => p.id === id);
          if (!product) return state;

          const newProduct: Product = {
            ...product,
            id: generateProductId(state.products),
            code: `${product.code}-COPY`,
            slug: generateSlug(`${product.name} (Copy)`, `${product.code}-COPY`),
            name: `${product.name} (Copy)`,
            dateAdded: new Date().toISOString().split("T")[0],
          };

          return { products: [...state.products, newProduct] };
        }),

      decreaseStock: (productId, size, quantity) => {
        let success = false;
        set((state) => {
          const updatedProducts = state.products.map((p) => {
            if (p.id === productId) {
              const updatedSizes = p.sizes.map((s) => {
                if (s.value === size) {
                  const newQuantity = s.stockQuantity - quantity;
                  if (newQuantity >= 0) {
                    success = true;
                    return {
                      ...s,
                      stockQuantity: newQuantity,
                      available: newQuantity > 0,
                    };
                  }
                }
                return s;
              });
              return { ...p, sizes: updatedSizes };
            }
            return p;
          });
          return { products: updatedProducts };
        });
        return success;
      },

      increaseStock: (productId, size, quantity) =>
        set((state) => {
          const updatedProducts = state.products.map((p) => {
            if (p.id === productId) {
              const updatedSizes = p.sizes.map((s) => {
                if (s.value === size) {
                  const newQuantity = s.stockQuantity + quantity;
                  return {
                    ...s,
                    stockQuantity: newQuantity,
                    available: newQuantity > 0,
                  };
                }
                return s;
              });
              return { ...p, sizes: updatedSizes };
            }
            return p;
          });
          return { products: updatedProducts };
        }),

      getStockQuantity: (productId, size) => {
        const product = get().products.find((p) => p.id === productId);
        if (!product) return 0;
        const sizeObj = product.sizes.find((s) => s.value === size);
        return sizeObj?.stockQuantity ?? 0;
      },

      getProductById: (id) => {
        return get().products.find((p) => p.id === id);
      },

      getProductBySlug: (slug) => {
        return get().products.find((p) => p.slug === slug);
      },

      getAllProducts: () => {
        return get().products;
      },

      getProductsByCategory: (category) => {
        const products = get().products;

        if (!category) {
          return products.filter((p) => p.featured);
        }

        // Show ALL products sorted by date for "new" category
        if (category === "new") {
          return [...products].sort(
            (a, b) =>
              new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
          );
        }

        // For other categories, filter by category field
        return products.filter((p) => p.category === category);
      },

      initializeFromHardcodedData: () =>
        set((state) => {
          // Only initialize if not already initialized and no products exist
          if (!state.initialized && state.products.length === 0) {
            return { products: migrateProductsToIncludeStock(initialProducts), initialized: true };
          }
          return state;
        }),
    }),
    {
      name: "yeezy-products-storage",
      // Initialize from hardcoded data on first load and migrate existing data
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (state.products.length === 0) {
            state.initializeFromHardcodedData();
          } else {
            // Migrate existing products to include stockQuantity
            state.products = migrateProductsToIncludeStock(state.products);
          }
        }
      },
    }
  )
);
