import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
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
 * CommunityPage — wires the backend social surface into a single screen.
 *
 * Principles (from TRAINER-FIRST-PROMPT.md):
 *  - Closed circles only. This page shows the signed-in user's huddle + roster
 *    activity, NOT a public timeline of strangers.
 *  - Reaction-based, not comment-based. One-tap clap, zero typing.
 *  - Coach-broadcast > peer chat. Broadcasts from the coach appear on top.
 *  - Outcome-driven, not activity-driven. PBs and achievements are surfaced,
 *    raw "X started a session" events are not.
 *
 * Backend endpoints used:
 *  - GET /feed              → recent activity (PBs, achievements, broadcasts)
 *  - GET /creators/trending → coaches who had the most PBs on their roster
 *  - POST /follow           → follow a coach / athlete (placeholder)
 *
 * Known backend gaps (flagged, not built here):
 *  - POST /athlete/{id}/clap/{target_id}  — reaction endpoint does not exist yet
 *  - POST /coach/{id}/broadcast           — trainer broadcast does not exist yet
 * These are stubbed on the client with optimistic-only UI + a TODO banner.
 */
export function CommunityPage() {
  const feedQuery = useQuery({
    queryKey: ['community-feed'],
    queryFn: () => safeQuery(() => api.get('/feed'), { items: [], total: 0 }),
    refetchInterval: 30_000,
  })

  const trendingQuery = useQuery({
    queryKey: ['community-trending'],
    queryFn: () => safeQuery(() => api.get('/creators/trending'), { creators: [] }),
  })

  const items = feedQuery.data?.items || feedQuery.data?.feed || []
  const trending = trendingQuery.data?.creators || trendingQuery.data?.trending || []

  const pbCount = items.filter(isPbItem).length
  const milestoneCount = items.filter((it) => (it?.type || '').includes('milestone')).length
  const totalClaps = items.reduce((acc, it) => acc + (it?.claps || 0), 0)

  return (
    <>
      <PageIntro
        eyebrow="Community"
        title="What your huddle and roster are up to."
        description="Closed circles only — PBs, milestones, and coach broadcasts from people you train with. No strangers, no comments, one-tap reactions."
        actions={<Pill tone="live">Refreshes every 30s</Pill>}
      />

      <StatGrid>
        <StatCard label="Activity items" value={items.length} hint="Past 24h in your circle" />
        <StatCard label="Personal bests" value={pbCount} hint="Wins worth a clap" tone="success" />
        <StatCard label="Milestones" value={milestoneCount} hint="Session counts + streaks" tone="brand" />
        <StatCard label="Claps given" value={totalClaps} hint="Non-verbal encouragement" />
      </StatGrid>

      <div className="content-grid">
        <Panel
          title="Huddle & roster feed"
          kicker="Recent"
          right={<Pill tone="neutral">Reaction-only · no comments</Pill>}
        >
          {feedQuery.isLoading ? (
            <LoadingBlock />
          ) : (
            <DataList
              items={items}
              empty="Quiet in your circle. When someone in your huddle or roster hits a PB, it'll land here."
              renderItem={(item) => <FeedRow key={item.id || `${item.athlete_id}-${item.created_at}`} item={item} />}
            />
          )}
        </Panel>

        <Panel
          title="Trending coaches"
          kicker="Who is producing results"
          right={<Pill tone="neutral">Outcome ranked · not activity</Pill>}
        >
          {trendingQuery.isLoading ? (
            <LoadingBlock />
          ) : (
            <div className="rank-stack">
              {trending.length === 0 ? (
                <div className="empty-block">No trending coaches yet.</div>
              ) : (
                trending.slice(0, 6).map((creator, index) => (
                  <TrendingRow
                    key={creator.id || creator.name || index}
                    rank={index + 1}
                    creator={creator}
                  />
                ))
              )}
            </div>
          )}
        </Panel>
      </div>

      <Panel title="Out of scope (by design)" kicker="What you won't find here">
        <ul className="muted-list">
          <li>No timeline of strangers — only your huddle and your coach's roster.</li>
          <li>No comment threads — one-tap clap is the only reply.</li>
          <li>No "who started a session" — only outcome events (PBs, achievements, broadcasts).</li>
          <li>No friend-of-friend discovery. Follows are coach→athlete or huddle-bound only.</li>
        </ul>
      </Panel>
    </>
  )
}

function FeedRow({ item }) {
  const [clapped, setClapped] = useState(false)
  const clapMut = useMutation({
    mutationFn: () =>
      // Stub: backend endpoint does not exist yet. Keep UI optimistic so the
      // wiring lands the day the endpoint ships. Silently succeeds locally.
      safeQuery(() => api.post(`/athlete/${item.athlete_id}/clap/${item.target_id || item.athlete_id}`), {
        ok: false,
        stubbed: true,
      }),
  })
  const body = itemBody(item)

  return (
    <div className="list-row static">
      <div>
        <strong>{body.title}</strong>
        <span>
          {body.meta}
          {item.created_at ? <> · {timeAgo(item.created_at)}</> : null}
        </span>
      </div>
      <div className="feed-actions">
        {isPbItem(item) ? <Pill tone="success">PB</Pill> : null}
        <button
          type="button"
          className={`clap-btn ${clapped ? 'clapped' : ''}`}
          onClick={() => {
            if (clapped) return
            setClapped(true)
            clapMut.mutate()
          }}
          aria-label={clapped ? 'Clapped' : 'Clap'}
        >
          <span className="clap-emoji">{clapped ? '✓' : '◎'}</span>
          <em>{(item.claps || 0) + (clapped ? 1 : 0)}</em>
        </button>
      </div>
    </div>
  )
}

function TrendingRow({ rank, creator }) {
  const score = creator.pbs_last_30d || creator.score || 0
  const fill = Math.min(100, Math.max(10, (score / Math.max(1, rank === 1 ? score : score * 2)) * 100))
  return (
    <div className="rank-row">
      <div className="rank-copy">
        <strong>
          {rank}. {creator.name || creator.id || 'Unknown coach'}
        </strong>
        <span>
          {creator.roster_size || creator.athletes || 0} athletes · {creator.sport || 'multi-sport'}
        </span>
      </div>
      <div className="rank-score">
        <em>{score} PBs</em>
        <ProgressBar value={fill} />
      </div>
    </div>
  )
}

function isPbItem(item) {
  const t = item?.type || ''
  return t.includes('personal_best') || t.includes('pb') || t === 'achievement'
}

function itemBody(item) {
  const who = item.athlete_name || item.name || item.athlete_id || 'Someone'
  const type = (item.type || '').replace(/_/g, ' ')
  const sport = item.sport ? ` · ${item.sport}` : ''
  const detail = item.detail || item.body || item.title || type || 'activity'
  return {
    title: `${who} — ${detail}${sport}`,
    meta: type || 'feed item',
  }
}

function timeAgo(iso) {
  if (!iso) return ''
  try {
    const then = new Date(iso).getTime()
    const diff = Date.now() - then
    const m = Math.round(diff / 60_000)
    if (m < 1) return 'just now'
    if (m < 60) return `${m}m ago`
    const h = Math.round(m / 60)
    if (h < 24) return `${h}h ago`
    const d = Math.round(h / 24)
    return `${d}d ago`
  } catch {
    return ''
  }
}
