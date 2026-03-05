import { useEffect, useState } from 'react';
import { MapPin, Plus, Search } from 'lucide-react';
import { adminCitiesService } from '../../services/adminService';
import type { AdminCityDto, CreateCityRequest, UpdateCityRequest } from '../../types/admin.types';
import { DataTable, type Column } from '../../components/admin/DataTable';
import { Modal } from '../../components/admin/Modal';

// ─────────────────────────────────────────────────────────────────────────────
// City Form (used inside modal for both create and edit)
// ─────────────────────────────────────────────────────────────────────────────

interface CityFormProps {
    initial?: AdminCityDto | null;
    onSave: (data: CreateCityRequest) => Promise<void>;
    onCancel: () => void;
    saving: boolean;
    error: string;
}

function CityForm({ initial, onSave, onCancel, saving, error }: CityFormProps) {
    const [name, setName] = useState(initial?.name ?? '');
    const [country, setCountry] = useState(initial?.country ?? '');
    const [postOffice, setPostOffice] = useState(initial?.postOffice ?? '');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        await onSave({ name: name.trim(), country: country.trim(), postOffice: postOffice.trim() || undefined });
    }

    const fieldStyle: React.CSSProperties = {
        width: '100%',
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '9px 12px',
        color: 'var(--text-primary)',
        fontSize: '0.88rem',
        fontFamily: 'Inter, sans-serif',
        outline: 'none',
        transition: 'var(--transition)',
    };

    const labelStyle: React.CSSProperties = {
        display: 'block',
        fontSize: '0.78rem',
        fontWeight: 600,
        color: 'var(--text-secondary)',
        marginBottom: 6,
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {error && (
                <div className="form-server-error">{error}</div>
            )}
            <div>
                <label style={labelStyle}>City Name *</label>
                <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Paris"
                    style={fieldStyle}
                    onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-light)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                />
            </div>
            <div>
                <label style={labelStyle}>Country *</label>
                <input
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. France"
                    style={fieldStyle}
                    onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-light)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                />
            </div>
            <div>
                <label style={labelStyle}>Post Office</label>
                <input
                    value={postOffice}
                    onChange={(e) => setPostOffice(e.target.value)}
                    placeholder="Optional"
                    style={fieldStyle}
                    onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-light)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn btn-ghost"
                    style={{ width: 'auto', padding: '8px 20px' }}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={saving}
                    className="btn"
                    style={{ width: 'auto', padding: '8px 24px' }}
                >
                    {saving
                        ? <><span className="btn-spinner" /> Saving&hellip;</>
                        : initial ? 'Save Changes' : 'Create City'
                    }
                </button>
            </div>
        </form>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 15;

const COLUMNS: Column<AdminCityDto>[] = [
    { key: 'name',       header: 'City',         render: (r) => <strong style={{ color: 'var(--text-primary)' }}>{r.name}</strong> },
    { key: 'country',    header: 'Country' },
    { key: 'postOffice', header: 'Post Office',  render: (r) => r.postOffice ?? <span style={{ color: 'var(--text-muted)' }}>—</span> },
    { key: 'hotelCount', header: 'Hotels',       render: (r) => (
        <span style={{
            background: 'var(--accent-light)', color: 'var(--text-accent)',
            borderRadius: 20, padding: '2px 10px', fontSize: '0.78rem', fontWeight: 600,
        }}>{r.hotelCount}</span>
    )},
    { key: 'createdAtUtc', header: 'Created', render: (r) => new Date(r.createdAtUtc).toLocaleDateString() },
];

export function AdminCitiesPage() {
    const [data, setData] = useState<AdminCityDto[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<AdminCityDto | null>(null);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');

    // Delete confirmation state
    const [deleting, setDeleting] = useState<AdminCityDto | null>(null);
    const [deleteError, setDeleteError] = useState('');

    async function load(p: number, s: string) {
        setLoading(true);
        setError('');
        try {
            const res = await adminCitiesService.list({ page: p, pageSize: PAGE_SIZE, search: s || undefined });
            setData(res.items);
            setTotalCount(res.totalCount);
        } catch (err: unknown) {
            const e = err as { response?: { data?: { detail?: string; title?: string } } };
            setError(e.response?.data?.detail ?? e.response?.data?.title ?? 'Failed to load cities.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(page, search); }, [page, search]);

    function openCreate() {
        setEditing(null);
        setSaveError('');
        setModalOpen(true);
    }

    function openEdit(city: AdminCityDto) {
        setEditing(city);
        setSaveError('');
        setModalOpen(true);
    }

    async function handleSave(body: CreateCityRequest | UpdateCityRequest) {
        setSaving(true);
        setSaveError('');
        try {
            if (editing) {
                const updated = await adminCitiesService.update(editing.id, body as UpdateCityRequest);
                setData((prev) => prev.map((c) => (c.id === editing.id ? updated : c)));
            } else {
                await adminCitiesService.create(body as CreateCityRequest);
                await load(1, search);
                setPage(1);
            }
            setModalOpen(false);
        } catch (err: unknown) {
            const e = err as { response?: { data?: { detail?: string; title?: string } } };
            setSaveError(e.response?.data?.detail ?? e.response?.data?.title ?? 'Operation failed.');
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(city: AdminCityDto) {
        setDeleting(city);
        setDeleteError('');
    }

    async function confirmDelete() {
        if (!deleting) return;
        try {
            await adminCitiesService.delete(deleting.id);
            setData((prev) => prev.filter((c) => c.id !== deleting.id));
            setTotalCount((n) => n - 1);
            setDeleting(null);
        } catch (err: unknown) {
            const e = err as { response?: { data?: { detail?: string; title?: string } } };
            setDeleteError(e.response?.data?.detail ?? e.response?.data?.title ?? 'Failed to delete city.');
        }
    }

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        setPage(1);
        setSearch(searchInput);
    }

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                        width: 44, height: 44, borderRadius: 'var(--radius-md)',
                        background: 'var(--accent-light)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <MapPin size={20} color="var(--text-accent)" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>Cities</h1>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                            Manage hotel destination cities
                        </p>
                    </div>
                </div>
                <button onClick={openCreate} className="btn" style={{ width: 'auto', padding: '8px 20px', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Plus size={15} /> Add City
                </button>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 20, maxWidth: 400 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                    <input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search cities…"
                        style={{
                            width: '100%',
                            background: 'var(--bg-surface)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            padding: '8px 12px 8px 34px',
                            color: 'var(--text-primary)',
                            fontSize: '0.84rem',
                            fontFamily: 'Inter, sans-serif',
                            outline: 'none',
                        }}
                        onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; }}
                        onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
                    />
                </div>
                <button type="submit" className="btn btn-ghost" style={{ width: 'auto', padding: '8px 16px' }}>Search</button>
            </form>

            {error && <div className="form-server-error" style={{ marginBottom: 16 }}>{error}</div>}

            <DataTable
                columns={COLUMNS}
                data={data}
                totalCount={totalCount}
                page={page}
                pageSize={PAGE_SIZE}
                onPageChange={(p) => setPage(p)}
                onEdit={openEdit}
                onDelete={handleDelete}
                isLoading={loading}
                emptyMessage="No cities found. Add the first one!"
            />

            {/* Create / Edit Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editing ? 'Edit City' : 'Add New City'}
            >
                <CityForm
                    initial={editing}
                    onSave={handleSave}
                    onCancel={() => setModalOpen(false)}
                    saving={saving}
                    error={saveError}
                />
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={!!deleting}
                onClose={() => setDeleting(null)}
                title="Delete City"
                maxWidth="420px"
            >
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 20 }}>
                    Are you sure you want to delete <strong style={{ color: 'var(--text-primary)' }}>{deleting?.name}</strong>?
                    This action cannot be undone.
                </p>
                {deleteError && <div className="form-server-error" style={{ marginBottom: 16 }}>{deleteError}</div>}
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                    <button onClick={() => setDeleting(null)} className="btn btn-ghost" style={{ width: 'auto', padding: '8px 20px' }}>Cancel</button>
                    <button
                        onClick={confirmDelete}
                        className="btn"
                        style={{ width: 'auto', padding: '8px 20px', background: 'var(--delete)', borderColor: 'var(--delete)' }}
                    >
                        Delete
                    </button>
                </div>
            </Modal>
        </div>
    );
}
