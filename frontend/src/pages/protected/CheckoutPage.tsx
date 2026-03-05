import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Clock, ShieldCheck, AlertTriangle } from 'lucide-react';
import { checkoutService } from '../../services/checkoutService';
import { useCartStore, selectCart } from '../../store/cartStore';

export function CheckoutPage() {
    const navigate = useNavigate();
    const cart = useCartStore(selectCart);
    const { clearCart } = useCartStore();

    const [holdId, setHoldId] = useState<string | null>(null);
    const [holdExpiry, setHoldExpiry] = useState<string | null>(null);
    const [specialRequests, setSpecialRequests] = useState('');

    const [holding, setHolding] = useState(false);
    const [holdError, setHoldError] = useState('');

    const [booking, setBooking] = useState(false);
    const [bookError, setBookError] = useState('');

    // On mount — create a hold to lock the rooms
    useEffect(() => {
        if (!cart || cart.items.length === 0) {
            navigate('/cart', { replace: true });
            return;
        }

        async function createHold() {
            setHolding(true);
            setHoldError('');
            try {
                const res = await checkoutService.hold();
                setHoldId(res.holdId);
                setHoldExpiry(res.expiresAt);
            } catch (err: unknown) {
                const axiosErr = err as { response?: { data?: { detail?: string; title?: string } } };
                setHoldError(
                    axiosErr.response?.data?.detail ??
                    axiosErr.response?.data?.title ??
                    'Failed to reserve rooms. Please go back and try again.'
                );
            } finally {
                setHolding(false);
            }
        }
        createHold();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function handleConfirmAndPay() {
        if (!holdId) return;
        setBooking(true);
        setBookError('');
        try {
            const res = await checkoutService.book({
                holdId,
                specialRequests: specialRequests.trim() || undefined,
            });
            clearCart();
            // Redirect to Stripe
            window.location.href = res.paymentUrl;
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { detail?: string; title?: string } } };
            setBookError(
                axiosErr.response?.data?.detail ??
                axiosErr.response?.data?.title ??
                'Failed to complete booking. Please try again.'
            );
            setBooking(false);
        }
    }

    const items = cart?.items ?? [];

    const formatExpiry = (iso: string) => {
        try {
            return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch {
            return iso;
        }
    };

    return (
        <div className="content-wrapper" style={{ maxWidth: 860 }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                <div style={{
                    width: 44, height: 44, borderRadius: 'var(--radius-md)',
                    background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <CreditCard size={20} color="var(--text-accent)" />
                </div>
                <div>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Checkout</h1>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 2 }}>
                        Review your booking and confirm payment.
                    </p>
                </div>
            </div>

            {/* Hold status banner */}
            {holding && (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px',
                    background: 'var(--post-bg)', border: '1px solid rgba(79,110,247,0.3)',
                    borderRadius: 'var(--radius-md)', marginBottom: 24, fontSize: '0.85rem', color: 'var(--text-accent)',
                }}>
                    <span className="btn-spinner" style={{ borderTopColor: 'var(--accent)', width: 16, height: 16, flexShrink: 0 }} />
                    Reserving your rooms&hellip;
                </div>
            )}

            {holdExpiry && !holding && (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px',
                    background: 'var(--get-bg)', border: '1px solid rgba(16,185,129,0.3)',
                    borderRadius: 'var(--radius-md)', marginBottom: 24, fontSize: '0.85rem', color: 'var(--get)',
                }}>
                    <Clock size={16} style={{ flexShrink: 0 }} />
                    Rooms reserved! Complete payment by <strong style={{ marginLeft: 4 }}>{formatExpiry(holdExpiry)}</strong>
                </div>
            )}

            {holdError && (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px',
                    background: 'var(--delete-bg)', border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: 'var(--radius-md)', marginBottom: 24, fontSize: '0.85rem', color: 'var(--delete)',
                }}>
                    <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                    {holdError}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>
                {/* Order details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{
                        background: 'var(--bg-surface)', border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-lg)', padding: '20px 24px',
                    }}>
                        <h3 style={{ fontWeight: 600, marginBottom: 16, fontSize: '0.95rem' }}>Booking Details</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    style={{
                                        padding: '14px 16px',
                                        background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)',
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                        <strong style={{ fontSize: '0.92rem' }}>{item.roomTypeName}</strong>
                                        <span style={{ color: 'var(--text-accent)', fontWeight: 600 }}>
                                            ${item.totalPrice.toFixed(2)}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        {item.hotelName} &bull; {item.checkIn} → {item.checkOut} &bull; {item.nights} nights &bull; {item.quantity} room(s)
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Special requests */}
                    <div style={{
                        background: 'var(--bg-surface)', border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-lg)', padding: '20px 24px',
                    }}>
                        <h3 style={{ fontWeight: 600, marginBottom: 12, fontSize: '0.95rem' }}>Special Requests</h3>
                        <textarea
                            value={specialRequests}
                            onChange={(e) => setSpecialRequests(e.target.value)}
                            placeholder="Any special requests? (optional)"
                            rows={3}
                            className="form-input"
                            style={{ resize: 'vertical', fontFamily: 'inherit' }}
                        />
                    </div>
                </div>

                {/* Payment summary */}
                <div style={{
                    background: 'var(--bg-surface)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)', padding: '24px', position: 'sticky', top: 80,
                }}>
                    <h3 style={{ fontWeight: 700, marginBottom: 20, fontSize: '1rem' }}>Payment Summary</h3>

                    {items.map((item) => (
                        <div key={item.id} style={{
                            display: 'flex', justifyContent: 'space-between',
                            fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 10,
                        }}>
                            <span style={{ flex: 1, marginRight: 8 }}>{item.roomTypeName} ×{item.quantity}</span>
                            <span style={{ fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                                ${item.totalPrice.toFixed(2)}
                            </span>
                        </div>
                    ))}

                    <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '16px 0' }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.05rem', marginBottom: 24 }}>
                        <span>Total</span>
                        <span style={{ color: 'var(--text-accent)' }}>
                            ${(cart?.totalPrice ?? 0).toFixed(2)}
                        </span>
                    </div>

                    {bookError && (
                        <div className="form-server-error" style={{ marginBottom: 16, fontSize: '0.82rem' }}>
                            {bookError}
                        </div>
                    )}

                    <button
                        className="btn btn-primary"
                        onClick={handleConfirmAndPay}
                        disabled={holding || !holdId || booking}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                    >
                        {booking ? (
                            <><span className="btn-spinner" /> Processing&hellip;</>
                        ) : (
                            <><ShieldCheck size={16} /> Confirm &amp; Pay</>
                        )}
                    </button>

                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 12 }}>
                        You will be redirected to Stripe for secure payment.
                    </p>
                </div>
            </div>
        </div>
    );
}
