import React from 'react'
import { Link, useNavigate, useLocation } from '@tanstack/react-router'
import { useUser } from '../context/UserContext'
import { SportsDoodleBackground } from './SportsDoodleBackground'

export const ORANGE = '#FC4C02'
export const DARK = '#242428'
export const GRAY = '#6D6D78'
export const LIGHT = '#F7F7FA'
export const BORDER = '#E6E6EA'

export function StravaLayout({ children, displayName, role }) {
  const { logout, isCoach } = useUser()
  const navigate = useNavigate()
  const location = useLocation()

  const useCoachNav = role === 'coach' || (role !== 'athlete' && isCoach)

  const navLinks = useCoachNav ? [
    { to: '/dashboard', label: 'Roster' },
    { to: '/feed', label: 'Feed' },
    { to: '/coach/analytics', label: 'Analytics' },
    { to: '/coach/drills', label: 'Drills' },
    { to: '/coach/reports', label: 'Reports' },
    { to: '/messages', label: 'Messages' },
  ] : [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/feed', label: 'Feed' },
    { to: '/athlete/analytics', label: 'Training' },
    { to: '/athlete/calendar', label: 'Calendar' },
    { to: '/athlete/leaderboard', label: 'Leaderboard' },
  ]

  const avatar = (displayName || 'A').toString().charAt(0).toUpperCase()

  return (
    <div style={{
      background: '#fff',
      color: DARK,
      minHeight: '100vh',
      width: '100%',
      position: 'relative',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      {/* Pencil-sketch doodle background — fills viewport edges */}
      <div style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        background: '#fafaf6',
      }}>
        <SportsDoodleBackground opacity={0.10} color="#242428" />
      </div>
      {/* Top Nav */}
      <header style={{
        padding: '0 24px',
        background: '#fff',
        borderBottom: `1px solid ${BORDER}`,
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
            <Link to="/dashboard" style={{
              fontSize: '20px',
              fontWeight: 800,
              color: ORANGE,
              letterSpacing: '-0.5px',
              textDecoration: 'none',
            }}>
              PERSONAL HEALTH
            </Link>
            <nav style={{ display: 'flex', gap: '24px', fontSize: '13px', fontWeight: 600 }}>
              {navLinks.map((l) => {
                const isActive = location.pathname === l.to
                return (
                  <Link
                    key={l.to}
                    to={l.to}
                    style={{
                      color: isActive ? DARK : GRAY,
                      textDecoration: 'none',
                      paddingBottom: '18px',
                      borderBottom: isActive ? `3px solid ${ORANGE}` : '3px solid transparent',
                      marginBottom: '-19px',
                      transition: 'color 0.2s',
                    }}
                  >
                    {l.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => alert('Open the mobile app to record a session')}
              style={{
                padding: '8px 16px',
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
            >
              + Record
            </button>
            <button
              onClick={() => { logout(); navigate({ to: '/' }) }}
              title="Click to log out"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: ORANGE,
                color: '#fff',
                border: 'none',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {avatar}
            </button>
          </div>
        </div>
      </header>

      {/* Page content (above doodle) */}
      <main style={{ position: 'relative', zIndex: 1, width: '100%', display: 'block' }}>
        {children}
      </main>
    </div>
  )
}

// Reusable building blocks for inner pages
export function PageHeader({ eyebrow, title, description }) {
  return (
    <div style={{
      width: '100%',
      background: '#fff',
      borderBottom: `1px solid ${BORDER}`,
      boxShadow: '0 2px 6px rgba(36, 36, 40, 0.03)',
    }}>
    <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '40px 24px 32px',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      <div style={{ fontSize: '11px', fontWeight: 700, color: ORANGE, textTransform: 'uppercase', letterSpacing: '1px' }}>
        {eyebrow}
      </div>
      <h1 style={{
        fontSize: 'clamp(28px, 3.5vw, 40px)',
        fontWeight: 800,
        margin: '8px 0 8px 0',
        letterSpacing: '-1px',
      }}>
        {title}
      </h1>
      {description && (
        <p style={{ fontSize: '14px', color: GRAY, margin: 0, maxWidth: '720px' }}>
          {description}
        </p>
      )}
    </div>
    </div>
  )
}

export function StravaCard({ title, action, children, padding = '24px', accent = false }) {
  return (
    <div style={{
      background: '#fff',
      border: accent ? `2px solid ${ORANGE}` : `1px solid ${BORDER}`,
      borderRadius: '4px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(36, 36, 40, 0.04)',
    }}>
      {(title || action) && (
        <div style={{
          padding: '14px 20px',
          borderBottom: `1px solid ${BORDER}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {title}
          </div>
          {action}
        </div>
      )}
      <div style={{ padding }}>
        {children}
      </div>
    </div>
  )
}
