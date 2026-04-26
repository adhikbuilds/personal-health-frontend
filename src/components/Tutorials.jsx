// Tutorials — curated YouTube videos for each sport / skill module.
// Use anywhere a sport or drill is shown to surface a "Watch tutorial" link.

import React, { useState } from 'react'

const ORANGE = '#FC4C02'
const DARK   = '#242428'
const GRAY   = '#6D6D78'
const BORDER = '#E6E6EA'
const LIGHT  = '#F7F7FA'

// Curated tutorial library — keys are normalized (lowercase, single words).
// Videos are real, popular, free YouTube tutorials. Coaches can add more later.
const TUTORIALS = {
  cricket: [
    { title: 'Front-Foot Defense — Basics',     channel: 'Cricket Lessons',  url: 'https://www.youtube.com/watch?v=oV-kDuT4tUc',    duration: '6:42' },
    { title: 'Cover Drive Technique',           channel: 'Cricket India',    url: 'https://www.youtube.com/watch?v=ToO6mvAqzmA',    duration: '9:21' },
    { title: 'Bowling Action Fundamentals',     channel: 'CricketDept',      url: 'https://www.youtube.com/watch?v=lKOc8gVoH-w',    duration: '8:15' },
  ],
  sprint: [
    { title: 'Sprint Drive Phase Drills',       channel: 'ALTIS',            url: 'https://www.youtube.com/watch?v=0KgfBWDbRz4',    duration: '5:10' },
    { title: 'A-Skip and B-Skip Form',          channel: 'TrackStar',        url: 'https://www.youtube.com/watch?v=ZrhkvQwfBM4',    duration: '7:33' },
    { title: 'Block Start Mechanics',           channel: 'Speed Endurance',  url: 'https://www.youtube.com/watch?v=Ra6QOd7zhEg',    duration: '11:02' },
  ],
  strength: [
    { title: 'Squat Form — Complete Guide',     channel: 'Squat University', url: 'https://www.youtube.com/watch?v=ulq8njbDnSg',    duration: '12:48' },
    { title: 'Deadlift — Hip Hinge Pattern',    channel: 'Squat University', url: 'https://www.youtube.com/watch?v=op9kVnSso6Q',    duration: '10:15' },
    { title: 'Bench Press — Setup & Arch',      channel: 'Alan Thrall',      url: 'https://www.youtube.com/watch?v=4Y2ZdHCOXok',    duration: '8:59' },
  ],
  jump: [
    { title: 'Vertical Jump Training',          channel: 'THENX',            url: 'https://www.youtube.com/watch?v=qg-FdF8AANM',    duration: '6:24' },
    { title: 'Box Jump Landing Mechanics',      channel: 'JumpScience',      url: 'https://www.youtube.com/watch?v=52r_Ul6Bfgg',    duration: '4:50' },
    { title: 'Plyometric Drills',               channel: 'Sports Science',   url: 'https://www.youtube.com/watch?v=wU1LO8uBFFU',    duration: '9:08' },
  ],
  basketball: [
    { title: 'Shooting Form Fundamentals',      channel: 'ILoveBasketball',  url: 'https://www.youtube.com/watch?v=Z0KFXh-Rikc',    duration: '7:55' },
    { title: 'Crossover Dribble Drill',         channel: 'GetHandles',       url: 'https://www.youtube.com/watch?v=kPWCNMK-LmA',    duration: '5:30' },
    { title: 'Defensive Stance Basics',         channel: 'BasketballDojo',   url: 'https://www.youtube.com/watch?v=wwTu3eHA3eY',    duration: '6:12' },
  ],
  football: [
    { title: 'First Touch Drills',              channel: 'AllAttack',        url: 'https://www.youtube.com/watch?v=O6bQyc5hXrU',    duration: '8:30' },
    { title: 'Sprinting with the Ball',         channel: '7mlc',             url: 'https://www.youtube.com/watch?v=t1Tp1i_F2lY',    duration: '6:18' },
    { title: 'Striker Movement Patterns',       channel: 'Online Trainer',   url: 'https://www.youtube.com/watch?v=tDeRQ5Z3sno',    duration: '10:45' },
  ],
  agility: [
    { title: 'Lateral Bound Progression',       channel: 'PerformBetter',    url: 'https://www.youtube.com/watch?v=JLnpyEvtj0M',    duration: '4:20' },
    { title: 'T-Drill for Footwork',            channel: 'Athletes Hub',     url: 'https://www.youtube.com/watch?v=DbkqJaLqnhI',    duration: '5:45' },
  ],
  mobility: [
    { title: 'Hip Mobility Routine',            channel: 'Tom Morrison',     url: 'https://www.youtube.com/watch?v=jl_d0_C6Z3Q',    duration: '9:30' },
    { title: 'Shoulder Mobility Drills',        channel: 'GMB Fitness',      url: 'https://www.youtube.com/watch?v=A0MbPOEHa_E',    duration: '7:15' },
    { title: 'Ankle Mobility Fix',              channel: 'Squat University', url: 'https://www.youtube.com/watch?v=rzwy_TxBh40',    duration: '6:08' },
  ],
  badminton: [
    { title: 'Backhand Clear Technique',        channel: 'Badminton Famly',  url: 'https://www.youtube.com/watch?v=oiCkN0w4QC0',    duration: '8:00' },
    { title: 'Footwork Pattern Drills',         channel: 'Lee Chong Wei',    url: 'https://www.youtube.com/watch?v=0nMXm4y4sV8',    duration: '6:40' },
  ],
  yoga: [
    { title: 'Yoga for Athletes — 20 min',      channel: 'Yoga With Adriene', url: 'https://www.youtube.com/watch?v=vKxUF9FoSGQ',   duration: '20:14' },
    { title: 'Recovery Flow',                   channel: 'Yoga With Bird',   url: 'https://www.youtube.com/watch?v=Eml2xnoLpYE',    duration: '15:00' },
  ],
}

// Generic → fall back to "general athletic conditioning" tutorials
const GENERAL_FALLBACK = [
  { title: 'Athletic Warm-Up Routine',       channel: 'PerformBetter',     url: 'https://www.youtube.com/watch?v=R0mMyV5OtcM',    duration: '8:00' },
  { title: 'Mobility for Athletes',          channel: 'Tom Morrison',      url: 'https://www.youtube.com/watch?v=jl_d0_C6Z3Q',    duration: '9:30' },
]

function videoIdFromUrl(url) {
  try {
    const u = new URL(url)
    if (u.hostname === 'youtu.be') return u.pathname.slice(1)
    return u.searchParams.get('v')
  } catch {
    return null
  }
}

function thumbnailUrl(url) {
  const id = videoIdFromUrl(url)
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null
}

export function getTutorials(sport) {
  const key = String(sport || '').toLowerCase().trim().replace(/\s+/g, '_').replace(/_training$/, '').replace(/_/g, '')
  // Try direct match, then partial
  if (TUTORIALS[key]) return TUTORIALS[key]
  for (const k of Object.keys(TUTORIALS)) {
    if (key.includes(k) || k.includes(key)) return TUTORIALS[k]
  }
  return GENERAL_FALLBACK
}

// ─── Tutorials list (shows 2-3 videos for a given sport) ──────
export function TutorialList({ sport, title = 'TUTORIALS', max = 3 }) {
  const videos = getTutorials(sport).slice(0, max)
  return (
    <div style={{
      background: '#fff',
      border: `1px solid ${BORDER}`,
      borderRadius: '8px',
      padding: '16px 20px',
      marginBottom: '16px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '11px', fontWeight: 800, color: GRAY, letterSpacing: '0.5px' }}>
          🎬 {title}
        </span>
        <span style={{ fontSize: '10px', color: GRAY, textTransform: 'capitalize' }}>
          {sport || 'general'}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {videos.map((v) => (
          <a key={v.url} href={v.url} target="_blank" rel="noopener noreferrer"
            style={{
              display: 'flex',
              gap: '12px',
              padding: '8px',
              borderRadius: '6px',
              textDecoration: 'none',
              color: DARK,
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = LIGHT}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <img
              src={thumbnailUrl(v.url)}
              alt={v.title}
              loading="lazy"
              style={{ width: '80px', height: '45px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }}
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {v.title}
              </div>
              <div style={{ fontSize: '10px', color: GRAY }}>
                {v.channel} · {v.duration}
              </div>
            </div>
            <span style={{ color: ORANGE, fontSize: '14px', alignSelf: 'center' }}>▶</span>
          </a>
        ))}
      </div>
    </div>
  )
}

// ─── Embedded player (uses iframe so we don't ship the YouTube SDK) ──────
export function TutorialEmbed({ url, title }) {
  const id = videoIdFromUrl(url)
  if (!id) return null
  return (
    <div style={{
      position: 'relative',
      paddingBottom: '56.25%',
      height: 0,
      overflow: 'hidden',
      borderRadius: '8px',
      background: '#000',
    }}>
      <iframe
        src={`https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`}
        title={title || 'Tutorial'}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
      />
    </div>
  )
}
