import { apiClient } from '../lib/apiClient';
import type { HotelDetailsDto, HotelGalleryResponse, RoomAvailabilityResponse } from '../types/public.types';

export const hotelService = {
    getHotelDetails: async (id: string): Promise<HotelDetailsDto> => {
        // Matches: [HttpGet("{id}")]
        const res = await apiClient.get<HotelDetailsDto>(`/hotels/${id}`);
        return res.data;
    },

    getHotelGallery: async (id: string): Promise<HotelGalleryResponse> => {
        // Matches: [HttpGet("{id}/gallery")]
        const res = await apiClient.get<HotelGalleryResponse>(`/hotels/${id}/gallery`);
        return res.data;
    },

    checkRoomAvailability: async (id: string, checkIn: string, checkOut: string): Promise<RoomAvailabilityResponse> => {
        // Matches: [HttpGet("{id}/room-availability")]
        const res = await apiClient.get<RoomAvailabilityResponse>(`/hotels/${id}/room-availability`, {
            params: { CheckIn: checkIn, CheckOut: checkOut }
        });
        return res.data;
    },

    trackHotelView: async (id: string): Promise<void> => {
        // Matches: [HttpPost("hotel-view")] in EventsController
        // This is a fire-and-forget endpoint for recommendations
        await apiClient.post('/events/hotel-view', { hotelId: id });
    }
};
