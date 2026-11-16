import { useQuery } from '@tanstack/react-query'
import { api, safeQuery } from '../lib/api'
import { DataList, LinkRow, LoadingBlock, PageIntro, Panel, StatCard, StatGrid, MiniBars, Pill } from '../components/Primitives'

export function HomePage() {
  const healthQuery = useQuery({
    queryKey: ['health'],
    queryFn: () => safeQuery(() => api.get('/health'), { status: 'offline', athletes_count: 0, sessions_count: 0 }),
  })
  const activeQuery = useQuery({
    queryKey: ['active-sessions'],
    queryFn: () => safeQuery(() => api.get('/sessions/active'), { count: 0, active_sessions: [] }),
  })
  const leaderboardQuery = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => safeQuery(() => api.get('/leaderboard'), { leaderboard: [] }),
  })
  const sessionsQuery = useQuery({
    queryKey: ['recent-sessions'],
    queryFn: () => safeQuery(() => api.get('/sessions?limit=8&status=completed'), { sessions: [] }),
  })

  const recentSessions = sessionsQuery.data?.sessions || []
  const avgForm = recentSessions.length
    ? (
        recentSessions
          .map((session) => session.summary?.avg_form_score)
          .filter((score) => score != null)
          .reduce((sum, score) => sum + score, 0) /
        Math.max(recentSessions.filter((session) => session.summary?.avg_form_score != null).length, 1)
      ).toFixed(1)
    : '—'

  return (
    <>
      <PageIntro
        eyebrow="Product overview"
        title="Coach workflows, athlete readiness, and live biomechanics in one surface."
        description="This frontend now runs on TanStack Router for app structure and TanStack Query for data flow, so every page pulls directly from the existing sports backend instead of hard-coded templates."
        actions={<Pill tone="live">TanStack Router + Query</Pill>}
      />

      <StatGrid>
        <StatCard label="Athletes" value={healthQuery.data?.athletes_count ?? 0} hint="Registered in the backend" tone="brand" />
        <StatCard label="Sessions" value={healthQuery.data?.sessions_count ?? 0} hint="Total tracked sessions" />
        <StatCard label="Active now" value={activeQuery.data?.count ?? 0} hint="Currently training" tone="success" />
        <StatCard label="Avg form" value={avgForm} hint="Across recent completed sessions" tone="warm" />
      </StatGrid>

      <div className="content-grid">
        <Panel title="What the product now does well" kicker="Narrative">
          <div className="feature-grid">
            <div className="feature-card">
              <strong>Realtime monitoring</strong>
              <p>Track live sessions, surface top performers, and keep a clear view of who needs support.</p>
            </div>
            <div className="feature-card">
              <strong>Weekly planning</strong>
              <p>Turn backend readiness signals into weekly plans, adherence tracking, and daily session focus.</p>
            </div>
            <div className="feature-card">
              <strong>Coach triage</strong>
              <p>Morning priorities, athlete drill-down, and session review all sit inside one consistent route system.</p>
            </div>
          </div>
        </Panel>

        <Panel
          title="Recent form trend"
          kicker="Signal"
          right={<Pill tone={healthQuery.data?.status === 'ok' ? 'success' : 'neutral'}>{healthQuery.data?.status === 'ok' ? 'live backend' : 'offline fallback'}</Pill>}
        >
          {sessionsQuery.isLoading ? (
            <LoadingBlock />
          ) : (
            <div className="trend-panel">
              <MiniBars values={recentSessions.map((session) => session.summary?.avg_form_score || 0)} />
              <div className="trend-copy">
                <strong>{avgForm}</strong>
                <span>average form score from the latest completed sessions</span>
              </div>
            </div>
          )}
        </Panel>
      </div>

      <div className="content-grid">
        <Panel title="Top athletes" kicker="Leaderboard">
          {leaderboardQuery.isLoading ? (
            <LoadingBlock />
          ) : (
            <DataList
              items={leaderboardQuery.data?.leaderboard?.slice(0, 6) || []}
              empty="No leaderboard data yet."
              renderItem={(athlete, index) => (
                <LinkRow
                  key={athlete.id || athlete.name || index}
                  to="/athlete/$athleteId"
                  params={{ athleteId: athlete.id || athlete.athlete_id }}
                  title={`${index + 1}. ${athlete.name || athlete.id}`}
                  meta={`${athlete.sport || 'Unknown sport'} · ${athlete.tier || 'Athlete'}`}
                  right={`${athlete.bpi || 0} BPI`}
                />
              )}
            />
          )}
        </Panel>

        <Panel title="Recent sessions" kicker="Review">
          {sessionsQuery.isLoading ? (
            <LoadingBlock />
          ) : (
            <DataList
              items={recentSessions}
              empty="No sessions yet."
              renderItem={(session) => (
                <LinkRow
                  key={session.id || session.session_id}
                  to="/session/$sessionId"
                  params={{ sessionId: session.id || session.session_id }}
                  title={session.athlete_id || 'Unknown athlete'}
                  meta={`${session.sport || 'Unknown sport'} · ${session.started_at?.slice(0, 10) || 'No date'}`}
                  right={`${session.summary?.avg_form_score?.toFixed?.(1) || session.summary?.avg_form_score || '—'} score`}
                />
              )}
            />
          )}
        </Panel>
      </div>
    </>
  )
}
