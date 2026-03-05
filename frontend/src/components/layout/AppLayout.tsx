import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, X, Hotel } from 'lucide-react';
import { Sidebar } from './Sidebar';

export function AppLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="app-shell">
            {/* Top Bar */}
            <header className="topbar">
                <div className="topbar__logo">
                    {/* Mobile menu toggle */}
                    <button
                        onClick={() => setSidebarOpen((p) => !p)}
                        style={{
                            background: 'none', border: 'none', color: 'var(--text-secondary)',
                            cursor: 'pointer', padding: '4px', display: 'none',
                        }}
                        className="mobile-menu-btn"
                        aria-label="Toggle sidebar"
                    >
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    <div className="topbar__logo-icon">
                        <Hotel size={18} color="white" />
                    </div>
                    <span className="topbar__logo-text">
                        HotelBooking <span>API</span>
                    </span>
                </div>

                <div className="topbar__meta">
                    <span className="topbar__api-base">api.hotelbooking.com</span>
                    <span className="topbar__version">v1.0</span>
                </div>
            </header>

            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} />

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: 'fixed', inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        zIndex: 49,
                        display: 'none',
                    }}
                    className="mobile-overlay"
                />
            )}

            {/* Main */}
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}
