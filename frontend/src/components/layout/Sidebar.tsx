import { useState } from 'react';
import { Search } from 'lucide-react';
import { apiSections } from '../../data/endpoints';
import { MethodBadge } from '../api-docs/MethodBadge';

interface SidebarProps {
    isOpen?: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
    const [query, setQuery] = useState('');

    const q = query.toLowerCase().trim();

    // Filter endpoints across all sections
    const filtered = apiSections.map((section) => ({
        ...section,
        endpoints: section.endpoints.filter(
            (ep) =>
                !q ||
                ep.path.toLowerCase().includes(q) ||
                ep.summary.toLowerCase().includes(q) ||
                ep.method.toLowerCase().includes(q) ||
                section.title.toLowerCase().includes(q)
        ),
    })).filter((s) => s.endpoints.length > 0);

    const totalVisible = filtered.reduce((acc, s) => acc + s.endpoints.length, 0);

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            {/* Search */}
            <div className="sidebar__search">
                <Search size={14} className="sidebar__search-icon" style={{ top: '50%', transform: 'translateY(-50%)' }} />
                <input
                    className="sidebar__search-input"
                    type="text"
                    placeholder="Search endpoints…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            <nav className="sidebar__nav">
                {filtered.length === 0 ? (
                    <div className="sidebar__no-results">No endpoints found</div>
                ) : (
                    filtered.map((section) => (
                        <div className="sidebar__section" key={section.id}>
                            {/* Section label with scroll to anchor */}
                            <button
                                className="sidebar__section-label"
                                style={{
                                    background: 'none', border: 'none', cursor: 'pointer', width: '100%',
                                    textAlign: 'left', display: 'block', color: section.color,
                                }}
                                onClick={() => scrollTo(section.id)}
                                title={`Jump to ${section.title}`}
                            >
                                {section.icon} {section.title.toUpperCase()}
                            </button>

                            {section.endpoints.map((ep) => (
                                <button
                                    key={ep.id}
                                    className="sidebar__item"
                                    onClick={() => scrollTo(ep.id)}
                                >
                                    <span className={`sidebar__item-method method-badge ${ep.method}`}>
                                        {ep.method}
                                    </span>
                                    <span className="sidebar__item-path">{ep.path.replace('/api/v1', '')}</span>
                                </button>
                            ))}
                        </div>
                    ))
                )}
            </nav>

            {/* Footer stats */}
            <div
                style={{
                    padding: '12px 16px',
                    borderTop: '1px solid var(--border)',
                    fontSize: '0.72rem',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <span>v1.0</span>
                <span>{totalVisible} endpoints</span>
            </div>
        </aside>
    );
}
