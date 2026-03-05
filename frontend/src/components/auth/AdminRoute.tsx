import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore, selectIsAuthenticated, selectUser } from '../../store/authStore';

/**
 * AdminRoute — wraps routes that require the "Admin" role.
 * Unauthenticated users are redirected to /auth/login.
 * Authenticated non-admin users are redirected to /.
 */
export function AdminRoute() {
    const isAuthenticated = useAuthStore(selectIsAuthenticated);
    const user = useAuthStore(selectUser);
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

    if (user?.role !== 'Admin') {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
