import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Eye, EyeOff, AlertCircle, LogIn } from 'lucide-react';
import { authService } from '../../services/authService';

interface FormState {
    email: string;
    password: string;
}

interface FormErrors {
    email?: string;
    password?: string;
}

export function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/';

    const [form, setForm] = useState<FormState>({ email: '', password: '' });
    const [errors, setErrors] = useState<FormErrors>({});
    const [serverError, setServerError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // ── Validation ──────────────────────────────────────────────────────────────
    function validate(): boolean {
        const newErrors: FormErrors = {};

        if (!form.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = 'Enter a valid email address';
        }

        if (!form.password) {
            newErrors.password = 'Password is required';
        } else if (form.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        // Clear field error on change
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
        if (serverError) setServerError('');
    }

    // ── Submit ──────────────────────────────────────────────────────────────────
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);
        setServerError('');

        try {
            await authService.login({ email: form.email, password: form.password });
            navigate(from, { replace: true });
        } catch (err: unknown) {
            const axiosErr = err as { response?: { status?: number; data?: { title?: string; detail?: string } } };
            const status = axiosErr?.response?.status;

            if (status === 401) {
                setServerError('Invalid email or password. Please try again.');
            } else if (status === 429) {
                setServerError('Too many login attempts. Please wait a moment.');
            } else {
                setServerError(
                    axiosErr?.response?.data?.detail ??
                    axiosErr?.response?.data?.title ??
                    'Something went wrong. Please try again.'
                );
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <h1 className="auth-card__title">Welcome back</h1>
            <p className="auth-card__subtitle">Sign in to your HotelBooking account</p>

            {serverError && (
                <div className="form-server-error" role="alert">
                    <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '1px' }} />
                    {serverError}
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate>

                {/* Email */}
                <div className="form-group">
                    <label htmlFor="login-email" className="form-label">
                        Email address
                    </label>
                    <div className="form-input-wrap">
                        <input
                            id="login-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            className={`form-input has-icon ${errors.email ? 'error' : ''}`}
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        <span className="form-input-icon" style={{ pointerEvents: 'none' }}>
                            <Mail size={15} />
                        </span>
                    </div>
                    {errors.email && (
                        <span className="form-error">
                            <AlertCircle size={12} />
                            {errors.email}
                        </span>
                    )}
                </div>

                {/* Password */}
                <div className="form-group">
                    <label htmlFor="login-password" className="form-label">
                        Password
                    </label>
                    <div className="form-input-wrap">
                        <input
                            id="login-password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            className={`form-input has-icon ${errors.password ? 'error' : ''}`}
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            className="form-input-icon"
                            onClick={() => setShowPassword((p) => !p)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                    </div>
                    {errors.password && (
                        <span className="form-error">
                            <AlertCircle size={12} />
                            {errors.password}
                        </span>
                    )}
                </div>

                {/* Submit */}
                <div style={{ marginTop: '24px' }}>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="btn-spinner" />
                                Signing in…
                            </>
                        ) : (
                            <>
                                <LogIn size={16} />
                                Sign In
                            </>
                        )}
                    </button>
                </div>
            </form>

            <div className="auth-switch">
                Don't have an account?
                <Link to="/auth/register">Create one</Link>
            </div>
        </>
    );
}
