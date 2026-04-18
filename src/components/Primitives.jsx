import { Link } from '@tanstack/react-router'

export function PageIntro({ eyebrow, title, description, actions }) {
  return (
    <section className="page-intro">
      <div>
        {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {actions ? <div className="page-actions">{actions}</div> : null}
    </section>
  )
}

export function StatGrid({ children }) {
  return <div className="stat-grid">{children}</div>
}

export function StatCard({ label, value, hint, tone = 'default' }) {
  return (
    <article className={`stat-card tone-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{hint}</small>
    </article>
  )
}

export function Panel({ title, kicker, right, children, className = '' }) {
  return (
    <section className={`panel ${className}`.trim()}>
      {(title || right || kicker) ? (
        <div className="panel-head">
          <div>
            {kicker ? <div className="eyebrow">{kicker}</div> : null}
            {title ? <h2>{title}</h2> : null}
          </div>
          {right ? <div>{right}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  )
}

export function DataList({ items, renderItem, empty = 'Nothing here yet.' }) {
  if (!items?.length) return <div className="empty-block">{empty}</div>
  return <div className="list-stack">{items.map(renderItem)}</div>
}

export function LinkRow({ to, params, title, meta, right, search }) {
  return (
    <Link to={to} params={params} search={search} className="list-row">
      <div>
        <strong>{title}</strong>
        <span>{meta}</span>
      </div>
      <em>{right}</em>
    </Link>
  )
}

export function LoadingBlock({ label = 'Loading…' }) {
  return <div className="empty-block loading">{label}</div>
}

export function Pill({ children, tone = 'neutral' }) {
  return <span className={`pill tone-${tone}`}>{children}</span>
}

export function ProgressBar({ value = 0 }) {
  return (
    <div className="progress-shell">
      <div className="progress-bar" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  )
}

export function MiniBars({ values = [] }) {
  const max = Math.max(...values, 1)
  return (
    <div className="mini-bars">
      {values.map((value, index) => (
        <span
          key={`${value}-${index}`}
          style={{ height: `${Math.max(12, (value / max) * 100)}%` }}
        />
      ))}
    </div>
  )
}
