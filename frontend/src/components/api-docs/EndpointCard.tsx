import { useState } from 'react';
import { ChevronDown, Copy, Check, Lock, Shield, Globe } from 'lucide-react';
import type { Endpoint } from '../../data/endpoints';
import { MethodBadge } from './MethodBadge';

interface EndpointCardProps {
    endpoint: Endpoint;
}

function responseClass(code: number): string {
    if (code >= 200 && code < 300) {
        if (code === 201) return 'created';
        if (code === 204) return 'no-content';
        return 'success';
    }
    if (code === 400) return 'bad-request';
    if (code === 401) return 'unauthorized';
    if (code === 403) return 'forbidden';
    if (code === 404) return 'not-found';
    if (code === 409) return 'conflict';
    return 'bad-request';
}

function formatPath(path: string) {
    return path.replace(/\{([^}]+)\}/g, (_, p) => `{${p}}`);
}

function buildCurl(endpoint: Endpoint): string {
    const method = endpoint.method;
    const url = `https://api.hotelbooking.com${endpoint.path}`;

    const authHeader =
        endpoint.auth === 'bearer'
            ? '\n  -H "Authorization: Bearer <your_token>"'
            : endpoint.auth === 'admin'
                ? '\n  -H "Authorization: Bearer <admin_token>"'
                : '';

    const contentType =
        endpoint.bodyFields && endpoint.bodyFields.length > 0
            ? '\n  -H "Content-Type: application/json"'
            : '';

    let body = '';
    if (endpoint.bodyFields && endpoint.bodyFields.length > 0) {
        const example: Record<string, string | number | boolean> = {};
        endpoint.bodyFields.forEach((f) => {
            if (f.type === 'guid') example[f.name] = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
            else if (f.type === 'integer') example[f.name] = 1;
            else if (f.type === 'decimal') example[f.name] = 0.0;
            else if (f.type === 'boolean') example[f.name] = true;
            else if (f.type === 'date') example[f.name] = '2025-06-15';
            else if (f.type === 'file') example[f.name] = '@/path/to/image.jpg';
            else if (f.type === 'guid[]') example[f.name] = '["3fa85f64-5717-4562-b3fc-2c963f66afa6"]' as unknown as string;
            else example[f.name] = `<${f.name}>`;
        });
        body = `\n  -d '${JSON.stringify(example, null, 2)}'`;
    }

    return `curl -X ${method} "${url}"${authHeader}${contentType}${body}`;
}

export function EndpointCard({ endpoint }: EndpointCardProps) {
    const [expanded, setExpanded] = useState(false);
    const [copied, setCopied] = useState(false);

    const curlCmd = buildCurl(endpoint);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(curlCmd);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const hasParts =
        expanded && (
            (endpoint.params && endpoint.params.length > 0) ||
            (endpoint.bodyFields && endpoint.bodyFields.length > 0) ||
            endpoint.responses.length > 0
        );

    return (
        <div className={`endpoint-card ${expanded ? 'expanded' : ''}`}>
            {/* Header */}
            <div
                className="endpoint-card__header"
                onClick={() => setExpanded((p) => !p)}
                role="button"
                aria-expanded={expanded}
            >
                <MethodBadge method={endpoint.method} />

                {/* Auth badge */}
                {endpoint.auth === 'bearer' && (
                    <span className="auth-badge bearer">
                        <Lock size={10} />
                        Bearer
                    </span>
                )}
                {endpoint.auth === 'admin' && (
                    <span className="auth-badge admin">
                        <Shield size={10} />
                        Admin
                    </span>
                )}
                {endpoint.auth === 'none' && (
                    <span className="auth-badge public">
                        <Globe size={10} />
                        Public
                    </span>
                )}

                <span className="endpoint-card__path">
                    {formatPath(endpoint.path)}
                </span>
                <span className="endpoint-card__summary">{endpoint.summary}</span>
                <ChevronDown size={16} className="endpoint-card__chevron" />
            </div>

            {/* Body */}
            <div className="endpoint-card__body">
                {hasParts && (
                    <div className="endpoint-card__body-inner">
                        {/* Description */}
                        {endpoint.description && (
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '-8px' }}>
                                {endpoint.description}
                            </p>
                        )}

                        {/* Path / Query Params */}
                        {endpoint.params && endpoint.params.length > 0 && (
                            <div className="params-section">
                                <h4>Parameters</h4>
                                <table className="params-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>In</th>
                                            <th>Type</th>
                                            <th>Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {endpoint.params.map((p) => (
                                            <tr key={p.name}>
                                                <td>
                                                    {p.name}
                                                    {p.required && <span className="param-required">*</span>}
                                                </td>
                                                <td>
                                                    <span className="param-type">{p.in}</span>
                                                </td>
                                                <td>
                                                    <span className="param-type">{p.type}</span>
                                                </td>
                                                <td>{p.description}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Body fields */}
                        {endpoint.bodyFields && endpoint.bodyFields.length > 0 && (
                            <div className="body-section">
                                <h4>Request Body</h4>
                                <table className="params-table">
                                    <thead>
                                        <tr>
                                            <th>Field</th>
                                            <th>Type</th>
                                            <th>Required</th>
                                            <th>Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {endpoint.bodyFields.map((f) => (
                                            <tr key={f.name}>
                                                <td>
                                                    {f.name}
                                                    {f.required && <span className="param-required">*</span>}
                                                </td>
                                                <td>
                                                    <span className="param-type">{f.type}</span>
                                                </td>
                                                <td>
                                                    <span
                                                        style={{
                                                            color: f.required ? 'var(--delete)' : 'var(--text-muted)',
                                                            fontSize: '0.72rem',
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        {f.required ? 'required' : 'optional'}
                                                    </span>
                                                </td>
                                                <td>{f.description}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* cURL */}
                        <div className="curl-section">
                            <h4>cURL Example</h4>
                            <div className="curl-block">
                                <button
                                    className={`curl-copy-btn ${copied ? 'copied' : ''}`}
                                    onClick={handleCopy}
                                >
                                    {copied ? <Check size={12} /> : <Copy size={12} />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                                <pre>{curlCmd}</pre>
                            </div>
                        </div>

                        {/* Responses */}
                        <div className="responses-section">
                            <h4>Response Codes</h4>
                            <div className="response-codes">
                                {endpoint.responses.map((r) => (
                                    <span key={r.code} className={`response-code ${responseClass(r.code)}`}>
                                        <strong>{r.code}</strong>
                                        <span style={{ color: 'inherit', opacity: 0.8, fontFamily: 'Inter' }}>
                                            {r.description}
                                        </span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
