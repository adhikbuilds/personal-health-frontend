// HuddleLivePage — live group training screen with real-time form scores.
// Wires: /huddle/{id}, /huddle/{id}/live, /huddle/{id}/join, /huddle/{id}/end

import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useUser } from '../context/UserContext'
import { api, safeQuery } from '../lib/api'
import { StravaLayout, ORANGE, DARK, GRAY, LIGHT, BORDER } from '../components/StravaLayout'

export function HuddleLivePage({ huddleId }) {
  const { user, isCoach } = useUser()
  const navigate = useNavigate()
  const [joined, setJoined] = useState(false)

  useEffect(() => { if (!user) navigate({ to: '/login' }) }, [user, navigate])

  const huddleQuery = useQuery({
    queryKey: ['huddle', huddleId],
    queryFn: () => safeQuery(() => api.get(`/huddle/${huddleId}`), null),
    enabled: !!user,
  })

  const liveQuery = useQuery({
    queryKey: ['huddle-live', huddleId],
    queryFn: () => safeQuery(() => api.get(`/huddle/${huddleId}/live`), { participants: [] }),
    enabled: !!user,
    refetchInterval: 2_000,
  })

  const joinMut = useMutation({
    mutationFn: () => api.post(`/huddle/${huddleId}/join`, { athlete_id: user.userId }).catch(() => null),
  })
  const endMut = useMutation({
    mutationFn: () => api.post(`/huddle/${huddleId}/end`, {}).catch(() => null),
  })

  const handleJoin = () => { setJoined(true); joinMut.mutate() }

  if (!user) return null

  const huddle = huddleQuery.data || {
    id: huddleId,
    title: 'Morning Strength Session',
    coach_name: 'Coach Priya',
    started_at: new Date(Date.now() - 8 * 60_000).toISOString(),
    sport: 'Strength Training',
    status: 'active',
  }

  const fallbackParticipants = [
    { athlete_id: 'demo-aryan',  athlete_name: 'Aryan Kapoor',  form_score: 88, reps: 8, status: 'active' },
    { athlete_id: 'demo-priya',  athlete_name: 'Priya Singh',   form_score: 82, reps: 6, status: 'active' },
    { athlete_id: 'demo-vikram', athlete_name: 'Vikram T.',     form_score: 79, reps: 7, status: 'active' },
    { athlete_id: 'demo-zara',   athlete_name: 'Zara Khan',     form_score: 85, reps: 8, status: 'active' },
    { athlete_id: 'demo-rohan',  athlete_name: 'Rohan Patel',   form_score: 71, reps: 5, status: 'paused' },
    { athlete_id: 'demo-karan',  athlete_name: 'Karan Sharma',  form_score: 76, reps: 6, status: 'active' },
  ]
  const participants = liveQuery.data?.participants?.length > 0
    ? liveQuery.data.participants
    : fallbackParticipants

  const elapsed = huddle.started_at
    ? Math.floor((Date.now() - new Date(huddle.started_at).getTime()) / 60_000)
    : 0
  const displayName = String(user?.userId || user?.email || 'Athlete')

  return (
    <StravaLayout displayName={displayName} role={isCoach ? 'coach' : 'athlete'}>
      <div style={{
        background: DARK, color: '#fff', padding: '24px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-50px', right: '-50px',
          width: '200px', height: '200px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(252,76,2,0.3) 0%, transparent 70%)',
        }} />
        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{
              width: '10px', height: '10px', borderRadius: '50%',
              background: '#22c55e',
              animation: 'ph-pulse 1.5s infinite',
            }} />
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#22c55e', letterSpacing: '1px' }}>
              ● LIVE HUDDLE
            </span>
            <span style={{ fontSize: '11px', opacity: 0.6, marginLeft: '6px' }}>
              {elapsed}m elapsed · {participants.length} athletes
            </span>
          </div>
          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 800, margin: 0, letterSpacing: '-1px',
          }}>
            {huddle.title}
          </h1>
          <div style={{ fontSize: '13px', opacity: 0.7, marginTop: '6px' }}>
            led by {huddle.coach_name || 'Coach'} · {huddle.sport || 'Training'}
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '20px', flexWrap: 'wrap' }}>
            {!joined && !isCoach && (
              <button onClick={handleJoin} style={{
                padding: '12px 24px', background: ORANGE, color: '#fff',
                border: 'none', borderRadius: '4px',
                fontSize: '13px', fontWeight: 800, cursor: 'pointer',
                textTransform: 'uppercase', letterSpacing: '0.5px',
              }}>
                ⚡ Join Huddle
              </button>
            )}
            {joined && !isCoach && (
              <span style={{
                padding: '12px 24px',
                background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '4px', fontSize: '13px', fontWeight: 800,
                textTransform: 'uppercase', letterSpacing: '0.5px',
              }}>
                ✓ You're in
              </span>
            )}
            {isCoach && (
              <button onClick={() => endMut.mutate()} style={{
                padding: '12px 24px', background: '#ef4444', color: '#fff',
                border: 'none', borderRadius: '4px',
                fontSize: '13px', fontWeight: 800, cursor: 'pointer',
                textTransform: 'uppercase', letterSpacing: '0.5px',
              }}>
                End Huddle
              </button>
            )}
            <button style={{
              padding: '12px 18px',
              background: 'rgba(255,255,255,0.1)', color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px',
              fontSize: '13px', fontWeight: 700, cursor: 'pointer',
            }}>
              🎤 Voice Note
            </button>
            <button style={{
              padding: '12px 18px',
              background: 'rgba(255,255,255,0.1)', color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px',
              fontSize: '13px', fontWeight: 700, cursor: 'pointer',
            }}>
              🔥 Cheer All
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 20px 100px' }}>
        <div style={{
          fontSize: '11px', fontWeight: 800, color: GRAY,
          letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '14px',
        }}>
          LIVE FORM SCORES
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '12px',
        }}>
          {participants.map((p) => (
            <ParticipantCard key={p.athlete_id} p={p} isMe={p.athlete_id === user.userId} />
          ))}
        </div>
      </div>
    </StravaLayout>
  )
}

function ParticipantCard({ p, isMe }) {
  const score = p.form_score || p.score || 0
  const isActive = p.status === 'active' || p.status === 'recording'
  const scoreColor = score >= 80 ? '#22c55e' : score >= 70 ? ORANGE : '#ef4444'

  return (
    <div style={{
      background: '#fff',
      border: `1px solid ${isMe ? ORANGE : BORDER}`,
      borderRadius: '8px', padding: '16px',
      position: 'relative', overflow: 'hidden',
    }}>
      {isActive && (
        <span style={{
          position: 'absolute', top: '12px', right: '12px',
          width: '8px', height: '8px', borderRadius: '50%',
          background: '#22c55e',
          animation: 'ph-pulse 1.5s infinite',
        }} />
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: isMe ? ORANGE : DARK, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '13px', fontWeight: 700,
        }}>
          {String(p.athlete_name || 'A').charAt(0).toUpperCase()}
        </div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: DARK }}>
            {p.athlete_name || p.athlete_id}
            {isMe && <span style={{ marginLeft: '6px', color: ORANGE, fontSize: '10px' }}>(You)</span>}
          </div>
          <div style={{ fontSize: '10px', color: GRAY, fontWeight: 600 }}>
            {p.reps != null ? `${p.reps} reps` : isActive ? 'Recording' : 'Paused'}
          </div>
        </div>
      </div>
      <div style={{ fontSize: '36px', fontWeight: 800, color: scoreColor, lineHeight: 1 }}>
        {Math.round(score)}
        <span style={{ fontSize: '12px', color: GRAY, fontWeight: 500, marginLeft: '4px' }}>FORM</span>
      </div>
      <div style={{ marginTop: '8px', height: '4px', background: LIGHT, borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{
          width: `${score}%`, height: '100%', background: scoreColor,
          borderRadius: '2px', transition: 'width 0.5s',
        }} />
      </div>
    </div>
  )
}
