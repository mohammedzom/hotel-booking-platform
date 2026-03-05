import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, ArrowRight, Home } from 'lucide-react';
import { bookingService } from '../../services/bookingService';
import type { BookingDto } from '../../types/public.types';

export function BookingSuccessPage() {
    const { bookingId } = useParams<{ bookingId: string }>();
    const navigate = useNavigate();
    const [booking, setBooking] = useState<BookingDto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!bookingId) return;
        bookingService.getBooking(bookingId)
            .then(setBooking)
            .catch(() => { /* booking details are optional on this page */ })
            .finally(() => setLoading(false));
    }, [bookingId]);

    const firstItem = booking?.items[0];

    return (
        <div className="content-wrapper" style={{ maxWidth: 640, textAlign: 'center' }}>
            <div style={{ marginBottom: 32 }}>
                <div style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: 'var(--get-bg)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px',
                }}>
                    <CheckCircle size={36} color="var(--get)" />
                </div>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: 8 }}>
                    Booking Confirmed!
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                    Your payment was processed successfully and your rooms are reserved.
                </p>
            </div>

            {!loading && booking && firstItem && (
                <div style={{
                    background: 'var(--bg-surface)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: 32,
                    textAlign: 'left',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <Calendar size={18} color="var(--text-accent)" />
                        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Booking Details</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.88rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Hotel</span>
                            <span>{firstItem.hotelName}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Check-in</span>
                            <span>{firstItem.checkIn}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Check-out</span>
                            <span>{firstItem.checkOut}</span>
                        </div>
                        <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                            <span>Total Paid</span>
                            <span style={{ color: 'var(--text-accent)' }}>
                                ${booking.totalPrice.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button
                    className="btn btn-secondary"
                    onClick={() => navigate('/')}
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                    <Home size={16} /> Back to Home
                </button>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/bookings')}
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                    My Bookings <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
}
