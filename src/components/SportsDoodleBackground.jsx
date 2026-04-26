import React from 'react'

/**
 * Pencil-sketch sports atmosphere doodles for behind dashboards.
 * Just sports vibes — bird mascot, cyclist, runner, basketball hoop.
 * NOT the product story (that lives in the hero phone mockup on landing).
 */
export function SportsDoodleBackground({ opacity = 0.10, color = '#242428' }) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1600 1000"
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: 'absolute',
        inset: 0,
        opacity,
        pointerEvents: 'none',
        zIndex: 0,
      }}
      aria-hidden="true"
    >
      <defs>
        <pattern id="notebook-grid" width="50" height="50" patternUnits="userSpaceOnUse">
          <path d="M 50 0 L 0 0 0 50" fill="none" stroke={color} strokeWidth="0.4" />
        </pattern>
        <filter id="sketch-rough">
          <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="2" seed="3" />
          <feDisplacementMap in="SourceGraphic" scale="1.2" />
        </filter>
      </defs>

      {/* Notebook grid background */}
      <rect width="100%" height="100%" fill="url(#notebook-grid)" />

      {/* ─── Duolingo-style BIRD MASCOT (bobbing, top-right) ─── */}
      <g transform="translate(1280, 200)" filter="url(#sketch-rough)" className="ph-bird-bob">
        {/* Body */}
        <ellipse cx="0" cy="40" rx="55" ry="65" fill="none" stroke={color} strokeWidth="2.5" />
        <ellipse cx="0" cy="55" rx="35" ry="40" fill="none" stroke={color} strokeWidth="1.2" opacity="0.6" />
        {/* Wings */}
        <path d="M -50 30 Q -75 50 -55 70 Q -45 50 -50 30 Z" fill="none" stroke={color} strokeWidth="2" />
        <path d="M 50 30 Q 75 0 90 -10 Q 75 -5 60 5" fill="none" stroke={color} strokeWidth="2" />
        {/* Head */}
        <circle cx="0" cy="-15" r="38" fill="none" stroke={color} strokeWidth="2.5" />
        {/* Big eyes */}
        <circle cx="-12" cy="-22" r="7" fill="none" stroke={color} strokeWidth="2" />
        <circle cx="12" cy="-22" r="7" fill="none" stroke={color} strokeWidth="2" />
        <circle cx="-11" cy="-22" r="3" fill={color} />
        <circle cx="13" cy="-22" r="3" fill={color} />
        {/* Beak */}
        <path d="M -8 -8 L 0 -2 L 8 -8 Z" fill="none" stroke={color} strokeWidth="2" />
        <path d="M -6 -6 Q 0 -3 6 -6" fill="none" stroke={color} strokeWidth="1.2" />
        {/* Cheek */}
        <ellipse cx="-22" cy="-12" rx="5" ry="3" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
        <ellipse cx="22" cy="-12" rx="5" ry="3" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
        {/* Tuft */}
        <path d="M -8 -50 Q 0 -62 8 -50" fill="none" stroke={color} strokeWidth="2" />
        {/* Headband */}
        <path d="M -36 -30 Q 0 -42 36 -30" fill="none" stroke={color} strokeWidth="2.5" />
        <line x1="0" y1="-37" x2="0" y2="-30" stroke={color} strokeWidth="2" />
        {/* Feet */}
        <path d="M -20 100 L -30 120 M -20 100 L -10 120 M -20 100 L -25 125" fill="none" stroke={color} strokeWidth="2" />
        <path d="M 20 100 L 30 120 M 20 100 L 10 120 M 20 100 L 25 125" fill="none" stroke={color} strokeWidth="2" />
      </g>

      {/* ─── Basketball mid-air (bouncing + spinning) ─── */}
      <g transform="translate(1140, 380)" filter="url(#sketch-rough)" className="ph-ball-bounce">
        <g className="ph-ball-spin">
          <circle cx="0" cy="0" r="22" fill="none" stroke={color} strokeWidth="2" />
          <path d="M -22 0 Q 0 -10 22 0" fill="none" stroke={color} strokeWidth="1.5" />
          <path d="M -22 0 Q 0 10 22 0" fill="none" stroke={color} strokeWidth="1.5" />
          <line x1="0" y1="-22" x2="0" y2="22" stroke={color} strokeWidth="1.5" />
        </g>
      </g>

      {/* ─── Basketball hoop ─── */}
      <g transform="translate(1390, 90)" filter="url(#sketch-rough)">
        <rect x="-30" y="0" width="80" height="40" fill="none" stroke={color} strokeWidth="2" rx="2" />
        <ellipse cx="10" cy="50" rx="20" ry="6" fill="none" stroke={color} strokeWidth="2" />
        <path d="M -8 52 L -5 75 L 0 60 L 5 80 L 10 60 L 15 80 L 20 60 L 25 75 L 28 52" fill="none" stroke={color} strokeWidth="1.2" />
        <line x1="50" y1="20" x2="65" y2="20" stroke={color} strokeWidth="2" />
      </g>

      {/* ─── CYCLIST KID (rolling left to right) ─── */}
      <g transform="translate(120, 180)" stroke={color} strokeWidth="2" fill="none" filter="url(#sketch-rough)" strokeLinecap="round" strokeLinejoin="round" className="ph-cyclist-roll">
        {/* Wheels */}
        <circle cx="0" cy="120" r="38" />
        <circle cx="140" cy="120" r="38" />
        {/* Spokes */}
        <line x1="0" y1="82" x2="0" y2="158" />
        <line x1="-38" y1="120" x2="38" y2="120" />
        <line x1="-27" y1="93" x2="27" y2="147" />
        <line x1="-27" y1="147" x2="27" y2="93" />
        <line x1="140" y1="82" x2="140" y2="158" />
        <line x1="102" y1="120" x2="178" y2="120" />
        {/* Frame */}
        <line x1="0" y1="120" x2="80" y2="80" />
        <line x1="80" y1="80" x2="140" y2="120" />
        <line x1="80" y1="80" x2="80" y2="55" />
        <line x1="0" y1="120" x2="140" y2="120" />
        <line x1="80" y1="80" x2="40" y2="120" />
        {/* Seat */}
        <line x1="60" y1="55" x2="100" y2="55" />
        {/* Handlebar */}
        <line x1="80" y1="55" x2="100" y2="40" />
        <line x1="100" y1="40" x2="115" y2="40" />
        <line x1="80" y1="55" x2="60" y2="40" />
        {/* Kid body */}
        <circle cx="100" cy="0" r="22" />
        {/* Cap */}
        <path d="M 80 -15 L 122 -15 Q 122 -22 100 -23 Q 80 -22 80 -15 Z" fill={color} fillOpacity="0.15" />
        <line x1="118" y1="-15" x2="135" y2="-12" />
        {/* Eyes */}
        <circle cx="93" cy="-3" r="2" fill={color} />
        <circle cx="107" cy="-3" r="2" fill={color} />
        {/* Smile */}
        <path d="M 92 5 Q 100 10 108 5" />
        {/* Body */}
        <line x1="100" y1="22" x2="80" y2="55" />
        {/* Arms */}
        <line x1="100" y1="22" x2="115" y2="40" />
        <line x1="100" y1="22" x2="63" y2="40" />
        {/* Legs */}
        <line x1="80" y1="55" x2="55" y2="100" />
        <line x1="55" y1="100" x2="40" y2="120" />
        <line x1="80" y1="55" x2="100" y2="100" />
        <line x1="100" y1="100" x2="105" y2="125" />
        {/* Motion clouds */}
        <path d="M -70 110 Q -60 100 -50 110" />
        <path d="M -85 130 Q -75 120 -65 130" />
      </g>

      {/* ─── Runner figure (striding, mid-page) ─── */}
      <g transform="translate(720, 740)" stroke={color} strokeWidth="2" fill="none" filter="url(#sketch-rough)" strokeLinecap="round" className="ph-runner-stride">
        <circle cx="0" cy="0" r="14" />
        <circle cx="-3" cy="-2" r="1.5" fill={color} />
        <circle cx="3" cy="-2" r="1.5" fill={color} />
        {/* Spine */}
        <line x1="0" y1="14" x2="-3" y2="60" />
        {/* Arms */}
        <line x1="-3" y1="35" x2="-30" y2="22" />
        <line x1="-30" y1="22" x2="-38" y2="48" />
        <line x1="-3" y1="35" x2="25" y2="55" />
        <line x1="25" y1="55" x2="40" y2="38" />
        {/* Legs in stride */}
        <line x1="-3" y1="60" x2="-18" y2="105" />
        <line x1="-18" y1="105" x2="-30" y2="135" />
        <line x1="-3" y1="60" x2="18" y2="100" />
        <line x1="18" y1="100" x2="35" y2="130" />
        {/* Speed lines */}
        <line x1="-60" y1="10" x2="-45" y2="15" strokeDasharray="3 3" />
        <line x1="-60" y1="35" x2="-45" y2="35" strokeDasharray="3 3" />
        <line x1="-60" y1="60" x2="-45" y2="55" strokeDasharray="3 3" />
      </g>

      {/* ─── Squat skeleton (bottom-left) ─── */}
      <g transform="translate(220, 760)" stroke={color} strokeWidth="2" fill="none" filter="url(#sketch-rough)" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="50" cy="0" r="14" />
        <line x1="50" y1="14" x2="50" y2="70" />
        <line x1="50" y1="30" x2="20" y2="20" />
        <line x1="50" y1="30" x2="80" y2="20" />
        <line x1="0" y1="18" x2="100" y2="22" strokeWidth="3" />
        <circle cx="0" cy="18" r="6" fill={color} fillOpacity="0.4" />
        <circle cx="100" cy="22" r="6" fill={color} fillOpacity="0.4" />
        <line x1="50" y1="70" x2="30" y2="110" className="ph-squat-legs" />
        <line x1="30" y1="110" x2="50" y2="160" className="ph-squat-legs" />
        <line x1="50" y1="70" x2="70" y2="110" className="ph-squat-legs" />
        <line x1="70" y1="110" x2="50" y2="160" className="ph-squat-legs" />
        <text x="35" y="105" fontSize="9" fontFamily="monospace" fill={color} stroke="none" opacity="0.6">87°</text>
      </g>

      {/* ─── Stopwatch (bottom-right corner) ─── */}
      <g transform="translate(1380, 800)" stroke={color} strokeWidth="2" fill="none" filter="url(#sketch-rough)" strokeLinecap="round">
        <circle cx="50" cy="50" r="40" />
        <line x1="50" y1="20" x2="50" y2="50" />
        <line x1="50" y1="50" x2="70" y2="40" />
        <rect x="42" y="0" width="16" height="8" rx="2" />
        <line x1="80" y1="20" x2="90" y2="10" />
        <text x="32" y="105" fontSize="10" fontFamily="monospace" fill={color} stroke="none" opacity="0.6">45 min</text>
      </g>

      {/* ─── Heart-rate notation (mid-right) ─── */}
      <g transform="translate(900, 280)" filter="url(#sketch-rough)">
        <text x="0" y="-8" fontSize="10" fontFamily="monospace" fill={color} opacity="0.6">
          rPPG · BPM 142
        </text>
        <polyline
          points="0,30 30,30 35,15 40,45 45,30 75,30 80,10 85,50 90,30 130,30 135,20 140,40 145,30 180,30"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          className="ph-ecg-draw"
        />
      </g>

      {/* ─── Notebook handwriting ─── */}
      <text x="100" y="500" fontSize="36" fontFamily="Georgia, serif" fontStyle="italic" fill={color} opacity="0.5">
        Form Score
      </text>
      <text x="940" y="900" fontSize="28" fontFamily="Georgia, serif" fontStyle="italic" fill={color} opacity="0.5">
        Hoops with Duo!
      </text>
      <text x="100" y="930" fontSize="13" fontFamily="monospace" fill={color} opacity="0.5">
        rPPG · 33 keypoints · 30 fps
      </text>
    </svg>
  )
}
