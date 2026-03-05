import { apiClient } from '../lib/apiClient';
import type {
    CheckoutHoldResponse,
    CheckoutBookRequest,
    CheckoutBookResponse,
} from '../types/public.types';

export const checkoutService = {
    /**
     * POST /api/checkout/hold
     * Locks the rooms in the cart for a short window (e.g. 10 min)
     * to prevent conflicts while the user fills in payment details.
     */
    hold: async (): Promise<CheckoutHoldResponse> => {
        const res = await apiClient.post<CheckoutHoldResponse>('/checkout/hold');
        return res.data;
    },

    /**
     * POST /api/checkout/book
     * Finalises the booking and returns a Stripe payment URL.
     */
    book: async (payload: CheckoutBookRequest): Promise<CheckoutBookResponse> => {
        const res = await apiClient.post<CheckoutBookResponse>('/checkout/book', payload);
        return res.data;
    },
};
