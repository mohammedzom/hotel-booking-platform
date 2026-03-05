import { apiClient } from '../lib/apiClient';
import type {
    PaginatedAdminResponse,
    AdminCityDto,
    CreateCityRequest,
    UpdateCityRequest,
    AdminHotelDto,
    CreateHotelRequest,
    UpdateHotelRequest,
    AdminImageDto,
    AdminRoomTypeDto,
    CreateRoomTypeRequest,
    UpdateRoomTypeRequest,
    AdminRoomDto,
    CreateRoomRequest,
    UpdateRoomRequest,
    AdminServiceDto,
    CreateServiceRequest,
    UpdateServiceRequest,
} from '../types/admin.types';

// ─────────────────────────────────────────────────────────────────────────────
// Cities
// ─────────────────────────────────────────────────────────────────────────────

const citiesBase = '/admin-cities';

export const adminCitiesService = {
    /** GET /admin-cities?search&page&pageSize */
    list: async (params?: { search?: string; page?: number; pageSize?: number }): Promise<PaginatedAdminResponse<AdminCityDto>> => {
        const res = await apiClient.get<PaginatedAdminResponse<AdminCityDto>>(citiesBase, { params });
        return res.data;
    },

    /** GET /admin-cities/{id} */
    get: async (id: string): Promise<AdminCityDto> => {
        const res = await apiClient.get<AdminCityDto>(`${citiesBase}/${id}`);
        return res.data;
    },

    /** POST /admin-cities */
    create: async (body: CreateCityRequest): Promise<AdminCityDto> => {
        const res = await apiClient.post<AdminCityDto>(citiesBase, body);
        return res.data;
    },

    /** PUT /admin-cities/{id} */
    update: async (id: string, body: UpdateCityRequest): Promise<AdminCityDto> => {
        const res = await apiClient.put<AdminCityDto>(`${citiesBase}/${id}`, body);
        return res.data;
    },

    /** DELETE /admin-cities/{id} */
    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`${citiesBase}/${id}`);
    },
};

// ─────────────────────────────────────────────────────────────────────────────
// Hotels
// ─────────────────────────────────────────────────────────────────────────────

const hotelsBase = '/admin-hotels';

export const adminHotelsService = {
    /** GET /admin-hotels?cityId&search&page&pageSize */
    list: async (params?: { cityId?: string; search?: string; page?: number; pageSize?: number }): Promise<PaginatedAdminResponse<AdminHotelDto>> => {
        const res = await apiClient.get<PaginatedAdminResponse<AdminHotelDto>>(hotelsBase, { params });
        return res.data;
    },

    /** GET /admin-hotels/{id} */
    get: async (id: string): Promise<AdminHotelDto> => {
        const res = await apiClient.get<AdminHotelDto>(`${hotelsBase}/${id}`);
        return res.data;
    },

    /** POST /admin-hotels */
    create: async (body: CreateHotelRequest): Promise<AdminHotelDto> => {
        const res = await apiClient.post<AdminHotelDto>(hotelsBase, body);
        return res.data;
    },

    /** PUT /admin-hotels/{id} */
    update: async (id: string, body: UpdateHotelRequest): Promise<AdminHotelDto> => {
        const res = await apiClient.put<AdminHotelDto>(`${hotelsBase}/${id}`, body);
        return res.data;
    },

    /** DELETE /admin-hotels/{id} */
    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`${hotelsBase}/${id}`);
    },

    /**
     * POST /admin-hotels/{id}/images
     * Sends multipart/form-data — required for file uploads.
     */
    uploadImage: async (
        hotelId: string,
        file: File,
        caption?: string,
        sortOrder?: number,
    ): Promise<AdminImageDto> => {
        const formData = new FormData();
        formData.append('image', file);
        if (caption !== undefined && caption !== '') {
            formData.append('caption', caption);
        }
        if (sortOrder !== undefined) {
            formData.append('sortOrder', String(sortOrder));
        }
        const res = await apiClient.post<AdminImageDto>(
            `${hotelsBase}/${hotelId}/images`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } },
        );
        return res.data;
    },
};

// ─────────────────────────────────────────────────────────────────────────────
// Room Types
// ─────────────────────────────────────────────────────────────────────────────

const roomTypesBase = '/admin-room-types';

export const adminRoomTypesService = {
    /** GET /admin-room-types?search&page&pageSize */
    list: async (params?: { search?: string; page?: number; pageSize?: number }): Promise<PaginatedAdminResponse<AdminRoomTypeDto>> => {
        const res = await apiClient.get<PaginatedAdminResponse<AdminRoomTypeDto>>(roomTypesBase, { params });
        return res.data;
    },

    /** GET /admin-room-types/{id} */
    get: async (id: string): Promise<AdminRoomTypeDto> => {
        const res = await apiClient.get<AdminRoomTypeDto>(`${roomTypesBase}/${id}`);
        return res.data;
    },

    /** POST /admin-room-types */
    create: async (body: CreateRoomTypeRequest): Promise<AdminRoomTypeDto> => {
        const res = await apiClient.post<AdminRoomTypeDto>(roomTypesBase, body);
        return res.data;
    },

    /** PUT /admin-room-types/{id} */
    update: async (id: string, body: UpdateRoomTypeRequest): Promise<AdminRoomTypeDto> => {
        const res = await apiClient.put<AdminRoomTypeDto>(`${roomTypesBase}/${id}`, body);
        return res.data;
    },

    /** DELETE /admin-room-types/{id} */
    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`${roomTypesBase}/${id}`);
    },
};

// ─────────────────────────────────────────────────────────────────────────────
// Rooms
// ─────────────────────────────────────────────────────────────────────────────

const roomsBase = '/admin-rooms';

export const adminRoomsService = {
    /** GET /admin-rooms?hotelId&roomTypeId&search&page&pageSize */
    list: async (params?: { hotelId?: string; roomTypeId?: string; search?: string; page?: number; pageSize?: number }): Promise<PaginatedAdminResponse<AdminRoomDto>> => {
        const res = await apiClient.get<PaginatedAdminResponse<AdminRoomDto>>(roomsBase, { params });
        return res.data;
    },

    /** GET /admin-rooms/{id} */
    get: async (id: string): Promise<AdminRoomDto> => {
        const res = await apiClient.get<AdminRoomDto>(`${roomsBase}/${id}`);
        return res.data;
    },

    /** POST /admin-rooms */
    create: async (body: CreateRoomRequest): Promise<AdminRoomDto> => {
        const res = await apiClient.post<AdminRoomDto>(roomsBase, body);
        return res.data;
    },

    /** PUT /admin-rooms/{id} */
    update: async (id: string, body: UpdateRoomRequest): Promise<AdminRoomDto> => {
        const res = await apiClient.put<AdminRoomDto>(`${roomsBase}/${id}`, body);
        return res.data;
    },

    /** DELETE /admin-rooms/{id} */
    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`${roomsBase}/${id}`);
    },
};

// ─────────────────────────────────────────────────────────────────────────────
// Services
// ─────────────────────────────────────────────────────────────────────────────

const servicesBase = '/admin-services';

export const adminServicesService = {
    /** GET /admin-services?search&page&pageSize */
    list: async (params?: { search?: string; page?: number; pageSize?: number }): Promise<PaginatedAdminResponse<AdminServiceDto>> => {
        const res = await apiClient.get<PaginatedAdminResponse<AdminServiceDto>>(servicesBase, { params });
        return res.data;
    },

    /** GET /admin-services/{id} */
    get: async (id: string): Promise<AdminServiceDto> => {
        const res = await apiClient.get<AdminServiceDto>(`${servicesBase}/${id}`);
        return res.data;
    },

    /** POST /admin-services */
    create: async (body: CreateServiceRequest): Promise<AdminServiceDto> => {
        const res = await apiClient.post<AdminServiceDto>(servicesBase, body);
        return res.data;
    },

    /** PUT /admin-services/{id} */
    update: async (id: string, body: UpdateServiceRequest): Promise<AdminServiceDto> => {
        const res = await apiClient.put<AdminServiceDto>(`${servicesBase}/${id}`, body);
        return res.data;
    },

    /** DELETE /admin-services/{id} */
    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`${servicesBase}/${id}`);
    },
};
