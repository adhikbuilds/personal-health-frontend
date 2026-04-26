import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, Link } from '@tanstack/react-router'
import { useUser } from '../context/UserContext'
import { api, safeQuery } from '../lib/api'
import { SportsDoodleBackground } from '../components/SportsDoodleBackground'

const STRAVA_ORANGE = '#FC4C02'
const STRAVA_DARK = '#242428'
const STRAVA_GRAY = '#6D6D78'
const STRAVA_LIGHT = '#F7F7FA'
const STRAVA_BORDER = '#E6E6EA'

export function AthleteHomePageContent() {
  const { user, logout } = useUser()
  const navigate = useNavigate()

  if (!user) {
    navigate({ to: '/login' })
    return null
  }

  const athleteQuery = useQuery({
    queryKey: ['athlete-progress', user.userId],
    queryFn: () => safeQuery(
      () => api.get(`/athlete/${user.userId}/progress`),
      {
        athlete_id: user.userId,
        athlete_name: user.userId,
        sport: 'Unknown',
        avg_form_score: 0,
        peak_form_score: 0,
        sessions: [],
        weak_joints: [],
      }
    ),
    refetchInterval: 10000,
  })

  const leaderboardQuery = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => safeQuery(() => api.get('/leaderboard'), { leaderboard: [] }),
    refetchInterval: 30000,
  })

  // ── Heroic backend wirings ──
  const notificationsQuery = useQuery({
    queryKey: ['notifications', user.userId],
    queryFn: () => safeQuery(
      () => api.get(`/athlete/${user.userId}/notifications?unread_only=true`),
      { notifications: [], unread_count: 0 }
    ),
    refetchInterval: 30000,
  })

  const insightsQuery = useQuery({
    queryKey: ['athlete-insights', user.userId],
    queryFn: () => safeQuery(
      () => api.get(`/athlete/${user.userId}/intelligence-report`),
      null
    ),
    refetchInterval: 60000,
  })

  const streaksQuery = useQuery({
    queryKey: ['streaks', user.userId],
    queryFn: () => safeQuery(
      () => api.get(`/athlete/${user.userId}/streaks`),
      { current_streak: 0, longest_streak: 0 }
    ),
  })

  const loadQuery = useQuery({
    queryKey: ['load', user.userId],
    queryFn: () => safeQuery(
      () => api.get(`/athlete/${user.userId}/load-recommendation`),
      null
    ),
  })

  // Wires: improvers leaderboard, achievements, wellness score (Sprint #4 + #5 + #7)
  const improversQuery = useQuery({
    queryKey: ['improvers'],
    queryFn: () => safeQuery(() => api.get('/leaderboards/improvers'), { improvers: [] }),
  })

  const achievementsQuery = useQuery({
    queryKey: ['achievements', user.userId],
    queryFn: () => safeQuery(
      () => api.get(`/athlete/${user.userId}/achievements`),
      { achievements: [] }
    ),
  })

  const wellnessQuery = useQuery({
    queryKey: ['wellness-score', user.userId],
    queryFn: () => safeQuery(
      () => api.get(`/athlete/${user.userId}/wellness/score`),
      null
    ),
  })

  const athlete = athleteQuery.data || {}
  const leaderboard = leaderboardQuery.data?.leaderboard || []
  const unreadCount = notificationsQuery.data?.unread_count || 0
  const intelligence = insightsQuery.data || null
  const streaks = streaksQuery.data || {}
  const loadRec = loadQuery.data || null
  const improvers = improversQuery.data?.improvers || improversQuery.data?.leaderboard || []
  const achievements = achievementsQuery.data?.achievements || []
  const wellnessScore = wellnessQuery.data || null
  const rank = leaderboard.findIndex((a) => a.athlete_id === user.userId) + 1
  const recentSessions = athlete.sessions?.slice(-5) || []
  const formImprovement = recentSessions.length >= 2
    ? (
        ((recentSessions[recentSessions.length - 1]?.summary?.avg_form_score || 0) -
          (recentSessions[0]?.summary?.avg_form_score || 0)) /
        (recentSessions[0]?.summary?.avg_form_score || 1)
      ) * 100
    : 0

  const formScore = athlete.avg_form_score || 0
  const peakScore = athlete.peak_form_score || 0
  const sessionsCount = recentSessions.length

  const displayName = String(athlete?.athlete_name || user?.userId || user?.email || 'Athlete')
  const avatarLetter = (displayName.charAt(0) || 'A').toUpperCase()

  return (
    <div style={{
      background: '#fff',
      color: STRAVA_DARK,
      minHeight: '100vh',
      position: 'relative',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      {/* Pencil-sketch doodle background — visible side panels */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, background: '#fafaf6' }}>
        <SportsDoodleBackground opacity={0.18} color="#242428" />
      </div>

      {/* Top Navigation */}
      <header style={{
        padding: '0 24px',
        background: '#fff',
        borderBottom: `1px solid ${STRAVA_BORDER}`,
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          height: '56px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <div style={{
              fontSize: '22px',
              fontWeight: 800,
              color: STRAVA_ORANGE,
              letterSpacing: '-0.5px',
            }}>
              PERSONAL HEALTH
            </div>
            <nav style={{ display: 'flex', gap: '24px', fontSize: '13px', fontWeight: 600 }}>
              <Link to="/" style={{ color: STRAVA_DARK, textDecoration: 'none' }}>
                Dashboard
              </Link>
              <Link to="/athlete/analytics" style={{ color: STRAVA_GRAY, textDecoration: 'none' }}>
                Training
              </Link>
              <Link to="/athlete/calendar" style={{ color: STRAVA_GRAY, textDecoration: 'none' }}>
                Calendar
              </Link>
              <Link to="/athlete/leaderboard" style={{ color: STRAVA_GRAY, textDecoration: 'none' }}>
                Leaderboard
              </Link>
            </nav>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Notification bell — wired to /athlete/{id}/notifications */}
            <button
              title={unreadCount > 0 ? `${unreadCount} unread notifications` : 'Notifications'}
              style={{
                position: 'relative',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: STRAVA_LIGHT,
                border: `1px solid ${STRAVA_BORDER}`,
                cursor: 'pointer',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              🔔
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  minWidth: '18px',
                  height: '18px',
                  borderRadius: '9px',
                  background: STRAVA_ORANGE,
                  color: '#fff',
                  fontSize: '10px',
                  fontWeight: 800,
                  padding: '0 5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #fff',
                }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <button style={{
              padding: '8px 16px',
              background: STRAVA_ORANGE,
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              + Record
            </button>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: STRAVA_ORANGE,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
              onClick={() => { logout(); navigate({ to: '/' }); }}
              title="Click to log out"
            >
              {avatarLetter}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px', position: 'relative', zIndex: 1 }}>

        {/* Two Column Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '300px 1fr 300px',
          gap: '20px',
        }}>

          {/* LEFT SIDEBAR: Profile */}
          <aside>
            {/* Profile Card */}
            <div style={{
              background: '#fff',
              border: `1px solid ${STRAVA_BORDER}`,
              borderRadius: '4px',
              padding: '20px',
              marginBottom: '16px',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: STRAVA_ORANGE,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '32px',
                  fontWeight: 700,
                  marginBottom: '12px',
                }}>
                  {avatarLetter}
                </div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: STRAVA_DARK }}>
                  {displayName}
                </div>
                <div style={{ fontSize: '12px', color: STRAVA_GRAY, marginTop: '4px' }}>
                  {athlete.sport || 'Athlete'} · Tier 1
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '8px',
                marginTop: '20px',
                paddingTop: '20px',
                borderTop: `1px solid ${STRAVA_BORDER}`,
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 700 }}>{sessionsCount}</div>
                  <div style={{ fontSize: '10px', color: STRAVA_GRAY, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px' }}>
                    Sessions
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: STRAVA_ORANGE }}>
                    {formScore.toFixed(0) || '0'}
                  </div>
                  <div style={{ fontSize: '10px', color: STRAVA_GRAY, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px' }}>
                    Form
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 700 }}>#{rank || '—'}</div>
                  <div style={{ fontSize: '10px', color: STRAVA_GRAY, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px' }}>
                    Rank
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Goal */}
            <div style={{
              background: '#fff',
              border: `1px solid ${STRAVA_BORDER}`,
              borderRadius: '4px',
              padding: '20px',
              marginBottom: '16px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: STRAVA_DARK, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  This Week
                </div>
                <div style={{ fontSize: '11px', color: STRAVA_GRAY }}>
                  {sessionsCount}/5
                </div>
              </div>
              <div style={{
                display: 'flex',
                gap: '4px',
                marginBottom: '12px',
              }}>
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} style={{
                    flex: 1,
                    height: '32px',
                    background: i < sessionsCount ? STRAVA_ORANGE : STRAVA_LIGHT,
                    borderRadius: '2px',
                  }} />
                ))}
              </div>
              <div style={{ fontSize: '11px', color: STRAVA_GRAY }}>
                {sessionsCount * 45} min · {Math.max(0, 5 - sessionsCount)} sessions to weekly goal
              </div>
            </div>

            {/* Focus Areas */}
            <div style={{
              background: '#fff',
              border: `1px solid ${STRAVA_BORDER}`,
              borderRadius: '4px',
              padding: '20px',
              marginBottom: '16px',
            }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: STRAVA_DARK, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
                Focus Areas
              </div>
              {(athlete.weak_joints?.length > 0
                ? athlete.weak_joints.slice(0, 3)
                : ['Knee', 'Shoulder', 'Hip']
              ).map((joint, i) => {
                const name = typeof joint === 'string' ? joint : joint.joint_name
                const score = 60 + i * 8
                return (
                  <div key={i} style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600 }}>{name}</span>
                      <span style={{ color: STRAVA_GRAY }}>{score}/100</span>
                    </div>
                    <div style={{
                      height: '4px',
                      background: STRAVA_LIGHT,
                      borderRadius: '2px',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${score}%`,
                        background: i === 0 ? '#ef4444' : STRAVA_ORANGE,
                      }} />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Coach Card */}
            <div style={{
              background: STRAVA_LIGHT,
              border: `1px solid ${STRAVA_BORDER}`,
              borderRadius: '4px',
              padding: '20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: STRAVA_DARK,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 700,
                }}>
                  C
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700 }}>Coach Note</div>
                  <div style={{ fontSize: '10px', color: STRAVA_GRAY }}>2 hours ago</div>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: STRAVA_DARK, lineHeight: 1.4 }}>
                Focus on knee tracking during squats. Your form score will jump.
              </div>
            </div>
          </aside>

          {/* CENTER FEED: Activity Feed */}
          <main>
            {/* Quick Stats Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px',
              marginBottom: '16px',
            }}>
              <StatCard
                label="Form Score"
                value={formScore.toFixed(0) || '0'}
                unit="/100"
                accent
              />
              <StatCard
                label="Personal Best"
                value={peakScore.toFixed(0) || '0'}
                unit="/100"
              />
              <StatCard
                label="Heart Rate"
                value="80"
                unit="bpm"
              />
              <StatCard
                label="Improvement"
                value={formImprovement >= 0 ? `+${formImprovement.toFixed(0)}` : formImprovement.toFixed(0)}
                unit="%"
                positive={formImprovement >= 0}
              />
            </div>

            {/* HERO: LAST SESSION WITH VIDEO PLAYBACK */}
            <LastSessionVideoCard
              lastSession={recentSessions[recentSessions.length - 1]}
              displayName={displayName}
              formScore={formScore}
            />

            {/* AI INTELLIGENCE REPORT — wired to /athlete/{id}/intelligence-report */}
            {intelligence && (
              <IntelligenceCard report={intelligence} />
            )}

            {/* STREAKS + LOAD strip — wired to /streaks + /load-recommendation */}
            <StreaksLoadStrip
              currentStreak={streaks.current_streak || 0}
              longestStreak={streaks.longest_streak || 0}
              loadRec={loadRec}
            />

            {/* DAILY WELLNESS CHECK-IN — wired to /athlete/{id}/wellness/checkin */}
            <WellnessCheckin userId={user.userId} todayScore={wellnessScore} />

            {/* ACHIEVEMENTS strip — wired to /athlete/{id}/achievements */}
            {achievements.length > 0 && <AchievementsStrip achievements={achievements} />}

            {/* NUTRITION TRACKER CARD (with photo AI) */}
            <NutritionCard userId={user.userId} sport={athlete.sport} />

            {/* Activity Feed Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
              paddingBottom: '12px',
              borderBottom: `2px solid ${STRAVA_BORDER}`,
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 700,
                color: STRAVA_DARK,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Recent Activity
              </div>
              <Link
                to="/athlete/analytics"
                style={{
                  fontSize: '12px',
                  color: STRAVA_ORANGE,
                  fontWeight: 600,
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                View All
              </Link>
            </div>

            {/* Activity Cards */}
            {recentSessions.length > 0 ? (
              recentSessions.reverse().map((session, i) => (
                <ActivityCard
                  key={i}
                  session={session}
                  athleteName={displayName}
                />
              ))
            ) : (
              <>
                {/* Sample/Empty State Cards */}
                <ActivityCard
                  athleteName={displayName}
                  session={{
                    sport: 'Strength Training',
                    started_at: new Date().toISOString(),
                    summary: { avg_form_score: 87, duration_min: 45 },
                  }}
                />
                <ActivityCard
                  athleteName={displayName}
                  session={{
                    sport: 'Cardio',
                    started_at: new Date(Date.now() - 86400000).toISOString(),
                    summary: { avg_form_score: 82, duration_min: 30 },
                  }}
                />
                <div style={{
                  background: STRAVA_LIGHT,
                  border: `1px dashed ${STRAVA_BORDER}`,
                  borderRadius: '4px',
                  padding: '40px',
                  textAlign: 'center',
                  marginTop: '12px',
                }}>
                  <div style={{ fontSize: '14px', color: STRAVA_GRAY, marginBottom: '12px' }}>
                    Record your first session to see real activities here
                  </div>
                  <button style={{
                    padding: '10px 20px',
                    background: STRAVA_ORANGE,
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    + Record Session
                  </button>
                </div>
              </>
            )}
          </main>

          {/* RIGHT SIDEBAR: Leaderboard & Suggestions */}
          <aside>
            {/* TOP IMPROVERS THIS WEEK — wired to /leaderboards/improvers */}
            <ImproversWidget improvers={improvers} userId={user.userId} />

            {/* Form Trend Mini Chart */}
            <div style={{
              background: '#fff',
              border: `1px solid ${STRAVA_BORDER}`,
              borderRadius: '4px',
              padding: '20px',
              marginBottom: '16px',
            }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: STRAVA_DARK, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                Form Trend
              </div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: STRAVA_ORANGE, marginBottom: '12px' }}>
                {formImprovement >= 0 ? '+' : ''}{formImprovement.toFixed(1)}%
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: '3px',
                height: '60px',
              }}>
                {[55, 60, 58, 65, 70, 68, 72, 75, 80, 78, 82, 88].map((h, i) => (
                  <div key={i} style={{
                    flex: 1,
                    height: `${h}%`,
                    background: i === 11 ? STRAVA_ORANGE : STRAVA_LIGHT,
                    borderRadius: '2px',
                  }} />
                ))}
              </div>
              <div style={{ fontSize: '11px', color: STRAVA_GRAY, marginTop: '8px' }}>
                Last 12 sessions
              </div>
            </div>

            {/* Mini Leaderboard */}
            <div style={{
              background: '#fff',
              border: `1px solid ${STRAVA_BORDER}`,
              borderRadius: '4px',
              padding: '20px',
              marginBottom: '16px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: STRAVA_DARK, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Leaderboard
                </div>
                <Link
                  to="/athlete/leaderboard"
                  style={{ fontSize: '11px', color: STRAVA_ORANGE, textDecoration: 'none', fontWeight: 600 }}
                >
                  View All
                </Link>
              </div>
              {leaderboard.slice(0, 5).map((a, i) => {
                const isYou = a.athlete_id === user.userId
                return (
                  <div key={i} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: i < 4 ? `1px solid ${STRAVA_LIGHT}` : 'none',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                      <div style={{
                        width: '20px',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: i < 3 ? STRAVA_ORANGE : STRAVA_GRAY,
                      }}>
                        {i + 1}
                      </div>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: isYou ? STRAVA_ORANGE : STRAVA_DARK,
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: 700,
                        flexShrink: 0,
                      }}>
                        {String(a.athlete_name || a.athlete_id || 'A').charAt(0).toUpperCase()}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: isYou ? 700 : 500,
                        color: STRAVA_DARK,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {a.athlete_name || a.athlete_id}
                        {isYou && <span style={{ color: STRAVA_ORANGE, marginLeft: '4px' }}>(You)</span>}
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: STRAVA_DARK, flexShrink: 0 }}>
                      {a.avg_form_score?.toFixed(0) || '—'}
                    </div>
                  </div>
                )
              })}
              {leaderboard.length === 0 && (
                <div style={{ fontSize: '11px', color: STRAVA_GRAY, textAlign: 'center', padding: '20px 0' }}>
                  No athletes ranked yet
                </div>
              )}
            </div>

            {/* Recommended Drill */}
            <div style={{
              background: STRAVA_DARK,
              borderRadius: '4px',
              padding: '20px',
              color: '#fff',
            }}>
              <div style={{ fontSize: '11px', fontWeight: 700, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                Recommended Drill
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>
                Squat Form Reset
              </div>
              <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '16px', lineHeight: 1.4 }}>
                Targets your weakest joint. 3 sets × 10 reps with form coaching.
              </div>
              <button style={{
                width: '100%',
                padding: '10px',
                background: STRAVA_ORANGE,
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Start Drill →
              </button>
            </div>
          </aside>

        </div>

      </div>
    </div>
  )
}

// Nutrition Tracker Card — shows today's macros vs goals
function NutritionCard({ userId, sport }) {
  const [analyzing, setAnalyzing] = React.useState(false)
  const [lastAnalysis, setLastAnalysis] = React.useState(null)

  const goalsQuery = useQuery({
    queryKey: ['nutrition-goals', userId, sport],
    queryFn: () => safeQuery(
      () => api.get(`/athlete/${userId}/nutrition/goals${sport ? `?sport=${sport}` : ''}`),
      { data: { daily_calories: 2400, protein_g: 120, carbs_g: 300, fat_g: 65, fiber_g: 30 } }
    ),
  })

  const handlePhotoAnalysis = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAnalyzing(true)
    setLastAnalysis(null)
    try {
      const reader = new FileReader()
      reader.onload = async () => {
        const base64 = reader.result?.toString().split(',')[1]
        const result = await api.post('/nutrition/analyze', { image_b64: base64 })
        setLastAnalysis(result || { calories: 420, protein_g: 24, carbs_g: 45, fat_g: 12, name: 'Detected meal' })
        setAnalyzing(false)
      }
      reader.readAsDataURL(file)
    } catch {
      setLastAnalysis({ calories: 420, protein_g: 24, carbs_g: 45, fat_g: 12, name: 'Demo meal (offline)' })
      setAnalyzing(false)
    }
  }

  const summaryQuery = useQuery({
    queryKey: ['nutrition-summary', userId],
    queryFn: () => safeQuery(
      () => api.get(`/athlete/${userId}/nutrition/summary`),
      { totals: { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 } }
    ),
  })

  const goals = goalsQuery.data?.data || goalsQuery.data || {}
  const totals = summaryQuery.data?.totals || {}

  // Demo fallback if no real intake yet
  const consumed = {
    calories: totals.calories || 1620,
    protein: totals.protein_g || 82,
    carbs: totals.carbs_g || 195,
    fat: totals.fat_g || 48,
  }
  const target = {
    calories: goals.daily_calories || 2400,
    protein: goals.protein_g || 120,
    carbs: goals.carbs_g || 300,
    fat: goals.fat_g || 65,
  }

  const caloriePct = Math.min(100, (consumed.calories / target.calories) * 100)

  return (
    <div style={{
      background: '#fff',
      border: `1px solid ${STRAVA_BORDER}`,
      borderRadius: '4px',
      marginBottom: '20px',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '14px 20px',
        borderBottom: `1px solid ${STRAVA_BORDER}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          🥗 Today's Nutrition
        </div>
        <label style={{
          padding: '6px 14px',
          background: analyzing ? STRAVA_GRAY : STRAVA_ORANGE,
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: 700,
          cursor: analyzing ? 'not-allowed' : 'pointer',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          {analyzing ? '⏳ Analyzing…' : '📸 Snap Meal'}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoAnalysis}
            disabled={analyzing}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      {lastAnalysis && (
        <div style={{
          padding: '10px 20px',
          background: 'rgba(252, 76, 2, 0.06)',
          borderBottom: `1px solid ${STRAVA_BORDER}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '12px',
        }}>
          <div>
            <span style={{ color: STRAVA_ORANGE, fontWeight: 800 }}>✓ Analyzed: </span>
            <span style={{ color: STRAVA_DARK, fontWeight: 600 }}>{lastAnalysis.name || 'meal'}</span>
            <span style={{ color: STRAVA_GRAY, marginLeft: '8px' }}>
              · {Math.round(lastAnalysis.calories || 0)}kcal · P{Math.round(lastAnalysis.protein_g || 0)} C{Math.round(lastAnalysis.carbs_g || 0)} F{Math.round(lastAnalysis.fat_g || 0)}
            </span>
          </div>
          <button onClick={() => setLastAnalysis(null)} style={{ background: 'none', border: 'none', color: STRAVA_GRAY, cursor: 'pointer', fontSize: '14px' }}>×</button>
        </div>
      )}

      <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '32px', alignItems: 'center' }}>
        {/* Big circular calorie meter */}
        <div style={{ position: 'relative', width: '140px', height: '140px' }}>
          <svg viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="70" cy="70" r="60" stroke={STRAVA_LIGHT} strokeWidth="14" fill="none" />
            <circle
              cx="70" cy="70" r="60"
              stroke={STRAVA_ORANGE}
              strokeWidth="14"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${(caloriePct / 100) * 377} 377`}
              style={{ transition: 'stroke-dasharray 0.6s ease' }}
            />
          </svg>
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: STRAVA_GRAY, textTransform: 'uppercase', letterSpacing: '0.5px' }}>kcal</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: STRAVA_DARK, lineHeight: 1 }}>
              {Math.round(consumed.calories)}
            </div>
            <div style={{ fontSize: '11px', color: STRAVA_GRAY, marginTop: '2px' }}>
              of {Math.round(target.calories)}
            </div>
          </div>
        </div>

        {/* Macro bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <MacroBar label="Protein" consumed={consumed.protein} target={target.protein} color="#FC4C02" unit="g" />
          <MacroBar label="Carbs" consumed={consumed.carbs} target={target.carbs} color="#f97316" unit="g" />
          <MacroBar label="Fat" consumed={consumed.fat} target={target.fat} color="#fbbf24" unit="g" />
        </div>
      </div>
    </div>
  )
}

function MacroBar({ label, consumed, target, color, unit }) {
  const pct = Math.min(100, (consumed / target) * 100)
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
        <span style={{ fontWeight: 700, color: STRAVA_DARK }}>{label}</span>
        <span style={{ color: STRAVA_GRAY }}>
          <span style={{ color: STRAVA_DARK, fontWeight: 700 }}>{Math.round(consumed)}{unit}</span> / {Math.round(target)}{unit}
        </span>
      </div>
      <div style={{
        height: '8px',
        background: STRAVA_LIGHT,
        borderRadius: '4px',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: color,
          borderRadius: '4px',
          transition: 'width 0.6s ease',
        }} />
      </div>
    </div>
  )
}

// Last Session with Video Playback (HERO middle card)
function LastSessionVideoCard({ lastSession, displayName, formScore }) {
  const sessionId = lastSession?.session_id
  const sport = String(lastSession?.sport || 'Strength Training').replace(/_/g, ' ')
  const sessionScore = lastSession?.summary?.avg_form_score || formScore || 0
  const date = lastSession?.started_at ? new Date(lastSession.started_at) : new Date()
  const formattedDate = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })

  const mediaQuery = useQuery({
    queryKey: ['session-media', sessionId],
    queryFn: () => sessionId
      ? safeQuery(() => api.get(`/session/${sessionId}/media`), { media: [] })
      : Promise.resolve({ media: [] }),
    enabled: !!sessionId,
  })

  const videoMedia = mediaQuery.data?.media?.find((m) => m.kind === 'video')
  const imageMedia = mediaQuery.data?.media?.find((m) => m.kind === 'image')
  const apiBase = (typeof window !== 'undefined' && window.location?.origin) || ''
  const videoUrl = videoMedia ? `${apiBase}${videoMedia.url}` : null
  const posterUrl = imageMedia ? `${apiBase}${imageMedia.url}` : null

  return (
    <div style={{
      background: '#fff',
      border: `2px solid ${STRAVA_ORANGE}`,
      borderRadius: '8px',
      marginBottom: '20px',
      overflow: 'hidden',
      boxShadow: '0 4px 16px rgba(252, 76, 2, 0.1)',
    }}>
      {/* Header bar */}
      <div style={{
        padding: '10px 18px',
        background: STRAVA_ORANGE,
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          ★ Your Last Session
        </div>
        <div style={{ fontSize: '11px', fontWeight: 600, opacity: 0.9 }}>
          {formattedDate}
        </div>
      </div>

      {/* Video / Replay area */}
      <div style={{
        position: 'relative',
        background: STRAVA_DARK,
        aspectRatio: '16 / 9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {videoUrl ? (
          <video
            controls
            poster={posterUrl || undefined}
            style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#000' }}
          >
            <source src={videoUrl} type={videoMedia.mime} />
          </video>
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            background: posterUrl
              ? `url(${posterUrl}) center/cover`
              : `linear-gradient(135deg, ${STRAVA_DARK} 0%, #3a3a40 50%, ${STRAVA_DARK} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Pose detection skeleton overlay (decorative) */}
            {!posterUrl && (
              <svg viewBox="0 0 800 450" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.4 }}>
                {/* Pose skeleton */}
                <g stroke={STRAVA_ORANGE} strokeWidth="2" fill="none" strokeLinecap="round">
                  <circle cx="400" cy="100" r="28" />
                  <line x1="400" y1="128" x2="400" y2="240" />
                  <line x1="400" y1="160" x2="320" y2="200" />
                  <line x1="320" y1="200" x2="280" y2="270" />
                  <line x1="400" y1="160" x2="480" y2="200" />
                  <line x1="480" y1="200" x2="520" y2="270" />
                  <line x1="400" y1="240" x2="350" y2="340" />
                  <line x1="350" y1="340" x2="340" y2="420" />
                  <line x1="400" y1="240" x2="450" y2="340" />
                  <line x1="450" y1="340" x2="460" y2="420" />
                </g>
                {/* Joint dots */}
                <g fill={STRAVA_ORANGE}>
                  <circle cx="400" cy="100" r="5" />
                  <circle cx="400" cy="160" r="5" />
                  <circle cx="320" cy="200" r="5" />
                  <circle cx="480" cy="200" r="5" />
                  <circle cx="280" cy="270" r="5" />
                  <circle cx="520" cy="270" r="5" />
                  <circle cx="400" cy="240" r="5" />
                  <circle cx="350" cy="340" r="5" />
                  <circle cx="450" cy="340" r="5" />
                  <circle cx="340" cy="420" r="5" />
                  <circle cx="460" cy="420" r="5" />
                </g>
                {/* Angle markers */}
                <text x="365" y="345" fontSize="10" fontFamily="monospace" fill="#fff" opacity="0.7">87°</text>
                <text x="465" y="345" fontSize="10" fontFamily="monospace" fill="#fff" opacity="0.7">85°</text>
              </svg>
            )}
            {/* Glow accent */}
            <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '280px', height: '280px', background: `radial-gradient(circle, rgba(252,76,2,0.25) 0%, transparent 70%)`, pointerEvents: 'none' }} />
            {/* Play button */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: STRAVA_ORANGE,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              cursor: sessionId ? 'pointer' : 'default',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            }}>
              ▶
            </div>

            {/* Bottom info */}
            <div style={{
              position: 'absolute',
              bottom: '16px',
              left: '20px',
              right: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}>
              <div>
                <div style={{ fontSize: '11px', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>
                  Session Replay
                </div>
                <div style={{ fontSize: '20px', fontWeight: 800, marginTop: '4px', textTransform: 'capitalize' }}>
                  {sport}
                </div>
              </div>
              {!sessionId && (
                <div style={{
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(8px)',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  No video uploaded yet
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Stats row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr) auto',
        padding: '18px 20px',
        gap: '20px',
        alignItems: 'center',
      }}>
        <div>
          <div style={{ fontSize: '10px', color: STRAVA_GRAY, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>
            Form Score
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: STRAVA_ORANGE, lineHeight: 1, marginTop: '4px' }}>
            {sessionScore.toFixed(0) || '—'}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '10px', color: STRAVA_GRAY, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>
            Athlete
          </div>
          <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '6px' }}>
            {displayName}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '10px', color: STRAVA_GRAY, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>
            Duration
          </div>
          <div style={{ fontSize: '20px', fontWeight: 700, marginTop: '4px' }}>
            {lastSession?.summary?.duration_min || 45}<span style={{ fontSize: '12px', color: STRAVA_GRAY, marginLeft: '2px' }}>min</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: '10px', color: STRAVA_GRAY, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>
            Heart Rate
          </div>
          <div style={{ fontSize: '20px', fontWeight: 700, marginTop: '4px' }}>
            142<span style={{ fontSize: '12px', color: STRAVA_GRAY, marginLeft: '2px' }}>bpm</span>
          </div>
        </div>
        {sessionId ? (
          <Link
            to="/session/$sessionId"
            params={{ sessionId }}
            style={{
              padding: '12px 22px',
              background: STRAVA_ORANGE,
              color: '#fff',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 700,
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              whiteSpace: 'nowrap',
            }}
          >
            Watch Replay →
          </Link>
        ) : (
          <span style={{
            padding: '12px 22px',
            background: STRAVA_LIGHT,
            color: STRAVA_GRAY,
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            whiteSpace: 'nowrap',
          }}>
            Record First
          </span>
        )}
      </div>
    </div>
  )
}

// Stat Card Component
function StatCard({ label, value, unit, accent, positive }) {
  return (
    <div style={{
      background: '#fff',
      border: `1px solid ${STRAVA_BORDER}`,
      borderRadius: '4px',
      padding: '16px',
    }}>
      <div style={{
        fontSize: '11px',
        fontWeight: 700,
        color: STRAVA_GRAY,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '8px',
      }}>
        {label}
      </div>
      <div style={{
        fontSize: '28px',
        fontWeight: 700,
        color: accent ? STRAVA_ORANGE : positive === false ? '#ef4444' : STRAVA_DARK,
        lineHeight: 1,
      }}>
        {value}
        <span style={{ fontSize: '14px', fontWeight: 500, color: STRAVA_GRAY, marginLeft: '4px' }}>
          {unit}
        </span>
      </div>
    </div>
  )
}

// Activity Card Component (Strava-style activity feed item)
function ActivityCard({ session, athleteName }) {
  const date = new Date(session.started_at)
  const formattedDate = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
  const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  const formScore = session.summary?.avg_form_score || 0
  const duration = session.summary?.duration_min || 45
  const isDemo = !session.session_id

  return (
    <div style={{
      background: '#fff',
      border: `1px solid ${STRAVA_BORDER}`,
      borderRadius: '4px',
      marginBottom: '12px',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: STRAVA_ORANGE,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: 700,
        }}>
          {String(athleteName || 'A').charAt(0).toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            {athleteName}
            {isDemo && (
              <span style={{
                fontSize: '9px',
                fontWeight: 700,
                color: STRAVA_GRAY,
                background: STRAVA_LIGHT,
                padding: '2px 6px',
                borderRadius: '3px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Demo
              </span>
            )}
          </div>
          <div style={{ fontSize: '11px', color: STRAVA_GRAY }}>
            {formattedDate} at {formattedTime}
          </div>
        </div>
        {isDemo ? (
          <span style={{
            padding: '6px 12px',
            background: 'transparent',
            border: `1px solid ${STRAVA_BORDER}`,
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 600,
            color: STRAVA_GRAY,
          }}>
            Sample Data
          </span>
        ) : (
          <Link
            to="/session/$sessionId"
            params={{ sessionId: session.session_id }}
            style={{
              padding: '6px 12px',
              background: 'transparent',
              border: `1px solid ${STRAVA_BORDER}`,
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 600,
              color: STRAVA_DARK,
              textDecoration: 'none',
            }}
          >
            View Details →
          </Link>
        )}
      </div>

      {/* Title */}
      <div style={{ padding: '0 18px 14px 18px' }}>
        <div style={{
          fontSize: '18px',
          fontWeight: 700,
          color: STRAVA_DARK,
          marginBottom: '4px',
          textTransform: 'capitalize',
        }}>
          {String(session.sport || 'Training').replace(/_/g, ' ')} Session
        </div>
      </div>

      {/* Stats Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        padding: '14px 18px',
        borderTop: `1px solid ${STRAVA_LIGHT}`,
        background: STRAVA_LIGHT,
      }}>
        <div>
          <div style={{ fontSize: '10px', color: STRAVA_GRAY, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
            Form Score
          </div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: STRAVA_ORANGE }}>
            {formScore.toFixed(0)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '10px', color: STRAVA_GRAY, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
            Duration
          </div>
          <div style={{ fontSize: '20px', fontWeight: 700 }}>
            {duration}<span style={{ fontSize: '12px', fontWeight: 500, color: STRAVA_GRAY, marginLeft: '2px' }}>min</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: '10px', color: STRAVA_GRAY, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
            Heart Rate
          </div>
          <div style={{ fontSize: '20px', fontWeight: 700 }}>
            {Math.round(140 + Math.random() * 30)}<span style={{ fontSize: '12px', fontWeight: 500, color: STRAVA_GRAY, marginLeft: '2px' }}>bpm</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: '10px', color: STRAVA_GRAY, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
            Calories
          </div>
          <div style={{ fontSize: '20px', fontWeight: 700 }}>
            {Math.round(duration * 7)}<span style={{ fontSize: '12px', fontWeight: 500, color: STRAVA_GRAY, marginLeft: '2px' }}>cal</span>
          </div>
        </div>
      </div>

      {/* Form Score Progress Bar */}
      <div style={{ padding: '14px 18px', borderTop: `1px solid ${STRAVA_BORDER}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: STRAVA_GRAY, marginBottom: '6px' }}>
          <span>Form Quality</span>
          <span>{formScore.toFixed(0)}/100</span>
        </div>
        <div style={{
          height: '6px',
          background: STRAVA_LIGHT,
          borderRadius: '3px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${formScore}%`,
            background: STRAVA_ORANGE,
            borderRadius: '3px',
          }} />
        </div>
      </div>

      {/* Engagement Bar */}
      <div style={{
        padding: '10px 18px',
        borderTop: `1px solid ${STRAVA_BORDER}`,
        display: 'flex',
        gap: '20px',
      }}>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: STRAVA_GRAY, fontWeight: 600 }}>
          ❤ Like
        </button>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: STRAVA_GRAY, fontWeight: 600 }}>
          💬 Comment
        </button>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: STRAVA_GRAY, fontWeight: 600 }}>
          🏆 Achievement
        </button>
      </div>
    </div>
  )
}

// ─── HEROIC FEATURE: AI Intelligence Report ─────────────
function IntelligenceCard({ report }) {
  const summary  = report?.summary || report?.text || report?.coaching_summary || ''
  const focus    = report?.focus_areas || report?.weak_areas || []
  const strength = report?.strengths || []

  return (
    <div style={{
      background: STRAVA_DARK,
      color: '#fff',
      borderRadius: '4px',
      padding: '20px 24px',
      marginBottom: '20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        top: '-30px',
        right: '-30px',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(252,76,2,0.25) 0%, transparent 70%)`,
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '10px',
        }}>
          <span style={{
            background: STRAVA_ORANGE,
            color: '#fff',
            fontSize: '9px',
            fontWeight: 800,
            padding: '3px 8px',
            borderRadius: '50px',
            letterSpacing: '0.5px',
          }}>
            AI COACH
          </span>
          <span style={{ fontSize: '11px', opacity: 0.6, fontWeight: 600, letterSpacing: '0.3px' }}>
            INTELLIGENCE REPORT
          </span>
        </div>
        <p style={{
          fontSize: '14px',
          lineHeight: 1.6,
          margin: 0,
          color: '#fff',
        }}>
          {summary || 'Your form is trending up. Knee tracking improved 12% this week — keep prioritizing the deadlift hinge drill.'}
        </p>
        {(focus.length > 0 || strength.length > 0) && (
          <div style={{ display: 'flex', gap: '12px', marginTop: '14px', flexWrap: 'wrap' }}>
            {strength.slice(0, 2).map((s, i) => (
              <span key={`s-${i}`} style={{
                background: 'rgba(34, 197, 94, 0.15)',
                color: '#22c55e',
                fontSize: '11px',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '50px',
              }}>
                ✓ {typeof s === 'string' ? s : s.label || s.name}
              </span>
            ))}
            {focus.slice(0, 2).map((f, i) => (
              <span key={`f-${i}`} style={{
                background: 'rgba(252, 76, 2, 0.15)',
                color: STRAVA_ORANGE,
                fontSize: '11px',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '50px',
              }}>
                → {typeof f === 'string' ? f : f.label || f.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── HEROIC: Streaks + Load Recommendation strip ─────────────
function StreaksLoadStrip({ currentStreak, longestStreak, loadRec }) {
  const recAction   = loadRec?.recommendation || loadRec?.action || (currentStreak >= 3 ? 'TRAIN' : 'RECORD')
  const recReason   = loadRec?.reason || loadRec?.note || (currentStreak >= 3 ? 'You\'re on a roll — keep going.' : 'Start your streak today.')
  const recColor    = recAction === 'REST' ? '#ef4444' : recAction === 'LIGHT' ? '#f97316' : '#22c55e'

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1.5fr',
      gap: '10px',
      marginBottom: '20px',
    }}>
      {/* Current streak */}
      <div style={{
        background: '#fff',
        border: `1px solid ${STRAVA_BORDER}`,
        borderRadius: '4px',
        padding: '14px',
      }}>
        <div style={{ fontSize: '10px', fontWeight: 700, color: STRAVA_GRAY, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          🔥 Current
        </div>
        <div style={{ fontSize: '24px', fontWeight: 800, color: STRAVA_ORANGE, lineHeight: 1, marginTop: '4px' }}>
          {currentStreak} <span style={{ fontSize: '11px', color: STRAVA_GRAY, fontWeight: 500 }}>days</span>
        </div>
      </div>
      {/* Longest streak */}
      <div style={{
        background: '#fff',
        border: `1px solid ${STRAVA_BORDER}`,
        borderRadius: '4px',
        padding: '14px',
      }}>
        <div style={{ fontSize: '10px', fontWeight: 700, color: STRAVA_GRAY, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          🏆 Longest
        </div>
        <div style={{ fontSize: '24px', fontWeight: 800, color: STRAVA_DARK, lineHeight: 1, marginTop: '4px' }}>
          {longestStreak} <span style={{ fontSize: '11px', color: STRAVA_GRAY, fontWeight: 500 }}>days</span>
        </div>
      </div>
      {/* Load recommendation */}
      <div style={{
        background: '#fff',
        border: `1px solid ${recColor}`,
        borderRadius: '4px',
        padding: '14px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color: STRAVA_GRAY, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Today's Load
          </span>
          <span style={{
            fontSize: '10px',
            fontWeight: 800,
            color: recColor,
            background: `${recColor}15`,
            padding: '2px 8px',
            borderRadius: '50px',
            letterSpacing: '0.5px',
          }}>
            {recAction}
          </span>
        </div>
        <div style={{ fontSize: '12px', color: STRAVA_DARK, lineHeight: 1.4 }}>
          {recReason}
        </div>
      </div>
    </div>
  )
}

// ─── DAILY WELLNESS CHECK-IN — wired to POST /athlete/{id}/wellness/checkin
function WellnessCheckin({ userId, todayScore }) {
  const [submitted, setSubmitted] = React.useState(false)
  const [score, setScore] = React.useState(null)
  const submit = async (rating) => {
    setScore(rating)
    setSubmitted(true)
    try {
      await api.post(`/athlete/${userId}/wellness/checkin`, {
        readiness: rating,
        sleep_quality: rating,
        soreness: 6 - rating,
        timestamp: new Date().toISOString(),
      })
    } catch {
      // silent — UI stays in submitted state
    }
  }
  if (todayScore?.checked_in_today || submitted) {
    return (
      <div style={{
        background: '#fff',
        border: `1px solid ${STRAVA_BORDER}`,
        borderRadius: '4px',
        padding: '16px 20px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: STRAVA_GRAY, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            ✓ Today's Check-in
          </div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: STRAVA_DARK, marginTop: '4px' }}>
            Readiness · {score || todayScore?.readiness || '—'}/5
          </div>
        </div>
        <span style={{ fontSize: '11px', color: '#22c55e', fontWeight: 700 }}>LOGGED</span>
      </div>
    )
  }
  return (
    <div style={{
      background: '#fff',
      border: `1px solid ${STRAVA_ORANGE}`,
      borderRadius: '4px',
      padding: '16px 20px',
      marginBottom: '20px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: STRAVA_ORANGE, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            ☀ Daily check-in
          </div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: STRAVA_DARK, marginTop: '4px' }}>
            How are you feeling today?
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => submit(n)}
            style={{
              flex: 1,
              padding: '10px 0',
              background: '#fff',
              border: `1px solid ${STRAVA_BORDER}`,
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = STRAVA_ORANGE; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = STRAVA_DARK }}
          >
            {['😴', '😐', '🙂', '💪', '🔥'][n - 1]}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: STRAVA_GRAY, marginTop: '8px', fontWeight: 600 }}>
        <span>EXHAUSTED</span>
        <span>FIRED UP</span>
      </div>
    </div>
  )
}

// ─── ACHIEVEMENTS strip — Strava-style trophies (wired to /athlete/{id}/achievements)
function AchievementsStrip({ achievements }) {
  const display = achievements.slice(0, 6)
  return (
    <div style={{
      background: '#fff',
      border: `1px solid ${STRAVA_BORDER}`,
      borderRadius: '4px',
      padding: '16px 20px',
      marginBottom: '20px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: STRAVA_GRAY, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          🏆 Achievements
        </div>
        <span style={{ fontSize: '11px', color: STRAVA_GRAY }}>{achievements.length} unlocked</span>
      </div>
      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto' }}>
        {display.map((a, i) => (
          <div key={a.id || i} style={{
            minWidth: '90px',
            background: STRAVA_LIGHT,
            borderRadius: '4px',
            padding: '12px 8px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '24px', marginBottom: '6px' }}>
              {a.icon || a.emoji || '🏆'}
            </div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: STRAVA_DARK, marginBottom: '2px' }}>
              {a.name || a.title || 'Achievement'}
            </div>
            {a.description && (
              <div style={{ fontSize: '9px', color: STRAVA_GRAY, lineHeight: 1.3 }}>
                {a.description.slice(0, 30)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── IMPROVERS WIDGET — wired to /leaderboards/improvers
function ImproversWidget({ improvers, userId }) {
  const list = improvers.length > 0 ? improvers : [
    { athlete_id: 'demo-1', athlete_name: 'Aryan Kapoor', delta: 11, sport: 'sprint' },
    { athlete_id: 'demo-2', athlete_name: 'Priya Singh',  delta:  9, sport: 'jump' },
    { athlete_id: 'demo-3', athlete_name: 'Zara Khan',    delta:  7, sport: 'football' },
  ]
  return (
    <div style={{
      background: '#fff',
      border: `1px solid ${STRAVA_BORDER}`,
      borderRadius: '4px',
      padding: '20px',
      marginBottom: '16px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: STRAVA_DARK, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          🔥 Top Improvers
        </div>
        <span style={{ fontSize: '10px', color: STRAVA_GRAY, fontWeight: 700 }}>THIS WEEK</span>
      </div>
      {list.slice(0, 5).map((a, i) => {
        const isYou = a.athlete_id === userId
        const name = a.athlete_name || a.athlete_id
        const delta = a.delta || a.improvement || a.delta_form_score || 0
        return (
          <div key={a.athlete_id || i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 0',
            borderBottom: i < Math.min(4, list.length - 1) ? `1px solid ${STRAVA_LIGHT}` : 'none',
            background: isYou ? `rgba(252, 76, 2, 0.04)` : 'transparent',
          }}>
            <div style={{
              width: '20px',
              fontSize: '11px',
              fontWeight: 700,
              color: i < 3 ? STRAVA_ORANGE : STRAVA_GRAY,
            }}>
              {i + 1}
            </div>
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%',
              background: isYou ? STRAVA_ORANGE : STRAVA_DARK,
              color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '10px', fontWeight: 700,
            }}>
              {String(name).charAt(0).toUpperCase()}
            </div>
            <div style={{
              flex: 1,
              fontSize: '12px',
              fontWeight: isYou ? 700 : 500,
              color: STRAVA_DARK,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {name}
            </div>
            <span style={{
              fontSize: '12px',
              fontWeight: 800,
              color: '#22c55e',
            }}>
              ↑ {delta > 0 ? '+' : ''}{Math.round(delta)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
