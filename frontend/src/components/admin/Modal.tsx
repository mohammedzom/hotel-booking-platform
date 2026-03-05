import { type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    /** Max width of the modal content box, e.g. "560px" (default: "520px") */
    maxWidth?: string;
}

/**
 * Modal — glassmorphism dialog for create/edit forms.
 * Closes when clicking the backdrop or the × button.
 */
export function Modal({ isOpen, onClose, title, children, maxWidth = '520px' }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 400,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px 16px',
            }}
        >
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(7, 13, 26, 0.75)',
                    backdropFilter: 'blur(6px)',
                    WebkitBackdropFilter: 'blur(6px)',
                }}
            />

            {/* Dialog */}
            <div
                role="dialog"
                aria-modal="true"
                aria-label={title}
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth,
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-xl)',
                    boxShadow: 'var(--shadow-lg)',
                    animation: 'cardIn 0.18s ease both',
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
            >
                {/* Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '20px 24px 16px',
                    borderBottom: '1px solid var(--border)',
                    flexShrink: 0,
                }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>{title}</h3>
                    <button
                        onClick={onClose}
                        aria-label="Close modal"
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            padding: 4,
                            borderRadius: 'var(--radius-sm)',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'var(--transition)',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: '20px 24px 24px', overflowY: 'auto', flex: 1 }}>
                    {children}
                </div>
            </div>
        </div>
    );
}
