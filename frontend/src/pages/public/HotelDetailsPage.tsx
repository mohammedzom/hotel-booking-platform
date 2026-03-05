import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, CalendarDays, ChevronRight, Check } from 'lucide-react';
import { hotelService } from '../../services/hotelService';
import type { HotelDetailsDto, ImageDto, RoomAvailabilityDto } from '../../types/public.types';

export function HotelDetailsPage() {
    const { id } = useParams<{ id: string }>();

    const [hotel, setHotel] = useState<HotelDetailsDto | null>(null);
    const [gallery, setGallery] = useState<ImageDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Booking states
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const [checkIn, setCheckIn] = useState(today);
    const [checkOut, setCheckOut] = useState(tomorrow);
    const [checkingRooms, setCheckingRooms] = useState(false);
    const [availableRooms, setAvailableRooms] = useState<RoomAvailabilityDto[] | null>(null);
    const [bookingError, setBookingError] = useState('');

    useEffect(() => {
        async function loadHotel() {
            if (!id) return;
            try {
                setLoading(true);

                const [detailsData, galleryData] = await Promise.all([
                    hotelService.getHotelDetails(id),
                    hotelService.getHotelGallery(id).catch(() => ({ images: [] })), // Graceful failure for gallery
                    hotelService.trackHotelView(id).catch(console.error), // Fire & forget tracking
                ]);

                setHotel(detailsData);
                setGallery(galleryData.images);
            } catch (err) {
                console.error('Failed to load hotel details', err);
                setError('Could not load hotel information. Please try again.');
            } finally {
                setLoading(false);
            }
        }
        loadHotel();
    }, [id]);

    async function handleCheckAvailability(e: React.FormEvent) {
        e.preventDefault();
        if (!id || !checkIn || !checkOut) return;

        setCheckingRooms(true);
        setBookingError('');
        setAvailableRooms(null);

        try {
            const data = await hotelService.checkRoomAvailability(id, checkIn, checkOut);
            setAvailableRooms(data.roomTypes);
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { detail?: string; title?: string } } };
            setBookingError(
                axiosErr.response?.data?.detail ??
                axiosErr.response?.data?.title ??
                'Failed to check availability.'
            );
        } finally {
            setCheckingRooms(false);
        }
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
                <span className="btn-spinner" style={{ borderTopColor: 'var(--accent)', width: 40, height: 40 }} />
            </div>
        );
    }

    if (error || !hotel) {
        return (
            <div className="content-wrapper">
                <div className="form-server-error">{error || 'Hotel not found'}</div>
                <Link to="/" className="btn btn-ghost" style={{ width: 'auto' }}>Return Home</Link>
            </div>
        );
    }

    const mainImage = gallery.find((i) => i.sortOrder === 1) || gallery[0];
    const secondaryImages = gallery.filter((i) => i.id !== mainImage?.id).slice(0, 2);

    return (
        <div className="content-wrapper hotel-details">

            {/* Breadcrumbs */}
            <div className="hotel-details__breadcrumbs">
                <Link to="/">Home</Link>
                <ChevronRight size={14} />
                <Link to={`/search?city=${hotel.cityName}`}>{hotel.cityName}</Link>
                <ChevronRight size={14} />
                <span style={{ color: 'var(--text-primary)' }}>{hotel.name}</span>
            </div>

            {/* Header */}
            <div className="hotel-details__hero">
                <div className="hotel-details__title-row">
                    <div>
                        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>
                            {hotel.name}
                        </h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-secondary)' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#fbbf24', fontWeight: 600 }}>
                                {hotel.starRating} <Star size={14} fill="currentColor" />
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <MapPin size={16} />
                                {hotel.address}, {hotel.cityName}, {hotel.country}
                            </span>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-accent)' }}>
                            {hotel.averageRating.toFixed(1)} / 5
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {hotel.reviewCount} reviews
                        </div>
                    </div>
                </div>
            </div>

            {/* Gallery Grid */}
            {gallery.length > 0 ? (
                <div className="gallery-grid">
                    <div
                        className="gallery-grid__main"
                        style={{ backgroundImage: `url(${mainImage.url})` }}
                    />
                    {secondaryImages.map((img) => (
                        <div
                            key={img.id}
                            className="gallery-grid__side"
                            style={{ backgroundImage: `url(${img.url})` }}
                        />
                    ))}
                    {/* If there's only 1 image, standard grid breaks a bit, but CSS handles it gracefully by leaving the right col empty */}
                </div>
            ) : hotel.thumbnailUrl ? (
                <div style={{ height: 400, borderRadius: 'var(--radius-xl)', overflow: 'hidden', background: `url(${hotel.thumbnailUrl}) center/cover` }} />
            ) : null}

            {/* 2-Column Layout */}
            <div className="hotel-details__layout">

                <div className="hotel-details__main">
                    {/* Description */}
                    <section>
                        <h2>About this hotel</h2>
                        <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: 20 }}>
                            {hotel.description || 'Welcome to our beautiful hotel located in the heart of the city.'}
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: '0.9rem' }}>
                            <div><strong>Check-in:</strong> After {hotel.checkInTime}</div>
                            <div><strong>Check-out:</strong> Before {hotel.checkOutTime}</div>
                            <div><strong>Owner:</strong> {hotel.owner}</div>
                        </div>
                    </section>

                    {/* Amenities */}
                    {hotel.amenities && hotel.amenities.length > 0 && (
                        <section>
                            <h2>Amenities</h2>
                            <div className="amenities-list">
                                {hotel.amenities.map((amenity, idx) => (
                                    <span key={idx} className="amenity-tag">
                                        <Check size={14} color="var(--get)" />
                                        {amenity}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Room Types Listing (Static) */}
                    {hotel.roomTypes && hotel.roomTypes.length > 0 && (
                        <section>
                            <h2>Accommodations</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {hotel.roomTypes.map((rt) => (
                                    <div key={rt.hotelRoomTypeId} style={{ padding: 16, border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                            <strong style={{ fontSize: '1.05rem' }}>{rt.roomTypeName}</strong>
                                            <span style={{ color: 'var(--text-accent)', fontWeight: 600 }}>${rt.pricePerNight} / night</span>
                                        </div>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 12 }}>{rt.description}</p>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: 16 }}>
                                            <span>Adults: {rt.adultCapacity}</span>
                                            <span>Children: {rt.childCapacity}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Sidebar / Booking Card */}
                <div>
                    <form className="booking-card" onSubmit={handleCheckAvailability}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <CalendarDays size={20} style={{ color: 'var(--text-accent)' }} />
                            Check Availability
                        </h3>

                        <div className="form-group">
                            <label className="form-label">Check-in</label>
                            <input
                                type="date"
                                min={today}
                                value={checkIn}
                                onChange={(e) => setCheckIn(e.target.value)}
                                className="form-input date-picker"
                                required
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: 24 }}>
                            <label className="form-label">Check-out</label>
                            <input
                                type="date"
                                min={checkIn || tomorrow}
                                value={checkOut}
                                onChange={(e) => setCheckOut(e.target.value)}
                                className="form-input date-picker"
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={checkingRooms}>
                            {checkingRooms ? (
                                <><span className="btn-spinner" /> Checking...</>
                            ) : (
                                'Check Rooms'
                            )}
                        </button>

                        {bookingError && (
                            <div className="form-server-error" style={{ marginTop: 20 }}>
                                {bookingError}
                            </div>
                        )}

                        {/* Availability Results */}
                        {availableRooms && (
                            <div className="availability-results">
                                <hr style={{ border: 'none', borderTop: '1px dashed var(--border)', margin: '4px 0 12px' }} />
                                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Available Rooms</h4>

                                {availableRooms.length === 0 ? (
                                    <div style={{ color: 'var(--delete)', fontSize: '0.85rem', marginTop: 8 }}>
                                        No rooms available for these dates.
                                    </div>
                                ) : (
                                    availableRooms.map((rt) => (
                                        <div key={rt.hotelRoomTypeId} className="room-type-card">
                                            <div className="room-type-card__head">
                                                <span className="room-type-card__name">{rt.roomTypeName}</span>
                                                <span className="room-type-card__price">${rt.pricePerNight}</span>
                                            </div>
                                            <div className="room-type-card__meta">
                                                <span>{rt.adultCapacity} Adults, {rt.childCapacity} Children</span>
                                                {rt.availableRooms > 0 ? (
                                                    <span className="room-type-card__available">
                                                        {rt.availableRooms} left
                                                    </span>
                                                ) : (
                                                    <span style={{ color: 'var(--delete)' }}>Sold Out</span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </form>
                </div>

            </div>
        </div>
    );
}
