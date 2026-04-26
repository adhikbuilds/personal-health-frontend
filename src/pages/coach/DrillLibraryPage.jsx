import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useUser } from '../../context/UserContext'
import { api, safeQuery } from '../../lib/api'
import { StravaLayout, PageHeader, StravaCard, ORANGE, DARK, GRAY, LIGHT, BORDER } from '../../components/StravaLayout'

export function DrillLibraryPage() {
  const { user } = useUser()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (!user) navigate({ to: '/login' })
  }, [user, navigate])

  const drillsQuery = useQuery({
    queryKey: ['drills-catalog'],
    queryFn: () => safeQuery(() => api.get('/drills/catalog'), { drills: [] }),
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
          <button style={{
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
            <DrillCard key={d.id || d.name} drill={d} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: GRAY, fontSize: '13px', background: '#fff', border: `1px solid ${BORDER}`, borderRadius: '4px' }}>
            No drills match your search.
          </div>
        )}
      </div>
    </StravaLayout>
  )
}

function DrillCard({ drill }) {
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
        <button style={{
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
        }}>
          Assign →
        </button>
      </div>
    </div>
  )
}
