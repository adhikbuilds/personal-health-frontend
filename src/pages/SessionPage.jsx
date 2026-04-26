import { useQuery } from '@tanstack/react-query'
import { api, safeQuery } from '../lib/api'
import { LoadingBlock, PageIntro, Panel, Pill, StatCard, StatGrid } from '../components/Primitives'

const ORANGE = '#FC4C02'

export function SessionPage({ sessionId }) {
  const replayQuery = useQuery({
    queryKey: ['session-detail', sessionId],
    queryFn: () => safeQuery(() => api.get(`/session/${sessionId}`), null),
  })
  const scorecardQuery = useQuery({
    queryKey: ['session-scorecard', sessionId],
    queryFn: () => safeQuery(() => api.get(`/session/${sessionId}/scorecard`), null),
  })
  const repCountQuery = useQuery({
    queryKey: ['session-reps', sessionId],
    queryFn: () => safeQuery(() => api.get(`/sessions/${sessionId}/rep-count`), null),
  })

  // Sprint #1 — AI per-session coaching notes
  const coachingQuery = useQuery({
    queryKey: ['session-coaching', sessionId],
    queryFn: () => safeQuery(() => api.get(`/session/${sessionId}/coaching`), null),
  })

  const replay = replayQuery.data
  const scorecard = scorecardQuery.data
  const coaching = coachingQuery.data

  // Sprint #8 — Share session as Strava-style PNG
  const shareUrl = `/api/session/${sessionId}/scorecard.png`
  const handleShare = async () => {
    try {
      const res = await fetch(shareUrl)
      if (!res.ok) throw new Error('not ok')
      const blob = await res.blob()
      // Modern share API
      const file = new File([blob], `session-${sessionId}.png`, { type: 'image/png' })
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'My session form score', text: 'Check out my latest form score on Personal Health' })
        return
      }
      // Fallback: download
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `session-${sessionId}.png`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      // last resort — open in a new tab
      window.open(shareUrl, '_blank')
    }
  }

  return (
    <>
      <PageIntro
        eyebrow="Session review"
        title={replay?.sport?.replace(/_/g, ' ') || sessionId}
        description="This session page turns the replay and scorecard APIs into a clean review surface with route-driven data loading."
        actions={
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {replay ? <Pill tone={replay.status === 'completed' ? 'success' : 'warm'}>{replay.status}</Pill> : null}
            <button
              onClick={handleShare}
              style={{
                padding: '8px 16px',
                background: ORANGE,
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              📤 Share
            </button>
          </div>
        }
      />

      {replayQuery.isLoading ? <LoadingBlock label="Loading session replay…" /> : null}

      {replay ? (
        <>
          <StatGrid>
            <StatCard label="Athlete" value={replay.athlete_id || '—'} hint="Owner of this session" />
            <StatCard label="Frames" value={replay.summary?.total_frames || replay.frame_count || 0} hint="Total frames recorded" />
            <StatCard label="Avg form" value={replay.summary?.avg_form_score || '—'} hint="Session average" tone="brand" />
            <StatCard label="Reps" value={repCountQuery.data?.rep_count || '—'} hint="Detected repetitions" tone="success" />
          </StatGrid>

          {/* AI Coaching Notes panel (Sprint #1) */}
          {coaching && (
            <Panel title="AI Coach Notes" kicker="Generated">
              <div className="history-stack">
                <div className="history-card current">
                  <strong>{coaching.headline || 'What to work on'}</strong>
                  <p>{coaching.summary || coaching.text || coaching.coaching_summary || 'Your form was solid overall — keep building on this.'}</p>
                </div>
                {(coaching.actionable_items || coaching.recommendations || []).slice(0, 3).map((item, i) => (
                  <div className="metric-line" key={i}>
                    <strong>→ {typeof item === 'string' ? item : item.label || item.title}</strong>
                    {typeof item === 'object' && item.detail && <span>{item.detail}</span>}
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <div className="content-grid">
            <Panel title="Highlights" kicker="Moments">
              <div className="history-stack">
                {(replay.highlights || []).map((highlight, index) => (
                  <div className="history-card" key={`${highlight.label}-${index}`}>
                    <strong>{highlight.label}</strong>
                    <p>{highlight.feedback || highlight.type}</p>
                    <span>{highlight.form_score || highlight.jump_height_cm || '—'}</span>
                  </div>
                ))}
                {!replay.highlights?.length ? <div className="empty-block">No highlight events were returned for this session.</div> : null}
              </div>
            </Panel>

            <Panel title="Scorecard" kicker="Outcome">
              {scorecard ? (
                <div className="history-stack">
                  <div className="history-card current">
                    <strong>{scorecard.headline_stat?.label}</strong>
                    <p>{scorecard.headline_stat?.value}{scorecard.headline_stat?.unit}</p>
                    <span>{scorecard.share_text}</span>
                  </div>
                  <div className="metric-line">
                    <strong>BPI</strong>
                    <span>{scorecard.bpi?.current} ({scorecard.bpi?.delta})</span>
                  </div>
                  <div className="metric-line">
                    <strong>PB form</strong>
                    <span>{scorecard.personal_bests?.form_score}</span>
                  </div>
                </div>
              ) : (
                <div className="empty-block">Scorecard data not available.</div>
              )}
            </Panel>
          </div>
        </>
      ) : null}
    </>
  )
}
