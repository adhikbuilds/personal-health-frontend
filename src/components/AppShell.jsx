import { Outlet, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { api, safeQuery } from '../lib/api'

const navItems = [
  { to: '/', label: 'Overview' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/inbox', label: 'Inbox' },
  { to: '/community', label: 'Community' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/huddle', label: 'Huddle' },
  { to: '/plan', label: 'Plan' },
  { to: '/wellness', label: 'Wellness' },
  { to: '/map', label: 'Map' },
]

export function AppShell() {
  const statusQuery = useQuery({
    queryKey: ['frontend-status'],
    queryFn: () => safeQuery(() => api.get('/status'), { backend: 'offline' }),
    refetchInterval: 20_000,
  })

  const backendOnline = statusQuery.data?.backend === 'ok'

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <Link to="/" className="brand">
          <span className="brand-mark">PH</span>
          <div>
            <strong>Personal Health</strong>
            <small>TanStack Frontend</small>
          </div>
        </Link>

        <nav className="nav-stack">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="nav-link"
              activeProps={{ className: 'nav-link active' }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="status-card">
          <span className={`status-dot ${backendOnline ? 'online' : 'offline'}`} />
          <div>
            <strong>{backendOnline ? 'Backend online' : 'Backend offline'}</strong>
            <small>{backendOnline ? 'Live data flowing through Query.' : 'Showing fallbacks where possible.'}</small>
          </div>
        </div>
      </aside>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
