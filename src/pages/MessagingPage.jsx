import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useUser } from '../context/UserContext'
import { StravaLayout, PageHeader, ORANGE, DARK, GRAY, LIGHT, BORDER } from '../components/StravaLayout'
import { api, safeQuery } from '../lib/api'

function timeAgo(iso) {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'now'
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  return `${Math.floor(h / 24)}d`
}

function fmtTime(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function MessagingPage() {
  const { user, isCoach } = useUser()
  const navigate = useNavigate()
  const [threads, setThreads] = useState([])
  const [activeThread, setActiveThread] = useState(null)
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const userId = user?.userId || user?.id || ''

  useEffect(() => {
    if (!user) { navigate({ to: '/login' }); return }
    loadThreads()
  }, [user])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function loadThreads() {
    setLoading(true)
    if (isCoach) {
      const data = await safeQuery(() => api.get(`/coach/${userId}/messages`), null)
      const list = data?.threads || []
      setThreads(list)
      if (list.length > 0 && !activeThread) {
        selectThread(list[0])
      }
    } else {
      // Athlete: show broadcasts from coaches
      const data = await safeQuery(() => api.get(`/inbox/athlete/${userId}`), null)
      const broadcasts = (data?.broadcasts || []).map(b => ({
        athlete_id: b.coach_id || 'coach',
        athlete_name: b.coach_name || 'Coach',
        last_msg_preview: b.message || b.text || '',
        last_msg_at: b.created_at || b.sent_at,
        msg_count: 1,
        _broadcast: b,
      }))
      setThreads(broadcasts)
      if (broadcasts.length > 0 && !activeThread) selectThread(broadcasts[0])
    }
    setLoading(false)
  }

  async function selectThread(thread) {
    setActiveThread(thread)
    setMessages([])
    if (!isCoach) {
      // For athletes show the broadcast body as a single message
      if (thread._broadcast) {
        setMessages([{
          id: thread._broadcast.id || '1',
          sender: 'them',
          text: thread._broadcast.message || thread._broadcast.text || '',
          sent_at: thread._broadcast.created_at || thread._broadcast.sent_at,
        }])
      }
      return
    }
    const data = await safeQuery(
      () => api.get(`/messages/${userId}/${thread.athlete_id}`),
      null,
    )
    setMessages(data?.msgs || [])
  }

  async function sendMessage() {
    if (!draft.trim() || !activeThread || !isCoach || sending) return
    setSending(true)
    const body = { sender: 'coach', text: draft.trim() }
    const result = await safeQuery(
      () => api.post(`/messages/${userId}/${activeThread.athlete_id}`, body),
      null,
    )
    if (result) {
      setMessages(prev => [...prev, result])
      setDraft('')
      // Update thread preview
      setThreads(prev => prev.map(t =>
        t.athlete_id === activeThread.athlete_id
          ? { ...t, last_msg_preview: draft.trim(), last_msg_at: new Date().toISOString() }
          : t,
      ))
    }
    setSending(false)
    inputRef.current?.focus()
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  if (!user) return null

  const displayName = String(user?.userId || user?.email || 'User')

  return (
    <StravaLayout displayName={displayName} role={isCoach ? 'coach' : 'athlete'}>
      <PageHeader
        eyebrow="Messages"
        title="Conversations"
        description={isCoach
          ? 'Send feedback and coaching notes directly to athletes.'
          : 'Messages from your coach.'}
      />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '300px 1fr',
          gap: '0',
          background: '#fff',
          border: `1px solid ${BORDER}`,
          borderRadius: '4px',
          overflow: 'hidden',
          minHeight: '600px',
        }}>

          {/* ── Thread list ── */}
          <aside style={{ borderRight: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '14px 16px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: GRAY, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {loading ? 'Loading…' : `${threads.length} conversation${threads.length !== 1 ? 's' : ''}`}
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {!loading && threads.length === 0 && (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: GRAY, fontSize: '13px' }}>
                  No conversations yet.
                  {isCoach && <div style={{ marginTop: '8px', fontSize: '12px' }}>Go to the Athlete page to start a thread.</div>}
                </div>
              )}
              {threads.map((t, i) => (
                <button
                  key={t.athlete_id + i}
                  onClick={() => selectThread(t)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    gap: '12px',
                    padding: '14px 16px',
                    border: 'none',
                    borderBottom: `1px solid ${LIGHT}`,
                    background: activeThread?.athlete_id === t.athlete_id ? LIGHT : '#fff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    alignItems: 'center',
                    borderLeft: activeThread?.athlete_id === t.athlete_id ? `3px solid ${ORANGE}` : '3px solid transparent',
                  }}
                >
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '50%', background: ORANGE,
                    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '14px', fontWeight: 800, flexShrink: 0,
                  }}>
                    {String(t.athlete_name || 'A').charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: DARK }}>{t.athlete_name}</span>
                      <span style={{ fontSize: '10px', color: GRAY, flexShrink: 0 }}>{timeAgo(t.last_msg_at)}</span>
                    </div>
                    <div style={{
                      fontSize: '11px', color: GRAY, marginTop: '3px',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {t.last_msg_preview || 'No messages yet'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          {/* ── Chat window ── */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {activeThread ? (
              <>
                {/* Header */}
                <div style={{
                  padding: '14px 20px', borderBottom: `1px solid ${BORDER}`,
                  display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0,
                }}>
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '50%', background: ORANGE,
                    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '14px', fontWeight: 800,
                  }}>
                    {String(activeThread.athlete_name || 'A').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700 }}>{activeThread.athlete_name}</div>
                    <div style={{ fontSize: '11px', color: GRAY }}>{activeThread.msg_count || 0} messages</div>
                  </div>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, padding: '20px', overflowY: 'auto', background: LIGHT, minHeight: '400px' }}>
                  {messages.length === 0 && (
                    <div style={{ textAlign: 'center', color: GRAY, fontSize: '13px', marginTop: '40px' }}>
                      No messages in this thread yet.
                    </div>
                  )}
                  {messages.map((m) => {
                    const isMe = m.sender === 'coach'
                    return (
                      <div key={m.id} style={{
                        display: 'flex',
                        justifyContent: isMe ? 'flex-end' : 'flex-start',
                        marginBottom: '12px',
                      }}>
                        <div style={{
                          maxWidth: '70%', padding: '10px 14px',
                          background: isMe ? ORANGE : '#fff',
                          color: isMe ? '#fff' : DARK,
                          borderRadius: '12px', fontSize: '13px', lineHeight: '1.5',
                          border: isMe ? 'none' : `1px solid ${BORDER}`,
                        }}>
                          {m.text}
                          <div style={{ fontSize: '10px', marginTop: '4px', opacity: 0.6 }}>
                            {fmtTime(m.sent_at)}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input — coaches only */}
                {isCoach && (
                  <div style={{ padding: '14px 20px', borderTop: `1px solid ${BORDER}`, display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <input
                      ref={inputRef}
                      type="text"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={onKeyDown}
                      placeholder="Type a message… (Enter to send)"
                      style={{
                        flex: 1, padding: '12px 16px', border: `1px solid ${BORDER}`,
                        borderRadius: '4px', fontSize: '13px', outline: 'none',
                      }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = ORANGE }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = BORDER }}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!draft.trim() || sending}
                      style={{
                        padding: '12px 24px', background: draft.trim() ? ORANGE : GRAY,
                        color: '#fff', border: 'none', borderRadius: '4px',
                        fontSize: '12px', fontWeight: 700, cursor: draft.trim() ? 'pointer' : 'default',
                        textTransform: 'uppercase', letterSpacing: '0.5px', transition: 'background 0.15s',
                      }}
                    >
                      {sending ? '…' : 'Send'}
                    </button>
                  </div>
                )}

                {!isCoach && (
                  <div style={{ padding: '14px 20px', borderTop: `1px solid ${BORDER}`, background: LIGHT }}>
                    <div style={{ fontSize: '12px', color: GRAY, textAlign: 'center' }}>
                      Replies go through your coach's app. Sessions are the fastest way to get feedback.
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: GRAY, fontSize: '14px' }}>
                {loading ? 'Loading conversations…' : 'Select a conversation'}
              </div>
            )}
          </div>
        </div>
      </div>
    </StravaLayout>
  )
}
