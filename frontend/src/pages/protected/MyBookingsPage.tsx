import { useEffect, useState } from 'react';
import { BookOpen, XCircle, CheckCircle2, Clock, Ban } from 'lucide-react';
import { bookingService } from '../../services/bookingService';
import type { BookingDto, BookingStatus } from '../../types/public.types';

function StatusBadge({ status }: { status: BookingStatus }) {
    const map: Record<BookingStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
        Pending:   { label: 'Pending',   color: 'var(--put)',    bg: 'var(--put-bg)',    icon: <Clock size={12} /> },
        Confirmed: { label: 'Confirmed', color: 'var(--get)',    bg: 'var(--get-bg)',    icon: <CheckCircle2 size={12} /> },
        Cancelled: { label: 'Cancelled', color: 'var(--delete)', bg: 'var(--delete-bg)', icon: <Ban size={12} /> },
        Completed: { label: 'Completed', color: 'var(--patch)',  bg: 'var(--patch-bg)',  icon: <CheckCircle2 size={12} /> },
    };
    const { label, color, bg, icon } = map[status] ?? map.Pending;
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '3px 10px', borderRadius: 20,
            background: bg, color, fontSize: '0.75rem', fontWeight: 600,
        }}>
            {icon}{label}
        </span>
    );
}

export function MyBookingsPage() {
    const [bookings, setBookings] = useState<BookingDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const [cancelError, setCancelError] = useState('');

    useEffect(() => {
        async function fetchBookings() {
            setLoading(true);
            setError('');
            try {
                const data = await bookingService.getBookings();
                setBookings(data);
            } catch (err: unknown) {
                const axiosErr = err as { response?: { data?: { detail?: string; title?: string } } };
                setError(
                    axiosErr.response?.data?.detail ??
                    axiosErr.response?.data?.title ??
                    'Failed to load bookings.'
                );
            } finally {
                setLoading(false);
            }
        }
        fetchBookings();
    }, []);

    async function handleCancel(id: string) {
        setCancellingId(id);
        setCancelError('');
        try {
            const updated = await bookingService.cancelBooking(id);
            setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { detail?: string; title?: string } } };
            setCancelError(
                axiosErr.response?.data?.detail ??
                axiosErr.response?.data?.title ??
                'Failed to cancel booking.'
            );
        } finally {
            setCancellingId(null);
        }
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
                <span className="btn-spinner" style={{ borderTopColor: 'var(--accent)', width: 40, height: 40 }} />
            </div>
        );
    }

    return (
        <div className="content-wrapper" style={{ maxWidth: 860 }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                <div style={{
                    width: 44, height: 44, borderRadius: 'var(--radius-md)',
                    background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <BookOpen size={20} color="var(--text-accent)" />
                </div>
                <div>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>My Bookings</h1>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 2 }}>
                        {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'} found
                    </p>
                </div>
            </div>

            {error && <div className="form-server-error" style={{ marginBottom: 20 }}>{error}</div>}
            {cancelError && <div className="form-server-error" style={{ marginBottom: 20 }}>{cancelError}</div>}

            {bookings.length === 0 && !error ? (
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    padding: '80px 24px', gap: 20, textAlign: 'center',
                    background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)',
                    border: '1px solid var(--border)',
                }}>
                    <BookOpen size={56} color="var(--text-muted)" strokeWidth={1.2} />
                    <div>
                        <h2 style={{ fontWeight: 600, marginBottom: 8 }}>No bookings yet</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            Your confirmed bookings will appear here.
                        </p>
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {bookings.map((booking) => (
                        <div
                            key={booking.id}
                            style={{
                                background: 'var(--bg-surface)', border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-lg)', padding: '20px 24px',
                                opacity: cancellingId === booking.id ? 0.6 : 1,
                                transition: 'var(--transition)',
                            }}
                        >
                            {/* Booking header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                                <div>
                                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                                        Booking #{booking.id.slice(0, 8).toUpperCase()}
                                    </div>
                                    <StatusBadge status={booking.status} />
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-accent)' }}>
                                        ${booking.totalPrice.toFixed(2)}
                                    </div>
                                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                                        {new Date(booking.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            {/* Items */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                                {booking.items.map((item) => (
                                    <div
                                        key={item.id}
                                        style={{
                                            background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)',
                                            padding: '12px 16px',
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                            <strong style={{ fontSize: '0.9rem' }}>{item.roomTypeName}</strong>
                                            <span style={{ fontWeight: 600, color: 'var(--text-accent)', fontSize: '0.9rem' }}>
                                                ${item.totalPrice.toFixed(2)}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                            {item.hotelName} &bull; {item.checkIn} → {item.checkOut} &bull; {item.nights} nights &bull; {item.quantity} room(s)
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {booking.specialRequests && (
                                <div style={{
                                    fontSize: '0.8rem', color: 'var(--text-secondary)',
                                    padding: '8px 14px', background: 'var(--bg-elevated)',
                                    borderRadius: 'var(--radius-sm)', marginBottom: 16,
                                }}>
                                    <strong>Special requests:</strong> {booking.specialRequests}
                                </div>
                            )}

                            {/* Cancel button — only for Pending or Confirmed */}
                            {(booking.status === 'Pending' || booking.status === 'Confirmed') && (
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <button
                                        onClick={() => handleCancel(booking.id)}
                                        disabled={cancellingId === booking.id}
                                        className="btn btn-ghost"
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 6,
                                            width: 'auto', padding: '6px 16px',
                                            color: 'var(--delete)', borderColor: 'rgba(239,68,68,0.3)',
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--delete-bg)')}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                                    >
                                        {cancellingId === booking.id
                                            ? <><span className="btn-spinner" /> Cancelling&hellip;</>
                                            : <><XCircle size={14} /> Cancel Booking</>
                                        }
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
