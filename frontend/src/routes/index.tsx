import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { AuthLayout } from '../components/layout/AuthLayout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { PublicRoute } from '../components/auth/PublicRoute';
import { ApiDocsPage } from '../pages/ApiDocsPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ProfilePage } from '../pages/auth/ProfilePage';

export const router = createBrowserRouter([
    // ── Main app layout (with sidebar) ────────────────────────────────────────
    {
        path: '/',
        element: <AppLayout />,
        children: [
            { index: true, element: <ApiDocsPage /> },
            { path: 'api-docs', element: <ApiDocsPage /> },

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
