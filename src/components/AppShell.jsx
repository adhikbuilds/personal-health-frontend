import { Outlet, Link, useNavigate, useLocation } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { api, safeQuery } from '../lib/api'
import { useCurrentUser, isAuthed, logout } from '../lib/auth'

const navItems = [
  { to: '/', label: 'Overview' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/compose', label: 'Compose' },
  { to: '/inbox', label: 'Inbox' },
  { to: '/community', label: 'Community' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/huddle', label: 'Huddle' },
  { to: '/plan', label: 'Plan' },
  { to: '/wellness', label: 'Wellness Analytics' },
  { to: '/map', label: 'Map' },
]

export function AppShell() {
  const navigate = useNavigate()
  const location = useLocation()
  const user     = useCurrentUser()
  const onLoginPage = location.pathname === '/login'

  // Auth gate: if no token, route to /login. If on /login but already
  // authed, route to /. Lives in an effect so the navigation doesn't
  // race the first render.
  useEffect(() => {
    if (!isAuthed() && !onLoginPage) {
      navigate({ to: '/login', replace: true })
    } else if (isAuthed() && onLoginPage) {
      navigate({ to: '/', replace: true })
    }
  }, [navigate, onLoginPage, user?.id])

  const statusQuery = useQuery({
    queryKey: ['frontend-status'],
    queryFn: () => safeQuery(() => api.get('/status'), { backend: 'offline' }),
    refetchInterval: 20_000,
    enabled: isAuthed(),
  })

  const backendOnline = statusQuery.data?.backend === 'ok'

  // On the login route, render the bare outlet — no sidebar, no nav.
  if (onLoginPage) {
    return (
      <div className="app-shell auth-only">
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    )
  }

  // Show a minimal splash so the redirect doesn't flash protected nav.
  if (!isAuthed()) {
    return (
      <div className="app-shell">
        <main className="app-main"><div className="empty-block">Redirecting to sign in…</div></main>
      </div>
    )
  }

  const handleLogout = async () => {
    await logout()
    navigate({ to: '/login', replace: true })
  }

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

        {user && (
          <div className="status-card auth-card">
            <span className="status-dot online" />
            <div>
              <strong>{user.name || user.email}</strong>
              <small>{user.email} · {user.role || 'athlete'}</small>
            </div>
            <button type="button" className="logout-btn" onClick={handleLogout}>
              Sign out
            </button>
          </div>
        )}
      </aside>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
