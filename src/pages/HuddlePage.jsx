import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, safeQuery } from '../lib/api'
import { getCurrentAthleteId } from '../lib/auth'
import { toast } from '../lib/toast'
import { LoadingBlock, PageIntro, Panel, Pill, StatCard, StatGrid } from '../components/Primitives'

export function HuddlePage() {
  const queryClient = useQueryClient()
  const huddlesQuery = useQuery({
    queryKey: ['huddles'],
    queryFn: () => safeQuery(() => api.get('/huddles'), { huddles: [] }),
    refetchInterval: 5000,
  })
  const athletesQuery = useQuery({
    queryKey: ['huddle-athletes'],
    queryFn: () => safeQuery(() => api.get('/athletes'), { athletes: [] }),
  })

  const [filter, setFilter] = useState('all')
  const [form, setForm] = useState({
    name: 'Friday Jump Lab',
    sport: 'vertical_jump',
    coach_id: '',
    max_athletes: 12,
  })

  const createMutation = useMutation({
    mutationFn: () => api.post('/huddle/create', form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['huddles'] })
      toast.success(`Huddle "${form.name}" created.`)
    },
    onError: (e) => toast.error(`Couldn't create huddle: ${e?.message || 'unknown error'}`),
  })
  const startMutation = useMutation({
    mutationFn: (id) => api.post(`/huddle/${id}/start`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['huddles'] })
      toast.success('Huddle started.')
    },
    onError: (e) => toast.error(`Couldn't start huddle: ${e?.message || 'unknown error'}`),
  })
  const endMutation = useMutation({
    mutationFn: (id) => api.post(`/huddle/${id}/end`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['huddles'] })
      toast.success('Huddle ended.')
    },
    onError: (e) => toast.error(`Couldn't end huddle: ${e?.message || 'unknown error'}`),
  })
  const joinMutation = useMutation({
    mutationFn: (id) => api.post(`/huddle/${id}/join`, { athlete_id: getCurrentAthleteId() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['huddles'] })
      toast.success('Joined huddle.')
    },
    onError: (e) => toast.error(`Couldn't join: ${e?.message || 'unknown error'}`),
  })
  const leaveMutation = useMutation({
    mutationFn: (id) => api.post(`/huddle/${id}/leave`, { athlete_id: getCurrentAthleteId() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['huddles'] })
      toast.success('Left huddle.')
    },
    onError: (e) => toast.error(`Couldn't leave: ${e?.message || 'unknown error'}`),
  })

  const athleteId = getCurrentAthleteId()
  const allHuddles = huddlesQuery.data?.huddles || []
  const visibleHuddles = useMemo(() => {
    if (filter === 'all') return allHuddles
    return allHuddles.filter((huddle) => huddle.status === filter)
  }, [allHuddles, filter])
  const activeHuddle = allHuddles.find((huddle) => huddle.status === 'active' || huddle.status === 'waiting')

  return (
    <>
      <PageIntro
        eyebrow="Live rooms"
        title="Coach-led huddles built as a real product workflow, not a loose collection of buttons."
        description="The room list, create flow, and live room view all sit on TanStack Query mutations so the UI stays in sync as coaches create, start, and end sessions."
      />

      <StatGrid>
        <StatCard label="Total rooms" value={allHuddles.length} hint="All huddles in storage" />
        <StatCard label="Live rooms" value={allHuddles.filter((huddle) => huddle.status === 'active').length} hint="Currently scoring" tone="success" />
        <StatCard label="Waiting rooms" value={allHuddles.filter((huddle) => huddle.status === 'waiting').length} hint="Ready to start" tone="warm" />
        <StatCard label="Visible now" value={visibleHuddles.length} hint={`Filter: ${filter}`} tone="brand" />
      </StatGrid>

      <div className="content-grid">
        <Panel title="Create a huddle" kicker="Control room">
          <div className="form-grid">
            <label>
              <span>Name</span>
              <input className="input-control" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </label>
            <label>
              <span>Sport</span>
              <select className="input-control" value={form.sport} onChange={(event) => setForm({ ...form, sport: event.target.value })}>
                <option value="general">General</option>
                <option value="vertical_jump">Vertical Jump</option>
                <option value="squat">Squat</option>
                <option value="push_up">Push-up</option>
                <option value="pull_up">Pull-up</option>
                <option value="sprint">Sprint</option>
                <option value="snatch">Snatch</option>
                <option value="javelin">Javelin</option>
                <option value="cricket_bat">Cricket Bat</option>
              </select>
            </label>
            <label>
              <span>Coach</span>
              <select className="input-control" value={form.coach_id} onChange={(event) => setForm({ ...form, coach_id: event.target.value })}>
                <option value="">No coach assigned</option>
                {(athletesQuery.data?.athletes || []).slice(0, 25).map((athlete) => (
                  <option key={athlete.id} value={athlete.id}>
                    {athlete.name || athlete.id}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Capacity</span>
              <input
                className="input-control"
                type="number"
                min="2"
                max="60"
                value={form.max_athletes}
                onChange={(event) => setForm({ ...form, max_athletes: Number(event.target.value) })}
              />
            </label>
          </div>
          <button className="action-button" onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Creating…' : 'Create room'}
          </button>
        </Panel>

        <Panel title="Active room" kicker="Focus">
          {activeHuddle ? (
            <div className="active-huddle">
              <strong>{activeHuddle.name}</strong>
              <p>{activeHuddle.sport?.replace(/_/g, ' ')} · {(activeHuddle.athletes || []).length}/{activeHuddle.max_athletes} athletes</p>
              <div className="pill-row">
                <Pill tone={activeHuddle.status === 'active' ? 'success' : 'warm'}>{activeHuddle.status}</Pill>
                <Pill tone="neutral">{activeHuddle.coach_id || 'No coach'}</Pill>
              </div>
              <div className="table-shell">
                {(activeHuddle.leaderboard || []).length ? (
                  (activeHuddle.leaderboard || []).map((athlete, index) => (
                    <div key={`${athlete.athlete_id}-${index}`} className="table-row">
                      <span>{index + 1}</span>
                      <strong>{athlete.name || athlete.athlete_id}</strong>
                      <em>{(athlete.avg_form_score || athlete.avg_score || 0).toFixed(1)}</em>
                    </div>
                  ))
                ) : (
                  <div className="empty-block">Leaderboard will appear when live scores arrive.</div>
                )}
              </div>
            </div>
          ) : (
            <div className="empty-block">No active or waiting room right now.</div>
          )}
        </Panel>
      </div>

      <Panel
        title="Huddle roster"
        kicker="Rooms"
        right={
          <div className="pill-row">
            {['all', 'waiting', 'active', 'ended'].map((option) => (
              <button
                key={option}
                className={`filter-chip ${filter === option ? 'selected' : ''}`}
                onClick={() => setFilter(option)}
              >
                {option}
              </button>
            ))}
          </div>
        }
      >
        {huddlesQuery.isLoading ? <LoadingBlock label="Loading huddles…" /> : null}
        <div className="card-grid">
          {visibleHuddles.map((huddle) => (
            <article className="room-card" key={huddle.huddle_id}>
              <div className="room-top">
                <div>
                  <strong>{huddle.name}</strong>
                  <span>{huddle.sport?.replace(/_/g, ' ')} · {(huddle.athletes || []).length}/{huddle.max_athletes}</span>
                </div>
                <Pill tone={huddle.status === 'active' ? 'success' : huddle.status === 'waiting' ? 'warm' : 'neutral'}>
                  {huddle.status}
                </Pill>
              </div>
              <small>{huddle.huddle_id}</small>
              <div className="room-actions">
                {huddle.status === 'waiting' ? (
                  <button className="ghost-button" onClick={() => startMutation.mutate(huddle.huddle_id)}>
                    Start
                  </button>
                ) : null}
                {huddle.status === 'active' ? (
                  <button className="ghost-button danger" onClick={() => endMutation.mutate(huddle.huddle_id)}>
                    End
                  </button>
                ) : null}
                {(huddle.status === 'waiting' || huddle.status === 'active') && athleteId ? (
                  (huddle.athletes || []).some((a) => a === athleteId || a?.athlete_id === athleteId) ? (
                    <button className="ghost-button" onClick={() => leaveMutation.mutate(huddle.huddle_id)} disabled={leaveMutation.isPending}>
                      Leave
                    </button>
                  ) : (
                    <button className="ghost-button" onClick={() => joinMutation.mutate(huddle.huddle_id)} disabled={joinMutation.isPending}>
                      Join
                    </button>
                  )
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </Panel>
    </>
  )
}
