// ─────────────────────────────────────────────────────────────────────────────
// Admin Types — mirrors C# HotelBooking.Contracts/Admin exactly
// ─────────────────────────────────────────────────────────────────────────────

/** Generic paginated response from admin list endpoints */
export interface PaginatedAdminResponse<T> {
    items: T[];
    totalCount: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}

// ─── Cities ──────────────────────────────────────────────────────────────────

export interface AdminCityDto {
    id: string;
    name: string;
    country: string;
    postOffice: string | null;
    hotelCount: number;
    createdAtUtc: string;
    modifiedAtUtc: string | null;
}

export interface CreateCityRequest {
    name: string;
    country: string;
    postOffice?: string;
}

export interface UpdateCityRequest {
    name: string;
    country: string;
    postOffice?: string;
}

// ─── Hotels ──────────────────────────────────────────────────────────────────

export interface AdminHotelDto {
    id: string;
    cityId: string;
    cityName: string;
    name: string;
    owner: string;
    address: string;
    starRating: number;
    description: string | null;
    latitude: number | null;
    longitude: number | null;
    minPricePerNight: number;
    averageRating: number;
    reviewCount: number;
    roomTypeCount: number;
    createdAtUtc: string;
    modifiedAtUtc: string | null;
}

export interface CreateHotelRequest {
    cityId: string;
    name: string;
    owner: string;
    address: string;
    starRating: number;
    description?: string;
    latitude?: number;
    longitude?: number;
}

export interface UpdateHotelRequest {
    cityId: string;
    name: string;
    owner: string;
    address: string;
    starRating: number;
    description?: string;
    latitude?: number;
    longitude?: number;
}

export interface AdminImageDto {
    id: string;
    url: string;
    caption: string | null;
    sortOrder: number;
    entityType: string;
}

// ─── Room Types ───────────────────────────────────────────────────────────────

export interface AdminRoomTypeDto {
    id: string;
    name: string;
    description: string | null;
    hotelAssignmentCount: number;
    createdAtUtc: string;
    modifiedAtUtc: string | null;
}

export interface CreateRoomTypeRequest {
    name: string;
    description?: string;
}

export interface UpdateRoomTypeRequest {
    name: string;
    description?: string;
}

// ─── Rooms ────────────────────────────────────────────────────────────────────

export interface AdminRoomDto {
    id: string;
    hotelId: string;
    hotelName: string;
    roomTypeId: string;
    roomTypeName: string;
    pricePerNight: number;
    adultCapacity: number;
    childCapacity: number;
    maxOccupancy: number;
    description: string | null;
    roomCount: number;
    createdAtUtc: string;
    modifiedAtUtc: string | null;
}

export interface CreateRoomRequest {
    hotelId: string;
    roomTypeId: string;
    pricePerNight: number;
    adultCapacity: number;
    childCapacity: number;
    description?: string;
}

export interface UpdateRoomRequest {
    pricePerNight: number;
    adultCapacity: number;
    childCapacity: number;
    description?: string;
}

// ─── Services ─────────────────────────────────────────────────────────────────

export interface AdminServiceDto {
    id: string;
    name: string;
    description: string | null;
    hotelAssignmentCount: number;
    createdAtUtc: string;
    modifiedAtUtc: string | null;
}

export interface CreateServiceRequest {
    name: string;
    description?: string;
}

export interface UpdateServiceRequest {
    name: string;
    description?: string;
}
