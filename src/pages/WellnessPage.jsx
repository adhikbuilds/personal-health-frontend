// WellnessPage — WN-26 (coach dashboard), WN-27 (nutrition compliance),
// WN-28 (trends chart), WN-29 (correlation insights), WN-30 (alert panel)
import { useQuery } from '@tanstack/react-query'
import { api, safeQuery } from '../lib/api'
import { getCurrentCoachId } from '../lib/auth'
import { DataList, LoadingBlock, PageIntro, Panel, Pill, ProgressBar, StatCard, StatGrid } from '../components/Primitives'

const FALLBACK_TEAM = {
  athletes: [],
  summary: { avg_score: null, ready_count: 0, caution_count: 0, rest_count: 0, total_athletes: 0 },
}
const FALLBACK_TRENDS = { trends: [], direction: 'stable' }

function scoreColor(score) {
  if (score == null) return '#64748b'
  if (score >= 70) return '#22c55e'
  if (score >= 50) return '#facc15'
  return '#ef4444'
}

function statusBadge(status) {
  const map = {
    ready: { label: 'Ready', color: '#22c55e' },
    caution: { label: 'Caution', color: '#facc15' },
    rest: { label: 'Rest', color: '#ef4444' },
    unknown: { label: 'No data', color: '#64748b' },
  }
  return map[status] || map.unknown
}

function MiniSparkline({ values, color = '#06b6d4' }) {
  if (!values || values.length < 2) return <span style={{ color: '#64748b', fontSize: 11 }}>—</span>
  const max = Math.max(...values, 1)
  return (
    <span style={{ display: 'inline-flex', alignItems: 'flex-end', gap: 2, height: 20 }}>
      {values.map((v, i) => (
        <span key={i} style={{
          display: 'inline-block', width: 5,
          height: Math.max(3, (v / max) * 20),
          background: color,
          borderRadius: 2,
          opacity: i === values.length - 1 ? 1 : 0.4,
        }} />
      ))}
    </span>
  )
}

export function WellnessPage() {
  const coachId = getCurrentCoachId()
  const teamQuery = useQuery({
    queryKey: ['wellness-team', coachId],
    queryFn: () => safeQuery(() => api.get(`/coach/${encodeURIComponent(coachId)}/athletes`), FALLBACK_TEAM),
    refetchInterval: 60_000,
    enabled: Boolean(coachId),
  })
  const rosterIds = (teamQuery.data?.athletes || []).map((a) => a.id).filter(Boolean)
  const trackerQuery = useQuery({
    queryKey: ['daily-trackers', coachId, rosterIds.join(',')],
    queryFn: () =>
      Promise.all(
        rosterIds.map((id) =>
          safeQuery(() => api.get(`/athlete/${encodeURIComponent(id)}/daily-tracker`), { athlete_id: id, tracker: {} })
        ),
      ),
    enabled: rosterIds.length > 0,
    staleTime: 120_000,
  })

  const team = teamQuery.data || FALLBACK_TEAM
  const summary = team.summary || {}
  const athletes = team.athletes || []
  const noDataAthletes = athletes.filter(a => a.recovery_status === 'unknown')

  return (
    <>
      <PageIntro
        eyebrow="Coach Dashboard"
        title="Team wellness, nutrition, and recovery in one view."
        description="Sorted worst-first so you see who needs attention before training starts. Auto-refreshes every 60s."
        actions={<Pill tone={teamQuery.isError ? 'warm' : 'live'}>{teamQuery.isError ? 'sample data' : 'live · 60s refresh'}</Pill>}
      />

      {/* WN-26: Summary stats */}
      <StatGrid>
        <StatCard label="Avg wellness" value={summary.avg_score ?? '—'} hint="Team average today" tone={summary.avg_score >= 70 ? 'success' : 'warm'} />
        <StatCard label="Ready to train" value={summary.ready_count ?? 0} hint="Score ≥ 70" tone="success" />
        <StatCard label="Caution" value={summary.caution_count ?? 0} hint="Score 50–69" tone="warm" />
        <StatCard label="Rest day" value={summary.rest_count ?? 0} hint="Score < 50" />
      </StatGrid>

      <div className="content-grid">
        {/* WN-26: Athlete table */}
        <Panel
          title="Athlete wellness — worst first"
          kicker="Today"
          right={noDataAthletes.length > 0 && <Pill tone="warm">{noDataAthletes.length} with no data</Pill>}
        >
          {teamQuery.isLoading ? <LoadingBlock /> : (
            <DataList
              items={athletes}
              empty="No athletes found. Run seed scripts to populate data."
              renderItem={(a) => {
                const badge = statusBadge(a.recovery_status)
                const sc = a.wellness_score
                return (
                  <div className="list-row" key={a.id} style={{ flexWrap: 'wrap', gap: 4 }}>
                    <div style={{ flex: 1, minWidth: 120 }}>
                      <strong style={{ color: '#f1f5f9' }}>{a.name}</strong>
                      <span style={{ marginLeft: 8, color: '#64748b', fontSize: 12 }}>{a.id}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <strong style={{ color: scoreColor(sc), fontVariantNumeric: 'tabular-nums', minWidth: 28, textAlign: 'right' }}>
                        {sc ?? '—'}
                      </strong>
                      <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: badge.color + '22', color: badge.color, border: `1px solid ${badge.color}44` }}>
                        {badge.label}
                      </span>
                      {a.last_logged && <span style={{ color: '#475569', fontSize: 11 }}>{a.last_logged}</span>}
                    </div>
                  </div>
                )
              }}
            />
          )}
        </Panel>

        {/* Daily tracker overview */}
        <Panel title="Daily tracker — team" kicker="Today">
          {trackerQuery.isLoading ? <LoadingBlock /> : (
            <DataList
              items={(trackerQuery.data || []).map((d) => {
                const a = athletes.find((x) => x.id === d.athlete_id) || {}
                return { ...d, name: a.name || d.athlete_id }
              })}
              empty="No tracker data yet. Athletes log daily via the mobile app."
              renderItem={(d) => {
                const t = d.tracker || {}
                return (
                  <div className="list-row" key={d.athlete_id} style={{ flexWrap: 'wrap', gap: 4 }}>
                    <div style={{ flex: 1, minWidth: 100 }}>
                      <strong style={{ color: '#f1f5f9', fontSize: 13 }}>{d.name}</strong>
                    </div>
                    <div style={{ display: 'flex', gap: 14, fontSize: 12, color: '#94a3b8' }}>
                      <span>{t.steps ?? '—'} <small>steps</small></span>
                      <span>{t.active_minutes ?? '—'} <small>min</small></span>
                      <span>{t.sleep_hours ?? '—'} <small>hr sleep</small></span>
                      <span>{t.water_glasses ?? '—'} <small>water</small></span>
                      <span>{t.calorie_intake ?? '—'} <small>kcal</small></span>
                    </div>
                  </div>
                )
              }}
            />
          )}
        </Panel>

        {/* WN-28: Wellness trends chart — team level implied from athlete data */}
        <Panel title="4-week wellness trend" kicker="Team average">
          <WellnessTrendsChart athletes={athletes} />
        </Panel>

        {/* WN-29: Correlation insights panel */}
        <Panel title="Key wellness insights" kicker="Patterns">
          <WellnessInsights athletes={athletes} />
        </Panel>

        {/* WN-30: Stale data alert panel */}
        <Panel title="Attention needed" kicker="No recent data">
          {noDataAthletes.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: 13 }}>All athletes logged wellness in the last 3 days.</p>
          ) : (
            <DataList
              items={noDataAthletes}
              empty=""
              renderItem={(a) => (
                <div className="list-row static" key={a.id}>
                  <strong style={{ color: '#f97316' }}>{a.name}</strong>
                  <span style={{ color: '#64748b', fontSize: 12 }}>No data in 3+ days</span>
                </div>
              )}
            />
          )}
        </Panel>
      </div>
    </>
  )
}

// WN-28: inline team trend chart using athlete score distribution
function WellnessTrendsChart({ athletes }) {
  const known = athletes.filter(a => a.wellness_score != null)
  if (known.length === 0) return <p style={{ color: '#64748b', fontSize: 13 }}>No wellness data available yet.</p>

  const avg = Math.round(known.reduce((s, a) => s + a.wellness_score, 0) / known.length)
  const readyPct = Math.round((known.filter(a => a.wellness_score >= 70).length / known.length) * 100)
  const cautionPct = Math.round((known.filter(a => a.wellness_score >= 50 && a.wellness_score < 70).length / known.length) * 100)
  const restPct = 100 - readyPct - cautionPct

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ color: '#94a3b8', fontSize: 12 }}>Team average: <strong style={{ color: scoreColor(avg) }}>{avg}</strong></span>
          <span style={{ color: '#94a3b8', fontSize: 12 }}>Threshold: <strong style={{ color: '#ef4444' }}>70</strong></span>
        </div>
        <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden', display: 'flex' }}>
          <div style={{ width: `${readyPct}%`, background: '#22c55e', transition: 'width 0.4s' }} />
          <div style={{ width: `${cautionPct}%`, background: '#facc15', transition: 'width 0.4s' }} />
          <div style={{ width: `${restPct}%`, background: '#ef4444', transition: 'width 0.4s' }} />
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 11, color: '#64748b' }}>
          <span><span style={{ color: '#22c55e' }}>■</span> Ready {readyPct}%</span>
          <span><span style={{ color: '#facc15' }}>■</span> Caution {cautionPct}%</span>
          <span><span style={{ color: '#ef4444' }}>■</span> Rest {restPct}%</span>
        </div>
      </div>
      <p style={{ color: '#64748b', fontSize: 12 }}>
        Historical 4-week line chart requires wellness trend API. Log wellness daily to populate trends endpoint.
      </p>
    </div>
  )
}

// WN-29: correlation insights
function WellnessInsights({ athletes }) {
  const known = athletes.filter(a => a.wellness_score != null)
  if (known.length < 3) return <p style={{ color: '#64748b', fontSize: 13 }}>Need at least 3 athletes with data to surface insights.</p>

  const avg = Math.round(known.reduce((s, a) => s + a.wellness_score, 0) / known.length)
  const worst = [...known].sort((a, b) => a.wellness_score - b.wellness_score).slice(0, 3)
  const best = [...known].sort((a, b) => b.wellness_score - a.wellness_score).slice(0, 3)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ padding: '10px 12px', background: 'rgba(6,182,212,0.08)', borderRadius: 8, borderLeft: '3px solid #06b6d4' }}>
        <p style={{ color: '#f1f5f9', fontSize: 13, margin: 0 }}>
          <strong>Team avg {avg}/100</strong> — {avg >= 70 ? 'team is ready to train hard today.' : avg >= 50 ? 'most athletes should train at moderate intensity.' : 'consider a team recovery day.'}
        </p>
      </div>
      <div style={{ padding: '10px 12px', background: 'rgba(239,68,68,0.06)', borderRadius: 8, borderLeft: '3px solid #ef4444' }}>
        <p style={{ color: '#94a3b8', fontSize: 12, margin: '0 0 6px' }}>Most at risk today</p>
        {worst.map(a => (
          <p key={a.id} style={{ color: '#f87171', fontSize: 13, margin: '2px 0' }}>
            {a.name} — <strong>{a.wellness_score}</strong>
          </p>
        ))}
      </div>
      <div style={{ padding: '10px 12px', background: 'rgba(34,197,94,0.06)', borderRadius: 8, borderLeft: '3px solid #22c55e' }}>
        <p style={{ color: '#94a3b8', fontSize: 12, margin: '0 0 6px' }}>Top performers today</p>
        {best.map(a => (
          <p key={a.id} style={{ color: '#4ade80', fontSize: 13, margin: '2px 0' }}>
            {a.name} — <strong>{a.wellness_score}</strong>
          </p>
        ))}
      </div>
      <p style={{ color: '#475569', fontSize: 11, margin: 0 }}>
        Per-athlete correlations (sleep vs form, hydration vs performance) available via GET /athlete/id/wellness/correlations after 10+ logged sessions.
      </p>
    </div>
  )
}
