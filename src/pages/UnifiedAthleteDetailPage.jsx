import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, Link } from '@tanstack/react-router'
import { useUser } from '../context/UserContext'
import { api, safeQuery } from '../lib/api'
import { StravaLayout, PageHeader, StravaCard, ORANGE, DARK, GRAY, LIGHT, BORDER } from '../components/StravaLayout'

export function UnifiedAthleteDetailPage({ athleteId }) {
  const { user, isCoach } = useUser()
  const navigate = useNavigate()

  if (!user) {
    navigate({ to: '/login' })
    return null
  }

  const athleteQuery = useQuery({
    queryKey: ['athlete-progress-detail', athleteId],
    queryFn: () => safeQuery(
      () => api.get(`/athlete/${athleteId}/progress`),
      { athlete_id: athleteId, athlete_name: athleteId, sport: 'Athlete', avg_form_score: 0, peak_form_score: 0, sessions: [], weak_joints: [] }
    ),
  })

  const athlete = athleteQuery.data || {}
  const sessions = athlete.sessions || []
  const recentSessions = sessions.slice(-10)
  const formScores = sessions.map((s) => s.summary?.avg_form_score || 0).filter((s) => s > 0)
  const avgScore = formScores.length ? formScores.reduce((a, b) => a + b, 0) / formScores.length : 0
  const peakScore = athlete.peak_form_score || Math.max(0, ...formScores)
  const totalSessions = sessions.length

  const displayName = String(athlete?.athlete_name || athleteId || 'Athlete')
  const myDisplayName = String(user?.userId || user?.email || 'User')

  const weakJoints = athlete.weak_joints?.length
    ? athlete.weak_joints.map((j, i) => ({
        name: typeof j === 'string' ? j : j.joint_name,
        score: typeof j === 'object' ? (j.score || 60 + i * 5) : 60 + i * 5,
      }))
    : [
        { name: 'Knee', score: 62 },
        { name: 'Shoulder', score: 70 },
        { name: 'Hip', score: 76 },
      ]

  return (
    <StravaLayout displayName={myDisplayName} role={isCoach ? 'coach' : 'athlete'}>
      {/* Header with avatar */}
      <div style={{ background: DARK, color: '#fff', padding: '40px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <Link to="/dashboard" style={{ color: ORANGE, fontSize: '11px', fontWeight: 700, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            ← Back to Roster
          </Link>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginTop: '20px' }}>
            <div style={{
              width: '96px',
              height: '96px',
              borderRadius: '50%',
              background: ORANGE,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              fontWeight: 800,
            }}>
              {String(displayName).charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 800, margin: 0, letterSpacing: '-1px' }}>
                {displayName}
              </h1>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginTop: '6px', textTransform: 'capitalize' }}>
                {athlete.sport || 'Athlete'} · Tier 1 · {totalSessions} sessions
              </div>
            </div>
            {isCoach && (
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                <button style={{
                  padding: '12px 20px',
                  background: 'transparent',
                  border: '1px solid #fff',
                  color: '#fff',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  Send Feedback
                </button>
                <button style={{
                  padding: '12px 20px',
                  background: ORANGE,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  Assign Drill
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
          <BigStat label="Form Score" value={avgScore.toFixed(0)} unit="/100" accent />
          <BigStat label="Personal Best" value={peakScore.toFixed(0) || '0'} unit="/100" />
          <BigStat label="Total Sessions" value={totalSessions} />
          <BigStat label="Last Session" value={recentSessions[0]?.started_at ? new Date(recentSessions[recentSessions.length - 1].started_at).toLocaleDateString() : '—'} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
          {/* Trend */}
          <StravaCard title="Form Trend">
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '200px' }}>
              {(formScores.length ? formScores : Array.from({ length: 12 }, () => 60 + Math.random() * 30)).map((s, i, arr) => (
                <div key={i} style={{
                  flex: 1,
                  height: `${s}%`,
                  background: i === arr.length - 1 ? ORANGE : LIGHT,
                  borderRadius: '2px',
                }} />
              ))}
            </div>
          </StravaCard>

          {/* Weak joints */}
          <StravaCard title="Weak Joints">
            {weakJoints.map((j, i) => (
              <div key={i} style={{ marginBottom: i < weakJoints.length - 1 ? '14px' : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 600 }}>{j.name}</span>
                  <span style={{ color: i === 0 ? '#ef4444' : DARK, fontWeight: 700 }}>{j.score}/100</span>
                </div>
                <div style={{ height: '6px', background: LIGHT, borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${j.score}%`, background: i === 0 ? '#ef4444' : i === 1 ? '#f97316' : ORANGE }} />
                </div>
              </div>
            ))}
          </StravaCard>
        </div>

        {/* Sessions */}
        <StravaCard title="Recent Sessions" padding="0">
          {recentSessions.length > 0 ? (
            recentSessions.reverse().map((s, i, arr) => (
              <Link
                key={i}
                to="/session/$sessionId"
                params={{ sessionId: s.session_id || '' }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '60px 2fr 1fr 1fr 80px',
                  padding: '14px 20px',
                  borderBottom: i < arr.length - 1 ? `1px solid ${LIGHT}` : 'none',
                  textDecoration: 'none',
                  color: DARK,
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div style={{ fontSize: '20px', fontWeight: 800, color: ORANGE }}>
                  {(s.summary?.avg_form_score || 0).toFixed(0)}
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'capitalize' }}>
                    {String(s.sport || 'Training').replace(/_/g, ' ')}
                  </div>
                  <div style={{ fontSize: '11px', color: GRAY, marginTop: '2px' }}>
                    {s.started_at ? new Date(s.started_at).toLocaleDateString() : '—'}
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: GRAY }}>{s.summary?.duration_min || '—'} min</div>
                <div style={{ height: '4px', background: LIGHT, borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${s.summary?.avg_form_score || 0}%`, background: ORANGE }} />
                </div>
                <div style={{ textAlign: 'right', fontSize: '11px', color: ORANGE, fontWeight: 700 }}>View →</div>
              </Link>
            ))
          ) : (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: GRAY, fontSize: '13px' }}>
              No sessions recorded yet.
            </div>
          )}
        </StravaCard>
      </div>
    </StravaLayout>
  )
}

function BigStat({ label, value, unit, accent }) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: '4px', padding: '20px' }}>
      <div style={{ fontSize: '11px', fontWeight: 700, color: GRAY, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
        {label}
      </div>
      <div style={{ fontSize: '24px', fontWeight: 800, color: accent ? ORANGE : DARK, lineHeight: 1 }}>
        {value}
        {unit && <span style={{ fontSize: '12px', fontWeight: 500, color: GRAY, marginLeft: '6px' }}>{unit}</span>}
      </div>
    </div>
  )
}
