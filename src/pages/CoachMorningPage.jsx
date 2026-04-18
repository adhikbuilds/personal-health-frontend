// FH-06: Coach Morning Briefing — high-signal triage for coaches opening at 6am
// Pulls /coach/{id}/priorities (urgency-ranked) + /wellness/team-overview
import { useQuery } from '@tanstack/react-query'
import { api, safeQuery } from '../lib/api'
import { DataList, LoadingBlock, PageIntro, Panel, Pill, StatCard, StatGrid } from '../components/Primitives'

const FALLBACK_PRIORITIES = { priorities: [], roster_size: 0 }
const FALLBACK_TEAM = {
  athletes: [],
  summary: { avg_score: null, ready_count: 0, caution_count: 0, rest_count: 0, total_athletes: 0 },
}

const URGENCY_CONFIG = {
  injury_risk_high: { label: 'Injury risk',   color: '#ef4444', bg: 'rgba(239,68,68,0.08)',   icon: '⚠' },
  form_decay:       { label: 'Form drop',     color: '#f97316', bg: 'rgba(249,115,22,0.08)',   icon: '↓' },
  idle:             { label: 'Not training',  color: '#facc15', bg: 'rgba(250,204,21,0.08)',   icon: '⏸' },
  streak_risk:      { label: 'Streak risk',   color: '#facc15', bg: 'rgba(250,204,21,0.08)',   icon: '🔥' },
  personal_best:    { label: 'Personal best', color: '#22c55e', bg: 'rgba(34,197,94,0.08)',    icon: '★' },
}

function UrgencyBadge({ code }) {
  const cfg = URGENCY_CONFIG[code] || { label: code, color: '#64748b', bg: 'rgba(100,116,139,0.08)', icon: '·' }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700,
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30`,
    }}>
      <span>{cfg.icon}</span> {cfg.label}
    </span>
  )
}

function PriorityCard({ item, rank }) {
  const cfg = URGENCY_CONFIG[item.reason_code] || { color: '#64748b', bg: 'rgba(100,116,139,0.06)' }
  return (
    <div style={{
      display: 'flex', gap: 14, alignItems: 'flex-start',
      padding: '14px 16px', borderRadius: 12, marginBottom: 8,
      background: cfg.bg, borderLeft: `3px solid ${cfg.color}`,
    }}>
      <div style={{
        minWidth: 28, height: 28, borderRadius: '50%', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: `${cfg.color}20`, color: cfg.color,
        fontSize: 13, fontWeight: 800,
      }}>
        {rank}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
          <strong style={{ color: '#f1f5f9', fontSize: 15 }}>{item.name}</strong>
          <UrgencyBadge code={item.reason_code} />
        </div>
        <p style={{ color: '#94a3b8', fontSize: 13, margin: 0, lineHeight: '1.5' }}>{item.reason}</p>
      </div>
    </div>
  )
}

function WellnessBand({ summary }) {
  const total = summary.total_athletes || 1
  const readyPct   = Math.round((summary.ready_count   / total) * 100)
  const cautionPct = Math.round((summary.caution_count / total) * 100)
  const restPct    = Math.round((summary.rest_count    / total) * 100)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ color: '#94a3b8', fontSize: 12 }}>
          Team avg: <strong style={{ color: summary.avg_score >= 70 ? '#22c55e' : summary.avg_score >= 50 ? '#facc15' : '#ef4444' }}>
            {summary.avg_score ?? '—'}
          </strong>
        </span>
        <span style={{ color: '#64748b', fontSize: 12 }}>{total} athletes</span>
      </div>
      <div style={{ height: 10, borderRadius: 5, overflow: 'hidden', display: 'flex', background: 'rgba(255,255,255,0.05)' }}>
        <div style={{ width: `${readyPct}%`,   background: '#22c55e', transition: 'width 0.4s' }} />
        <div style={{ width: `${cautionPct}%`, background: '#facc15', transition: 'width 0.4s' }} />
        <div style={{ width: `${restPct}%`,    background: '#ef4444', transition: 'width 0.4s' }} />
      </div>
      <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 11, color: '#64748b' }}>
        <span><span style={{ color: '#22c55e' }}>■</span> Ready {summary.ready_count}</span>
        <span><span style={{ color: '#facc15' }}>■</span> Caution {summary.caution_count}</span>
        <span><span style={{ color: '#ef4444' }}>■</span> Rest {summary.rest_count}</span>
      </div>
    </div>
  )
}

export function CoachMorningPage({ coachId }) {
  const prioritiesQuery = useQuery({
    queryKey: ['coach-priorities', coachId],
    queryFn: () => safeQuery(() => api.get(`/coach/${coachId}/priorities`), FALLBACK_PRIORITIES),
    refetchInterval: 120_000,
  })
  const teamQuery = useQuery({
    queryKey: ['wellness-team'],
    queryFn: () => safeQuery(() => api.get('/wellness/team-overview'), FALLBACK_TEAM),
    refetchInterval: 60_000,
  })

  const data      = prioritiesQuery.data || FALLBACK_PRIORITIES
  const team      = teamQuery.data || FALLBACK_TEAM
  const summary   = team.summary || {}
  const priorities = data.priorities || []
  const noUrgent  = priorities.length === 0

  const now = new Date()
  const greeting = now.getHours() < 12 ? 'Morning' : now.getHours() < 17 ? 'Afternoon' : 'Evening'

  return (
    <>
      <PageIntro
        eyebrow={`${greeting}, Coach`}
        title={noUrgent
          ? 'All clear — no urgent conversations today.'
          : `${priorities.length} athlete${priorities.length !== 1 ? 's' : ''} need your attention.`
        }
        description="Sorted by urgency. Act on the top 1–2 before training starts."
        actions={
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Pill tone={prioritiesQuery.isError ? 'warm' : 'live'}>
              {prioritiesQuery.isError ? 'sample data' : 'live · 2m refresh'}
            </Pill>
            {data.roster_size > 0 && (
              <Pill tone="brand">{data.roster_size} athletes on roster</Pill>
            )}
          </div>
        }
      />

      {/* Team wellness snapshot */}
      <StatGrid>
        <StatCard
          label="Team wellness"
          value={summary.avg_score ?? '—'}
          hint="Average today"
          tone={summary.avg_score >= 70 ? 'success' : 'warm'}
        />
        <StatCard label="Ready"   value={summary.ready_count   ?? 0} hint="Score ≥ 70" tone="success" />
        <StatCard label="Caution" value={summary.caution_count ?? 0} hint="Score 50–69" tone="warm" />
        <StatCard label="Rest"    value={summary.rest_count    ?? 0} hint="Score < 50" />
      </StatGrid>

      <div className="content-grid">
        {/* Priority list */}
        <Panel
          title="Who to talk to"
          kicker="Sorted by urgency"
          right={
            data.stale
              ? <Pill tone="warm">Stale data</Pill>
              : data.cached_at
              ? <span style={{ color: '#475569', fontSize: 11 }}>cached {data.age_minutes ?? 0}m ago</span>
              : null
          }
        >
          {prioritiesQuery.isLoading ? <LoadingBlock /> : noUrgent ? (
            <div style={{ padding: '20px 0', textAlign: 'center' }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%', margin: '0 auto 12px',
                background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 22,
              }}>✓</div>
              <p style={{ color: '#22c55e', fontWeight: 700, margin: '0 0 4px' }}>Team looks good today.</p>
              <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>
                No injuries, no idle athletes, no form drops. Check back after today's sessions.
              </p>
            </div>
          ) : (
            <div>
              {priorities.map((p, i) => (
                <PriorityCard key={p.athlete_id} item={p} rank={i + 1} />
              ))}
            </div>
          )}
        </Panel>

        {/* Wellness band */}
        <Panel title="Team wellness band" kicker="Today">
          {teamQuery.isLoading ? <LoadingBlock /> : <WellnessBand summary={summary} />}
        </Panel>

        {/* Athlete wellness table */}
        <Panel title="Full roster wellness" kicker="Worst first">
          {teamQuery.isLoading ? <LoadingBlock /> : (
            <DataList
              items={team.athletes || []}
              empty="No athlete data. Run seed_wellness.py to populate."
              renderItem={(a) => {
                const sc = a.wellness_score
                const color = sc == null ? '#64748b' : sc >= 70 ? '#22c55e' : sc >= 50 ? '#facc15' : '#ef4444'
                const statusMap = {
                  ready:   { label: 'Ready',   color: '#22c55e' },
                  caution: { label: 'Caution',  color: '#facc15' },
                  rest:    { label: 'Rest',     color: '#ef4444' },
                  unknown: { label: 'No data',  color: '#64748b' },
                }
                const badge = statusMap[a.recovery_status] || statusMap.unknown
                return (
                  <div className="list-row" key={a.id} style={{ gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <strong style={{ color: '#f1f5f9', fontSize: 14 }}>{a.name}</strong>
                      {a.last_logged && (
                        <span style={{ marginLeft: 8, color: '#475569', fontSize: 11 }}>{a.last_logged}</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <strong style={{ color, fontVariantNumeric: 'tabular-nums', minWidth: 28, textAlign: 'right', fontSize: 15 }}>
                        {sc ?? '—'}
                      </strong>
                      <span style={{
                        padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                        background: `${badge.color}22`, color: badge.color,
                        border: `1px solid ${badge.color}44`,
                      }}>
                        {badge.label}
                      </span>
                    </div>
                  </div>
                )
              }}
            />
          )}
        </Panel>

        {/* Quick actions */}
        <Panel title="Coach tools" kicker="Quick actions">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Share invite link',    hint: 'Add athletes to your roster via WhatsApp', icon: '→', href: `/coach/${coachId}/invite-links` },
              { label: 'Team wellness detail', hint: 'Full nutrition + recovery breakdown',       icon: '→', href: '/wellness' },
            ].map(({ label, hint, icon, href }) => (
              <a key={label} href={href} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 14px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                  cursor: 'pointer', transition: 'background 0.15s',
                }}>
                  <div>
                    <div style={{ color: '#f1f5f9', fontSize: 14, fontWeight: 600 }}>{label}</div>
                    <div style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>{hint}</div>
                  </div>
                  <span style={{ color: '#06b6d4', fontSize: 18 }}>{icon}</span>
                </div>
              </a>
            ))}
          </div>
        </Panel>
      </div>
    </>
  )
}
