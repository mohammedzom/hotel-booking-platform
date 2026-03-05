import { useEffect, useState } from 'react';
import { SearchBar } from '../../components/public/SearchBar';
import { HotelCard } from '../../components/public/HotelCard';
import { homeService } from '../../services/homeService';
import type { FeaturedDealDto, TrendingCityDto } from '../../types/public.types';
import { Map, Zap } from 'lucide-react';

export function HomePage() {
    const [trending, setTrending] = useState<TrendingCityDto[]>([]);
    const [deals, setDeals] = useState<FeaturedDealDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const [citiesData, dealsData] = await Promise.all([
                    homeService.getTrendingCities(),
                    homeService.getFeaturedDeals(),
                ]);
                setTrending(citiesData.cities);
                setDeals(dealsData.deals);
            } catch (error) {
                console.error('Failed to load home data', error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    return (
        <div className="content-wrapper">
            {/* Hero */}
            <section className="hero-section">
                <h1 className="hero-title">
                    Find your next <span>perfect stay</span>
                </h1>
                <p className="hero-subtitle">
                    Discover exclusive deals on premium hotels, resorts, and vacation rentals worldwide.
                    Book directly and save.
                </p>
                <SearchBar />
            </section>

            {/* Loading state */}
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                    <span className="btn-spinner" style={{ borderTopColor: 'var(--accent)', width: 32, height: 32 }} />
                </div>
            ) : (
                <>
                    {/* Trending Cities */}
                    {trending.length > 0 && (
                        <section style={{ marginBottom: 60 }}>
                            <h2 className="section-title">
                                <Map size={22} style={{ color: 'var(--text-accent)' }} />
                                Trending Destinations
                            </h2>
                            <div className="cities-slider">
                                {trending.map((city) => (
                                    <div key={city.cityId} className="city-card">
                                        <div className="city-card__icon">
                                            <Map size={20} />
                                        </div>
                                        <div className="city-card__name">{city.name}</div>
                                        <div className="city-card__meta">
                                            {city.hotelCount} properties
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Featured Deals */}
                    {deals.length > 0 && (
                        <section>
                            <h2 className="section-title">
                                <Zap size={22} style={{ color: '#fbbf24' }} />
                                Featured Deals
                            </h2>
                            <div className="hotel-grid">
                                {deals.map((deal) => (
                                    <HotelCard
                                        key={deal.dealId}
                                        id={deal.hotelId}
                                        name={deal.hotelName}
                                        cityName={deal.cityName}
                                        starRating={deal.starRating}
                                        price={deal.discountedPrice}
                                        originalPrice={deal.originalPrice}
                                        discountPercentage={deal.discountPercentage}
                                        thumbnailUrl={deal.thumbnailUrl}
                                    />
                                ))}
                            </div>
                        </section>
                    )}
                </>
            )}
        </div>
    );
}
