import React, { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useUser } from '../../context/UserContext'
import { useQuery } from '@tanstack/react-query'
import { api, safeQuery } from '../../lib/api'
import { StravaLayout, PageHeader, StravaCard, ORANGE, DARK, GRAY, LIGHT, BORDER } from '../../components/StravaLayout'

export function LeaderboardPage() {
  const { user } = useUser()
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')

  if (!user) {
    navigate({ to: '/login' })
    return null
  }

  const lbQuery = useQuery({
    queryKey: ['leaderboard-full'],
    queryFn: () => safeQuery(() => api.get('/leaderboard'), { leaderboard: [] }),
  })

  const apiLeaderboard = lbQuery.data?.leaderboard || []
  const fallback = [
    { athlete_id: 'demo-1', athlete_name: 'Aryan Kapoor', sport: 'sprint', avg_form_score: 89, session_count: 28 },
    { athlete_id: 'demo-2', athlete_name: 'Priya Singh', sport: 'jump', avg_form_score: 86, session_count: 24 },
    { athlete_id: 'demo-3', athlete_name: 'Vikram Tiwari', sport: 'strength', avg_form_score: 84, session_count: 22 },
    { athlete_id: 'demo-4', athlete_name: 'Zara Khan', sport: 'football', avg_form_score: 82, session_count: 18 },
    { athlete_id: user.userId, athlete_name: 'You', sport: 'cricket', avg_form_score: 80, session_count: 15 },
    { athlete_id: 'demo-6', athlete_name: 'Karan Sharma', sport: 'badminton', avg_form_score: 78, session_count: 12 },
    { athlete_id: 'demo-7', athlete_name: 'Maya Reddy', sport: 'sprint', avg_form_score: 75, session_count: 10 },
    { athlete_id: 'demo-8', athlete_name: 'Rohan Patel', sport: 'cricket', avg_form_score: 72, session_count: 8 },
  ]
  const leaderboard = apiLeaderboard.length > 0 ? apiLeaderboard : fallback
  const myRank = leaderboard.findIndex((a) => a.athlete_id === user.userId) + 1
  const myEntry = myRank > 0 ? leaderboard[myRank - 1] : null
  const displayName = String(user?.userId || user?.email || 'Athlete')

  const filtered = filter === 'all'
    ? leaderboard
    : leaderboard.filter((a) => (a.sport || '').toLowerCase().includes(filter.toLowerCase()))

  return (
    <StravaLayout displayName={displayName}>
      <PageHeader
        eyebrow="Community · Leaderboard"
        title="Where you stand."
        description="Top athletes by form score across all sports. Compare with peers and chase the leaders."
      />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px' }}>
        {/* Your position card */}
        {myEntry && (
          <div style={{
            background: DARK,
            color: '#fff',
            borderRadius: '4px',
            padding: '24px',
            marginBottom: '20px',
            display: 'grid',
            gridTemplateColumns: 'auto 1fr auto auto',
            gap: '24px',
            alignItems: 'center',
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: ORANGE,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: 800,
            }}>
              {String(myEntry.athlete_name || myEntry.athlete_id || 'A').charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
                Your Position
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>
                {myEntry.athlete_name || myEntry.athlete_id}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
                {myEntry.sport || 'Athlete'} · You
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
                Rank
              </div>
              <div style={{ fontSize: '40px', fontWeight: 800, color: ORANGE, lineHeight: 1, marginTop: '4px' }}>
                #{myRank}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
                Form Score
              </div>
              <div style={{ fontSize: '40px', fontWeight: 800, lineHeight: 1, marginTop: '4px' }}>
                {(myEntry.avg_form_score || 0).toFixed(0)}
              </div>
            </div>
          </div>
        )}

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {['all', 'sprint', 'strength', 'cricket', 'basketball'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 16px',
                background: filter === f ? DARK : '#fff',
                color: filter === f ? '#fff' : DARK,
                border: `1px solid ${filter === f ? DARK : BORDER}`,
                borderRadius: '50px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Leaderboard table */}
        <StravaCard title={`Top Athletes · ${filtered.length}`} padding="0">
          {/* Table header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '60px 48px 2fr 1fr 1fr 100px',
            padding: '14px 20px',
            background: LIGHT,
            fontSize: '10px',
            fontWeight: 700,
            color: GRAY,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            gap: '12px',
          }}>
            <span>Rank</span>
            <span>&nbsp;</span>
            <span>Athlete</span>
            <span>Sport</span>
            <span>Sessions</span>
            <span style={{ textAlign: 'right' }}>Form Score</span>
          </div>

          {filtered.map((a, i) => {
            const isYou = a.athlete_id === user.userId
            const rankColor = i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : null
            return (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '60px 48px 2fr 1fr 1fr 100px',
                  padding: '14px 20px',
                  borderBottom: i < filtered.length - 1 ? `1px solid ${LIGHT}` : 'none',
                  background: isYou ? 'rgba(252, 76, 2, 0.05)' : '#fff',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div style={{
                  fontSize: '16px',
                  fontWeight: 800,
                  color: rankColor || (i < 10 ? DARK : GRAY),
                }}>
                  {rankColor && '🏆 '}#{i + 1}
                </div>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: isYou ? ORANGE : DARK,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 700,
                }}>
                  {String(a.athlete_name || a.athlete_id || 'A').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>
                    {a.athlete_name || a.athlete_id}
                    {isYou && <span style={{ marginLeft: '8px', color: ORANGE, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>(You)</span>}
                  </div>
                  <div style={{ fontSize: '10px', color: GRAY, marginTop: '2px' }}>
                    Tier {(i % 3) + 1}
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: GRAY, textTransform: 'capitalize' }}>
                  {String(a.sport || 'Athlete').replace(/_/g, ' ')}
                </div>
                <div style={{ fontSize: '12px', color: GRAY }}>
                  {a.session_count || a.sessions || '—'}
                </div>
                <div style={{
                  textAlign: 'right',
                  fontSize: '20px',
                  fontWeight: 800,
                  color: ORANGE,
                }}>
                  {(a.avg_form_score || 0).toFixed(0)}
                </div>
              </div>
            )
          })}

          {filtered.length === 0 && (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: GRAY, fontSize: '13px' }}>
              No athletes match this filter.
            </div>
          )}
        </StravaCard>
      </div>
    </StravaLayout>
  )
}
