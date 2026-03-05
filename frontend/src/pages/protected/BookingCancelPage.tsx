import { useNavigate } from 'react-router-dom';
import { XCircle, Home, ShoppingCart } from 'lucide-react';

export function BookingCancelPage() {
    const navigate = useNavigate();

    return (
        <div className="content-wrapper" style={{ maxWidth: 520, textAlign: 'center' }}>
            <div style={{ marginBottom: 32 }}>
                <div style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: 'var(--delete-bg)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px',
                }}>
                    <XCircle size={36} color="var(--delete)" />
                </div>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: 8 }}>
                    Payment Cancelled
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                    Your payment was not completed. Your rooms have not been charged.
                    You can return to your cart and try again.
                </p>
            </div>

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
                    onClick={() => navigate('/cart')}
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                    <ShoppingCart size={16} /> Return to Cart
                </button>
            </div>
        </div>
    );
}
