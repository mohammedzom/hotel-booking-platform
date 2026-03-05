import { apiClient } from '../lib/apiClient';
import type {
    CartDto,
    AddCartItemRequest,
    UpdateCartItemRequest,
} from '../types/public.types';

export const cartService = {
    /** GET /api/cart — fetch current cart */
    getCart: async (): Promise<CartDto> => {
        const res = await apiClient.get<CartDto>('/cart');
        return res.data;
    },

    /** POST /api/cart/items — add a room to the cart */
    addItem: async (payload: AddCartItemRequest): Promise<CartDto> => {
        const res = await apiClient.post<CartDto>('/cart/items', payload);
        return res.data;
    },

    /** PUT /api/cart/items/{id} — update quantity */
    updateItem: async (id: string, payload: UpdateCartItemRequest): Promise<CartDto> => {
        const res = await apiClient.put<CartDto>(`/cart/items/${id}`, payload);
        return res.data;
    },

    /** DELETE /api/cart/items/{id} — remove one item */
    removeItem: async (id: string): Promise<CartDto> => {
        const res = await apiClient.delete<CartDto>(`/cart/items/${id}`);
        return res.data;
    },

    /** DELETE /api/cart — empty the whole cart */
    clearCart: async (): Promise<void> => {
        await apiClient.delete('/cart');
    },
};
