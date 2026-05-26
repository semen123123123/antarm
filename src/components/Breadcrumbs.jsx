import { Link } from 'react-router-dom';

export default function Breadcrumbs({ items, style, color = 'var(--text-muted)', activeColor = 'var(--text-primary)' }) {
  return (
    <nav aria-label="Навигация" style={{
      display: 'flex',
      gap: 8,
      fontSize: 13,
      color: color,
      marginBottom: 24,
      flexWrap: 'wrap',
      ...style,
    }}>
      <Link to="/" style={{ color: color }}>
        Главная
      </Link>
      {items.map((item, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: color }}>/</span>
          {i === items.length - 1 ? (
            <span style={{ color: activeColor }}>{item.label}</span>
          ) : (
            <Link to={item.to} style={{ color: color }}>
              {item.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
