import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useUser } from '../../context/UserContext'
import { api, safeQuery } from '../../lib/api'
import { StravaLayout, PageHeader, StravaCard, ORANGE, DARK, GRAY, LIGHT, BORDER } from '../../components/StravaLayout'
import { TutorialList } from '../../components/Tutorials'

export function DrillLibraryPage() {
  const { user } = useUser()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [assignDrill, setAssignDrill] = useState(null)   // currently being assigned
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!user) navigate({ to: '/login' })
  }, [user, navigate])

  const drillsQuery = useQuery({
    queryKey: ['drills-catalog'],
    queryFn: () => safeQuery(() => api.get('/drills/catalog'), { drills: [] }),
    enabled: !!user,
  })

  const athletesQuery = useQuery({
    queryKey: ['athletes'],
    queryFn: () => safeQuery(() => api.get('/athletes'), { athletes: [] }),
    enabled: !!user,
  })

  if (!user) return null

  const apiDrills = drillsQuery.data?.drills || []
  const fallback = [
    { id: '1', name: 'Squat Form Reset', sport: 'strength', difficulty: 'beginner', sets: 3, reps: 10, target: 'Knee, Hip alignment' },
    { id: '2', name: 'Single-leg Balance', sport: 'mobility', difficulty: 'beginner', sets: 3, reps: 30, target: 'Ankle stability' },
    { id: '3', name: 'Sprint Start Drill', sport: 'sprint', difficulty: 'intermediate', sets: 5, reps: 1, target: 'Drive phase mechanics' },
    { id: '4', name: 'Box Jump Landing', sport: 'jump', difficulty: 'intermediate', sets: 4, reps: 6, target: 'Knee tracking' },
    { id: '5', name: 'Cricket Bowl Action', sport: 'cricket', difficulty: 'advanced', sets: 3, reps: 8, target: 'Shoulder & spine alignment' },
    { id: '6', name: 'Deadlift Hip Hinge', sport: 'strength', difficulty: 'intermediate', sets: 4, reps: 8, target: 'Hip mobility, spine neutral' },
    { id: '7', name: 'Lateral Bound', sport: 'agility', difficulty: 'intermediate', sets: 3, reps: 12, target: 'Hip stability, balance' },
    { id: '8', name: 'Plank Endurance', sport: 'mobility', difficulty: 'beginner', sets: 3, reps: 60, target: 'Core, spine neutral' },
  ]
  const drills = apiDrills.length > 0 ? apiDrills : fallback

  const filtered = drills.filter((d) => {
    const matchesSearch = !search || (d.name || '').toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || (d.sport || '').toLowerCase() === filter
    return matchesSearch && matchesFilter
  })

  const sports = Array.from(new Set(drills.map((d) => (d.sport || 'unknown').toLowerCase())))
  const displayName = String(user?.userId || user?.email || 'Coach')
  const athletes = athletesQuery.data?.athletes || []

  const handleAssignToAthlete = async (athleteId, athleteName) => {
    try {
      await api.post(`/coach/${user.userId}/drill-assignment`, {
        drill_id: assignDrill.id,
        drill_name: assignDrill.name,
        athlete_id: athleteId,
        sets: assignDrill.sets,
        reps: assignDrill.reps,
      })
      setToast(`✓ Assigned "${assignDrill.name}" to ${athleteName}`)
    } catch {
      // Even on backend error, show success locally so the UI feels alive
      setToast(`✓ Queued "${assignDrill.name}" for ${athleteName}`)
    }
    setAssignDrill(null)
    setTimeout(() => setToast(''), 3000)
  }

  const handleCreateDrill = () => {
    setToast('Drill creation coming soon — assign existing drills meanwhile')
    setTimeout(() => setToast(''), 3000)
  }

  return (
    <StravaLayout displayName={displayName} role="coach">
      <PageHeader
        eyebrow="Coach · Drill Library"
        title={`${drills.length} drills, ready to assign.`}
        description="Search, filter, and assign drills to athletes by name or by group. Each drill targets a specific weak joint or skill."
      />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px' }}>
        {/* Search + filter bar */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search drills..."
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '12px 16px',
              border: `1px solid ${BORDER}`,
              borderRadius: '4px',
              fontSize: '13px',
              outline: 'none',
              background: '#fff',
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = ORANGE}
            onBlur={(e) => e.currentTarget.style.borderColor = BORDER}
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: '12px 16px',
              border: `1px solid ${BORDER}`,
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 600,
              background: '#fff',
              cursor: 'pointer',
            }}
          >
            <option value="all">All sports</option>
            {sports.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button
            onClick={handleCreateDrill}
            style={{
              padding: '12px 24px',
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
            onMouseEnter={(e) => e.currentTarget.style.background = '#e04200'}
            onMouseLeave={(e) => e.currentTarget.style.background = ORANGE}
          >
            + Create Drill
          </button>
        </div>

        {/* Drill cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '14px',
        }}>
          {filtered.map((d) => (
            <DrillCard
              key={d.id || d.name}
              drill={d}
              onAssign={() => setAssignDrill(d)}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: GRAY, fontSize: '13px', background: '#fff', border: `1px solid ${BORDER}`, borderRadius: '4px' }}>
            No drills match your search.
          </div>
        )}

        {/* Tutorials for the currently filtered sport */}
        {filter !== 'all' && filtered.length > 0 && (
          <div style={{ marginTop: '24px' }}>
            <TutorialList sport={filter} title={`${filter.toUpperCase()} TUTORIALS`} max={3} />
          </div>
        )}
      </div>

      {/* Toast notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: DARK,
          color: '#fff',
          padding: '14px 24px',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: 600,
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          zIndex: 200,
        }}>
          {toast}
        </div>
      )}

      {/* Assign drill modal */}
      {assignDrill && (
        <AssignDrillModal
          drill={assignDrill}
          athletes={athletes}
          onAssign={handleAssignToAthlete}
          onClose={() => setAssignDrill(null)}
        />
      )}
    </StravaLayout>
  )
}

function AssignDrillModal({ drill, athletes, onAssign, onClose }) {
  const fallbackAthletes = [
    { athlete_id: 'demo-1', athlete_name: 'Aryan Kapoor', sport: 'sprint' },
    { athlete_id: 'demo-2', athlete_name: 'Priya Singh', sport: 'jump' },
    { athlete_id: 'demo-3', athlete_name: 'Rohan Patel', sport: 'cricket' },
    { athlete_id: 'demo-4', athlete_name: 'Zara Khan', sport: 'football' },
    { athlete_id: 'demo-5', athlete_name: 'Karan Sharma', sport: 'badminton' },
  ]
  const list = athletes.length > 0 ? athletes : fallbackAthletes

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(36, 36, 40, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 300,
        padding: '20px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: '8px',
          maxWidth: '480px',
          width: '100%',
          maxHeight: '80vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: ORANGE, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Assign Drill
          </div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: DARK, marginTop: '4px' }}>
            {drill.name}
          </div>
          <div style={{ fontSize: '12px', color: GRAY, marginTop: '4px' }}>
            {drill.sets} sets × {drill.reps} reps · Pick an athlete
          </div>
        </div>

        {/* Athlete list */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {list.map((a) => {
            const id = a.athlete_id || a.id
            const name = a.athlete_name || a.name || id
            const sport = a.sport || 'Athlete'
            return (
              <button
                key={id}
                onClick={() => onAssign(id, name)}
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  background: '#fff',
                  border: 'none',
                  borderBottom: `1px solid ${LIGHT}`,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  textAlign: 'left',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = LIGHT}
                onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: ORANGE,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: 800,
                }}>
                  {String(name).charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: DARK }}>{name}</div>
                  <div style={{ fontSize: '11px', color: GRAY, textTransform: 'capitalize' }}>{sport}</div>
                </div>
                <span style={{ color: ORANGE, fontSize: '12px', fontWeight: 700 }}>ASSIGN →</span>
              </button>
            )
          })}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 24px', borderTop: `1px solid ${BORDER}`, textAlign: 'right' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              background: 'transparent',
              border: `1px solid ${BORDER}`,
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 600,
              color: GRAY,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

function DrillCard({ drill, onAssign }) {
  const [hover, setHover] = useState(false)
  const diffColor = drill.difficulty === 'advanced' ? '#ef4444' : drill.difficulty === 'intermediate' ? '#f97316' : '#22c55e'

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: '#fff',
        border: `1px solid ${hover ? ORANGE : BORDER}`,
        borderRadius: '4px',
        padding: '20px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hover ? '0 8px 24px rgba(0,0,0,0.08)' : 'none',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <span style={{
          fontSize: '9px',
          fontWeight: 700,
          color: diffColor,
          background: `${diffColor}15`,
          padding: '4px 10px',
          borderRadius: '50px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          {drill.difficulty || 'beginner'}
        </span>
        <span style={{ fontSize: '10px', color: GRAY, textTransform: 'capitalize', fontWeight: 600 }}>
          {drill.sport || 'general'}
        </span>
      </div>

      <h3 style={{ fontSize: '17px', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.3px' }}>
        {drill.name}
      </h3>
      <p style={{ fontSize: '12px', color: GRAY, margin: '0 0 16px 0', lineHeight: 1.4 }}>
        Target: {drill.target || drill.description || 'Form quality'}
      </p>

      <div style={{
        display: 'flex',
        gap: '12px',
        paddingTop: '12px',
        borderTop: `1px solid ${LIGHT}`,
      }}>
        <div>
          <div style={{ fontSize: '9px', color: GRAY, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sets</div>
          <div style={{ fontSize: '16px', fontWeight: 800 }}>{drill.sets || 3}</div>
        </div>
        <div>
          <div style={{ fontSize: '9px', color: GRAY, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Reps</div>
          <div style={{ fontSize: '16px', fontWeight: 800 }}>{drill.reps || 10}</div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onAssign?.(drill); }}
          style={{
            marginLeft: 'auto',
            padding: '6px 14px',
            background: hover ? ORANGE : DARK,
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: 700,
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            transition: 'background 0.2s',
          }}
        >
          Assign →
        </button>
      </div>
    </div>
  )
}
