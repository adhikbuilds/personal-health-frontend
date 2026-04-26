import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, Link } from '@tanstack/react-router'
import { useUser } from '../../context/UserContext'
import { api, safeQuery } from '../../lib/api'
import { StravaLayout, PageHeader, StravaCard, ORANGE, DARK, GRAY, LIGHT, BORDER } from '../../components/StravaLayout'

export function TrainingCalendarPage() {
  const { user } = useUser()
  const navigate = useNavigate()

  if (!user) {
    navigate({ to: '/login' })
    return null
  }

  const athleteQuery = useQuery({
    queryKey: ['athlete-progress-calendar', user.userId],
    queryFn: () => safeQuery(
      () => api.get(`/athlete/${user.userId}/progress`),
      { sessions: [] }
    ),
  })

  const athlete = athleteQuery.data || {}
  const sessions = athlete.sessions || []
  const displayName = String(athlete?.athlete_name || user?.userId || user?.email || 'Athlete')

  const sessionByDate = {}
  sessions.forEach((s) => {
    if (!s.started_at) return
    const key = new Date(s.started_at).toISOString().slice(0, 10)
    if (!sessionByDate[key]) sessionByDate[key] = []
    sessionByDate[key].push(s)
  })

  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthName = today.toLocaleString('default', { month: 'long' })

  const totalSessions = sessions.length
  const thisMonthSessions = sessions.filter((s) => {
    if (!s.started_at) return false
    const d = new Date(s.started_at)
    return d.getFullYear() === year && d.getMonth() === month
  }).length
  const goalProgress = Math.min(100, (thisMonthSessions / 20) * 100)

  return (
    <StravaLayout displayName={displayName}>
      <PageHeader
        eyebrow="Training · Calendar"
        title={`${monthName} ${year}`}
        description="Visualize your sessions across the month. Stay consistent — your form score improves with frequency."
      />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
          <BigStat label="This Month" value={thisMonthSessions} unit="sessions" accent />
          <BigStat label="Total Sessions" value={totalSessions} unit="all-time" />
          <BigStat label="Monthly Goal" value={`${goalProgress.toFixed(0)}%`} unit="of 20" />
          <BigStat label="Streak" value={Math.min(thisMonthSessions, 7)} unit="days" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
          <StravaCard title={`${monthName} ${year}`} action={
            <span style={{ fontSize: '11px', color: GRAY }}>{thisMonthSessions} sessions logged</span>
          }>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', marginBottom: '8px' }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
                <div key={i} style={{ fontSize: '10px', color: GRAY, fontWeight: 700, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.5px', paddingBottom: '8px' }}>
                  {d}
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
              {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const dateStr = new Date(year, month, day).toISOString().slice(0, 10)
                const daySessions = sessionByDate[dateStr] || []
                const hasSession = daySessions.length > 0
                const isToday = day === today.getDate()
                const avgScore = hasSession
                  ? daySessions.reduce((a, s) => a + (s.summary?.avg_form_score || 0), 0) / daySessions.length
                  : 0
                return (
                  <div key={day} style={{
                    aspectRatio: '1',
                    background: isToday ? DARK : hasSession ? ORANGE : LIGHT,
                    color: isToday ? ORANGE : hasSession ? '#fff' : DARK,
                    borderRadius: '4px',
                    padding: '8px',
                    fontSize: '12px',
                    fontWeight: isToday || hasSession ? 700 : 500,
                    cursor: hasSession ? 'pointer' : 'default',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: isToday ? `2px solid ${ORANGE}` : 'none',
                  }}>
                    <span>{day}</span>
                    {hasSession && (
                      <span style={{ fontSize: '14px', fontWeight: 800, lineHeight: 1 }}>
                        {avgScore.toFixed(0)}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${BORDER}`, fontSize: '11px', color: GRAY }}>
              <Legend color={ORANGE} label="Session logged" />
              <Legend color={DARK} label="Today" />
              <Legend color={LIGHT} label="Rest day" border />
            </div>
          </StravaCard>

          <div>
            <StravaCard title="Monthly Goal">
              <div style={{ fontSize: '32px', fontWeight: 800, color: ORANGE, lineHeight: 1 }}>
                {thisMonthSessions}<span style={{ fontSize: '16px', color: GRAY, fontWeight: 600 }}> / 20</span>
              </div>
              <div style={{ fontSize: '11px', color: GRAY, marginTop: '6px' }}>Sessions this month</div>
              <div style={{ height: '6px', background: LIGHT, borderRadius: '3px', marginTop: '12px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${goalProgress}%`, background: ORANGE }} />
              </div>
            </StravaCard>

            <div style={{ height: '12px' }} />

            <StravaCard title="Recent Sessions" padding="0">
              {sessions.slice(-5).reverse().map((s, i, arr) => (
                <Link
                  key={i}
                  to="/session/$sessionId"
                  params={{ sessionId: s.session_id || '' }}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderBottom: i < arr.length - 1 ? `1px solid ${LIGHT}` : 'none',
                    textDecoration: 'none',
                    color: DARK,
                  }}
                >
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'capitalize' }}>
                      {String(s.sport || 'Training').replace(/_/g, ' ')}
                    </div>
                    <div style={{ fontSize: '10px', color: GRAY, marginTop: '2px' }}>
                      {s.started_at ? new Date(s.started_at).toLocaleDateString() : '—'}
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: ORANGE }}>
                    {(s.summary?.avg_form_score || 0).toFixed(0)}
                  </div>
                </Link>
              ))}
              {sessions.length === 0 && (
                <div style={{ padding: '24px', textAlign: 'center', fontSize: '12px', color: GRAY }}>
                  No sessions yet
                </div>
              )}
            </StravaCard>
          </div>
        </div>
      </div>
    </StravaLayout>
  )
}

function BigStat({ label, value, unit, accent }) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: '4px', padding: '20px' }}>
      <div style={{ fontSize: '11px', fontWeight: 700, color: GRAY, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
        {label}
      </div>
      <div style={{ fontSize: '32px', fontWeight: 800, color: accent ? ORANGE : DARK, lineHeight: 1 }}>
        {value}
        {unit && <span style={{ fontSize: '12px', fontWeight: 500, color: GRAY, marginLeft: '6px' }}>{unit}</span>}
      </div>
    </div>
  )
}

function Legend({ color, label, border }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span style={{ width: '12px', height: '12px', background: color, borderRadius: '2px', border: border ? `1px solid ${BORDER}` : 'none' }} />
      {label}
    </div>
  )
}
