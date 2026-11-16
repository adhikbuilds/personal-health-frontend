import { useQuery } from '@tanstack/react-query'
import { api, safeQuery } from '../lib/api'
import { LoadingBlock, PageIntro, Panel, Pill, ProgressBar, StatCard, StatGrid } from '../components/Primitives'

export function AthletePage({ athleteId }) {
  const reportQuery = useQuery({
    queryKey: ['athlete-report', athleteId],
    // safeQuery so a 403 (viewing a non-owned athlete after the
    // ownership-gate work) surfaces as a clean empty state rather than
    // an uncaught exception that breaks the whole page.
    queryFn: () => safeQuery(() => api.get(`/athlete/${athleteId}/insights`), null),
  })
  const summaryQuery = useQuery({
    queryKey: ['athlete-weekly', athleteId],
    queryFn: () => safeQuery(() => api.get(`/athlete/${athleteId}/weekly-summary?days=28`), { week_summaries: [] }),
  })

  const report = reportQuery.data

  return (
    <>
      <PageIntro
        eyebrow="Athlete profile"
        title={report?.athlete_name || athleteId}
        description="This route is now a proper TanStack detail page: route param in, intelligence report out, with no template-specific glue code."
        actions={report ? <Pill tone="brand">{report.sport?.replace(/_/g, ' ')}</Pill> : null}
      />

      {reportQuery.isLoading ? <LoadingBlock label="Loading athlete report…" /> : null}

      {report ? (
        <>
          <StatGrid>
            <StatCard label="Overall grade" value={`${report.overall_grade?.letter || '—'} / ${report.overall_grade?.score || 0}`} hint="Composite athlete score" tone="brand" />
            <StatCard label="Trend" value={report.trajectory?.trend_direction || '—'} hint="Recent performance direction" tone="success" />
            <StatCard label="Injury risk" value={report.injury_risk?.band || '—'} hint="Current risk band" tone="warm" />
            <StatCard label="Phase" value={report.periodization?.current_phase || '—'} hint="Current training phase" />
          </StatGrid>

          <div className="content-grid">
            <Panel title="Action items" kicker="Coach attention">
              <div className="history-stack">
                {(report.action_items || []).map((item, index) => (
                  <div className="history-card" key={`${item.action}-${index}`}>
                    <strong>{item.action}</strong>
                    <p>{item.detail}</p>
                    <span>{item.urgency}</span>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Biomechanics profile" kicker="Movement">
              <div className="history-stack">
                {(report.biomechanical_profile?.joints || []).map((joint) => (
                  <div className="metric-line" key={joint.joint}>
                    <strong>{joint.joint.replace(/_/g, ' ')}</strong>
                    <span>{joint.mean_deg}° · {joint.status}</span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          <div className="content-grid">
            <Panel title="4-week summary" kicker="Progress">
              <div className="history-stack">
                {(summaryQuery.data?.week_summaries || []).map((week) => (
                  <div className="history-card" key={week.label}>
                    <strong>{week.label}</strong>
                    <p>{week.session_count} sessions · avg form {week.avg_form_score} · {week.total_xp} XP</p>
                    <ProgressBar value={week.avg_form_score || 0} />
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Plan direction" kicker="Periodization">
              <div className="history-stack">
                {(report.periodization?.upcoming_blocks || []).map((block, index) => (
                  <div className="history-card" key={`${block.focus}-${index}`}>
                    <strong>{block.focus}</strong>
                    <p>{block.objective}</p>
                    <span>{block.week_label || `Block ${index + 1}`}</span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </>
      ) : null}
    </>
  )
}
