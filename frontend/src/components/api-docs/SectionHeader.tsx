interface SectionHeaderProps {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
  count: number;
}

export function SectionHeader({ id, icon, title, description, color, count }: SectionHeaderProps) {
  return (
    <div className="section-header" id={id}>
      <div
        className="section-header__icon"
        style={{ background: `${color}20`, border: `1px solid ${color}40` }}
      >
        <span style={{ fontSize: '1.2rem' }}>{icon}</span>
      </div>
      <div className="section-header__info">
        <h2 className="section-header__title" style={{ color }}>
          {title}
        </h2>
        <p className="section-header__desc">{description}</p>
      </div>
      <span className="section-header__count">{count} endpoints</span>
    </div>
  );
}
