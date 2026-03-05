import { apiClient } from '../lib/apiClient';
import type { SearchHotelsRequest, SearchHotelsResponse } from '../types/public.types';

export const searchService = {
    searchHotels: async (params: SearchHotelsRequest): Promise<SearchHotelsResponse> => {
        // Clean up empty params before sending
        const cleanedParams = Object.fromEntries(
            Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
        );

        // Matches: [HttpGet] in SearchController
        const res = await apiClient.get<SearchHotelsResponse>('/search/hotels', {
            params: cleanedParams,
        });
        return res.data;
    },
};
