import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';

interface HotelCardProps {
    id: string;
    name: string;
    cityName: string;
    starRating: number;
    price: number;
    originalPrice?: number;
    thumbnailUrl?: string | null;
    discountPercentage?: number;
}

export function HotelCard({
    id,
    name,
    cityName,
    starRating,
    price,
    originalPrice,
    thumbnailUrl,
    discountPercentage
}: HotelCardProps) {

    // Fallback gradient if no thumbnail is available
    const bgStyle = thumbnailUrl
        ? { backgroundImage: `url(${thumbnailUrl})` }
        : { background: 'linear-gradient(135deg, var(--bg-surface), var(--bg-hover))' };

    return (
        <Link to={`/hotels/${id}`} className="hotel-card">
            <div className="hotel-card__image" style={bgStyle}>
                {/* Deal badge overlay */}
                {discountPercentage && discountPercentage > 0 && (
                    <div className="hotel-card__badge">
                        -{discountPercentage}%
                    </div>
                )}
            </div>

            <div className="hotel-card__content">
                <div className="hotel-card__header">
                    <h3 className="hotel-card__title" title={name}>{name}</h3>
                    <div className="hotel-card__stars">
                        {starRating} <Star size={12} fill="currentColor" />
                    </div>
                </div>

                <div className="hotel-card__location">
                    <MapPin size={14} />
                    {cityName}
                </div>

                <div className="hotel-card__footer">
                    <div className="hotel-card__price-box">
                        <span className="hotel-card__price-label">Starting from</span>
                        <div className="hotel-card__price-row">
                            <span className="hotel-card__price">${price.toFixed(2)}</span>
                            {originalPrice && originalPrice > price && (
                                <span className="hotel-card__price-original">${originalPrice.toFixed(2)}</span>
                            )}
                        </div>
                        <span className="hotel-card__price-period">per night</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
