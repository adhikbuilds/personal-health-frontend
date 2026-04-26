import React, { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useUser } from '../../context/UserContext'
import { StravaLayout, PageHeader, StravaCard, ORANGE, DARK, GRAY, LIGHT, BORDER } from '../../components/StravaLayout'

export function PerformanceReportsPage() {
  const { user } = useUser()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('weekly')

  useEffect(() => {
    if (!user) navigate({ to: '/login' })
  }, [user, navigate])

  if (!user) return null

  const displayName = String(user?.userId || user?.email || 'Coach')

  const reports = [
    { id: 'weekly', label: 'Weekly Summary', desc: 'Team performance over last 7 days' },
    { id: 'injury', label: 'Injury Risk', desc: 'Athletes flagged for biomechanical risk' },
    { id: 'compliance', label: 'Compliance', desc: 'Drill adherence and session consistency' },
  ]

  return (
    <StravaLayout displayName={displayName} role="coach">
      <PageHeader
        eyebrow="Coach · Reports"
        title="Performance reports."
        description="Auto-generated reports for team meetings, parent updates, and program planning."
      />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: `1px solid ${BORDER}` }}>
          {reports.map((r) => (
            <button
              key={r.id}
              onClick={() => setActiveTab(r.id)}
              style={{
                padding: '12px 20px',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === r.id ? `3px solid ${ORANGE}` : '3px solid transparent',
                color: activeTab === r.id ? DARK : GRAY,
                fontSize: '13px',
                fontWeight: activeTab === r.id ? 700 : 600,
                cursor: 'pointer',
                marginBottom: '-1px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {r.label}
            </button>
          ))}
        </div>

        {activeTab === 'weekly' && <WeeklyReport />}
        {activeTab === 'injury' && <InjuryReport />}
        {activeTab === 'compliance' && <ComplianceReport />}
      </div>
    </StravaLayout>
  )
}

function WeeklyReport() {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        <BigStat label="Total Sessions" value="34" change="+12%" accent />
        <BigStat label="Avg Form Score" value="78.4" unit="/100" change="+3.2" />
        <BigStat label="Most Active" value="Aryan K." unit="8 sessions" />
        <BigStat label="Top Improver" value="Priya S." unit="+11 form" />
      </div>

      <StravaCard title="This Week's Highlights">
        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: DARK, lineHeight: 1.8 }}>
          <li>Team avg form score climbed from 75 → 78 (+3.2 points)</li>
          <li>5 personal bests recorded across sprint and strength</li>
          <li>Cricket squad showed strongest week-on-week trend (+5%)</li>
          <li>1 athlete (Rohan P.) flagged for declining knee form — review recommended</li>
        </ul>
      </StravaCard>

      <div style={{ height: '12px' }} />

      <StravaCard title="Top Improvers" padding="0">
        {[
          { name: 'Priya Singh', sport: 'Jump', delta: '+11 form pts' },
          { name: 'Aryan Kapoor', sport: 'Sprint', delta: '+7 form pts' },
          { name: 'Zara Khan', sport: 'Football', delta: '+5 form pts' },
        ].map((a, i, arr) => (
          <div key={i} style={{
            padding: '14px 20px',
            borderBottom: i < arr.length - 1 ? `1px solid ${LIGHT}` : 'none',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700 }}>{a.name}</div>
              <div style={{ fontSize: '11px', color: GRAY, marginTop: '2px' }}>{a.sport}</div>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#22c55e' }}>↑ {a.delta}</span>
          </div>
        ))}
      </StravaCard>
    </div>
  )
}

function InjuryReport() {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
        <BigStat label="High Risk" value="1" unit="athlete" danger />
        <BigStat label="Watch" value="2" unit="athletes" />
        <BigStat label="Healthy" value="2" unit="athletes" />
      </div>

      <StravaCard title="Risk Breakdown" padding="0">
        {[
          { name: 'Rohan Patel', sport: 'Cricket', risk: 'high', joint: 'Right knee · 15% form decline this week' },
          { name: 'Karan Sharma', sport: 'Badminton', risk: 'watch', joint: 'Shoulder asymmetry detected' },
          { name: 'Priya Singh', sport: 'Jump', risk: 'watch', joint: 'No session in 2 days' },
        ].map((a, i, arr) => (
          <div key={i} style={{
            padding: '16px 20px',
            borderBottom: i < arr.length - 1 ? `1px solid ${LIGHT}` : 'none',
            display: 'grid',
            gridTemplateColumns: '8px 1fr auto',
            gap: '14px',
            alignItems: 'center',
          }}>
            <span style={{ width: '8px', height: '40px', background: a.risk === 'high' ? '#ef4444' : '#f97316', borderRadius: '4px' }} />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700 }}>{a.name}</div>
              <div style={{ fontSize: '11px', color: GRAY, marginTop: '2px' }}>{a.sport} · {a.joint}</div>
            </div>
            <span style={{
              fontSize: '9px',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '50px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              background: a.risk === 'high' ? 'rgba(239,68,68,0.1)' : 'rgba(249,115,22,0.1)',
              color: a.risk === 'high' ? '#ef4444' : '#f97316',
            }}>
              {a.risk}
            </span>
          </div>
        ))}
      </StravaCard>
    </div>
  )
}

function ComplianceReport() {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
        <BigStat label="Drill Adherence" value="76%" accent />
        <BigStat label="Session Consistency" value="84%" />
        <BigStat label="Engagement" value="92%" />
      </div>

      <StravaCard title="Compliance by Athlete" padding="0">
        {[
          { name: 'Aryan Kapoor', drills: 90, sessions: 100 },
          { name: 'Priya Singh', drills: 80, sessions: 92 },
          { name: 'Zara Khan', drills: 85, sessions: 95 },
          { name: 'Karan Sharma', drills: 60, sessions: 70 },
          { name: 'Rohan Patel', drills: 50, sessions: 65 },
        ].map((a, i, arr) => (
          <div key={i} style={{
            padding: '14px 20px',
            borderBottom: i < arr.length - 1 ? `1px solid ${LIGHT}` : 'none',
            display: 'grid',
            gridTemplateColumns: '2fr 2fr 2fr',
            gap: '20px',
            alignItems: 'center',
          }}>
            <div style={{ fontSize: '13px', fontWeight: 700 }}>{a.name}</div>
            <ProgressBar label="Drills" value={a.drills} />
            <ProgressBar label="Sessions" value={a.sessions} />
          </div>
        ))}
      </StravaCard>
    </div>
  )
}

function ProgressBar({ label, value }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
        <span style={{ color: GRAY }}>{label}</span>
        <span style={{ fontWeight: 700 }}>{value}%</span>
      </div>
      <div style={{ height: '4px', background: LIGHT, borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value}%`, background: value >= 80 ? ORANGE : value >= 60 ? '#f97316' : '#ef4444' }} />
      </div>
    </div>
  )
}

function BigStat({ label, value, unit, accent, danger, change }) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${danger ? '#ef4444' : BORDER}`, borderRadius: '4px', padding: '20px' }}>
      <div style={{ fontSize: '11px', fontWeight: 700, color: GRAY, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
        {label}
      </div>
      <div style={{ fontSize: '28px', fontWeight: 800, color: danger ? '#ef4444' : accent ? ORANGE : DARK, lineHeight: 1 }}>
        {value}
        {unit && <span style={{ fontSize: '12px', fontWeight: 500, color: GRAY, marginLeft: '6px' }}>{unit}</span>}
      </div>
      {change && (
        <div style={{ fontSize: '11px', color: '#22c55e', fontWeight: 700, marginTop: '6px' }}>↑ {change}</div>
      )}
    </div>
  )
}
