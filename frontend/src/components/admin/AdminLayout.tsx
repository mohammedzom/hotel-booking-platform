import { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    MapPin,
    Hotel,
    Wrench,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Shield,
} from 'lucide-react';
import { useAuthStore, selectUser } from '../../store/authStore';
import { authService } from '../../services/authService';

const NAV_ITEMS = [
    { to: '/admin/cities',   label: 'Cities',   icon: MapPin },
    { to: '/admin/hotels',   label: 'Hotels',   icon: Hotel },
    { to: '/admin/services', label: 'Services', icon: Wrench },
];

/**
 * AdminLayout — full-screen shell for the admin dashboard.
 * Includes a dedicated sidebar with admin navigation.
 */
export function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const user = useAuthStore(selectUser);

    const initials = user
        ? `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase()
        : 'A';

    async function handleLogout() {
        await authService.logout();
        navigate('/auth/login', { replace: true });
    }

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-deep)' }}>

            {/* ── Mobile overlay ───────────────────────────────────────────── */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: 'fixed', inset: 0,
                        background: 'rgba(0,0,0,0.55)', zIndex: 149,
                    }}
                />
            )}

            {/* ── Sidebar ──────────────────────────────────────────────────── */}
            <aside style={{
                width: 'var(--sidebar-width)',
                flexShrink: 0,
                height: '100vh',
                background: 'rgba(11,17,32,0.96)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRight: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                top: 0, left: 0, bottom: 0,
                zIndex: 150,
                transform: sidebarOpen ? 'translateX(0)' : undefined,
                transition: 'transform 0.25s ease',
            }}
                className="admin-sidebar"
            >
                {/* Logo */}
                <div style={{
                    padding: '20px 20px 16px',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flex: 1 }}>
                        <div style={{
                            width: 34, height: 34,
                            borderRadius: 'var(--radius-sm)',
                            background: 'linear-gradient(135deg, var(--admin-color), #7b5bf7)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 0 16px rgba(232,121,249,0.35)',
                            flexShrink: 0,
                        }}>
                            <Shield size={16} color="white" />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                                Admin Panel
                            </div>
                            <div style={{ fontSize: '0.68rem', color: 'var(--admin-color)', fontWeight: 600, letterSpacing: '0.04em' }}>
                                HOTEL BOOKING
                            </div>
                        </div>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="admin-sidebar-close"
                        style={{
                            background: 'none', border: 'none',
                            color: 'var(--text-muted)', cursor: 'pointer',
                            padding: 4, display: 'none',
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Dashboard link */}
                <div style={{ padding: '12px 12px 6px' }}>
                    <NavLink
                        to="/admin"
                        end
                        style={({ isActive }) => ({
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '9px 12px',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.85rem', fontWeight: 500,
                            textDecoration: 'none',
                            color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                            background: isActive ? 'var(--accent-light)' : 'transparent',
                            border: `1px solid ${isActive ? 'rgba(79,110,247,0.3)' : 'transparent'}`,
                            transition: 'var(--transition)',
                        })}
                        onMouseEnter={(e) => { if (!e.currentTarget.classList.contains('active')) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                        onMouseLeave={(e) => { if (!e.currentTarget.classList.contains('active')) e.currentTarget.style.background = 'transparent'; }}
                    >
                        <LayoutDashboard size={16} />
                        Dashboard
                    </NavLink>
                </div>

                {/* Section label */}
                <div style={{
                    padding: '10px 24px 6px',
                    fontSize: '0.65rem', fontWeight: 700,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                }}>
                    Management
                </div>

                {/* Nav items */}
                <nav style={{ flex: 1, padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
                    {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            style={({ isActive }) => ({
                                display: 'flex', alignItems: 'center', gap: 10,
                                padding: '9px 12px',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.85rem', fontWeight: 500,
                                textDecoration: 'none',
                                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                                background: isActive ? 'var(--accent-light)' : 'transparent',
                                border: `1px solid ${isActive ? 'rgba(79,110,247,0.3)' : 'transparent'}`,
                                transition: 'var(--transition)',
                            })}
                            onMouseEnter={(e) => { if (!e.currentTarget.classList.contains('active')) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                            onMouseLeave={(e) => { if (!e.currentTarget.classList.contains('active')) e.currentTarget.style.background = 'transparent'; }}
                        >
                            <Icon size={16} />
                            {label}
                            <ChevronRight size={13} style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />
                        </NavLink>
                    ))}
                </nav>

                {/* User footer */}
                <div style={{
                    borderTop: '1px solid var(--border)',
                    padding: '14px 16px',
                    display: 'flex', alignItems: 'center', gap: 10,
                }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--admin-color), #7b5bf7)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.65rem', fontWeight: 700, color: 'white', flexShrink: 0,
                    }}>
                        {initials}
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user?.firstName} {user?.lastName}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--admin-color)', fontWeight: 600 }}>Administrator</div>
                    </div>
                    <button
                        onClick={handleLogout}
                        title="Sign Out"
                        style={{
                            background: 'none', border: 'none',
                            color: 'var(--text-muted)', cursor: 'pointer',
                            padding: 4, display: 'flex', alignItems: 'center',
                            transition: 'var(--transition)',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--delete)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                    >
                        <LogOut size={16} />
                    </button>
                </div>
            </aside>

            {/* ── Main area ────────────────────────────────────────────────── */}
            <div style={{
                flex: 1,
                display: 'flex', flexDirection: 'column',
                marginLeft: 'var(--sidebar-width)',
                overflow: 'hidden',
            }}
                className="admin-main"
            >
                {/* Mobile topbar */}
                <header style={{
                    height: 'var(--topbar-height)',
                    background: 'rgba(13,20,37,0.85)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderBottom: '1px solid var(--border)',
                    display: 'none',
                    alignItems: 'center',
                    padding: '0 16px',
                    gap: 12,
                    position: 'sticky', top: 0, zIndex: 100,
                }}
                    className="admin-topbar"
                >
                    <button
                        onClick={() => setSidebarOpen(true)}
                        style={{
                            background: 'none', border: 'none',
                            color: 'var(--text-secondary)', cursor: 'pointer', padding: 4,
                        }}
                    >
                        <Menu size={20} />
                    </button>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Admin Panel</span>
                </header>

                {/* Page content */}
                <main style={{ flex: 1, overflowY: 'auto', padding: '32px 36px' }} className="admin-content">
                    <Outlet />
                </main>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .admin-sidebar {
                        transform: translateX(-100%);
                    }
                    .admin-sidebar-close {
                        display: flex !important;
                    }
                    .admin-main {
                        margin-left: 0 !important;
                    }
                    .admin-topbar {
                        display: flex !important;
                    }
                    .admin-content {
                        padding: 20px 16px !important;
                    }
                }
                .admin-sidebar[style*="translateX(0)"] {
                    transform: translateX(0) !important;
                }
            `}</style>
        </div>
    );
}
