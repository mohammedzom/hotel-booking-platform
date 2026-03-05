export interface FeaturedDealDto {
    dealId: string;
    hotelId: string;
    hotelName: string;
    cityName: string;
    starRating: number;
    thumbnailUrl: string | null;
    originalPrice: number;
    discountedPrice: number;
    discountPercentage: number;
}

export interface FeaturedDealsResponse {
    deals: FeaturedDealDto[];
}

export interface TrendingCityDto {
    cityId: string;
    name: string;
    country: string;
    hotelCount: number;
    visitCount: number;
}

export interface TrendingCitiesResponse {
    cities: TrendingCityDto[];
}

export interface SearchHotelsRequest {
    city?: string;
    checkIn?: string; // e.g., "YYYY-MM-DD"
    checkOut?: string;
    adults?: number;
    children?: number;
    numberOfRooms?: number;
    minPrice?: number;
    maxPrice?: number;
    minStarRating?: number;
    amenities?: string[];
    sortBy?: string;
    cursor?: string;
    limit?: number;
}

export interface SearchHotelDto {
    hotelId: string;
    name: string;
    starRating: number;
    description: string | null;
    cityName: string;
    country: string;
    averageRating: number;
    reviewCount: number;
    thumbnailUrl: string | null;
    minPricePerNight: number;
    amenities: string[];
}

export interface SearchHotelsResponse {
    items: SearchHotelDto[];
    nextCursor: string | null;
    hasMore: boolean;
    limit: number;
}

export interface HotelRoomTypeDto {
    hotelRoomTypeId: string;
    roomTypeName: string;
    description: string | null;
    pricePerNight: number;
    adultCapacity: number;
    childCapacity: number;
}

export interface HotelDetailsDto {
    id: string;
    name: string;
    description: string | null;
    starRating: number;
    owner: string;
    address: string;
    latitude: number | null;
    longitude: number | null;
    checkInTime: string;
    checkOutTime: string;
    cityName: string;
    country: string;
    averageRating: number;
    reviewCount: number;
    thumbnailUrl: string | null;
    amenities: string[];
    roomTypes: HotelRoomTypeDto[];
}

export interface ImageDto {
    id: string;
    url: string;
    caption: string | null;
    sortOrder: number;
    entityType: string;
}

export interface HotelGalleryResponse {
    hotelId: string;
    images: ImageDto[];
}

export interface RoomAvailabilityDto {
    hotelRoomTypeId: string;
    roomTypeName: string;
    pricePerNight: number;
    adultCapacity: number;
    childCapacity: number;
    totalRooms: number;
    bookedRooms: number;
    heldRooms: number;
    availableRooms: number;
}

export interface RoomAvailabilityResponse {
    hotelId: string;
    checkIn: string;   // DateOnly maps to string in frontend (YYYY-MM-DD)
    checkOut: string;
    roomTypes: RoomAvailabilityDto[];
}
