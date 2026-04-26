// FeedPage — community activity feed (Strava-style)
// Wires: /feed (timeline), /follow (toggle), /athlete/{id}/claps (kudos)

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, Link } from '@tanstack/react-router'
import { useUser } from '../context/UserContext'
import { api, safeQuery } from '../lib/api'
import { StravaLayout, PageHeader, StravaCard, ORANGE, DARK, GRAY, LIGHT, BORDER } from '../components/StravaLayout'

export function FeedPage() {
  const { user, isCoach } = useUser()
  const navigate = useNavigate()
  const [tab, setTab] = useState('for_you')

  React.useEffect(() => { if (!user) navigate({ to: '/login' }) }, [user, navigate])

  const feedQuery = useQuery({
    queryKey: ['feed', user?.userId, tab],
    queryFn: () => user ? safeQuery(
      () => api.get(`/feed?athlete_id=${user.userId}&tab=${tab}&page=1`),
      { items: [] }
    ) : null,
    enabled: !!user,
    refetchInterval: 60_000,
  })

  const activeQuery = useQuery({
    queryKey: ['feed-active'],
    queryFn: () => safeQuery(() => api.get('/sessions/active'), { active_sessions: [] }),
    refetchInterval: 5_000,
    enabled: !!user,
  })

  if (!user) return null

  const items = feedQuery.data?.items || feedQuery.data?.feed || []
  const activeSessions = activeQuery.data?.active_sessions || []
  const liveAthletes = new Set(activeSessions.map((s) => s.athlete_id || s.id))
  const displayName = String(user?.userId || user?.email || 'Athlete')

  // Demo seed feed when backend is empty
  const fallback = [
    {
      id: 'demo-1', athlete_id: 'demo-aryan', athlete_name: 'Aryan Kapoor', sport: 'Sprint',
      session_id: 'demo-s1', form_score: 89, delta: 8, started_at: new Date(Date.now() - 30*60*1000).toISOString(),
      pb: true, kudos_count: 12, comment_count: 2,
    },
    {
      id: 'demo-2', athlete_id: 'demo-priya', athlete_name: 'Priya Singh', sport: 'Jump',
      session_id: 'demo-s2', form_score: 84, delta: 3, started_at: new Date(Date.now() - 2*60*60*1000).toISOString(),
      kudos_count: 8, comment_count: 1,
    },
    {
      id: 'demo-3', athlete_id: 'demo-vikram', athlete_name: 'Vikram T.', sport: 'Strength',
      session_id: 'demo-s3', form_score: 81, delta: 0, started_at: new Date(Date.now() - 5*60*60*1000).toISOString(),
      kudos_count: 5, comment_count: 0,
    },
  ]
  const list = items.length > 0 ? items : fallback

  return (
    <StravaLayout displayName={displayName} role={isCoach ? 'coach' : 'athlete'}>
      <PageHeader
        eyebrow="Community"
        title="Activity Feed"
        description="Form scores from athletes you follow. Tap a session to view, drop a kudos to keep the streak alive."
      />

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '24px 20px 100px' }}>
        {/* Tab pills */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {[
            { id: 'for_you',   label: 'For You' },
            { id: 'following', label: 'Following' },
            { id: 'team',      label: 'My Team' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: '8px 16px',
                background: tab === t.id ? DARK : '#fff',
                color: tab === t.id ? '#fff' : DARK,
                border: `1px solid ${tab === t.id ? DARK : BORDER}`,
                borderRadius: '50px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '0.3px',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Live training banner */}
        {activeSessions.length > 0 && (
          <LiveBanner athletes={activeSessions.slice(0, 5)} />
        )}

        {/* Feed cards */}
        {list.map((item) => (
          <FeedCard
            key={item.id || item.session_id}
            item={item}
            currentUserId={user.userId}
            isLive={liveAthletes.has(item.athlete_id)}
          />
        ))}

        {list.length === 0 && (
          <div style={{
            padding: '48px 24px',
            textAlign: 'center',
            background: '#fff',
            border: `1px dashed ${BORDER}`,
            borderRadius: '8px',
            color: GRAY,
            fontSize: '13px',
          }}>
            No activity yet — follow some athletes to see their sessions here.
          </div>
        )}
      </div>
    </StravaLayout>
  )
}

// ─── LIVE BANNER ───────────────────────────────
function LiveBanner({ athletes }) {
  return (
    <div style={{
      background: DARK,
      color: '#fff',
      borderRadius: '8px',
      padding: '14px 18px',
      marginBottom: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    }}>
      <span style={{
        width: '10px', height: '10px', borderRadius: '50%',
        background: '#22c55e',
        boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.7)',
        animation: 'ph-pulse 1.5s infinite',
      }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#22c55e', letterSpacing: '0.5px' }}>
          ● TRAINING NOW
        </div>
        <div style={{ fontSize: '13px', fontWeight: 600, marginTop: '2px' }}>
          {athletes.map((a) => a.athlete_name || a.athlete_id || 'Athlete').slice(0, 3).join(', ')}
          {athletes.length > 3 && ` +${athletes.length - 3} more`}
        </div>
      </div>
      <Link to="/dashboard" style={{
        padding: '6px 12px',
        background: ORANGE,
        color: '#fff',
        borderRadius: '4px',
        fontSize: '10px',
        fontWeight: 800,
        textDecoration: 'none',
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
      }}>
        View →
      </Link>
    </div>
  )
}

// ─── FEED CARD ─────────────────────────────────
function FeedCard({ item, currentUserId, isLive }) {
  const queryClient = useQueryClient()
  const [kudosed, setKudosed] = useState(item.kudosed_by_me || false)
  const [count, setCount] = useState(item.kudos_count || 0)

  const name = item.athlete_name || item.athlete_id || 'Athlete'
  const sport = String(item.sport || 'Training').replace(/_/g, ' ')
  const score = item.form_score || item.summary?.avg_form_score || item.score || 0
  const delta = item.delta || item.improvement || 0
  const isPB = item.pb || item.is_personal_best
  const date = item.started_at || item.created_at
  const timeAgo = date ? humanTime(new Date(date)) : 'recently'
  const sessionId = item.session_id || item.id

  const sendKudos = useMutation({
    mutationFn: () => api.post(`/athlete/${item.athlete_id}/claps`, {
      from_athlete_id: currentUserId,
      session_id: sessionId,
    }).catch(() => null),
  })

  const toggleKudos = () => {
    if (kudosed) return  // claps are one-way
    setKudosed(true)
    setCount(count + 1)
    sendKudos.mutate()
  }

  return (
    <div style={{
      background: '#fff',
      border: `1px solid ${BORDER}`,
      borderRadius: '8px',
      marginBottom: '12px',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Link
          to="/athlete/$athleteId"
          params={{ athleteId: item.athlete_id }}
          style={{ position: 'relative', textDecoration: 'none' }}
        >
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: ORANGE, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', fontWeight: 700,
          }}>
            {String(name).charAt(0).toUpperCase()}
          </div>
          {isLive && (
            <span style={{
              position: 'absolute', bottom: '-2px', right: '-2px',
              width: '12px', height: '12px', borderRadius: '50%',
              background: '#22c55e', border: '2px solid #fff',
            }} />
          )}
        </Link>
        <div style={{ flex: 1 }}>
          <Link to="/athlete/$athleteId" params={{ athleteId: item.athlete_id }} style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: DARK }}>{name}</div>
          </Link>
          <div style={{ fontSize: '11px', color: GRAY }}>
            {timeAgo} · {sport}
          </div>
        </div>
        {isPB && (
          <span style={{
            background: ORANGE, color: '#fff',
            padding: '4px 10px', borderRadius: '50px',
            fontSize: '9px', fontWeight: 800, letterSpacing: '0.5px',
            boxShadow: '0 2px 6px rgba(252,76,2,0.3)',
          }}>
            🏆 PERSONAL BEST
          </span>
        )}
      </div>

      {/* Score body */}
      <Link
        to="/session/$sessionId"
        params={{ sessionId }}
        style={{ textDecoration: 'none', color: DARK, display: 'block' }}
      >
        <div style={{
          padding: '20px 18px',
          background: 'linear-gradient(135deg, rgba(252,76,2,0.04), transparent)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: '11px', color: GRAY, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Form Score
            </div>
            <div style={{ fontSize: '52px', fontWeight: 800, color: ORANGE, lineHeight: 1, marginTop: '2px' }}>
              {Math.round(score)}
            </div>
            {delta !== 0 && (
              <div style={{ fontSize: '12px', color: delta > 0 ? '#22c55e' : '#ef4444', marginTop: '4px', fontWeight: 700 }}>
                {delta > 0 ? '↑' : '↓'} {Math.abs(delta)} from last session
              </div>
            )}
          </div>
          <div style={{ fontSize: '32px' }}>
            {sport.toLowerCase().includes('cricket') ? '🏏'
              : sport.toLowerCase().includes('sprint') ? '🏃'
              : sport.toLowerCase().includes('jump') ? '⬆️'
              : sport.toLowerCase().includes('strength') ? '🏋️'
              : sport.toLowerCase().includes('basketball') ? '🏀'
              : sport.toLowerCase().includes('football') ? '⚽'
              : '💪'}
          </div>
        </div>
      </Link>

      {/* Engagement bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        padding: '10px 18px',
        borderTop: `1px solid ${LIGHT}`,
      }}>
        <button
          onClick={toggleKudos}
          disabled={kudosed}
          style={{
            background: 'none', border: 'none', cursor: kudosed ? 'default' : 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '12px', fontWeight: 700,
            color: kudosed ? ORANGE : GRAY,
            padding: 0,
          }}
        >
          <span style={{ fontSize: '16px', transform: kudosed ? 'scale(1.15)' : 'scale(1)', transition: 'transform 0.2s' }}>
            {kudosed ? '🔥' : '👏'}
          </span>
          <span>{count > 0 ? count : 'Kudos'}</span>
        </button>
        <button style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '6px',
          fontSize: '12px', fontWeight: 700, color: GRAY, padding: 0,
        }}>
          💬 {item.comment_count || 0}
        </button>
        <button style={{
          marginLeft: 'auto',
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: '12px', fontWeight: 700, color: GRAY,
        }}>
          📤 Share
        </button>
      </div>
    </div>
  )
}

function humanTime(d) {
  const sec = Math.floor((Date.now() - d.getTime()) / 1000)
  if (sec < 60) return 'just now'
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`
  if (sec < 604800) return `${Math.floor(sec / 86400)}d ago`
  return d.toLocaleDateString()
}
