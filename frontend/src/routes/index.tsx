import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { AuthLayout } from '../components/layout/AuthLayout';
import { AdminLayout } from '../components/admin/AdminLayout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { PublicRoute } from '../components/auth/PublicRoute';
import { AdminRoute } from '../components/auth/AdminRoute';
import { ApiDocsPage } from '../pages/ApiDocsPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ProfilePage } from '../pages/auth/ProfilePage';
import { HomePage } from '../pages/public/HomePage';
import { SearchPage } from '../pages/public/SearchPage';
import { HotelDetailsPage } from '../pages/public/HotelDetailsPage';
import { CartPage } from '../pages/protected/CartPage';
import { CheckoutPage } from '../pages/protected/CheckoutPage';
import { MyBookingsPage } from '../pages/protected/MyBookingsPage';
import { BookingSuccessPage } from '../pages/protected/BookingSuccessPage';
import { BookingCancelPage } from '../pages/protected/BookingCancelPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminCitiesPage } from '../pages/admin/AdminCitiesPage';
import { AdminHotelsPage } from '../pages/admin/AdminHotelsPage';
import { AdminServicesPage } from '../pages/admin/AdminServicesPage';

export const router = createBrowserRouter([
    // ── Main app layout (with sidebar) ────────────────────────────────────────
    {
        path: '/',
        element: <AppLayout />,
        children: [
            { index: true, element: <HomePage /> },
            { path: 'api-docs', element: <ApiDocsPage /> },
            { path: 'search', element: <SearchPage /> },
            { path: 'hotels/:id', element: <HotelDetailsPage /> },

            // Protected routes — require auth
            {
                element: <ProtectedRoute />,
                children: [
                    { path: 'profile', element: <ProfilePage /> },
                    { path: 'cart', element: <CartPage /> },
                    { path: 'checkout', element: <CheckoutPage /> },
                    { path: 'bookings', element: <MyBookingsPage /> },
                    { path: 'booking/:bookingId/success', element: <BookingSuccessPage /> },
                    { path: 'booking/:bookingId/cancel', element: <BookingCancelPage /> },
                ],
            },
        ],
    },

    // ── Admin layout — requires Admin role ────────────────────────────────────
    {
        path: '/admin',
        element: <AdminLayout />,
        children: [
            {
                element: <AdminRoute />,
                children: [
                    { index: true, element: <AdminDashboardPage /> },
                    { path: 'cities',   element: <AdminCitiesPage /> },
                    { path: 'hotels',   element: <AdminHotelsPage /> },
                    { path: 'services', element: <AdminServicesPage /> },
                ],
            },
        ],
    },

    // ── Auth layout (no sidebar, centered card) ────────────────────────────────
    {
        path: '/auth',
        element: <AuthLayout />,
        children: [
            // Public routes — redirect away if already logged in
            {
                element: <PublicRoute />,
                children: [
                    { path: 'login', element: <LoginPage /> },
                    { path: 'register', element: <RegisterPage /> },
                ],
            },
        ],
    },
]);
