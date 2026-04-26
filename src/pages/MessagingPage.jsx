import React, { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useUser } from '../context/UserContext'
import { StravaLayout, PageHeader, ORANGE, DARK, GRAY, LIGHT, BORDER } from '../components/StravaLayout'

export function MessagingPage() {
  const { user, isCoach } = useUser()
  const navigate = useNavigate()
  const [activeChat, setActiveChat] = useState(0)
  const [draft, setDraft] = useState('')

  if (!user) {
    navigate({ to: '/login' })
    return null
  }

  const conversations = [
    { id: 1, name: 'Aryan Kapoor', lastMessage: 'Form score on the squat — what to focus on?', time: '2h', unread: 2, online: true },
    { id: 2, name: 'Priya Singh', lastMessage: 'Coach, I had a great session today!', time: '5h', unread: 0, online: true },
    { id: 3, name: 'Rohan Patel', lastMessage: 'Skipping today, knee feels off', time: '1d', unread: 0, online: false },
    { id: 4, name: 'Zara Khan', lastMessage: 'Sent voice note', time: '2d', unread: 0, online: false },
  ]

  const messages = [
    { id: 1, sender: 'them', text: 'Hi coach, did you see my squat form yesterday?', time: '10:32 AM' },
    { id: 2, sender: 'me', text: 'Yes — knee tracking improved a lot. Form score 82!', time: '10:35 AM' },
    { id: 3, sender: 'them', text: 'What should I focus on next?', time: '10:36 AM' },
    { id: 4, sender: 'me', text: 'Hip mobility. I assigned the deadlift hinge drill — try 3 sets today.', time: '10:38 AM' },
  ]

  const displayName = String(user?.userId || user?.email || 'User')

  return (
    <StravaLayout displayName={displayName} role={isCoach ? 'coach' : 'athlete'}>
      <PageHeader
        eyebrow="Messages"
        title="Conversations"
        description="Send feedback, voice notes, or assign drills directly to athletes."
      />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          gap: '0',
          background: '#fff',
          border: `1px solid ${BORDER}`,
          borderRadius: '4px',
          overflow: 'hidden',
          minHeight: '600px',
        }}>
          {/* Conversation list */}
          <aside style={{ borderRight: `1px solid ${BORDER}` }}>
            <div style={{ padding: '16px', borderBottom: `1px solid ${BORDER}` }}>
              <input
                type="text"
                placeholder="Search conversations..."
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: `1px solid ${BORDER}`,
                  borderRadius: '4px',
                  fontSize: '12px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            {conversations.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setActiveChat(i)}
                style={{
                  width: '100%',
                  display: 'flex',
                  gap: '12px',
                  padding: '14px 16px',
                  border: 'none',
                  borderBottom: `1px solid ${LIGHT}`,
                  background: activeChat === i ? LIGHT : '#fff',
                  cursor: 'pointer',
                  textAlign: 'left',
                  alignItems: 'center',
                  borderLeft: activeChat === i ? `3px solid ${ORANGE}` : '3px solid transparent',
                }}
              >
                <div style={{ position: 'relative' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: ORANGE,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 800,
                  }}>
                    {String(c.name || 'A').charAt(0).toUpperCase()}
                  </div>
                  {c.online && (
                    <span style={{
                      position: 'absolute',
                      bottom: '0',
                      right: '0',
                      width: '10px',
                      height: '10px',
                      background: '#22c55e',
                      borderRadius: '50%',
                      border: '2px solid #fff',
                    }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: DARK }}>{c.name}</span>
                    <span style={{ fontSize: '10px', color: GRAY }}>{c.time}</span>
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: c.unread > 0 ? DARK : GRAY,
                    fontWeight: c.unread > 0 ? 600 : 400,
                    marginTop: '2px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {c.lastMessage}
                  </div>
                </div>
                {c.unread > 0 && (
                  <span style={{
                    background: ORANGE,
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: '50px',
                  }}>
                    {c.unread}
                  </span>
                )}
              </button>
            ))}
          </aside>

          {/* Chat window */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Chat header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: `1px solid ${BORDER}`,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: ORANGE,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 800,
              }}>
                {String(conversations[activeChat]?.name || 'A').charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '15px', fontWeight: 700 }}>
                  {conversations[activeChat]?.name}
                </div>
                <div style={{ fontSize: '11px', color: '#22c55e', fontWeight: 600 }}>
                  {conversations[activeChat]?.online ? '● Online' : 'Offline'}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', background: LIGHT, minHeight: '400px' }}>
              {messages.map((m) => (
                <div key={m.id} style={{
                  display: 'flex',
                  justifyContent: m.sender === 'me' ? 'flex-end' : 'flex-start',
                  marginBottom: '12px',
                }}>
                  <div style={{
                    maxWidth: '70%',
                    padding: '10px 14px',
                    background: m.sender === 'me' ? ORANGE : '#fff',
                    color: m.sender === 'me' ? '#fff' : DARK,
                    borderRadius: '12px',
                    fontSize: '13px',
                    border: m.sender === 'me' ? 'none' : `1px solid ${BORDER}`,
                  }}>
                    {m.text}
                    <div style={{
                      fontSize: '10px',
                      marginTop: '4px',
                      opacity: 0.6,
                    }}>
                      {m.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message input */}
            <div style={{ padding: '16px 20px', borderTop: `1px solid ${BORDER}`, display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: `1px solid ${BORDER}`,
                  borderRadius: '4px',
                  fontSize: '13px',
                  outline: 'none',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = ORANGE}
                onBlur={(e) => e.currentTarget.style.borderColor = BORDER}
              />
              <button title="Voice note" style={{
                padding: '12px 14px',
                background: '#fff',
                border: `1px solid ${BORDER}`,
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
              }}>
                🎤
              </button>
              <button
                onClick={() => setDraft('')}
                style={{
                  padding: '12px 24px',
                  background: ORANGE,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </StravaLayout>
  )
}
