import type { HttpMethod } from '../../data/endpoints';

interface MethodBadgeProps {
  method: HttpMethod;
}

export function MethodBadge({ method }: MethodBadgeProps) {
  return <span className={`method-badge ${method}`}>{method}</span>;
}
