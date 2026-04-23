// Tiny app-wide toast system. No external deps. Mount <Toaster /> once
// near the root and call toast.success(...) / toast.error(...) / toast.info(...)
// from anywhere. Auto-dismisses after 4s by default.

import React, { useEffect, useState } from 'react'

const _listeners = new Set()
let _seq = 0

function _emit(toast) {
  _listeners.forEach((cb) => { try { cb(toast) } catch {} })
}

export const toast = {
  success(message, opts = {}) { _emit({ id: ++_seq, kind: 'success', message, ttlMs: opts.ttlMs ?? 4000 }) },
  error(message, opts = {})   { _emit({ id: ++_seq, kind: 'error',   message, ttlMs: opts.ttlMs ?? 5000 }) },
  info(message, opts = {})    { _emit({ id: ++_seq, kind: 'info',    message, ttlMs: opts.ttlMs ?? 4000 }) },
  warn(message, opts = {})    { _emit({ id: ++_seq, kind: 'warn',    message, ttlMs: opts.ttlMs ?? 4500 }) },
}

export function Toaster() {
  const [items, setItems] = useState([])

  useEffect(() => {
    const onToast = (t) => {
      setItems((prev) => [...prev, t])
      if (t.ttlMs > 0) {
        setTimeout(() => {
          setItems((prev) => prev.filter((x) => x.id !== t.id))
        }, t.ttlMs)
      }
    }
    _listeners.add(onToast)
    return () => { _listeners.delete(onToast) }
  }, [])

  if (!items.length) return null
  return (
    <div className="toaster" role="status" aria-live="polite">
      {items.map((t) => (
        <div
          key={t.id}
          className={`toast toast-${t.kind}`}
          onClick={() => setItems((prev) => prev.filter((x) => x.id !== t.id))}
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}
