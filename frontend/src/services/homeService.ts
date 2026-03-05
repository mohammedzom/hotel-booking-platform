import { apiClient } from '../lib/apiClient';
import type { FeaturedDealsResponse, TrendingCitiesResponse } from '../types/public.types';

export const homeService = {
    getFeaturedDeals: async (): Promise<FeaturedDealsResponse> => {
        // Matches: [HttpGet("featured-deals")]
        const res = await apiClient.get<FeaturedDealsResponse>('/home/featured-deals');
        return res.data;
    },

    getTrendingCities: async (): Promise<TrendingCitiesResponse> => {
        // Matches: [HttpGet("trending-cities")]
        const res = await apiClient.get<TrendingCitiesResponse>('/home/trending-cities');
        return res.data;
    },
};
