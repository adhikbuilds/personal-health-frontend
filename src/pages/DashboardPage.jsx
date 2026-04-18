import { useQuery } from '@tanstack/react-query'
import { api, safeQuery } from '../lib/api'
import { DataList, LoadingBlock, PageIntro, Panel, Pill, ProgressBar, StatCard, StatGrid } from '../components/Primitives'

export function DashboardPage() {
  const activeQuery = useQuery({
    queryKey: ['dashboard-active'],
    queryFn: () => safeQuery(() => api.get('/sessions/active'), { count: 0, active_sessions: [] }),
    refetchInterval: 5000,
  })
  const healthQuery = useQuery({
    queryKey: ['dashboard-health'],
    queryFn: () => safeQuery(() => api.get('/health'), { athletes_count: 0, sessions_count: 0 }),
  })
  const leaderboardQuery = useQuery({
    queryKey: ['dashboard-leaderboard'],
    queryFn: () => safeQuery(() => api.get('/leaderboard'), { leaderboard: [] }),
  })

  return (
    <>
      <PageIntro
        eyebrow="Operations"
        title="Live dashboard for sessions, score spread, and coach attention."
        description="TanStack Query keeps the live panels fresh without wiring custom fetch logic into every widget."
        actions={<Pill tone="live">Refetching live sessions every 5s</Pill>}
      />

      <StatGrid>
        <StatCard label="Active sessions" value={activeQuery.data?.count ?? 0} hint="Current mobile streams" tone="success" />
        <StatCard label="Athletes" value={healthQuery.data?.athletes_count ?? 0} hint="Known athlete records" />
        <StatCard label="Total sessions" value={healthQuery.data?.sessions_count ?? 0} hint="Historical volume" />
        <StatCard label="Leaderboard size" value={leaderboardQuery.data?.leaderboard?.length ?? 0} hint="Athletes currently ranked" tone="brand" />
      </StatGrid>

      <div className="content-grid">
        <Panel title="Live on app" kicker="Now">
          {activeQuery.isLoading ? (
            <LoadingBlock />
          ) : (
            <DataList
              items={activeQuery.data?.active_sessions || []}
              empty="No athletes are actively streaming right now."
              renderItem={(session) => (
                <div className="list-row static" key={session.session_id}>
                  <div>
                    <strong>{session.athlete_id || 'Unknown athlete'}</strong>
                    <span>{session.sport || 'Unknown sport'} · {session.session_id}</span>
                  </div>
                  <em>{session.status || 'active'}</em>
                </div>
              )}
            />
          )}
        </Panel>

        <Panel title="Leaderboard pressure" kicker="Attention">
          {leaderboardQuery.isLoading ? (
            <LoadingBlock />
          ) : (
            <div className="rank-stack">
              {(leaderboardQuery.data?.leaderboard || []).slice(0, 6).map((athlete, index) => {
                const score = athlete.bpi || 0
                const fill = Math.min(100, Math.max(10, score / 20))
                return (
                  <div className="rank-row" key={athlete.id || athlete.name || index}>
                    <div className="rank-copy">
                      <strong>{index + 1}. {athlete.name || athlete.id}</strong>
                      <span>{athlete.sport || 'Unknown sport'}</span>
                    </div>
                    <div className="rank-score">
                      <em>{score} BPI</em>
                      <ProgressBar value={fill} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Panel>
      </div>
    </>
  )
}
