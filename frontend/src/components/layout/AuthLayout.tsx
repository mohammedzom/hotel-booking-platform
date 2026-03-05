import { Hotel } from 'lucide-react';
import { Outlet, Link } from 'react-router-dom';

/**
 * AuthLayout — full-screen centered layout for Login / Register pages.
 * No sidebar. Uses glassmorphism card on a deep gradient background.
 */
export function AuthLayout() {
    return (
        <div className="auth-page">
            {/* Ambient background orbs */}
            <div className="auth-page__orb auth-page__orb--1" />
            <div className="auth-page__orb auth-page__orb--2" />

            <div className="auth-container">
                {/* Logo */}
                <Link to="/" className="auth-logo">
                    <div className="auth-logo__icon">
                        <Hotel size={22} color="white" />
                    </div>
                    <span className="auth-logo__text">
                        Hotel<span>Booking</span>
                    </span>
                </Link>

                {/* Card with page content */}
                <div className="auth-card">
                    <Outlet />
                </div>

                {/* Footer */}
                <p className="auth-footer">
                    © 2025 HotelBooking Platform. All rights reserved.
                </p>
            </div>
        </div>
    );
}
