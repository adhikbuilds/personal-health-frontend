import React from 'react'

export function SportsIllustratedBackground() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1920 1080"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Dark gradient background */}
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#0a0e1a', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#0d1520', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#080a12', stopOpacity: 1 }} />
        </linearGradient>

        <filter id="sketch">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="2" />
          <feDisplacementMap in="SourceGraphic" scale="3" />
        </filter>
      </defs>

      {/* Background */}
      <rect width="1920" height="1080" fill="url(#bgGradient)" />

      {/* Tier 1 (Top Right) - Young Athlete Cyclist */}
      <g opacity="0.12" filter="url(#sketch)">
        {/* Cyclist silhouette - Tier 1 */}
        <circle cx="1700" cy="200" r="150" fill="none" stroke="#06b6d4" strokeWidth="2" />
        <text
          x="1700"
          y="180"
          fontSize="24"
          fontWeight="700"
          fill="#06b6d4"
          textAnchor="middle"
        >
          TIER 1
        </text>
        {/* Cyclist body */}
        <circle cx="1680" cy="250" r="30" fill="#06b6d4" opacity="0.4" />
        {/* Head */}
        <circle cx="1680" cy="220" r="20" fill="#06b6d4" opacity="0.4" />
        {/* Arms extended */}
        <line x1="1650" y1="250" x2="1610" y2="240" stroke="#06b6d4" strokeWidth="2" opacity="0.4" />
        <line x1="1710" y1="250" x2="1750" y2="240" stroke="#06b6d4" strokeWidth="2" opacity="0.4" />
        {/* Legs */}
        <line x1="1680" y1="280" x2="1670" y2="330" stroke="#06b6d4" strokeWidth="2" opacity="0.4" />
        <line x1="1680" y1="280" x2="1690" y2="330" stroke="#06b6d4" strokeWidth="2" opacity="0.4" />
        {/* Bicycle wheels */}
        <circle cx="1640" cy="330" r="25" fill="none" stroke="#06b6d4" strokeWidth="1.5" opacity="0.4" />
        <circle cx="1720" cy="330" r="25" fill="none" stroke="#06b6d4" strokeWidth="1.5" opacity="0.4" />
      </g>

      {/* Tier 3 (Bottom Left) - Young Athlete Runner */}
      <g opacity="0.12" filter="url(#sketch)">
        {/* Runner silhouette - Tier 3 */}
        <circle cx="220" cy="900" r="150" fill="none" stroke="#8b5cf6" strokeWidth="2" />
        <text
          x="220"
          y="880"
          fontSize="24"
          fontWeight="700"
          fill="#8b5cf6"
          textAnchor="middle"
        >
          TIER 3
        </text>
        {/* Runner body */}
        <circle cx="240" cy="930" r="30" fill="#8b5cf6" opacity="0.4" />
        {/* Head */}
        <circle cx="240" cy="900" r="20" fill="#8b5cf6" opacity="0.4" />
        {/* Arms in running motion */}
        <line x1="210" y1="930" x2="170" y2="900" stroke="#8b5cf6" strokeWidth="2" opacity="0.4" />
        <line x1="270" y1="930" x2="310" y2="960" stroke="#8b5cf6" strokeWidth="2" opacity="0.4" />
        {/* Legs in running motion */}
        <line x1="240" y1="960" x2="230" y2="1010" stroke="#8b5cf6" strokeWidth="2" opacity="0.4" />
        <line x1="240" y1="960" x2="250" y2="1010" stroke="#8b5cf6" strokeWidth="2" opacity="0.4" />
      </g>

      {/* Competitive 1v1 Arena in Center */}
      <g opacity="0.1">
        {/* Center vs circle */}
        <circle cx="960" cy="540" r="300" fill="none" stroke="#06b6d4" strokeWidth="1.5" opacity="0.3" />
        <circle cx="960" cy="540" r="250" fill="none" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.3" />
        <circle cx="960" cy="540" r="200" fill="none" stroke="#22c55e" strokeWidth="1" opacity="0.2" />

        {/* VS Text */}
        <text x="960" y="560" fontSize="80" fontWeight="700" fill="#06b6d4" textAnchor="middle" opacity="0.15">
          VS
        </text>

        {/* Tier indicators */}
        <text x="960" y="300" fontSize="28" fontWeight="600" fill="#06b6d4" textAnchor="middle" opacity="0.2">
          TIER 1
        </text>
        <text x="960" y="800" fontSize="28" fontWeight="600" fill="#8b5cf6" textAnchor="middle" opacity="0.2">
          TIER 3
        </text>
      </g>

      {/* Sports Icons - Trophy */}
      <g opacity="0.08">
        {/* Trophy shape top right */}
        <rect x="1800" y="900" width="80" height="120" rx="5" fill="none" stroke="#22c55e" strokeWidth="1.5" />
        <circle cx="1840" cy="880" r="35" fill="none" stroke="#22c55e" strokeWidth="1.5" />
        <line x1="1805" y1="1020" x2="1875" y2="1020" stroke="#22c55e" strokeWidth="2" />
      </g>

      {/* Medal Icon - Bottom Right */}
      <g opacity="0.08">
        <circle cx="100" cy="200" r="40" fill="none" stroke="#f97316" strokeWidth="2" />
        <rect x="75" y="250" width="50" height="100" fill="none" stroke="#f97316" strokeWidth="1.5" />
      </g>

      {/* Fitness intensity bars */}
      <g opacity="0.06">
        <rect x="50" y="400" width="12" height="100" fill="#06b6d4" />
        <rect x="70" y="350" width="12" height="150" fill="#06b6d4" />
        <rect x="90" y="300" width="12" height="200" fill="#06b6d4" />
        <rect x="110" y="350" width="12" height="150" fill="#06b6d4" />
        <rect x="130" y="400" width="12" height="100" fill="#06b6d4" />
      </g>

      {/* Heartbeat line */}
      <g opacity="0.05" stroke="#ef4444" strokeWidth="2" fill="none">
        <polyline points="1700,100 1750,100 1780,80 1810,120 1840,100 1890,100" />
      </g>

      {/* Grid overlay for sports field feel */}
      <g opacity="0.03" stroke="#06b6d4" strokeWidth="1">
        <line x1="0" y1="540" x2="1920" y2="540" />
        <line x1="960" y1="0" x2="960" y2="1080" />
      </g>

      {/* Dots for data points */}
      <g fill="#06b6d4" opacity="0.08">
        <circle cx="300" cy="150" r="4" />
        <circle cx="600" cy="250" r="4" />
        <circle cx="1200" cy="200" r="4" />
        <circle cx="1600" cy="400" r="4" />
        <circle cx="1800" cy="650" r="4" />
        <circle cx="300" cy="900" r="4" />
        <circle cx="800" cy="950" r="4" />
      </g>
    </svg>
  )
}
