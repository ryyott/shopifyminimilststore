import { create } from "zustand";

interface NavigationStore {
  // State
  isTransitioning: boolean;
  direction: "forward" | "back" | null;
  previousRoute: string | null;
  currentRoute: string | null;
  selectedProductId: string | null;

  // Actions
  startTransition: (
    direction: "forward" | "back",
    fromRoute: string,
    toRoute: string
  ) => void;
  endTransition: () => void;
  setSelectedProduct: (productId: string | null) => void;
  reset: () => void;
}

export const useNavigationStore = create<NavigationStore>((set) => ({
  // Initial state
  isTransitioning: false,
  direction: null,
  previousRoute: null,
  currentRoute: null,
  selectedProductId: null,

  // Start a transition
  startTransition: (direction, fromRoute, toRoute) =>
    set({
      isTransitioning: true,
      direction,
      previousRoute: fromRoute,
      currentRoute: toRoute,
    }),

  // End transition and clean up
  endTransition: () =>
    set({
      isTransitioning: false,
      direction: null,
      previousRoute: null,
    }),

  // Set selected product for layoutId coordination
  setSelectedProduct: (productId) => set({ selectedProductId: productId }),

  // Reset all state
  reset: () =>
    set({
      isTransitioning: false,
      direction: null,
      previousRoute: null,
      currentRoute: null,
      selectedProductId: null,
    }),
}));
