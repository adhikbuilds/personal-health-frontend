import { useEffect, useRef, useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { api, safeQuery, API_BASE } from '../lib/api'
import {
  DataList,
  LoadingBlock,
  PageIntro,
  Panel,
  Pill,
  StatCard,
  StatGrid,
} from '../components/Primitives'

/**
 * ComposePage — web-side voice-note + text broadcast surface for coaches.
 *
 * From TRAINER-FIRST-PROMPT.md Flow 2 + Flow 6:
 *   "Voice-note to athlete: 30-second record, tap send, athlete sees it next
 *    session. Huddle broadcast + private replies: coach voice-note to huddle;
 *    athletes reply privately; coach inbox shows 8 replies by athlete."
 *
 * This page doesn't replace the (not-yet-built) Android trainer app, but lets
 * a coach working from a laptop or phone browser compose + send today.
 *
 * Backend endpoints wired:
 *   GET  /coach/{id}/athletes           — list roster for recipient picker
 *   POST /voice-note/upload             — multipart audio upload, returns URL
 *   POST /coach/{id}/broadcast          — send voice/text with athlete_ids[]
 *
 * Recording uses MediaRecorder (browser-native, no library). Webm/opus on
 * Chrome/Edge, mp4/aac on Safari — the backend accepts both. 30-second cap
 * is enforced client-side for copy-discipline ("if it takes >30s, text it").
 */
const MAX_RECORD_MS = 30_000

export function ComposePage() {
  const [coachId, setCoachId] = useState(
    () => localStorage.getItem('ph_coach_id') || 'athlete_01',
  )
  const [text, setText] = useState('')
  const [selected, setSelected] = useState(new Set())
  const [error, setError] = useState(null)
  const [uploadedVoice, setUploadedVoice] = useState(null) // { url, duration_ms }

  const rosterQuery = useQuery({
    queryKey: ['compose-roster', coachId],
    queryFn: () =>
      safeQuery(
        () => api.get(`/coach/${encodeURIComponent(coachId)}/athletes`),
        { athletes: [], count: 0 },
      ),
    enabled: Boolean(coachId),
  })
  const roster = rosterQuery.data?.athletes || []

  const historyQuery = useQuery({
    queryKey: ['compose-history', coachId],
    queryFn: () =>
      safeQuery(
        () => api.get(`/coach/${encodeURIComponent(coachId)}/inbox`),
        { broadcasts: [], total: 0 },
      ),
    enabled: Boolean(coachId),
    refetchInterval: 30_000,
  })

  const broadcast = useMutation({
    mutationFn: async () => {
      if (!text && !uploadedVoice?.url) {
        throw new Error('record a voice note or type a message first')
      }
      const athlete_ids = Array.from(selected)
      const body = {
        message: text || undefined,
        voice_note_url: uploadedVoice?.url || undefined,
        athlete_ids: athlete_ids.length ? athlete_ids : undefined,
      }
      return api.post(`/coach/${encodeURIComponent(coachId)}/broadcast`, body)
    },
    onSuccess: () => {
      setText('')
      setUploadedVoice(null)
      setSelected(new Set())
      historyQuery.refetch()
    },
    onError: (e) => setError(e.message || 'broadcast failed'),
  })

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const allChecked = roster.length > 0 && selected.size === roster.length
  const selectedLabel = selected.size === 0 ? 'entire roster' : `${selected.size} selected`

  return (
    <>
      <PageIntro
        eyebrow="Compose"
        title="Voice note or text to your athletes."
        description="30 seconds or less. Record once, send to the whole roster or a subset. If it needs more than 30 seconds, type it. Replies land in your inbox."
        actions={<Pill tone="brand">Trainer-first · WhatsApp-voice vibe</Pill>}
      />

      <StatGrid>
        <StatCard label="Roster size" value={roster.length} hint="Athletes under your coaching" />
        <StatCard
          label="Sending to"
          value={selected.size || roster.length}
          hint={selectedLabel}
          tone={selected.size ? 'brand' : 'default'}
        />
        <StatCard
          label="Voice ready"
          value={uploadedVoice ? 'Yes' : 'No'}
          hint={uploadedVoice ? `${Math.round(uploadedVoice.duration_ms / 1000)}s` : '—'}
          tone={uploadedVoice ? 'success' : 'default'}
        />
        <StatCard
          label="Recent broadcasts"
          value={historyQuery.data?.total ?? (historyQuery.data?.broadcasts?.length || 0)}
          hint="Last 10 shown below"
        />
      </StatGrid>

      <Panel title="Coach" kicker="Whose roster">
        <div className="filter-row">
          <label>
            <span>Coach ID</span>
            <input
              type="text"
              value={coachId}
              onChange={(e) => {
                setCoachId(e.target.value)
                localStorage.setItem('ph_coach_id', e.target.value)
              }}
              placeholder="athlete_01"
            />
          </label>
          <small className="muted">
            Once auth ships, this is the signed-in coach automatically.
          </small>
        </div>
      </Panel>

      <div className="content-grid">
        <Panel title="Voice note" kicker="Max 30s" right={<Pill tone="neutral">Hold to record</Pill>}>
          <VoiceRecorder
            maxMs={MAX_RECORD_MS}
            onUploaded={(info) => {
              setUploadedVoice(info)
              setError(null)
            }}
            onError={(e) => setError(e)}
            currentUrl={uploadedVoice?.url}
          />
          {uploadedVoice?.url ? (
            <div className="muted-footer">
              Ready to send: {Math.round(uploadedVoice.duration_ms / 1000)}s note.
              <button
                type="button"
                className="pill tone-neutral"
                style={{ marginLeft: 8 }}
                onClick={() => setUploadedVoice(null)}
              >
                Discard
              </button>
            </div>
          ) : null}
        </Panel>

        <Panel title="Text message" kicker="Optional">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a short note. A voice note does more work in less time — use text only when the athlete needs to read it back later (drill instructions, schedule changes)."
            rows={5}
            maxLength={600}
            className="compose-textarea"
          />
          <small className="muted">{text.length}/600 — less is more. Voice first.</small>
        </Panel>
      </div>

      <Panel
        title="Recipients"
        kicker="Select subset (empty = entire roster)"
        right={
          <button
            type="button"
            className="pill tone-neutral"
            onClick={() => setSelected(allChecked ? new Set() : new Set(roster.map((a) => a.id)))}
          >
            {allChecked ? 'Clear all' : 'Select all'}
          </button>
        }
      >
        {rosterQuery.isLoading ? (
          <LoadingBlock />
        ) : roster.length === 0 ? (
          <div className="empty-block">Your roster is empty. Add athletes first.</div>
        ) : (
          <div className="recipient-grid">
            {roster.map((a) => {
              const checked = selected.has(a.id)
              return (
                <button
                  key={a.id}
                  type="button"
                  className={`recipient-chip ${checked ? 'on' : ''}`}
                  onClick={() => toggle(a.id)}
                >
                  <strong>{a.name || a.id}</strong>
                  <span>{a.sport || '—'}</span>
                </button>
              )
            })}
          </div>
        )}
      </Panel>

      <Panel
        title="Send"
        kicker="Review and fire"
        right={
          <button
            type="button"
            className="pill tone-brand"
            onClick={() => broadcast.mutate()}
            disabled={broadcast.isPending || (!text && !uploadedVoice?.url)}
          >
            {broadcast.isPending ? 'Sending…' : `Send to ${selectedLabel}`}
          </button>
        }
      >
        {error ? <div className="empty-block danger">{error}</div> : null}
        {broadcast.isSuccess ? (
          <div className="empty-block success">Broadcast sent. Replies will land in the inbox below.</div>
        ) : null}
        <small className="muted">
          If a voice note is attached, text is shown under it as a caption. Athletes cannot
          reply publicly — only private 1:1 back to you.
        </small>
      </Panel>

      <Panel title="Recent broadcasts" kicker="Your outbox + inbox">
        {historyQuery.isLoading ? (
          <LoadingBlock />
        ) : (
          <DataList
            items={(historyQuery.data?.broadcasts || []).slice(0, 10)}
            empty="No broadcasts sent yet. Record one above to start the trainer-first loop."
            renderItem={(b) => <BroadcastRow key={b.broadcast_id} b={b} />}
          />
        )}
      </Panel>
    </>
  )
}

function VoiceRecorder({ maxMs, onUploaded, onError, currentUrl }) {
  const [state, setState] = useState('idle') // 'idle' | 'recording' | 'uploading'
  const [ms, setMs] = useState(0)
  const recorderRef = useRef(null)
  const chunksRef = useRef([])
  const startedAtRef = useRef(0)
  const tickerRef = useRef(null)

  useEffect(() => () => clearInterval(tickerRef.current), [])

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      recorderRef.current = mr
      chunksRef.current = []
      mr.ondataavailable = (e) => {
        if (e.data && e.data.size) chunksRef.current.push(e.data)
      }
      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop())
        clearInterval(tickerRef.current)
        const blob = new Blob(chunksRef.current, { type: mr.mimeType || 'audio/webm' })
        const duration_ms = Date.now() - startedAtRef.current
        setState('uploading')
        try {
          const form = new FormData()
          form.append('file', blob, `voice-note.${(mr.mimeType || '').includes('mp4') ? 'm4a' : 'webm'}`)
          const resp = await fetch(`${API_BASE}/voice-note/upload`, { method: 'POST', body: form })
          if (!resp.ok) throw new Error(`upload failed: ${resp.status}`)
          const json = await resp.json()
          onUploaded({ url: json.url || json.voice_url, duration_ms })
        } catch (e) {
          onError(e.message || 'upload failed')
        } finally {
          setState('idle')
          setMs(0)
        }
      }
      mr.start(250)
      startedAtRef.current = Date.now()
      setState('recording')
      tickerRef.current = setInterval(() => {
        const elapsed = Date.now() - startedAtRef.current
        setMs(elapsed)
        if (elapsed >= maxMs && mr.state === 'recording') mr.stop()
      }, 100)
    } catch (e) {
      onError(e.message || 'mic permission denied')
    }
  }

  const stop = () => {
    const mr = recorderRef.current
    if (mr && mr.state === 'recording') mr.stop()
  }

  const seconds = Math.floor(ms / 1000)
  const remaining = Math.max(0, Math.ceil((maxMs - ms) / 1000))
  const progress = Math.min(100, (ms / maxMs) * 100)

  return (
    <div className="recorder">
      <div className="recorder-row">
        {state === 'recording' ? (
          <button type="button" className="record-btn recording" onClick={stop}>
            <span className="rec-dot" /> Stop · {seconds}s
          </button>
        ) : state === 'uploading' ? (
          <button type="button" className="record-btn" disabled>
            Uploading…
          </button>
        ) : (
          <button type="button" className="record-btn" onClick={start}>
            {currentUrl ? 'Record again' : 'Record'}
          </button>
        )}
        <span className="muted">
          {state === 'recording' ? `${remaining}s left` : 'Max 30 seconds'}
        </span>
      </div>
      <div className="progress-shell">
        <div
          className="progress-bar"
          style={{
            width: `${progress}%`,
            background: progress > 80 ? 'var(--warm)' : 'var(--brand)',
          }}
        />
      </div>
      {currentUrl ? (
        <audio src={API_BASE + currentUrl.replace(/^\/api/, '')} controls preload="metadata" />
      ) : null}
    </div>
  )
}

function BroadcastRow({ b }) {
  const targets = b.athlete_ids || b.recipients || []
  const replies = b.reply_count ?? b.replies?.length ?? 0
  return (
    <div className="list-row static">
      <div>
        <strong>
          {b.voice_note_url ? '🔊 ' : ''}
          {truncate(b.message || 'voice note', 80)}
        </strong>
        <span>
          {targets.length ? `${targets.length} athletes` : 'entire roster'} ·{' '}
          {timeAgo(b.created_at || b.sent_at)}
        </span>
      </div>
      <em>{replies} repl{replies === 1 ? 'y' : 'ies'}</em>
    </div>
  )
}

function truncate(s, n) {
  if (!s) return ''
  return s.length > n ? s.slice(0, n - 1) + '…' : s
}

function timeAgo(iso) {
  if (!iso) return ''
  try {
    const diff = Date.now() - new Date(iso).getTime()
    const m = Math.round(diff / 60_000)
    if (m < 1) return 'just now'
    if (m < 60) return `${m}m ago`
    const h = Math.round(m / 60)
    if (h < 24) return `${h}h ago`
    const d = Math.round(h / 24)
    return `${d}d ago`
  } catch {
    return ''
  }
}
