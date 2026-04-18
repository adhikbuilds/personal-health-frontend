import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api, safeQuery } from '../lib/api'
import {
  DataList,
  LoadingBlock,
  PageIntro,
  Panel,
  Pill,
  ProgressBar,
  StatCard,
  StatGrid,
} from '../components/Primitives'

/**
 * LeaderboardPage — the anti-toxic version.
 *
 * From BIOMECHANICS-ARCHITECT.md Flow 11:
 *   "Design the leaderboard so Arjun wants to climb it but doesn't feel
 *    crushed when he's #47 of 50. What filters exist? What comparisons are
 *    default? When is the leaderboard hidden?"
 *
 * Anti-pattern we're explicitly NOT building:
 *   A flat top-50 list where rank 47 sees every better athlete in their
 *   feed and disengages.
 *
 * What we ship instead — BUCKET LEADERBOARD:
 *   - Default view: the signed-in athlete's BUCKET (8 athletes near their
 *     current rank). You see 3 people above and 4 below, with your own row
 *     highlighted. The gap to #1 is visible but not oppressive.
 *   - Secondary view: top-10 ONLY, no "see more." If you're not in the top 10,
 *     you see "Not yet — climb your bucket first." Keeps the podium aspirational
 *     without surfacing a long tail of people ahead of you.
 *   - Filter by sport (required — cross-sport comparison is meaningless).
 *   - Filter by huddle (optional — "my huddle only" for closed-circle pressure).
 *
 * Backend:
 *   GET /leaderboard  returns { leaderboard: [{ id, name, sport, bpi, tier, rank }] }
 *   Response already sorted by bpi desc.
 */
export function LeaderboardPage() {
  const [view, setView] = useState('bucket') // 'bucket' | 'podium' | 'huddle'
  const [sport, setSport] = useState('all')
  // Stubbed "me" — in a real auth flow this comes from /auth/me
  const [selfId] = useState(() => localStorage.getItem('ph_self_athlete_id') || 'athlete_01')

  const lbQuery = useQuery({
    queryKey: ['leaderboard', sport],
    queryFn: () =>
      safeQuery(
        () => api.get(`/leaderboard${sport === 'all' ? '' : `?sport=${encodeURIComponent(sport)}`}`),
        { leaderboard: [] },
      ),
    refetchInterval: 60_000,
  })

  const allRows = useMemo(() => lbQuery.data?.leaderboard || lbQuery.data?.data?.leaderboard || [], [lbQuery.data])

  // Ensure every row has a rank even if backend omits it.
  const ranked = useMemo(
    () => allRows.map((row, i) => ({ ...row, rank: row.rank ?? i + 1 })),
    [allRows],
  )

  const selfIndex = ranked.findIndex((r) => (r.id || r.athlete_id) === selfId)
  const selfRow = selfIndex >= 0 ? ranked[selfIndex] : null

  const sports = useMemo(() => {
    const s = new Set(['all'])
    ranked.forEach((r) => r.sport && s.add(r.sport))
    return Array.from(s)
  }, [ranked])

  const bucketRows = useMemo(() => {
    if (selfIndex < 0) return ranked.slice(0, 8)
    const start = Math.max(0, selfIndex - 3)
    const end = Math.min(ranked.length, start + 8)
    return ranked.slice(start, end)
  }, [ranked, selfIndex])

  const podiumRows = ranked.slice(0, 10)

  return (
    <>
      <PageIntro
        eyebrow="Leaderboard"
        title="Your bucket, not the crushing top-50."
        description="See who's three above and four below you. Close gaps first, chase the podium later. Cross-sport comparisons are off by default because they lie."
        actions={<Pill tone="live">Refreshes every 60s</Pill>}
      />

      <StatGrid>
        <StatCard
          label="Your rank"
          value={selfRow ? `#${selfRow.rank}` : '—'}
          hint={selfRow ? `of ${ranked.length} in ${selfRow.sport || 'overall'}` : 'Not on the board yet'}
          tone="brand"
        />
        <StatCard
          label="Your BPI"
          value={selfRow?.bpi ?? 0}
          hint={selfRow?.tier ? `Tier: ${selfRow.tier}` : 'Biomechanical Performance Index'}
        />
        <StatCard
          label="Gap to next"
          value={gapToNext(ranked, selfIndex)}
          hint="BPI points ahead of you"
          tone="warm"
        />
        <StatCard
          label="Gap to podium"
          value={gapToPodium(ranked, selfIndex)}
          hint="Points to rank #3"
        />
      </StatGrid>

      <Panel
        title="Filters"
        kicker="Pick your frame"
        right={
          <div className="view-toggle">
            <button
              type="button"
              className={`pill tone-${view === 'bucket' ? 'brand' : 'neutral'}`}
              onClick={() => setView('bucket')}
            >
              Your bucket
            </button>
            <button
              type="button"
              className={`pill tone-${view === 'podium' ? 'brand' : 'neutral'}`}
              onClick={() => setView('podium')}
            >
              Top 10
            </button>
            <button
              type="button"
              className={`pill tone-${view === 'huddle' ? 'brand' : 'neutral'}`}
              onClick={() => setView('huddle')}
              title="Shown only within your huddle — no strangers"
            >
              My huddle
            </button>
          </div>
        }
      >
        <div className="filter-row">
          <label>
            <span>Sport</span>
            <select value={sport} onChange={(e) => setSport(e.target.value)}>
              {sports.map((s) => (
                <option key={s} value={s}>
                  {s === 'all' ? 'All sports (comparisons are looser)' : s}
                </option>
              ))}
            </select>
          </label>
          <small className="muted">
            Cross-sport BPI is a rough approximation. Stick to your own sport for honest comparison.
          </small>
        </div>
      </Panel>

      {view === 'bucket' ? (
        <Panel title="Your bucket" kicker="3 above, you, 4 below">
          {lbQuery.isLoading ? (
            <LoadingBlock />
          ) : bucketRows.length === 0 ? (
            <div className="empty-block">No data yet. Log a session to enter the board.</div>
          ) : (
            <div className="rank-stack">
              {bucketRows.map((row) => (
                <LbRow
                  key={row.id || row.athlete_id || row.rank}
                  row={row}
                  top={ranked[0]}
                  self={row.rank === selfRow?.rank}
                />
              ))}
            </div>
          )}
          <p className="muted">
            Close the next gap. Don't doomscroll the tail — people above you are closer than
            you think, and the leaderboard is meant for motivation, not anxiety.
          </p>
        </Panel>
      ) : null}

      {view === 'podium' ? (
        <Panel title="Top 10" kicker="The podium">
          {lbQuery.isLoading ? (
            <LoadingBlock />
          ) : podiumRows.length === 0 ? (
            <div className="empty-block">No athletes ranked yet.</div>
          ) : (
            <div className="rank-stack">
              {podiumRows.map((row) => (
                <LbRow
                  key={row.id || row.athlete_id || row.rank}
                  row={row}
                  top={ranked[0]}
                  self={row.rank === selfRow?.rank}
                />
              ))}
            </div>
          )}
          {selfRow && selfRow.rank > 10 ? (
            <div className="muted-footer">
              You're #{selfRow.rank}. Climb your bucket first — switch to "Your bucket" above.
            </div>
          ) : null}
        </Panel>
      ) : null}

      {view === 'huddle' ? (
        <Panel title="My huddle" kicker="Closed circle">
          <div className="empty-block">
            Huddle leaderboard view is coming once the /huddle/{'{id}'}/leaderboard endpoint ships.
            The intent: rank only among the 15-20 athletes in your training group.
          </div>
        </Panel>
      ) : null}
    </>
  )
}

function LbRow({ row, top, self }) {
  const bpi = row.bpi || 0
  const topBpi = Math.max(1, top?.bpi || bpi)
  const fill = Math.min(100, Math.max(6, (bpi / topBpi) * 100))
  return (
    <div className={`rank-row ${self ? 'rank-self' : ''}`}>
      <div className="rank-copy">
        <strong>
          {medal(row.rank)} {row.rank}. {row.name || row.id || 'Unknown'}
          {self ? <Pill tone="brand">you</Pill> : null}
        </strong>
        <span>
          {row.sport || 'Unknown sport'}
          {row.tier ? ` · ${row.tier}` : ''}
        </span>
      </div>
      <div className="rank-score">
        <em>{bpi} BPI</em>
        <ProgressBar value={fill} />
      </div>
    </div>
  )
}

function medal(rank) {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return ''
}

function gapToNext(rows, selfIndex) {
  if (selfIndex <= 0) return 0
  const self = rows[selfIndex]?.bpi || 0
  const ahead = rows[selfIndex - 1]?.bpi || self
  return Math.max(0, ahead - self)
}

function gapToPodium(rows, selfIndex) {
  if (selfIndex < 0) return '—'
  const self = rows[selfIndex]?.bpi || 0
  const third = rows[2]?.bpi || self
  if (self >= third) return 0
  return Math.max(0, third - self)
}
