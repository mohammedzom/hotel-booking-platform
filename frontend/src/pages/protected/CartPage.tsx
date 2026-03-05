import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, PackageOpen } from 'lucide-react';
import { cartService } from '../../services/cartService';
import { useCartStore, selectCart, selectCartLoading } from '../../store/cartStore';

export function CartPage() {
    const navigate = useNavigate();
    const cart = useCartStore(selectCart);
    const isLoading = useCartStore(selectCartLoading);
    const { setCart, setLoading, clearCart } = useCartStore();

    const [removingId, setRemovingId] = useState<string | null>(null);
    const [clearingCart, setClearingCart] = useState(false);
    const [error, setError] = useState('');

    // Sync cart from the server when the page mounts
    useEffect(() => {
        async function fetchCart() {
            setLoading(true);
            setError('');
            try {
                const data = await cartService.getCart();
                setCart(data);
            } catch (err: unknown) {
                const axiosErr = err as { response?: { data?: { detail?: string; title?: string } } };
                setError(
                    axiosErr.response?.data?.detail ??
                    axiosErr.response?.data?.title ??
                    'Failed to load cart.'
                );
            } finally {
                setLoading(false);
            }
        }
        fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function handleUpdateQuantity(itemId: string, delta: number, currentQty: number) {
        const newQty = currentQty + delta;
        if (newQty < 1) return handleRemoveItem(itemId);
        setError('');
        try {
            const updated = await cartService.updateItem(itemId, { quantity: newQty });
            setCart(updated);
        } catch {
            setError('Failed to update item.');
        }
    }

    async function handleRemoveItem(itemId: string) {
        setRemovingId(itemId);
        setError('');
        try {
            const updated = await cartService.removeItem(itemId);
            setCart(updated);
        } catch {
            setError('Failed to remove item.');
        } finally {
            setRemovingId(null);
        }
    }

    async function handleClearCart() {
        setClearingCart(true);
        setError('');
        try {
            await cartService.clearCart();
            clearCart();
        } catch {
            setError('Failed to clear cart.');
        } finally {
            setClearingCart(false);
        }
    }

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
                <span className="btn-spinner" style={{ borderTopColor: 'var(--accent)', width: 40, height: 40 }} />
            </div>
        );
    }

    const items = cart?.items ?? [];

    return (
        <div className="content-wrapper" style={{ maxWidth: 900 }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                        width: 44, height: 44, borderRadius: 'var(--radius-md)',
                        background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <ShoppingCart size={20} color="var(--text-accent)" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Your Cart</h1>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 2 }}>
                            {items.length} {items.length === 1 ? 'item' : 'items'}
                        </p>
                    </div>
                </div>

                {items.length > 0 && (
                    <button
                        onClick={handleClearCart}
                        disabled={clearingCart}
                        className="btn btn-ghost"
                        style={{ display: 'flex', alignItems: 'center', gap: 6, width: 'auto', padding: '6px 14px' }}
                    >
                        {clearingCart ? <span className="btn-spinner" /> : <Trash2 size={14} />}
                        Clear Cart
                    </button>
                )}
            </div>

            {error && <div className="form-server-error" style={{ marginBottom: 20 }}>{error}</div>}

            {items.length === 0 ? (
                /* Empty state */
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    padding: '80px 24px', gap: 20, textAlign: 'center',
                    background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)',
                    border: '1px solid var(--border)',
                }}>
                    <PackageOpen size={56} color="var(--text-muted)" strokeWidth={1.2} />
                    <div>
                        <h2 style={{ fontWeight: 600, marginBottom: 8 }}>Your cart is empty</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            Browse hotels and add rooms to get started.
                        </p>
                    </div>
                    <Link to="/search" className="btn btn-primary" style={{ width: 'auto', padding: '10px 28px' }}>
                        Find Hotels
                    </Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>
                    {/* Items list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {items.map((item) => (
                            <div
                                key={item.id}
                                style={{
                                    background: 'var(--bg-surface)', border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-lg)', padding: '20px 24px',
                                    display: 'flex', flexDirection: 'column', gap: 14,
                                    transition: 'var(--transition)',
                                    opacity: removingId === item.id ? 0.5 : 1,
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: 4 }}>
                                            {item.roomTypeName}
                                        </div>
                                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                                            {item.hotelName}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveItem(item.id)}
                                        disabled={removingId === item.id}
                                        style={{
                                            background: 'none', border: 'none', cursor: 'pointer',
                                            color: 'var(--text-muted)', padding: 4,
                                            borderRadius: 'var(--radius-sm)', transition: 'var(--transition)',
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--delete)')}
                                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                                        aria-label="Remove item"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div style={{ display: 'flex', gap: 20, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                                    <span><strong>Check-in:</strong> {item.checkIn}</span>
                                    <span><strong>Check-out:</strong> {item.checkOut}</span>
                                    <span><strong>{item.nights}</strong> nights</span>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    {/* Quantity controls */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                                        <button
                                            onClick={() => handleUpdateQuantity(item.id, -1, item.quantity)}
                                            style={{
                                                width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                                                borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)',
                                                cursor: 'pointer', color: 'var(--text-secondary)', transition: 'var(--transition)',
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
                                            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                                        >
                                            <Minus size={12} />
                                        </button>
                                        <span style={{
                                            width: 36, textAlign: 'center', fontSize: '0.85rem', fontWeight: 600,
                                            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                                            borderLeft: 'none', borderRight: 'none', padding: '4px 0',
                                        }}>
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => handleUpdateQuantity(item.id, 1, item.quantity)}
                                            style={{
                                                width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                                                borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                                                cursor: 'pointer', color: 'var(--text-secondary)', transition: 'var(--transition)',
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
                                            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                                        >
                                            <Plus size={12} />
                                        </button>
                                    </div>

                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            ${item.pricePerNight} × {item.nights} nights × {item.quantity}
                                        </div>
                                        <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-accent)' }}>
                                            ${item.totalPrice.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary card */}
                    <div style={{
                        background: 'var(--bg-surface)', border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-lg)', padding: '24px', position: 'sticky', top: 80,
                    }}>
                        <h3 style={{ fontWeight: 700, marginBottom: 20, fontSize: '1rem' }}>Order Summary</h3>

                        {items.map((item) => (
                            <div key={item.id} style={{
                                display: 'flex', justifyContent: 'space-between',
                                fontSize: '0.82rem', color: 'var(--text-secondary)',
                                marginBottom: 10,
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
                            <span style={{ color: 'var(--text-accent)' }}>${(cart?.totalPrice ?? 0).toFixed(2)}</span>
                        </div>

                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/checkout')}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                        >
                            Proceed to Checkout
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
