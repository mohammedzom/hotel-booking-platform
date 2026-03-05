import { useEffect, useState } from 'react';
import { MapPin, Hotel, Wrench, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminCitiesService, adminHotelsService, adminServicesService } from '../../services/adminService';
import { useAuthStore, selectUser } from '../../store/authStore';

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: number | null;
    to: string;
    color: string;
    bg: string;
}

function StatCard({ icon, label, value, to, color, bg }: StatCardProps) {
    return (
        <Link
            to={to}
            style={{ textDecoration: 'none' }}
        >
            <div
                style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    transition: 'var(--transition)',
                    cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = color;
                    (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-elevated)';
                }}
                onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
                    (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-surface)';
                }}
            >
                <div style={{
                    width: 48, height: 48,
                    borderRadius: 'var(--radius-md)',
                    background: bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                }}>
                    {icon}
                </div>
                <div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
                        {value === null ? (
                            <span className="btn-spinner" style={{ borderTopColor: color, width: 22, height: 22, display: 'inline-block' }} />
                        ) : value.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4 }}>{label}</div>
                </div>
            </div>
        </Link>
    );
}

export function AdminDashboardPage() {
    const user = useAuthStore(selectUser);
    const [citiesCount, setCitiesCount] = useState<number | null>(null);
    const [hotelsCount, setHotelsCount] = useState<number | null>(null);
    const [servicesCount, setServicesCount] = useState<number | null>(null);

    useEffect(() => {
        adminCitiesService.list({ pageSize: 1 }).then((r) => setCitiesCount(r.totalCount)).catch(() => setCitiesCount(0));
        adminHotelsService.list({ pageSize: 1 }).then((r) => setHotelsCount(r.totalCount)).catch(() => setHotelsCount(0));
        adminServicesService.list({ pageSize: 1 }).then((r) => setServicesCount(r.totalCount)).catch(() => setServicesCount(0));
    }, []);

    return (
        <div>
            {/* Welcome */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(79,110,247,0.12), rgba(232,121,249,0.08))',
                border: '1px solid rgba(79,110,247,0.2)',
                borderRadius: 'var(--radius-xl)',
                padding: '28px 32px',
                marginBottom: 32,
                display: 'flex',
                alignItems: 'center',
                gap: 20,
            }}>
                <div style={{
                    width: 56, height: 56,
                    borderRadius: 'var(--radius-md)',
                    background: 'linear-gradient(135deg, var(--admin-color), #7b5bf7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 24px rgba(232,121,249,0.3)',
                    flexShrink: 0,
                }}>
                    <Shield size={24} color="white" />
                </div>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 4px' }}>
                        Welcome back, {user?.firstName} 👋
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
                        Manage your hotel platform from this admin dashboard.
                    </p>
                </div>
            </div>

            {/* Stats */}
            <h2 style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>
                Overview
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 36 }}>
                <StatCard
                    icon={<MapPin size={22} color="var(--text-accent)" />}
                    label="Total Cities"
                    value={citiesCount}
                    to="/admin/cities"
                    color="var(--accent)"
                    bg="var(--accent-light)"
                />
                <StatCard
                    icon={<Hotel size={22} color="var(--text-accent)" />}
                    label="Total Hotels"
                    value={hotelsCount}
                    to="/admin/hotels"
                    color="var(--accent)"
                    bg="var(--accent-light)"
                />
                <StatCard
                    icon={<Wrench size={22} color="var(--put)" />}
                    label="Total Services"
                    value={servicesCount}
                    to="/admin/services"
                    color="var(--put)"
                    bg="var(--put-bg)"
                />
            </div>

            {/* Quick Links */}
            <h2 style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>
                Quick Access
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
                {[
                    { to: '/admin/cities',   label: 'Manage Cities',   icon: <MapPin size={16} />,   desc: 'Add, edit, or remove cities' },
                    { to: '/admin/hotels',   label: 'Manage Hotels',   icon: <Hotel size={16} />,    desc: 'Hotels, rooms & images' },
                    { to: '/admin/services', label: 'Manage Services', icon: <Wrench size={16} />,   desc: 'Amenities & extra services' },
                ].map(({ to, label, icon, desc }) => (
                    <Link
                        key={to}
                        to={to}
                        style={{
                            textDecoration: 'none',
                            background: 'var(--bg-surface)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '18px 20px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 8,
                            transition: 'var(--transition)',
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--accent)';
                            (e.currentTarget as HTMLAnchorElement).style.background = 'var(--bg-elevated)';
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border)';
                            (e.currentTarget as HTMLAnchorElement).style.background = 'var(--bg-surface)';
                        }}
                    >
                        <div style={{ color: 'var(--text-accent)', display: 'flex', alignItems: 'center', gap: 6 }}>
                            {icon}
                            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</span>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>{desc}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
