import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { AuthLayout } from '../components/layout/AuthLayout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { PublicRoute } from '../components/auth/PublicRoute';
import { ApiDocsPage } from '../pages/ApiDocsPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ProfilePage } from '../pages/auth/ProfilePage';
import { HomePage } from '../pages/public/HomePage';
import { SearchPage } from '../pages/public/SearchPage';
import { HotelDetailsPage } from '../pages/public/HotelDetailsPage';

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
