interface SummaryCardProps {
  label: string;
  value: number;
  detail: string;
  onClick?: () => void;
}

export default function SummaryCard({ label, value, detail, onClick }: SummaryCardProps) {
  return (
    <article
      className={`summary-metric${onClick ? ' is-clickable' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
    >
      <span className="summary-label">{label}</span>
      <strong className="summary-value">{value.toLocaleString()}</strong>
      <span className="summary-detail">{detail}</span>
    </article>
  );
}
