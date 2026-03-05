import { apiClient } from '../lib/apiClient';
import type { BookingDto, BookingsListResponse } from '../types/public.types';

export const bookingService = {
    /** GET /api/bookings — list all bookings for the current user */
    getBookings: async (): Promise<BookingDto[]> => {
        const res = await apiClient.get<BookingsListResponse>('/bookings');
        return res.data.bookings;
    },

    /** GET /api/bookings/{id} — get details of a single booking */
    getBooking: async (id: string): Promise<BookingDto> => {
        const res = await apiClient.get<BookingDto>(`/bookings/${id}`);
        return res.data;
    },

    /** POST /api/bookings/{id}/cancel — cancel a booking */
    cancelBooking: async (id: string): Promise<BookingDto> => {
        const res = await apiClient.post<BookingDto>(`/bookings/${id}/cancel`);
        return res.data;
    },
};
