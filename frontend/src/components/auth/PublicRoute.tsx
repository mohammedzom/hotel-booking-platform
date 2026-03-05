import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore, selectIsAuthenticated } from '../../store/authStore';

/**
 * PublicRoute — wraps routes that should NOT be accessible when logged in
 * (login, register). Already-authenticated users are sent to the home page.
 */
export function PublicRoute() {
    const isAuthenticated = useAuthStore(selectIsAuthenticated);

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
