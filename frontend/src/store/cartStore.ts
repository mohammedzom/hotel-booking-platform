import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartDto, CartItemDto } from '../types/public.types';

// ─────────────────────────────────────────────────────────────────────────────
// State + Actions interface
// ─────────────────────────────────────────────────────────────────────────────

interface CartState {
    cart: CartDto | null;
    isLoading: boolean;
}

interface CartActions {
    /** Replace full cart state (after any API call) */
    setCart: (cart: CartDto | null) => void;
    /** Optimistically add / update a single item */
    setItem: (item: CartItemDto) => void;
    /** Remove item by id */
    removeItem: (itemId: string) => void;
    /** Clear all items (empty cart) */
    clearCart: () => void;
    /** Set loading flag */
    setLoading: (loading: boolean) => void;
}

type CartStore = CartState & CartActions;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function computeTotal(items: CartItemDto[]): number {
    return items.reduce((sum, i) => sum + i.totalPrice, 0);
}

// ─────────────────────────────────────────────────────────────────────────────
// Store — persisted to sessionStorage so cart survives page refresh
// but is cleared when the browser tab is closed.
// ─────────────────────────────────────────────────────────────────────────────

export const useCartStore = create<CartStore>()(
    persist(
        (set) => ({
            // ── Initial state ─────────────────────────────────────────────────
            cart: null,
            isLoading: false,

            // ── Actions ───────────────────────────────────────────────────────
            setCart: (cart) => set({ cart }),

            setItem: (item) =>
                set((state) => {
                    const existing = state.cart?.items ?? [];
                    const idx = existing.findIndex((i) => i.id === item.id);
                    const items = idx >= 0
                        ? existing.map((i) => (i.id === item.id ? item : i))
                        : [...existing, item];

                    return {
                        cart: {
                            id: state.cart?.id ?? '',
                            items,
                            totalPrice: computeTotal(items),
                        },
                    };
                }),

            removeItem: (itemId) =>
                set((state) => {
                    const items = (state.cart?.items ?? []).filter((i) => i.id !== itemId);
                    return {
                        cart: state.cart
                            ? { ...state.cart, items, totalPrice: computeTotal(items) }
                            : null,
                    };
                }),

            clearCart: () => set({ cart: null }),

            setLoading: (isLoading) => set({ isLoading }),
        }),
        {
            name: 'hotelbooking-cart',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);

// ─────────────────────────────────────────────────────────────────────────────
// Convenience selectors
// ─────────────────────────────────────────────────────────────────────────────

export const selectCart       = (s: CartStore) => s.cart;
export const selectCartItems  = (s: CartStore) => s.cart?.items ?? [];
export const selectCartTotal  = (s: CartStore) => s.cart?.totalPrice ?? 0;
export const selectCartCount  = (s: CartStore) => (s.cart?.items ?? []).reduce((n, i) => n + i.quantity, 0);
export const selectCartLoading = (s: CartStore) => s.isLoading;
