import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore, selectIsAuthenticated } from '../../store/authStore';

/**
 * ProtectedRoute — wraps routes that require authentication.
 * Unauthenticated users are redirected to /auth/login,
 * with the intended URL saved so they can be returned after login.
 */
export function ProtectedRoute() {
    const isAuthenticated = useAuthStore(selectIsAuthenticated);
    const location = useLocation();

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/auth/login"
                replace
                state={{ from: location }}
            />
        );
    }

    return <Outlet />;
}
