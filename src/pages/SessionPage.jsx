import { useQuery } from '@tanstack/react-query'
import { api, safeQuery } from '../lib/api'
import { LoadingBlock, PageIntro, Panel, Pill, StatCard, StatGrid } from '../components/Primitives'

export function SessionPage({ sessionId }) {
  const replayQuery = useQuery({
    queryKey: ['session-replay', sessionId],
    // safeQuery so 403/404 surfaces as null + empty state instead of crashing.
    queryFn: () => safeQuery(() => api.get(`/sessions/${sessionId}/replay?downsample=2`), null),
  })
  const scorecardQuery = useQuery({
    queryKey: ['session-scorecard', sessionId],
    queryFn: () => safeQuery(() => api.get(`/sessions/${sessionId}/scorecard`), null),
  })
  const repCountQuery = useQuery({
    queryKey: ['session-reps', sessionId],
    queryFn: () => safeQuery(() => api.get(`/sessions/${sessionId}/rep-count`), null),
  })

  const replay = replayQuery.data
  const scorecard = scorecardQuery.data

  return (
    <>
      <PageIntro
        eyebrow="Session review"
        title={replay?.sport?.replace(/_/g, ' ') || sessionId}
        description="This session page turns the replay and scorecard APIs into a clean review surface with route-driven data loading."
        actions={replay ? <Pill tone={replay.status === 'completed' ? 'success' : 'warm'}>{replay.status}</Pill> : null}
      />

      {replayQuery.isLoading ? <LoadingBlock label="Loading session replay…" /> : null}

      {replay ? (
        <>
          <StatGrid>
            <StatCard label="Athlete" value={replay.athlete_id || '—'} hint="Owner of this session" />
            <StatCard label="Frames" value={replay.total_frames || 0} hint="Replay sample size" />
            <StatCard label="Avg form" value={replay.avg_form_score || '—'} hint="Replay average" tone="brand" />
            <StatCard label="Reps" value={repCountQuery.data?.rep_count || '—'} hint="Detected repetitions" tone="success" />
          </StatGrid>

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
