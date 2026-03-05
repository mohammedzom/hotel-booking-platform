import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Hotel, LogIn, LogOut, UserCircle2, ChevronDown, ShoppingCart, BookOpen } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { useAuthStore, selectIsAuthenticated, selectUser } from '../../store/authStore';
import { useCartStore, selectCartCount } from '../../store/cartStore';
import { authService } from '../../services/authService';

export function AppLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const isAuthenticated = useAuthStore(selectIsAuthenticated);
    const user = useAuthStore(selectUser);
    const cartCount = useCartStore(selectCartCount);

    const initials = user
        ? `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase()
        : '';

    async function handleLogout() {
        setUserMenuOpen(false);
        await authService.logout();
        navigate('/auth/login', { replace: true });
    }

    return (
        <div className="app-shell">
            {/* ── Top Bar ───────────────────────────────────────── */}
            <header className="topbar">
                <div className="topbar__logo">
                    <button
                        onClick={() => setSidebarOpen((p) => !p)}
                        style={{
                            background: 'none', border: 'none', color: 'var(--text-secondary)',
                            cursor: 'pointer', padding: '4px',
                        }}
                        className="mobile-menu-btn"
                        aria-label="Toggle sidebar"
                    >
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                        <div className="topbar__logo-icon">
                            <Hotel size={18} color="white" />
                        </div>
                        <span className="topbar__logo-text">
                            HotelBooking <span>API</span>
                        </span>
                    </Link>
                </div>

                <div className="topbar__meta">
                    <span className="topbar__api-base">api.hotelbooking.com</span>
                    <span className="topbar__version">v1.0</span>

                    {/* ── Cart icon (authenticated only) ──────────────────── */}
                    {isAuthenticated && (
                        <Link
                            to="/cart"
                            aria-label="Shopping cart"
                            style={{
                                position: 'relative', display: 'flex', alignItems: 'center',
                                color: 'var(--text-secondary)', padding: '4px 6px',
                                borderRadius: 'var(--radius-sm)', transition: 'var(--transition)',
                                textDecoration: 'none',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                        >
                            <ShoppingCart size={20} />
                            {cartCount > 0 && (
                                <span style={{
                                    position: 'absolute', top: -4, right: -4,
                                    minWidth: 18, height: 18, borderRadius: 9,
                                    background: 'var(--accent)', color: 'white',
                                    fontSize: '0.65rem', fontWeight: 700,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    padding: '0 4px',
                                }}>
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </Link>
                    )}

                    {/* ── User Menu / Sign In ─────────────────────────── */}
                    {isAuthenticated && user ? (
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => setUserMenuOpen((p) => !p)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    background: 'var(--bg-surface)', border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-md)', padding: '5px 12px 5px 6px',
                                    cursor: 'pointer', color: 'var(--text-primary)', transition: 'var(--transition)',
                                    fontFamily: 'Inter, sans-serif',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
                                aria-expanded={userMenuOpen}
                            >
                                <span style={{
                                    width: 28, height: 28, borderRadius: '50%',
                                    background: 'linear-gradient(135deg, var(--accent), #7b5bf7)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '0.65rem', fontWeight: 700, color: 'white', flexShrink: 0,
                                }}>
                                    {initials}
                                </span>
                                <span style={{ fontSize: '0.82rem', fontWeight: 500 }}>{user.firstName}</span>
                                <ChevronDown
                                    size={13}
                                    style={{
                                        color: 'var(--text-muted)',
                                        transform: userMenuOpen ? 'rotate(180deg)' : 'none',
                                        transition: 'transform 0.2s ease',
                                    }}
                                />
                            </button>

                            {/* Dropdown */}
                            {userMenuOpen && (
                                <>
                                    <div style={{ position: 'fixed', inset: 0, zIndex: 198 }}
                                        onClick={() => setUserMenuOpen(false)} />
                                    <div style={{
                                        position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                                        background: 'var(--bg-surface)', border: '1px solid var(--border)',
                                        borderRadius: 'var(--radius-md)', padding: '6px',
                                        minWidth: 200, zIndex: 199,
                                        boxShadow: 'var(--shadow-md)',
                                        animation: 'cardIn 0.15s ease both',
                                    }}>
                                        <div style={{
                                            padding: '8px 12px 10px',
                                            borderBottom: '1px solid var(--border)', marginBottom: 4,
                                        }}>
                                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                                {user.firstName} {user.lastName}
                                            </div>
                                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                                                {user.email}
                                            </div>
                                        </div>

                                        <Link
                                            to="/profile"
                                            onClick={() => setUserMenuOpen(false)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: 8,
                                                padding: '8px 12px', borderRadius: 'var(--radius-sm)',
                                                fontSize: '0.82rem', color: 'var(--text-secondary)',
                                                textDecoration: 'none', transition: 'var(--transition)',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'var(--bg-elevated)';
                                                e.currentTarget.style.color = 'var(--text-primary)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'none';
                                                e.currentTarget.style.color = 'var(--text-secondary)';
                                            }}
                                        >
                                            <UserCircle2 size={14} /> My Profile
                                        </Link>

                                        <Link
                                            to="/bookings"
                                            onClick={() => setUserMenuOpen(false)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: 8,
                                                padding: '8px 12px', borderRadius: 'var(--radius-sm)',
                                                fontSize: '0.82rem', color: 'var(--text-secondary)',
                                                textDecoration: 'none', transition: 'var(--transition)',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'var(--bg-elevated)';
                                                e.currentTarget.style.color = 'var(--text-primary)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'none';
                                                e.currentTarget.style.color = 'var(--text-secondary)';
                                            }}
                                        >
                                            <BookOpen size={14} /> My Bookings
                                        </Link>

                                        <button
                                            onClick={handleLogout}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: 8,
                                                padding: '8px 12px', borderRadius: 'var(--radius-sm)',
                                                fontSize: '0.82rem', color: 'var(--delete)',
                                                background: 'none', border: 'none', cursor: 'pointer',
                                                width: '100%', textAlign: 'left', transition: 'var(--transition)',
                                                fontFamily: 'Inter, sans-serif',
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--delete-bg)')}
                                            onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                                        >
                                            <LogOut size={14} /> Sign Out
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <Link
                            to="/auth/login"
                            style={{
                                display: 'flex', alignItems: 'center', gap: 6,
                                background: 'var(--accent-light)', border: '1px solid rgba(79,110,247,0.3)',
                                borderRadius: 'var(--radius-md)', padding: '5px 14px',
                                fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-accent)',
                                textDecoration: 'none', transition: 'var(--transition)',
                            }}
                        >
                            <LogIn size={14} /> Sign In
                        </Link>
                    )}
                </div>
            </header>

            {/* Sidebar (Only on API Docs) */}
            {location.pathname === '/api-docs' && <Sidebar isOpen={sidebarOpen} />}

            {/* Mobile overlay */}
            {sidebarOpen && location.pathname === '/api-docs' && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 49 }}
                />
            )}


            {/* Main */}
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}

