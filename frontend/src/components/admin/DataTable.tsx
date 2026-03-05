import { type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react';

export interface Column<T> {
    key: string;
    header: string;
    /** Custom renderer; falls back to `String(row[key])` */
    render?: (row: T) => ReactNode;
    width?: string;
}

interface DataTableProps<T extends { id: string }> {
    columns: Column<T>[];
    data: T[];
    totalCount: number;
    page: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
    isLoading?: boolean;
    emptyMessage?: string;
    /** Extra action buttons rendered after Edit/Delete */
    extraActions?: (row: T) => ReactNode;
}

/**
 * DataTable — shared admin table with pagination and row-level actions.
 */
export function DataTable<T extends { id: string }>({
    columns,
    data,
    totalCount,
    page,
    pageSize,
    onPageChange,
    onEdit,
    onDelete,
    isLoading = false,
    emptyMessage = 'No records found.',
    extraActions,
}: DataTableProps<T>) {
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const hasActions = onEdit || onDelete || extraActions;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {/* Table wrapper */}
            <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
                    <thead>
                        <tr style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)' }}>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    style={{
                                        padding: '11px 16px',
                                        textAlign: 'left',
                                        fontSize: '0.72rem',
                                        fontWeight: 700,
                                        color: 'var(--text-muted)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.06em',
                                        whiteSpace: 'nowrap',
                                        width: col.width,
                                    }}
                                >
                                    {col.header}
                                </th>
                            ))}
                            {hasActions && (
                                <th style={{
                                    padding: '11px 16px',
                                    textAlign: 'right',
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    color: 'var(--text-muted)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.06em',
                                    whiteSpace: 'nowrap',
                                    width: '1%',
                                }}>
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>

                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (hasActions ? 1 : 0)}
                                    style={{ padding: '48px 16px', textAlign: 'center' }}
                                >
                                    <span
                                        className="btn-spinner"
                                        style={{ borderTopColor: 'var(--accent)', width: 32, height: 32, display: 'inline-block' }}
                                    />
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (hasActions ? 1 : 0)}
                                    style={{
                                        padding: '48px 16px',
                                        textAlign: 'center',
                                        color: 'var(--text-muted)',
                                        fontSize: '0.88rem',
                                    }}
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            data.map((row, idx) => (
                                <tr
                                    key={row.id}
                                    style={{
                                        borderBottom: idx < data.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                                        background: 'var(--bg-surface)',
                                        transition: 'var(--transition)',
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--bg-surface)')}
                                >
                                    {columns.map((col) => (
                                        <td
                                            key={col.key}
                                            style={{
                                                padding: '13px 16px',
                                                fontSize: '0.84rem',
                                                color: 'var(--text-secondary)',
                                                verticalAlign: 'middle',
                                            }}
                                        >
                                            {col.render
                                                ? col.render(row)
                                                : String((row as Record<string, unknown>)[col.key] ?? '')}
                                        </td>
                                    ))}

                                    {hasActions && (
                                        <td style={{ padding: '8px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                            <div style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                                                {extraActions?.(row)}
                                                {onEdit && (
                                                    <button
                                                        onClick={() => onEdit(row)}
                                                        title="Edit"
                                                        style={{
                                                            background: 'var(--accent-light)',
                                                            border: '1px solid rgba(79,110,247,0.25)',
                                                            borderRadius: 'var(--radius-sm)',
                                                            color: 'var(--text-accent)',
                                                            cursor: 'pointer',
                                                            padding: '5px 8px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            transition: 'var(--transition)',
                                                        }}
                                                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                                                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(79,110,247,0.25)')}
                                                    >
                                                        <Pencil size={13} />
                                                    </button>
                                                )}
                                                {onDelete && (
                                                    <button
                                                        onClick={() => onDelete(row)}
                                                        title="Delete"
                                                        style={{
                                                            background: 'var(--delete-bg)',
                                                            border: '1px solid rgba(239,68,68,0.25)',
                                                            borderRadius: 'var(--radius-sm)',
                                                            color: 'var(--delete)',
                                                            cursor: 'pointer',
                                                            padding: '5px 8px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            transition: 'var(--transition)',
                                                        }}
                                                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--delete)')}
                                                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(239,68,68,0.25)')}
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalCount > 0 && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 4px 0',
                    flexWrap: 'wrap',
                    gap: 8,
                }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {totalCount} {totalCount === 1 ? 'record' : 'records'} &bull; Page {page} of {totalPages}
                    </span>
                    <div style={{ display: 'flex', gap: 6 }}>
                        <button
                            onClick={() => onPageChange(page - 1)}
                            disabled={page <= 1}
                            style={{
                                background: 'var(--bg-surface)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-sm)',
                                color: page <= 1 ? 'var(--text-muted)' : 'var(--text-secondary)',
                                cursor: page <= 1 ? 'not-allowed' : 'pointer',
                                padding: '5px 10px',
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: '0.82rem',
                                transition: 'var(--transition)',
                            }}
                        >
                            <ChevronLeft size={14} />
                        </button>

                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            // Show pages around the current page
                            let p: number;
                            if (totalPages <= 5) {
                                p = i + 1;
                            } else if (page <= 3) {
                                p = i + 1;
                            } else if (page >= totalPages - 2) {
                                p = totalPages - 4 + i;
                            } else {
                                p = page - 2 + i;
                            }
                            return (
                                <button
                                    key={p}
                                    onClick={() => onPageChange(p)}
                                    style={{
                                        background: p === page ? 'var(--accent)' : 'var(--bg-surface)',
                                        border: `1px solid ${p === page ? 'var(--accent)' : 'var(--border)'}`,
                                        borderRadius: 'var(--radius-sm)',
                                        color: p === page ? 'white' : 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        padding: '5px 10px',
                                        fontSize: '0.82rem',
                                        fontWeight: p === page ? 700 : 400,
                                        minWidth: 32,
                                        transition: 'var(--transition)',
                                    }}
                                >
                                    {p}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => onPageChange(page + 1)}
                            disabled={page >= totalPages}
                            style={{
                                background: 'var(--bg-surface)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-sm)',
                                color: page >= totalPages ? 'var(--text-muted)' : 'var(--text-secondary)',
                                cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                                padding: '5px 10px',
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: '0.82rem',
                                transition: 'var(--transition)',
                            }}
                        >
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
