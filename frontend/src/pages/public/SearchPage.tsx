import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';
import { SearchBar } from '../../components/public/SearchBar';
import { HotelCard } from '../../components/public/HotelCard';
import { searchService } from '../../services/searchService';
import type { SearchHotelDto } from '../../types/public.types';

export function SearchPage() {
    const [searchParams] = useSearchParams();

    const city = searchParams.get('city');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const adults = searchParams.get('adults');

    const [results, setResults] = useState<SearchHotelDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        async function performSearch() {
            // Don't search if we have absolutely no params (or maybe we do want to show all?)
            setLoading(true);
            setError('');

            try {
                const data = await searchService.searchHotels({
                    city: city || undefined,
                    checkIn: checkIn || undefined,
                    checkOut: checkOut || undefined,
                    adults: adults ? parseInt(adults, 10) : undefined,
                    limit: 20, // arbitrary default limit
                });
                setResults(data.items);
            } catch (err) {
                console.error('Search failed', err);
                setError('Failed to fetch search results. Please try again.');
                setResults([]);
            } finally {
                setLoading(false);
            }
        }

        performSearch();
    }, [city, checkIn, checkOut, adults]);

    return (
        <div className="content-wrapper">
            <div style={{ marginBottom: '40px' }}>
                <SearchBar />
            </div>

            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
                    {city ? (
                        <>
                            <MapPin size={24} style={{ color: 'var(--text-accent)' }} />
                            Hotels in {city}
                        </>
                    ) : (
                        <>
                            <Search size={24} style={{ color: 'var(--text-accent)' }} />
                            Search Results
                        </>
                    )}
                </h1>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>
                    {loading
                        ? 'Searching...'
                        : `${results.length} ${results.length === 1 ? 'property' : 'properties'} found`}
                    {checkIn && checkOut && ` for ${new Date(checkIn).toLocaleDateString()} – ${new Date(checkOut).toLocaleDateString()}`}
                </p>
            </div>

            {error && (
                <div className="form-server-error" style={{ marginBottom: '24px' }}>
                    {error}
                </div>
            )}

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
                    <span className="btn-spinner" style={{ borderTopColor: 'var(--accent)', width: 32, height: 32 }} />
                </div>
            ) : results.length > 0 ? (
                <div className="hotel-grid">
                    {results.map((hotel) => (
                        <HotelCard
                            key={hotel.hotelId}
                            id={hotel.hotelId}
                            name={hotel.name}
                            cityName={hotel.cityName}
                            starRating={hotel.starRating}
                            price={hotel.minPricePerNight}
                            thumbnailUrl={hotel.thumbnailUrl}
                        />
                    ))}
                </div>
            ) : (
                !error && (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                        <Search size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--text-primary)' }}>
                            No results found
                        </h3>
                        <p>Try adjusting your search criteria or dates.</p>
                    </div>
                )
            )}
        </div>
    );
}
