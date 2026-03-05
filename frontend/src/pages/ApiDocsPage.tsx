import { apiSections } from '../data/endpoints';
import { EndpointCard } from '../components/api-docs/EndpointCard';
import { SectionHeader } from '../components/api-docs/SectionHeader';

const totalEndpoints = apiSections.reduce((acc, s) => acc + s.endpoints.length, 0);

export function ApiDocsPage() {
    return (
        <div className="content-wrapper">
            {/* Hero */}
            <div className="api-docs-hero">
                <h1 className="api-docs-hero__title">Hotel Booking API</h1>
                <p className="api-docs-hero__subtitle">
                    Complete reference for the HotelBooking REST API — built with ASP.NET Core, Clean Architecture &amp; CQRS.
                </p>
                <div className="api-docs-hero__stats">
                    <div className="api-docs-hero__stat">
                        <strong>{totalEndpoints}</strong>
                        <span>Total Endpoints</span>
                    </div>
                    <div className="api-docs-hero__stat">
                        <strong>{apiSections.length}</strong>
                        <span>Sections</span>
                    </div>
                    <div className="api-docs-hero__stat">
                        <strong>v1.0</strong>
                        <span>API Version</span>
                    </div>
                    <div className="api-docs-hero__stat">
                        <strong>JWT</strong>
                        <span>Authentication</span>
                    </div>
                    <div className="api-docs-hero__stat">
                        <strong>Stripe</strong>
                        <span>Payments</span>
                    </div>
                </div>
            </div>

            {/* Sections */}
            {apiSections.map((section) => (
                <section key={section.id} aria-labelledby={section.id}>
                    <SectionHeader
                        id={section.id}
                        icon={section.icon}
                        title={section.title}
                        description={section.description}
                        color={section.color}
                        count={section.endpoints.length}
                    />

                    {section.endpoints.map((ep) => (
                        <div id={ep.id} key={ep.id}>
                            <EndpointCard endpoint={ep} />
                        </div>
                    ))}
                </section>
            ))}

            {/* Footer */}
            <div
                style={{
                    marginTop: '60px',
                    padding: '28px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    textAlign: 'center',
                }}
            >
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    🏨 <strong style={{ color: 'var(--text-secondary)' }}>Hotel Booking Platform</strong> — API Documentation
                </p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    All endpoints base URL: <code style={{ color: 'var(--text-accent)' }}>https://api.hotelbooking.com/api/v1</code>
                </p>
            </div>
        </div>
    );
}
