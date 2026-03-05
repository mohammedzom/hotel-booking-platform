import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Eye, EyeOff, User, Phone, AlertCircle, UserPlus } from 'lucide-react';
import { authService } from '../../services/authService';

interface FormState {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phoneNumber: string;
}

interface FormErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

export function RegisterPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState<FormState>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [serverError, setServerError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // ── Validation ──────────────────────────────────────────────────────────────
    function validate(): boolean {
        const newErrors: FormErrors = {};

        if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
        else if (form.firstName.trim().length < 2) newErrors.firstName = 'At least 2 characters';

        if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
        else if (form.lastName.trim().length < 2) newErrors.lastName = 'At least 2 characters';

        if (!form.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = 'Enter a valid email address';
        }

        if (!form.password) {
            newErrors.password = 'Password is required';
        } else if (form.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (!form.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
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
            await authService.register({
                email: form.email.trim(),
                password: form.password,
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                phoneNumber: form.phoneNumber.trim() || undefined,
            });
            navigate('/', { replace: true });
        } catch (err: unknown) {
            const axiosErr = err as { response?: { status?: number; data?: { title?: string; detail?: string } } };
            const status = axiosErr?.response?.status;

            if (status === 409) {
                setServerError('An account with this email already exists.');
            } else if (status === 429) {
                setServerError('Too many requests. Please wait a moment.');
            } else {
                setServerError(
                    axiosErr?.response?.data?.detail ??
                    axiosErr?.response?.data?.title ??
                    'Registration failed. Please try again.'
                );
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <h1 className="auth-card__title">Create account</h1>
            <p className="auth-card__subtitle">Join HotelBooking and start exploring</p>

            {serverError && (
                <div className="form-server-error" role="alert">
                    <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '1px' }} />
                    {serverError}
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate>

                {/* First & Last Name (2-col grid) */}
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="reg-firstName" className="form-label">First name</label>
                        <div className="form-input-wrap">
                            <input
                                id="reg-firstName"
                                name="firstName"
                                type="text"
                                autoComplete="given-name"
                                className={`form-input has-icon ${errors.firstName ? 'error' : ''}`}
                                placeholder="John"
                                value={form.firstName}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            <span className="form-input-icon" style={{ pointerEvents: 'none' }}>
                                <User size={14} />
                            </span>
                        </div>
                        {errors.firstName && (
                            <span className="form-error"><AlertCircle size={12} />{errors.firstName}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="reg-lastName" className="form-label">Last name</label>
                        <div className="form-input-wrap">
                            <input
                                id="reg-lastName"
                                name="lastName"
                                type="text"
                                autoComplete="family-name"
                                className={`form-input has-icon ${errors.lastName ? 'error' : ''}`}
                                placeholder="Doe"
                                value={form.lastName}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            <span className="form-input-icon" style={{ pointerEvents: 'none' }}>
                                <User size={14} />
                            </span>
                        </div>
                        {errors.lastName && (
                            <span className="form-error"><AlertCircle size={12} />{errors.lastName}</span>
                        )}
                    </div>
                </div>

                {/* Email */}
                <div className="form-group">
                    <label htmlFor="reg-email" className="form-label">Email address</label>
                    <div className="form-input-wrap">
                        <input
                            id="reg-email"
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
                        <span className="form-error"><AlertCircle size={12} />{errors.email}</span>
                    )}
                </div>

                {/* Phone (optional) */}
                <div className="form-group">
                    <label htmlFor="reg-phone" className="form-label">
                        Phone number <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
                    </label>
                    <div className="form-input-wrap">
                        <input
                            id="reg-phone"
                            name="phoneNumber"
                            type="tel"
                            autoComplete="tel"
                            className="form-input has-icon"
                            placeholder="+1 555 000 0000"
                            value={form.phoneNumber}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        <span className="form-input-icon" style={{ pointerEvents: 'none' }}>
                            <Phone size={15} />
                        </span>
                    </div>
                </div>

                {/* Password */}
                <div className="form-group">
                    <label htmlFor="reg-password" className="form-label">Password</label>
                    <div className="form-input-wrap">
                        <input
                            id="reg-password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            className={`form-input has-icon ${errors.password ? 'error' : ''}`}
                            placeholder="Min. 8 characters"
                            value={form.password}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        <button type="button" className="form-input-icon"
                            onClick={() => setShowPassword((p) => !p)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                    </div>
                    {errors.password && (
                        <span className="form-error"><AlertCircle size={12} />{errors.password}</span>
                    )}
                </div>

                {/* Confirm Password */}
                <div className="form-group">
                    <label htmlFor="reg-confirm" className="form-label">Confirm password</label>
                    <div className="form-input-wrap">
                        <input
                            id="reg-confirm"
                            name="confirmPassword"
                            type={showConfirm ? 'text' : 'password'}
                            autoComplete="new-password"
                            className={`form-input has-icon ${errors.confirmPassword ? 'error' : ''}`}
                            placeholder="Repeat your password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        <button type="button" className="form-input-icon"
                            onClick={() => setShowConfirm((p) => !p)}
                            aria-label={showConfirm ? 'Hide' : 'Show'}
                        >
                            {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <span className="form-error"><AlertCircle size={12} />{errors.confirmPassword}</span>
                    )}
                </div>

                {/* Submit */}
                <div style={{ marginTop: '24px' }}>
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        {isLoading ? (
                            <><span className="btn-spinner" />Creating account…</>
                        ) : (
                            <><UserPlus size={16} />Create Account</>
                        )}
                    </button>
                </div>
            </form>

            <div className="auth-switch">
                Already have an account?
                <Link to="/auth/login">Sign in</Link>
            </div>
        </>
    );
}
