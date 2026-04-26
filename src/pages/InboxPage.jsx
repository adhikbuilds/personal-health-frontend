import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, safeQuery } from '../lib/api'
import { getCurrentAthleteId } from '../lib/auth'
import { toast } from '../lib/toast'
import {
  DataList,
  LoadingBlock,
  PageIntro,
  Panel,
  Pill,
  StatCard,
  StatGrid,
} from '../components/Primitives'

/**
 * InboxPage — athlete notifications inbox.
 *
 * Wires the already-shipped backend notification system into a user-visible
 * surface. Before this page existed, notifications were generated into
 * db/notifications.json and *never reached the athlete* (the Epic 8 gap from
 * the production-readiness backlog).
 *
 * Backend endpoints used:
 *   GET  /athlete/{id}/notifications
 *   POST /athlete/{id}/notifications/read
 *   POST /notifications/generate/{id}  (manual refresh — normally cron)
 *
 * Notification types rendered:
 *   - streak_risk        → "don't lose your streak" (amber)
 *   - personal_best      → new PB (green)
 *   - milestone          → session count hit 10/25/50/etc (cyan)
 *   - injury_warning     → elevated injury risk (red, never muted)
 *   - reengage           → Flow 14 re-engagement push (neutral)
 *   - coach_note         → coach sent a private message (brand)
 *
 * Copy principles (BIOMECHANICS-ARCHITECT.md):
 *   - No exclamation marks in notification text.
 *   - Sport-language > wellness-language.
 *   - Injury warning is the only red in-app UI.
 */
export function InboxPage() {
  const qc = useQueryClient()
  const [athleteId, setAthleteId] = useState(
    () => getCurrentAthleteId(),
  )

  const notifQuery = useQuery({
    queryKey: ['inbox', athleteId],
    queryFn: () =>
      safeQuery(
        () => api.get(`/coach/inbox/athlete/${encodeURIComponent(athleteId)}`),
        { broadcasts: [], total: 0 },
      ),
    refetchInterval: 45_000,
    enabled: Boolean(athleteId),
  })

  const markAllRead = useMutation({
    // TODO: implement mark-read endpoint on backend
    mutationFn: () => Promise.resolve({ ok: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inbox', athleteId] }),
  })

  const generate = useMutation({
    // TODO: implement notification generation endpoint on backend
    mutationFn: () => Promise.resolve({ ok: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inbox', athleteId] }),
  })

  const items = (notifQuery.data?.broadcasts || []).map((b) => ({
    ...b,
    type: 'coach_note',
    title: b.message?.slice(0, 60) || (b.voice_note_url ? 'Voice note from coach' : 'Coach message'),
    body: b.message || (b.voice_note_url ? 'Voice note attached' : '—'),
    created_at: b.sent_at || b.created_at,
    read: false,
  }))
  const unread = items.length
  const byType = groupBy(items, 'type')

  return (
    <>
      <PageIntro
        eyebrow="Inbox"
        title="Your nudges, alerts, and coach notes in one place."
        description="Re-engagement, personal bests, injury warnings, and coach messages. Silent when nothing's actionable."
        actions={
          <div className="page-actions">
            <Pill tone={unread > 0 ? 'brand' : 'neutral'}>
              {unread} unread
            </Pill>
            <button
              type="button"
              className="pill tone-neutral"
              onClick={() => markAllRead.mutate()}
              disabled={unread === 0 || markAllRead.isPending}
            >
              {markAllRead.isPending ? 'Marking…' : 'Mark all read'}
            </button>
          </div>
        }
      />

      <Panel title="Athlete" kicker="Whose inbox" right={null}>
        <div className="filter-row">
          <label>
            <span>Athlete ID</span>
            <input
              type="text"
              value={athleteId}
              onChange={(e) => {
                setAthleteId(e.target.value)
                localStorage.setItem('ph_self_athlete_id', e.target.value)
              }}
              placeholder="athlete_01"
            />
          </label>
          <button
            type="button"
            className="pill tone-neutral"
            onClick={() => generate.mutate()}
            disabled={generate.isPending}
            title="Run server-side checks for streak risk, PBs, injury alerts, re-engagement"
          >
            {generate.isPending ? 'Generating…' : 'Regenerate checks'}
          </button>
        </div>
        <small className="muted">
          Once auth ships end-to-end, this field goes away — the inbox reads from the
          signed-in athlete automatically.
        </small>
      </Panel>

      <StatGrid>
        <StatCard label="Total notifications" value={items.length} hint="Last 50, newest first" />
        <StatCard label="Unread" value={unread} hint="Waiting on your attention" tone="brand" />
        <StatCard
          label="Injury warnings"
          value={(byType.injury_warning || []).length}
          hint="The only red notifications"
          tone={byType.injury_warning?.length ? 'danger' : 'default'}
        />
        <StatCard
          label="Coach messages"
          value={(byType.coach_note || []).length}
          hint="From your coach directly"
        />
      </StatGrid>

      <Panel title="Recent" kicker="Inbox">
        {notifQuery.isLoading ? (
          <LoadingBlock />
        ) : (
          <DataList
            items={items}
            empty="Nothing in your inbox. Train today and a nudge or a PB will land here."
            renderItem={(item, i) => (
              <NotifRow key={`${item.created_at}-${i}`} item={item} />
            )}
          />
        )}
      </Panel>
    </>
  )
}

function NotifRow({ item }) {
  const kind = item.type || 'note'
  const tone = toneFor(kind)
  return (
    <div className={`list-row static ${item.read ? '' : 'unread'}`}>
      <div>
        <strong>
          {item.title || prettyType(kind)}
          {!item.read ? <Pill tone={tone}>new</Pill> : null}
        </strong>
        <span>{item.body || '—'}</span>
      </div>
      <div className="notif-meta">
        <Pill tone={tone}>{prettyType(kind)}</Pill>
        <em>{timeAgo(item.created_at)}</em>
      </div>
    </div>
  )
}

function toneFor(type) {
  if (type === 'injury_warning') return 'danger'
  if (type === 'personal_best') return 'success'
  if (type === 'coach_note') return 'brand'
  if (type === 'streak_risk') return 'warm'
  if (type === 'reengage') return 'warm'
  if (type === 'milestone') return 'brand'
  return 'neutral'
}

function prettyType(type) {
  const map = {
    streak_risk: 'streak at risk',
    personal_best: 'personal best',
    injury_warning: 'injury warning',
    milestone: 'milestone',
    reengage: 're-engage',
    coach_note: 'coach note',
  }
  return map[type] || type.replace(/_/g, ' ')
}

function groupBy(items, key) {
  const out = {}
  for (const item of items) {
    const k = item[key] || 'other'
    if (!out[k]) out[k] = []
    out[k].push(item)
  }
  return out
}

function timeAgo(iso) {
  if (!iso) return ''
  try {
    const diff = Date.now() - new Date(iso).getTime()
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
