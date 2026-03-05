import { useEffect, useState } from 'react';
import { UserCircle2, Mail, Phone, Calendar, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { authService } from '../../services/authService';
import { useAuthStore, selectUser } from '../../store/authStore';
import type { ProfileResponse } from '../../types/auth.types';

interface EditState {
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

interface EditErrors {
    firstName?: string;
    lastName?: string;
}

export function ProfilePage() {
    const user = useAuthStore(selectUser);

    const [profile, setProfile] = useState<ProfileResponse | null>(null);
    const [isFetching, setIsFetching] = useState(true);
    const [fetchError, setFetchError] = useState('');

    const [edit, setEdit] = useState<EditState>({
        firstName: user?.firstName ?? '',
        lastName: user?.lastName ?? '',
        phoneNumber: '',
    });
    const [editErrors, setEditErrors] = useState<EditErrors>({});
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saveError, setSaveError] = useState('');

    // ── Fetch full profile on mount ─────────────────────────────────────────────
    useEffect(() => {
        async function fetchProfile() {
            try {
                const data = await authService.getProfile();
                setProfile(data);
                setEdit({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phoneNumber: data.phoneNumber ?? '',
                });
            } catch {
                setFetchError('Could not load your profile. Please refresh.');
            } finally {
                setIsFetching(false);
            }
        }
        fetchProfile();
    }, []);

    // ── Validate ────────────────────────────────────────────────────────────────
    function validateEdit(): boolean {
        const newErrors: EditErrors = {};
        if (!edit.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!edit.lastName.trim()) newErrors.lastName = 'Last name is required';
        setEditErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function handleEditChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setEdit((prev) => ({ ...prev, [name]: value }));
        if (editErrors[name as keyof EditErrors]) {
            setEditErrors((prev) => ({ ...prev, [name]: undefined }));
        }
        setSaveSuccess(false);
        setSaveError('');
    }

    // ── Save ────────────────────────────────────────────────────────────────────
    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        if (!validateEdit()) return;

        setIsSaving(true);
        setSaveError('');
        setSaveSuccess(false);

        try {
            const updated = await authService.updateProfile({
                firstName: edit.firstName.trim(),
                lastName: edit.lastName.trim(),
                phoneNumber: edit.phoneNumber.trim() || undefined,
            });
            setProfile(updated);
            setSaveSuccess(true);
        } catch {
            setSaveError('Failed to update profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    }

    // ── Render helpers ─────────────────────────────────────────────────────────
    const displayName = profile
        ? `${profile.firstName} ${profile.lastName}`
        : user
            ? `${user.firstName} ${user.lastName}`
            : '';

    const initials = displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const displayEmail = profile?.email ?? user?.email ?? '';
    const displayRole = profile?.role ?? user?.role ?? '';

    function fmt(iso: string) {
        return new Date(iso).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
        });
    }

    if (isFetching) {
        return (
            <div className="profile-page" style={{ display: 'flex', justifyContent: 'center', paddingTop: '80px' }}>
                <span className="btn-spinner" style={{ borderTopColor: 'var(--accent)', width: 28, height: 28 }} />
            </div>
        );
    }

    if (fetchError) {
        return (
            <div className="profile-page">
                <div className="form-server-error">
                    <AlertCircle size={16} />
                    {fetchError}
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            {/* Header card */}
            <div className="profile-header">
                <div className="profile-avatar">{initials}</div>
                <div className="profile-header__info">
                    <div className="profile-header__name">{displayName}</div>
                    <div className="profile-header__email">
                        <Mail size={13} style={{ display: 'inline', marginRight: 4 }} />
                        {displayEmail}
                    </div>
                    {displayRole && (
                        <span className="profile-role-badge">{displayRole}</span>
                    )}
                </div>
            </div>

            {/* Edit form */}
            <div className="profile-card">
                <div className="profile-card__title">
                    <UserCircle2 size={18} style={{ color: 'var(--text-accent)' }} />
                    Personal Information
                </div>

                {saveSuccess && (
                    <div className="form-success">
                        <CheckCircle2 size={15} />
                        Profile updated successfully!
                    </div>
                )}

                {saveError && (
                    <div className="form-server-error">
                        <AlertCircle size={15} />
                        {saveError}
                    </div>
                )}

                <form onSubmit={handleSave} noValidate>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="profile-firstName" className="form-label">First name</label>
                            <input
                                id="profile-firstName"
                                name="firstName"
                                type="text"
                                className={`form-input ${editErrors.firstName ? 'error' : ''}`}
                                value={edit.firstName}
                                onChange={handleEditChange}
                                disabled={isSaving}
                            />
                            {editErrors.firstName && (
                                <span className="form-error"><AlertCircle size={12} />{editErrors.firstName}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="profile-lastName" className="form-label">Last name</label>
                            <input
                                id="profile-lastName"
                                name="lastName"
                                type="text"
                                className={`form-input ${editErrors.lastName ? 'error' : ''}`}
                                value={edit.lastName}
                                onChange={handleEditChange}
                                disabled={isSaving}
                            />
                            {editErrors.lastName && (
                                <span className="form-error"><AlertCircle size={12} />{editErrors.lastName}</span>
                            )}
                        </div>
                    </div>

                    {/* Email (read-only) */}
                    <div className="form-group">
                        <label className="form-label">
                            Email address <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(cannot be changed)</span>
                        </label>
                        <div className="form-input-wrap">
                            <input
                                type="email"
                                className="form-input has-icon"
                                value={displayEmail}
                                readOnly
                                style={{ opacity: 0.5, cursor: 'default' }}
                            />
                            <span className="form-input-icon" style={{ pointerEvents: 'none' }}>
                                <Mail size={15} />
                            </span>
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="form-group">
                        <label htmlFor="profile-phone" className="form-label">
                            Phone number <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
                        </label>
                        <div className="form-input-wrap">
                            <input
                                id="profile-phone"
                                name="phoneNumber"
                                type="tel"
                                className="form-input has-icon"
                                placeholder="+1 555 000 0000"
                                value={edit.phoneNumber}
                                onChange={handleEditChange}
                                disabled={isSaving}
                            />
                            <span className="form-input-icon" style={{ pointerEvents: 'none' }}>
                                <Phone size={15} />
                            </span>
                        </div>
                    </div>

                    {/* Member since */}
                    {profile?.createdAt && (
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            fontSize: '0.78rem', color: 'var(--text-muted)',
                            padding: '12px 0', borderTop: '1px solid var(--border)', marginBottom: '20px'
                        }}>
                            <Calendar size={13} />
                            Member since {fmt(profile.createdAt)}
                            {profile.updatedAt && (
                                <span style={{ marginLeft: 'auto' }}>
                                    Updated {fmt(profile.updatedAt)}
                                </span>
                            )}
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary" disabled={isSaving}>
                        {isSaving ? (
                            <><span className="btn-spinner" />Saving…</>
                        ) : (
                            <><Save size={16} />Save Changes</>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
