import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, safeQuery } from '../lib/api'
import { toast } from '../lib/toast'
import { LoadingBlock, PageIntro, Panel, Pill, StatCard, StatGrid } from '../components/Primitives'

export function PlanPage() {
  const queryClient = useQueryClient()
  const athletesQuery = useQuery({
    queryKey: ['plan-athletes'],
    queryFn: () => safeQuery(() => api.get('/athletes'), { athletes: [] }),
  })
  const [athleteId, setAthleteId] = useState('')

  useEffect(() => {
    if (!athleteId && athletesQuery.data?.athletes?.length) {
      setAthleteId(athletesQuery.data.athletes[0].id)
    }
  }, [athleteId, athletesQuery.data])

  const planQuery = useQuery({
    queryKey: ['plan-weekly', athleteId],
    enabled: Boolean(athleteId),
    queryFn: () => api.get(`/plan/${athleteId}/weekly`),
  })

  const historyQuery = useQuery({
    queryKey: ['plan-history', athleteId],
    enabled: Boolean(athleteId),
    queryFn: () => safeQuery(() => api.get(`/plan/${athleteId}/history?limit=6`), { weeks: [] }),
  })

  const regenerate = useMutation({
    mutationFn: () => api.post(`/plan/${athleteId}/regenerate`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plan-weekly', athleteId] })
      queryClient.invalidateQueries({ queryKey: ['plan-history', athleteId] })
      toast.success('Plan regenerated.')
    },
    onError: (e) => toast.error(`Regenerate failed: ${e?.message || 'unknown error'}`),
  })

  const completeDay = useMutation({
    mutationFn: (date) => api.post(`/plan/${athleteId}/day/${date}/complete`),
    onSuccess: (_d, date) => {
      queryClient.invalidateQueries({ queryKey: ['plan-weekly', athleteId] })
      queryClient.invalidateQueries({ queryKey: ['plan-history', athleteId] })
      toast.success(`Marked ${date} complete.`)
    },
    onError: (e) => toast.error(`Could not mark complete: ${e?.message || 'unknown error'}`),
  })

  const plan = planQuery.data
  const context = plan?.context || {}
  const spotlight = useMemo(() => {
    if (!plan?.days?.length) return null
    const today = new Date().toISOString().slice(0, 10)
    return plan.days.find((day) => day.date === today) || plan.days.find((day) => !day.completed) || plan.days[0]
  }, [plan])

  return (
    <>
      <PageIntro
        eyebrow="Weekly plan"
        title="Backend signals turned into a coach-readable training week."
        description="This page is now a TanStack Query workflow: athlete selection drives plan, history, regeneration, and completion without manual fetch chains."
        actions={
          <div className="page-actions">
            <select className="input-control" value={athleteId} onChange={(event) => setAthleteId(event.target.value)}>
              {(athletesQuery.data?.athletes || []).map((athlete) => (
                <option key={athlete.id} value={athlete.id}>
                  {athlete.name || athlete.id}
                </option>
              ))}
            </select>
            <button className="action-button" onClick={() => regenerate.mutate()} disabled={!athleteId || regenerate.isPending}>
              {regenerate.isPending ? 'Regenerating…' : 'Regenerate'}
            </button>
          </div>
        }
      />

      {planQuery.isLoading ? <LoadingBlock label="Loading training week…" /> : null}

      {plan ? (
        <>
          <StatGrid>
            <StatCard label="Week" value={plan.week_start} hint={plan.week_end} tone="brand" />
            <StatCard label="Adherence" value={`${plan.adherence_pct}%`} hint="Completed days this week" />
            <StatCard label="Risk" value={context.injury_risk || '—'} hint="Current injury risk band" tone="warm" />
            <StatCard label="Weak joint" value={(context.weak_joint || '—').replace(/_/g, ' ')} hint="Priority movement area" tone="success" />
          </StatGrid>

          <div className="content-grid">
            <Panel
              title={plan.summary || 'This week'}
              kicker="Weekly brief"
              right={<Pill tone={plan.source === 'llm' ? 'brand' : 'neutral'}>{plan.source}</Pill>}
            >
              <div className="plan-spotlight">
                <div>
                  <strong>{spotlight?.label || 'No spotlight'}</strong>
                  <p>{spotlight?.rationale || 'No rationale available.'}</p>
                </div>
                <div className="pill-row">
                  <Pill tone="neutral">RPE {spotlight?.rpe ?? '—'}</Pill>
                  <Pill tone="neutral">{spotlight?.duration_min ?? '—'} min</Pill>
                  <Pill tone="neutral">{context.volume_state || 'balanced'} volume</Pill>
                </div>
              </div>

              <div className="calendar-grid">
                {plan.days.map((day) => (
                  <article className={`day-card day-${day.type}`} key={day.date}>
                    <div className="day-head">
                      <strong>{day.day_name}</strong>
                      <span>{day.date.slice(5)}</span>
                    </div>
                    <h3>{day.label}</h3>
                    <p>{day.rationale}</p>
                    <div className="pill-row">
                      <Pill tone="neutral">{day.type}</Pill>
                      <Pill tone="neutral">RPE {day.rpe}</Pill>
                    </div>
                    <div className="drill-stack">
                      {(day.drills || []).map((drill, index) => (
                        <div key={`${drill.name}-${index}`} className="drill-row">
                          <strong>{drill.name}</strong>
                          <span>{drill.sets} · {drill.cue}</span>
                        </div>
                      ))}
                    </div>
                    {!day.completed && day.type !== 'rest' ? (
                      <button
                        className="ghost-button"
                        onClick={() => completeDay.mutate(day.date)}
                        disabled={completeDay.isPending}
                      >
                        Mark done
                      </button>
                    ) : (
                      <Pill tone={day.completed ? 'success' : 'neutral'}>
                        {day.completed ? 'Completed' : 'Rest day'}
                      </Pill>
                    )}
                  </article>
                ))}
              </div>
            </Panel>

            <Panel title="Saved week history" kicker="Consistency">
              <div className="history-stack">
                {(historyQuery.data?.weeks || []).map((week, index) => (
                  <div key={week.week_start} className={`history-card ${index === 0 ? 'current' : ''}`}>
                    <strong>{week.week_start}</strong>
                    <p>{week.summary || 'Weekly plan snapshot'}</p>
                    <span>{week.adherence_pct}% adherence · {week.source}</span>
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
