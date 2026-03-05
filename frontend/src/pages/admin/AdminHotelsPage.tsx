import { useEffect, useRef, useState } from 'react';
import {
    Hotel,
    Plus,
    Search,
    ImagePlus,
    ArrowLeft,
    Star,
    Upload,
    BedDouble,
    Layers,
} from 'lucide-react';
import {
    adminHotelsService,
    adminCitiesService,
    adminRoomTypesService,
    adminRoomsService,
} from '../../services/adminService';
import type {
    AdminHotelDto,
    CreateHotelRequest,
    UpdateHotelRequest,
    AdminCityDto,
    AdminRoomTypeDto,
    AdminRoomDto,
    CreateRoomRequest,
    UpdateRoomRequest,
    CreateRoomTypeRequest,
    UpdateRoomTypeRequest,
} from '../../types/admin.types';
import { DataTable, type Column } from '../../components/admin/DataTable';
import { Modal } from '../../components/admin/Modal';

// ─────────────────────────────────────────────────────────────────────────────
// Shared field styles
// ─────────────────────────────────────────────────────────────────────────────

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

function onFocusField(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    e.target.style.borderColor = 'var(--accent)';
    e.target.style.boxShadow = '0 0 0 3px var(--accent-light)';
}
function onBlurField(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    e.target.style.borderColor = 'var(--border)';
    e.target.style.boxShadow = 'none';
}

// ─────────────────────────────────────────────────────────────────────────────
// Hotel Form
// ─────────────────────────────────────────────────────────────────────────────

interface HotelFormProps {
    initial?: AdminHotelDto | null;
    cities: AdminCityDto[];
    onSave: (data: CreateHotelRequest) => Promise<void>;
    onCancel: () => void;
    saving: boolean;
    error: string;
}

function HotelForm({ initial, cities, onSave, onCancel, saving, error }: HotelFormProps) {
    const [cityId, setCityId] = useState(initial?.cityId ?? '');
    const [name, setName] = useState(initial?.name ?? '');
    const [owner, setOwner] = useState(initial?.owner ?? '');
    const [address, setAddress] = useState(initial?.address ?? '');
    const [starRating, setStarRating] = useState(String(initial?.starRating ?? 3));
    const [description, setDescription] = useState(initial?.description ?? '');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        await onSave({
            cityId,
            name: name.trim(),
            owner: owner.trim(),
            address: address.trim(),
            starRating: Number(starRating),
            description: description.trim() || undefined,
        });
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {error && <div className="form-server-error">{error}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>City *</label>
                    <select
                        required
                        value={cityId}
                        onChange={(e) => setCityId(e.target.value)}
                        style={{ ...fieldStyle, cursor: 'pointer' }}
                        onFocus={onFocusField}
                        onBlur={onBlurField}
                    >
                        <option value="">Select city…</option>
                        {cities.map((c) => <option key={c.id} value={c.id}>{c.name}, {c.country}</option>)}
                    </select>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Hotel Name *</label>
                    <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Grand Palace" style={fieldStyle} onFocus={onFocusField} onBlur={onBlurField} />
                </div>
                <div>
                    <label style={labelStyle}>Owner *</label>
                    <input required value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="Owner name" style={fieldStyle} onFocus={onFocusField} onBlur={onBlurField} />
                </div>
                <div>
                    <label style={labelStyle}>Star Rating *</label>
                    <select required value={starRating} onChange={(e) => setStarRating(e.target.value)} style={{ ...fieldStyle, cursor: 'pointer' }} onFocus={onFocusField} onBlur={onBlurField}>
                        {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} ★</option>)}
                    </select>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Address *</label>
                    <input required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street address" style={fieldStyle} onFocus={onFocusField} onBlur={onBlurField} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional…" rows={3} style={{ ...fieldStyle, resize: 'vertical' }} onFocus={onFocusField} onBlur={onBlurField} />
                </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
                <button type="button" onClick={onCancel} className="btn btn-ghost" style={{ width: 'auto', padding: '8px 20px' }}>Cancel</button>
                <button type="submit" disabled={saving} className="btn" style={{ width: 'auto', padding: '8px 24px' }}>
                    {saving ? <><span className="btn-spinner" /> Saving&hellip;</> : initial ? 'Save Changes' : 'Create Hotel'}
                </button>
            </div>
        </form>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Image Uploader
// ─────────────────────────────────────────────────────────────────────────────

interface ImageUploaderProps {
    hotelId: string;
    onDone: () => void;
}

function ImageUploader({ hotelId, onDone }: ImageUploaderProps) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [caption, setCaption] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        setError('');
        setSuccess('');
        const f = e.target.files?.[0] ?? null;
        if (f && f.size > 6 * 1024 * 1024) {
            setError('File too large. Maximum size is 6 MB.');
            setFile(null);
            return;
        }
        setFile(f);
    }

    async function handleUpload(e: React.FormEvent) {
        e.preventDefault();
        if (!file) return;
        setUploading(true);
        setError('');
        setSuccess('');
        try {
            const result = await adminHotelsService.uploadImage(
                hotelId,
                file,
                caption.trim() || undefined,
                sortOrder !== '' ? Number(sortOrder) : undefined,
            );
            setSuccess(`Image uploaded successfully (ID: ${result.id.slice(0, 8)})`);
            setFile(null);
            setCaption('');
            setSortOrder('');
            if (fileRef.current) fileRef.current.value = '';
        } catch (err: unknown) {
            const e2 = err as { response?: { data?: { detail?: string; title?: string }; status?: number } };
            if (e2.response?.status === 413) {
                setError('File too large. Maximum upload size is 6 MB.');
            } else if (e2.response?.status === 429) {
                setError('Too many uploads. Please wait a moment and try again.');
            } else {
                setError(e2.response?.data?.detail ?? e2.response?.data?.title ?? 'Upload failed.');
            }
        } finally {
            setUploading(false);
        }
    }

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ImagePlus size={18} color="var(--text-accent)" /> Upload Image
                </h2>
                <button onClick={onDone} className="btn btn-ghost" style={{ width: 'auto', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem' }}>
                    <ArrowLeft size={13} /> Back
                </button>
            </div>

            <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {error && <div className="form-server-error">{error}</div>}
                {success && (
                    <div style={{
                        background: 'var(--get-bg)', border: '1px solid rgba(16,185,129,0.3)',
                        borderRadius: 'var(--radius-md)', padding: '10px 14px',
                        color: 'var(--get)', fontSize: '0.85rem',
                    }}>{success}</div>
                )}

                {/* Drop zone */}
                <div
                    onClick={() => fileRef.current?.click()}
                    style={{
                        border: `2px dashed ${file ? 'var(--accent)' : 'var(--border)'}`,
                        borderRadius: 'var(--radius-lg)',
                        padding: '36px 20px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: file ? 'var(--accent-light)' : 'var(--bg-elevated)',
                        transition: 'var(--transition)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = file ? 'var(--accent)' : 'var(--border)')}
                >
                    <Upload size={28} color="var(--text-muted)" style={{ marginBottom: 10 }} />
                    {file ? (
                        <div>
                            <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{file.name}</p>
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                    ) : (
                        <div>
                            <p style={{ fontWeight: 600, marginBottom: 4 }}>Click to select an image</p>
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>JPG, PNG, WebP — max 6 MB</p>
                        </div>
                    )}
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: 12 }}>
                    <div>
                        <label style={labelStyle}>Caption</label>
                        <input
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            maxLength={200}
                            placeholder="Optional caption…"
                            style={fieldStyle}
                            onFocus={onFocusField}
                            onBlur={onBlurField}
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Sort Order</label>
                        <input
                            type="number"
                            min={0}
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            placeholder="0"
                            style={fieldStyle}
                            onFocus={onFocusField}
                            onBlur={onBlurField}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={!file || uploading}
                    className="btn"
                    style={{ padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                >
                    {uploading
                        ? <><span className="btn-spinner" /> Uploading&hellip;</>
                        : <><Upload size={15} /> Upload Image</>
                    }
                </button>
            </form>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Room Type Form
// ─────────────────────────────────────────────────────────────────────────────

interface RoomTypeFormProps {
    initial?: AdminRoomTypeDto | null;
    onSave: (data: CreateRoomTypeRequest) => Promise<void>;
    onCancel: () => void;
    saving: boolean;
    error: string;
}

function RoomTypeForm({ initial, onSave, onCancel, saving, error }: RoomTypeFormProps) {
    const [name, setName] = useState(initial?.name ?? '');
    const [description, setDescription] = useState(initial?.description ?? '');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        await onSave({ name: name.trim(), description: description.trim() || undefined });
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {error && <div className="form-server-error">{error}</div>}
            <div>
                <label style={labelStyle}>Room Type Name *</label>
                <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Deluxe Suite" style={fieldStyle} onFocus={onFocusField} onBlur={onBlurField} />
            </div>
            <div>
                <label style={labelStyle}>Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional…" rows={3} style={{ ...fieldStyle, resize: 'vertical' }} onFocus={onFocusField} onBlur={onBlurField} />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" onClick={onCancel} className="btn btn-ghost" style={{ width: 'auto', padding: '8px 20px' }}>Cancel</button>
                <button type="submit" disabled={saving} className="btn" style={{ width: 'auto', padding: '8px 24px' }}>
                    {saving ? <><span className="btn-spinner" /> Saving&hellip;</> : initial ? 'Save Changes' : 'Create'}
                </button>
            </div>
        </form>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Room Form
// ─────────────────────────────────────────────────────────────────────────────

interface RoomFormProps {
    initial?: AdminRoomDto | null;
    hotelId: string;
    roomTypes: AdminRoomTypeDto[];
    onSave: (data: CreateRoomRequest | UpdateRoomRequest) => Promise<void>;
    onCancel: () => void;
    saving: boolean;
    error: string;
}

function RoomForm({ initial, hotelId, roomTypes, onSave, onCancel, saving, error }: RoomFormProps) {
    const [roomTypeId, setRoomTypeId] = useState(initial?.roomTypeId ?? '');
    const [pricePerNight, setPricePerNight] = useState(String(initial?.pricePerNight ?? ''));
    const [adultCapacity, setAdultCapacity] = useState(String(initial?.adultCapacity ?? 2));
    const [childCapacity, setChildCapacity] = useState(String(initial?.childCapacity ?? 0));
    const [description, setDescription] = useState(initial?.description ?? '');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (initial) {
            await onSave({
                pricePerNight: Number(pricePerNight),
                adultCapacity: Number(adultCapacity),
                childCapacity: Number(childCapacity),
                description: description.trim() || undefined,
            } as UpdateRoomRequest);
        } else {
            await onSave({
                hotelId,
                roomTypeId,
                pricePerNight: Number(pricePerNight),
                adultCapacity: Number(adultCapacity),
                childCapacity: Number(childCapacity),
                description: description.trim() || undefined,
            } as CreateRoomRequest);
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {error && <div className="form-server-error">{error}</div>}
            {!initial && (
                <div>
                    <label style={labelStyle}>Room Type *</label>
                    <select required value={roomTypeId} onChange={(e) => setRoomTypeId(e.target.value)} style={{ ...fieldStyle, cursor: 'pointer' }} onFocus={onFocusField} onBlur={onBlurField}>
                        <option value="">Select room type…</option>
                        {roomTypes.map((rt) => <option key={rt.id} value={rt.id}>{rt.name}</option>)}
                    </select>
                </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Price / Night ($) *</label>
                    <input required type="number" min={0} step="0.01" value={pricePerNight} onChange={(e) => setPricePerNight(e.target.value)} placeholder="99.99" style={fieldStyle} onFocus={onFocusField} onBlur={onBlurField} />
                </div>
                <div>
                    <label style={labelStyle}>Adults *</label>
                    <input required type="number" min={1} max={10} value={adultCapacity} onChange={(e) => setAdultCapacity(e.target.value)} style={fieldStyle} onFocus={onFocusField} onBlur={onBlurField} />
                </div>
                <div>
                    <label style={labelStyle}>Children</label>
                    <input required type="number" min={0} max={10} value={childCapacity} onChange={(e) => setChildCapacity(e.target.value)} style={fieldStyle} onFocus={onFocusField} onBlur={onBlurField} />
                </div>
            </div>
            <div>
                <label style={labelStyle}>Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional…" rows={2} style={{ ...fieldStyle, resize: 'vertical' }} onFocus={onFocusField} onBlur={onBlurField} />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" onClick={onCancel} className="btn btn-ghost" style={{ width: 'auto', padding: '8px 20px' }}>Cancel</button>
                <button type="submit" disabled={saving} className="btn" style={{ width: 'auto', padding: '8px 24px' }}>
                    {saving ? <><span className="btn-spinner" /> Saving&hellip;</> : initial ? 'Save Changes' : 'Create Room'}
                </button>
            </div>
        </form>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hotel Detail View (image upload + room types + rooms)
// ─────────────────────────────────────────────────────────────────────────────

interface HotelDetailViewProps {
    hotel: AdminHotelDto;
    onBack: () => void;
}

type DetailTab = 'images' | 'roomTypes' | 'rooms';

function HotelDetailView({ hotel, onBack }: HotelDetailViewProps) {
    const [tab, setTab] = useState<DetailTab>('images');

    // Room Types state
    const [roomTypes, setRoomTypes] = useState<AdminRoomTypeDto[]>([]);
    const [rtTotal, setRtTotal] = useState(0);
    const [rtPage, setRtPage] = useState(1);
    const [rtLoading, setRtLoading] = useState(false);
    const [rtError, setRtError] = useState('');
    const [rtModalOpen, setRtModalOpen] = useState(false);
    const [rtEditing, setRtEditing] = useState<AdminRoomTypeDto | null>(null);
    const [rtSaving, setRtSaving] = useState(false);
    const [rtSaveError, setRtSaveError] = useState('');
    const [rtDeleting, setRtDeleting] = useState<AdminRoomTypeDto | null>(null);
    const [rtDeleteError, setRtDeleteError] = useState('');

    // Rooms state
    const [rooms, setRooms] = useState<AdminRoomDto[]>([]);
    const [roomsTotal, setRoomsTotal] = useState(0);
    const [roomsPage, setRoomsPage] = useState(1);
    const [roomsLoading, setRoomsLoading] = useState(false);
    const [roomsError, setRoomsError] = useState('');
    const [roomModalOpen, setRoomModalOpen] = useState(false);
    const [roomEditing, setRoomEditing] = useState<AdminRoomDto | null>(null);
    const [roomSaving, setRoomSaving] = useState(false);
    const [roomSaveError, setRoomSaveError] = useState('');
    const [roomDeleting, setRoomDeleting] = useState<AdminRoomDto | null>(null);
    const [roomDeleteError, setRoomDeleteError] = useState('');

    const RT_PAGE_SIZE = 10;
    const ROOM_PAGE_SIZE = 10;

    async function loadRoomTypes(p: number) {
        setRtLoading(true); setRtError('');
        try {
            const res = await adminRoomTypesService.list({ page: p, pageSize: RT_PAGE_SIZE });
            setRoomTypes(res.items); setRtTotal(res.totalCount);
        } catch { setRtError('Failed to load room types.'); }
        finally { setRtLoading(false); }
    }

    async function loadRooms(p: number) {
        setRoomsLoading(true); setRoomsError('');
        try {
            const res = await adminRoomsService.list({ hotelId: hotel.id, page: p, pageSize: ROOM_PAGE_SIZE });
            setRooms(res.items); setRoomsTotal(res.totalCount);
        } catch { setRoomsError('Failed to load rooms.'); }
        finally { setRoomsLoading(false); }
    }

    useEffect(() => {
        if (tab === 'roomTypes') loadRoomTypes(rtPage);
        if (tab === 'rooms') { loadRooms(roomsPage); loadRoomTypes(rtPage); }
    }, [tab, rtPage, roomsPage]);

    // ── Room Type CRUD ─────────────────────────────────────────────────────

    async function handleSaveRoomType(body: CreateRoomTypeRequest | UpdateRoomTypeRequest) {
        setRtSaving(true); setRtSaveError('');
        try {
            if (rtEditing) {
                const updated = await adminRoomTypesService.update(rtEditing.id, body as UpdateRoomTypeRequest);
                setRoomTypes((prev) => prev.map((rt) => rt.id === rtEditing.id ? updated : rt));
            } else {
                await adminRoomTypesService.create(body as CreateRoomTypeRequest);
                await loadRoomTypes(1); setRtPage(1);
            }
            setRtModalOpen(false);
        } catch (err: unknown) {
            const e = err as { response?: { data?: { detail?: string; title?: string } } };
            setRtSaveError(e.response?.data?.detail ?? e.response?.data?.title ?? 'Operation failed.');
        } finally { setRtSaving(false); }
    }

    async function confirmDeleteRoomType() {
        if (!rtDeleting) return;
        try {
            await adminRoomTypesService.delete(rtDeleting.id);
            setRoomTypes((prev) => prev.filter((rt) => rt.id !== rtDeleting.id));
            setRtTotal((n) => n - 1); setRtDeleting(null);
        } catch (err: unknown) {
            const e = err as { response?: { data?: { detail?: string; title?: string } } };
            setRtDeleteError(e.response?.data?.detail ?? e.response?.data?.title ?? 'Failed to delete.');
        }
    }

    // ── Room CRUD ──────────────────────────────────────────────────────────

    async function handleSaveRoom(body: CreateRoomRequest | UpdateRoomRequest) {
        setRoomSaving(true); setRoomSaveError('');
        try {
            if (roomEditing) {
                const updated = await adminRoomsService.update(roomEditing.id, body as UpdateRoomRequest);
                setRooms((prev) => prev.map((r) => r.id === roomEditing.id ? updated : r));
            } else {
                await adminRoomsService.create(body as CreateRoomRequest);
                await loadRooms(1); setRoomsPage(1);
            }
            setRoomModalOpen(false);
        } catch (err: unknown) {
            const e = err as { response?: { data?: { detail?: string; title?: string } } };
            setRoomSaveError(e.response?.data?.detail ?? e.response?.data?.title ?? 'Operation failed.');
        } finally { setRoomSaving(false); }
    }

    async function confirmDeleteRoom() {
        if (!roomDeleting) return;
        try {
            await adminRoomsService.delete(roomDeleting.id);
            setRooms((prev) => prev.filter((r) => r.id !== roomDeleting.id));
            setRoomsTotal((n) => n - 1); setRoomDeleting(null);
        } catch (err: unknown) {
            const e = err as { response?: { data?: { detail?: string; title?: string } } };
            setRoomDeleteError(e.response?.data?.detail ?? e.response?.data?.title ?? 'Failed to delete room.');
        }
    }

    // ── Columns ────────────────────────────────────────────────────────────

    const rtColumns: Column<AdminRoomTypeDto>[] = [
        { key: 'name', header: 'Room Type', render: (r) => <strong style={{ color: 'var(--text-primary)' }}>{r.name}</strong> },
        { key: 'description', header: 'Description', render: (r) => r.description ?? <span style={{ color: 'var(--text-muted)' }}>—</span> },
        { key: 'hotelAssignmentCount', header: 'Hotels', render: (r) => (
            <span style={{ background: 'var(--accent-light)', color: 'var(--text-accent)', borderRadius: 20, padding: '2px 10px', fontSize: '0.78rem', fontWeight: 600 }}>{r.hotelAssignmentCount}</span>
        )},
    ];

    const roomColumns: Column<AdminRoomDto>[] = [
        { key: 'roomTypeName', header: 'Type', render: (r) => <strong style={{ color: 'var(--text-primary)' }}>{r.roomTypeName}</strong> },
        { key: 'pricePerNight', header: 'Price/Night', render: (r) => <span style={{ color: 'var(--text-accent)', fontWeight: 600 }}>${r.pricePerNight.toFixed(2)}</span> },
        { key: 'adultCapacity', header: 'Adults', render: (r) => r.adultCapacity },
        { key: 'childCapacity', header: 'Children', render: (r) => r.childCapacity },
        { key: 'description', header: 'Description', render: (r) => r.description ?? <span style={{ color: 'var(--text-muted)' }}>—</span> },
    ];

    const tabStyle = (active: boolean): React.CSSProperties => ({
        padding: '8px 18px',
        borderRadius: 'var(--radius-md)',
        border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
        background: active ? 'var(--accent-light)' : 'transparent',
        color: active ? 'var(--text-accent)' : 'var(--text-secondary)',
        cursor: 'pointer',
        fontSize: '0.84rem',
        fontWeight: active ? 600 : 400,
        fontFamily: 'Inter, sans-serif',
        display: 'flex', alignItems: 'center', gap: 6,
        transition: 'var(--transition)',
    });

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
                    <ArrowLeft size={18} />
                </button>
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0 }}>{hotel.name}</h1>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                        {hotel.cityName} &bull; {Array.from({ length: hotel.starRating }, () => '★').join('')}
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
                <button style={tabStyle(tab === 'images')} onClick={() => setTab('images')}>
                    <ImagePlus size={14} /> Images
                </button>
                <button style={tabStyle(tab === 'roomTypes')} onClick={() => setTab('roomTypes')}>
                    <Layers size={14} /> Room Types
                </button>
                <button style={tabStyle(tab === 'rooms')} onClick={() => setTab('rooms')}>
                    <BedDouble size={14} /> Rooms
                </button>
            </div>

            {/* Tab content */}
            {tab === 'images' && (
                <div style={{ maxWidth: 560 }}>
                    <ImageUploader hotelId={hotel.id} onDone={onBack} />
                </div>
            )}

            {tab === 'roomTypes' && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                        <button onClick={() => { setRtEditing(null); setRtSaveError(''); setRtModalOpen(true); }} className="btn" style={{ width: 'auto', padding: '8px 18px', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Plus size={14} /> Add Room Type
                        </button>
                    </div>
                    {rtError && <div className="form-server-error" style={{ marginBottom: 12 }}>{rtError}</div>}
                    <DataTable
                        columns={rtColumns}
                        data={roomTypes}
                        totalCount={rtTotal}
                        page={rtPage}
                        pageSize={RT_PAGE_SIZE}
                        onPageChange={(p) => setRtPage(p)}
                        onEdit={(rt) => { setRtEditing(rt); setRtSaveError(''); setRtModalOpen(true); }}
                        onDelete={(rt) => { setRtDeleting(rt); setRtDeleteError(''); }}
                        isLoading={rtLoading}
                        emptyMessage="No room types found."
                    />
                    <Modal isOpen={rtModalOpen} onClose={() => setRtModalOpen(false)} title={rtEditing ? 'Edit Room Type' : 'Add Room Type'}>
                        <RoomTypeForm initial={rtEditing} onSave={handleSaveRoomType} onCancel={() => setRtModalOpen(false)} saving={rtSaving} error={rtSaveError} />
                    </Modal>
                    <Modal isOpen={!!rtDeleting} onClose={() => setRtDeleting(null)} title="Delete Room Type" maxWidth="420px">
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 20 }}>
                            Delete <strong style={{ color: 'var(--text-primary)' }}>{rtDeleting?.name}</strong>?
                        </p>
                        {rtDeleteError && <div className="form-server-error" style={{ marginBottom: 12 }}>{rtDeleteError}</div>}
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                            <button onClick={() => setRtDeleting(null)} className="btn btn-ghost" style={{ width: 'auto', padding: '8px 20px' }}>Cancel</button>
                            <button onClick={confirmDeleteRoomType} className="btn" style={{ width: 'auto', padding: '8px 20px', background: 'var(--delete)', borderColor: 'var(--delete)' }}>Delete</button>
                        </div>
                    </Modal>
                </div>
            )}

            {tab === 'rooms' && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                        <button onClick={() => { setRoomEditing(null); setRoomSaveError(''); setRoomModalOpen(true); }} className="btn" style={{ width: 'auto', padding: '8px 18px', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Plus size={14} /> Add Room
                        </button>
                    </div>
                    {roomsError && <div className="form-server-error" style={{ marginBottom: 12 }}>{roomsError}</div>}
                    <DataTable
                        columns={roomColumns}
                        data={rooms}
                        totalCount={roomsTotal}
                        page={roomsPage}
                        pageSize={ROOM_PAGE_SIZE}
                        onPageChange={(p) => setRoomsPage(p)}
                        onEdit={(r) => { setRoomEditing(r); setRoomSaveError(''); setRoomModalOpen(true); }}
                        onDelete={(r) => { setRoomDeleting(r); setRoomDeleteError(''); }}
                        isLoading={roomsLoading}
                        emptyMessage="No rooms yet. Add the first one!"
                    />
                    <Modal isOpen={roomModalOpen} onClose={() => setRoomModalOpen(false)} title={roomEditing ? 'Edit Room' : 'Add Room'} maxWidth="560px">
                        <RoomForm
                            initial={roomEditing}
                            hotelId={hotel.id}
                            roomTypes={roomTypes}
                            onSave={handleSaveRoom}
                            onCancel={() => setRoomModalOpen(false)}
                            saving={roomSaving}
                            error={roomSaveError}
                        />
                    </Modal>
                    <Modal isOpen={!!roomDeleting} onClose={() => setRoomDeleting(null)} title="Delete Room" maxWidth="420px">
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 20 }}>
                            Delete this room (<strong style={{ color: 'var(--text-primary)' }}>{roomDeleting?.roomTypeName}</strong>)?
                        </p>
                        {roomDeleteError && <div className="form-server-error" style={{ marginBottom: 12 }}>{roomDeleteError}</div>}
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                            <button onClick={() => setRoomDeleting(null)} className="btn btn-ghost" style={{ width: 'auto', padding: '8px 20px' }}>Cancel</button>
                            <button onClick={confirmDeleteRoom} className="btn" style={{ width: 'auto', padding: '8px 20px', background: 'var(--delete)', borderColor: 'var(--delete)' }}>Delete</button>
                        </div>
                    </Modal>
                </div>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Hotels Page
// ─────────────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 15;

export function AdminHotelsPage() {
    const [data, setData] = useState<AdminHotelDto[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // City list for the form
    const [cities, setCities] = useState<AdminCityDto[]>([]);

    // Detail view
    const [selectedHotel, setSelectedHotel] = useState<AdminHotelDto | null>(null);

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<AdminHotelDto | null>(null);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');

    const [deleting, setDeleting] = useState<AdminHotelDto | null>(null);
    const [deleteError, setDeleteError] = useState('');

    async function load(p: number, s: string) {
        setLoading(true); setError('');
        try {
            const res = await adminHotelsService.list({ page: p, pageSize: PAGE_SIZE, search: s || undefined });
            setData(res.items); setTotalCount(res.totalCount);
        } catch (err: unknown) {
            const e = err as { response?: { data?: { detail?: string; title?: string } } };
            setError(e.response?.data?.detail ?? e.response?.data?.title ?? 'Failed to load hotels.');
        } finally { setLoading(false); }
    }

    async function loadCities() {
        try {
            const res = await adminCitiesService.list({ pageSize: 100 });
            setCities(res.items);
        } catch { /* ignore */ }
    }

    useEffect(() => { load(page, search); }, [page, search]);
    useEffect(() => { loadCities(); }, []);

    function openCreate() { setEditing(null); setSaveError(''); setModalOpen(true); }
    function openEdit(hotel: AdminHotelDto) { setEditing(hotel); setSaveError(''); setModalOpen(true); }

    async function handleSave(body: CreateHotelRequest | UpdateHotelRequest) {
        setSaving(true); setSaveError('');
        try {
            if (editing) {
                const updated = await adminHotelsService.update(editing.id, body as UpdateHotelRequest);
                setData((prev) => prev.map((h) => h.id === editing.id ? updated : h));
            } else {
                await adminHotelsService.create(body as CreateHotelRequest);
                await load(1, search); setPage(1);
            }
            setModalOpen(false);
        } catch (err: unknown) {
            const e = err as { response?: { data?: { detail?: string; title?: string } } };
            setSaveError(e.response?.data?.detail ?? e.response?.data?.title ?? 'Operation failed.');
        } finally { setSaving(false); }
    }

    async function confirmDelete() {
        if (!deleting) return;
        try {
            await adminHotelsService.delete(deleting.id);
            setData((prev) => prev.filter((h) => h.id !== deleting.id));
            setTotalCount((n) => n - 1); setDeleting(null);
        } catch (err: unknown) {
            const e = err as { response?: { data?: { detail?: string; title?: string } } };
            setDeleteError(e.response?.data?.detail ?? e.response?.data?.title ?? 'Failed to delete hotel.');
        }
    }

    function handleSearch(e: React.FormEvent) {
        e.preventDefault(); setPage(1); setSearch(searchInput);
    }

    // Star rating renderer
    function Stars({ n }: { n: number }) {
        return <span style={{ color: 'var(--put)', fontSize: '0.78rem' }}>{Array.from({ length: n }, () => '★').join('')}</span>;
    }

    const columns: Column<AdminHotelDto>[] = [
        { key: 'name', header: 'Hotel', render: (r) => (
            <div>
                <strong style={{ color: 'var(--text-primary)' }}>{r.name}</strong>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>{r.cityName}</div>
            </div>
        )},
        { key: 'starRating', header: 'Stars', render: (r) => <Stars n={r.starRating} /> },
        { key: 'owner', header: 'Owner', render: (r) => <span style={{ fontSize: '0.82rem' }}>{r.owner}</span> },
        { key: 'roomTypeCount', header: 'Room Types', render: (r) => (
            <span style={{ background: 'var(--accent-light)', color: 'var(--text-accent)', borderRadius: 20, padding: '2px 10px', fontSize: '0.78rem', fontWeight: 600 }}>{r.roomTypeCount}</span>
        )},
    ];

    // If a hotel is selected, show its detail view
    if (selectedHotel) {
        return (
            <HotelDetailView
                hotel={selectedHotel}
                onBack={() => setSelectedHotel(null)}
            />
        );
    }

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Hotel size={20} color="var(--text-accent)" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>Hotels</h1>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Manage hotels and their rooms</p>
                    </div>
                </div>
                <button onClick={openCreate} className="btn" style={{ width: 'auto', padding: '8px 20px', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Plus size={15} /> Add Hotel
                </button>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 20, maxWidth: 400 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                    <input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search hotels…"
                        style={{ width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '8px 12px 8px 34px', color: 'var(--text-primary)', fontSize: '0.84rem', fontFamily: 'Inter, sans-serif', outline: 'none' }}
                        onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; }}
                        onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
                    />
                </div>
                <button type="submit" className="btn btn-ghost" style={{ width: 'auto', padding: '8px 16px' }}>Search</button>
            </form>

            {error && <div className="form-server-error" style={{ marginBottom: 16 }}>{error}</div>}

            <DataTable
                columns={columns}
                data={data}
                totalCount={totalCount}
                page={page}
                pageSize={PAGE_SIZE}
                onPageChange={(p) => setPage(p)}
                onEdit={openEdit}
                onDelete={(h) => { setDeleting(h); setDeleteError(''); }}
                isLoading={loading}
                emptyMessage="No hotels found. Add the first one!"
                extraActions={(row) => (
                    <button
                        onClick={() => setSelectedHotel(row)}
                        title="Manage hotel (images, rooms)"
                        style={{
                            background: 'rgba(232,121,249,0.1)',
                            border: '1px solid rgba(232,121,249,0.25)',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--admin-color)',
                            cursor: 'pointer',
                            padding: '5px 8px',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'var(--transition)',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--admin-color)')}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(232,121,249,0.25)')}
                    >
                        <Star size={13} />
                    </button>
                )}
            />

            {/* Create / Edit Modal */}
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Hotel' : 'Add New Hotel'} maxWidth="580px">
                <HotelForm initial={editing} cities={cities} onSave={handleSave} onCancel={() => setModalOpen(false)} saving={saving} error={saveError} />
            </Modal>

            {/* Delete Modal */}
            <Modal isOpen={!!deleting} onClose={() => setDeleting(null)} title="Delete Hotel" maxWidth="420px">
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 20 }}>
                    Are you sure you want to delete <strong style={{ color: 'var(--text-primary)' }}>{deleting?.name}</strong>?
                    This will remove all associated data.
                </p>
                {deleteError && <div className="form-server-error" style={{ marginBottom: 16 }}>{deleteError}</div>}
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                    <button onClick={() => setDeleting(null)} className="btn btn-ghost" style={{ width: 'auto', padding: '8px 20px' }}>Cancel</button>
                    <button onClick={confirmDelete} className="btn" style={{ width: 'auto', padding: '8px 20px', background: 'var(--delete)', borderColor: 'var(--delete)' }}>Delete</button>
                </div>
            </Modal>
        </div>
    );
}
