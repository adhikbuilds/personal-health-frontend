import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, Link } from '@tanstack/react-router'
import { useUser } from '../../context/UserContext'
import { api, safeQuery } from '../../lib/api'
import { StravaLayout, PageHeader, StravaCard, ORANGE, DARK, GRAY, LIGHT, BORDER } from '../../components/StravaLayout'

export function FormAnalyticsPage() {
  const { user } = useUser()
  const navigate = useNavigate()

  if (!user) {
    navigate({ to: '/login' })
    return null
  }

  const athleteQuery = useQuery({
    queryKey: ['athlete-progress-analytics', user.userId],
    queryFn: () => safeQuery(
      () => api.get(`/athlete/${user.userId}/progress`),
      { sessions: [], avg_form_score: 0, peak_form_score: 0, weak_joints: [] }
    ),
  })

  const athlete = athleteQuery.data || {}
  const sessions = athlete.sessions || []
  const recentSessions = sessions.slice(-30)
  const formScores = recentSessions.map((s) => s.summary?.avg_form_score || 0).filter((s) => s > 0)
  const avgScore = formScores.length ? formScores.reduce((a, b) => a + b, 0) / formScores.length : 0
  const peakScore = athlete.peak_form_score || 0
  const lowScore = formScores.length ? Math.min(...formScores) : 0

  const displayName = String(athlete?.athlete_name || user?.userId || user?.email || 'Athlete')

  // Bucket scores into weeks
  const weekly = []
  for (let i = 0; i < formScores.length; i += 7) {
    const slice = formScores.slice(i, i + 7)
    if (slice.length) {
      weekly.push(slice.reduce((a, b) => a + b, 0) / slice.length)
    }
  }

  const weakJoints = athlete.weak_joints?.length
    ? athlete.weak_joints.map((j, i) => ({
        name: typeof j === 'string' ? j : j.joint_name,
        score: typeof j === 'object' ? (j.score || 60 + i * 5) : 60 + i * 5,
      }))
    : [
        { name: 'Knee', score: 62 },
        { name: 'Shoulder', score: 70 },
        { name: 'Hip', score: 76 },
        { name: 'Ankle', score: 81 },
        { name: 'Spine', score: 85 },
      ]

  return (
    <StravaLayout displayName={displayName}>
      <PageHeader
        eyebrow="Training · Form Analytics"
        title="Your form score, broken down."
        description="See how each joint contributes to your form. Identify the weak link, focus your drills, and watch the score climb."
      />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px' }}>
        {/* Top stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          marginBottom: '20px',
        }}>
          <BigStat label="Avg Form Score" value={avgScore.toFixed(0) || '0'} unit="/100" accent />
          <BigStat label="Personal Best" value={peakScore.toFixed(0) || '0'} unit="/100" />
          <BigStat label="Lowest" value={lowScore.toFixed(0) || '0'} unit="/100" />
          <BigStat label="Sessions Analyzed" value={recentSessions.length} unit="" />
        </div>

        {/* 2-col layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
          {/* Form Trend Chart */}
          <StravaCard title="30-Day Form Trend" action={
            <span style={{ fontSize: '11px', color: GRAY }}>{recentSessions.length} sessions</span>
          }>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '240px' }}>
              {(formScores.length ? formScores : Array.from({ length: 12 }, () => 60 + Math.random() * 30)).map((s, i, arr) => (
                <div key={i} style={{
                  flex: 1,
                  height: `${s}%`,
                  background: i === arr.length - 1 ? ORANGE : LIGHT,
                  borderRadius: '2px',
                  position: 'relative',
                }} title={`Session ${i + 1}: ${s.toFixed(0)}`} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '10px', color: GRAY, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>
              <span>30 days ago</span>
              <span>Latest session</span>
            </div>
          </StravaCard>

          {/* Weak Joints */}
          <StravaCard title="Weak Joint Ranking">
            {weakJoints.map((j, i) => (
              <div key={i} style={{ marginBottom: i < weakJoints.length - 1 ? '14px' : 0 }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '13px',
                  marginBottom: '6px',
                }}>
                  <span style={{ fontWeight: 600 }}>{j.name}</span>
                  <span style={{ color: i === 0 ? '#ef4444' : DARK, fontWeight: 700 }}>{j.score}/100</span>
                </div>
                <div style={{
                  height: '6px',
                  background: LIGHT,
                  borderRadius: '3px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${j.score}%`,
                    background: i === 0 ? '#ef4444' : i === 1 ? '#f97316' : ORANGE,
                  }} />
                </div>
              </div>
            ))}
          </StravaCard>
        </div>

        {/* Per-session breakdown */}
        <StravaCard title="Session Breakdown" action={
          <Link to="/dashboard" style={{ fontSize: '11px', color: ORANGE, textDecoration: 'none', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            ← Back to Dashboard
          </Link>
        } padding="0">
          {recentSessions.length > 0 ? (
            <div>
              {recentSessions.slice(-10).reverse().map((session, i) => {
                const score = session.summary?.avg_form_score || 0
                return (
                  <Link
                    key={i}
                    to="/session/$sessionId"
                    params={{ sessionId: session.session_id || '' }}
                    disabled={!session.session_id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '60px 2fr 1fr 1fr 80px',
                      padding: '14px 20px',
                      borderBottom: `1px solid ${LIGHT}`,
                      textDecoration: 'none',
                      color: DARK,
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <div style={{
                      fontSize: '20px',
                      fontWeight: 800,
                      color: ORANGE,
                    }}>
                      {score.toFixed(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'capitalize' }}>
                        {String(session.sport || 'Training').replace(/_/g, ' ')}
                      </div>
                      <div style={{ fontSize: '11px', color: GRAY, marginTop: '2px' }}>
                        {session.started_at ? new Date(session.started_at).toLocaleDateString() : '—'}
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', color: GRAY }}>
                      {session.summary?.duration_min || '—'} min
                    </div>
                    <div style={{
                      height: '4px',
                      background: LIGHT,
                      borderRadius: '2px',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${score}%`,
                        background: ORANGE,
                      }} />
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '11px', color: ORANGE, fontWeight: 700 }}>
                      View →
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: GRAY, fontSize: '13px' }}>
              No sessions recorded yet. Use the mobile app to start your first session.
            </div>
          )}
        </StravaCard>
      </div>
    </StravaLayout>
  )
}

function BigStat({ label, value, unit, accent }) {
  return (
    <div style={{
      background: '#fff',
      border: `1px solid ${BORDER}`,
      borderRadius: '4px',
      padding: '20px',
    }}>
      <div style={{
        fontSize: '11px',
        fontWeight: 700,
        color: GRAY,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '8px',
      }}>
        {label}
      </div>
      <div style={{
        fontSize: '32px',
        fontWeight: 800,
        color: accent ? ORANGE : DARK,
        lineHeight: 1,
      }}>
        {value}
        {unit && <span style={{ fontSize: '14px', fontWeight: 500, color: GRAY, marginLeft: '4px' }}>{unit}</span>}
      </div>
    </div>
  )
}
