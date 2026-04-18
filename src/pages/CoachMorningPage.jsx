import { useQuery } from '@tanstack/react-query'
import { api, safeQuery } from '../lib/api'
import { LoadingBlock, PageIntro, Panel, Pill } from '../components/Primitives'

export function CoachMorningPage({ coachId }) {
  const prioritiesQuery = useQuery({
    queryKey: ['coach-priorities', coachId],
    queryFn: () => safeQuery(() => api.get(`/coach/${coachId}/priorities`), { priorities: [], roster_size: 0 }),
  })

  const priorities = prioritiesQuery.data?.priorities || []

  return (
    <>
      <PageIntro
        eyebrow="Morning triage"
        title={`${priorities.length} athletes to talk to today`}
        description="A small high-signal route for coaches. TanStack Router gives it a stable URL, and TanStack Query keeps the priority list fresh."
        actions={<Pill tone="brand">Coach {coachId}</Pill>}
      />

      {prioritiesQuery.isLoading ? <LoadingBlock label="Loading coach priorities…" /> : null}

      <Panel title="Priority list" kicker="Today">
        <div className="history-stack">
          {priorities.map((priority) => (
            <div className="history-card current" key={priority.athlete_id}>
              <strong>{priority.name}</strong>
              <p>{priority.reason}</p>
              <span>{priority.reason_code}</span>
            </div>
          ))}
          {!priorities.length ? <div className="empty-block">No urgent conversations today.</div> : null}
        </div>
      </Panel>
    </>
  )
}
