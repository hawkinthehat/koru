import { useCallback, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'koru.sessionLedger.v1'

function canUseLocalStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function normalizeEntries(value) {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((entry, index) => {
      if (typeof entry === 'string') {
        return {
          id: `${entry}-${index}`,
          type: 'grounding',
          timestamp: entry,
        }
      }

      if (!entry || typeof entry !== 'object' || typeof entry.timestamp !== 'string') {
        return null
      }

      return {
        id: typeof entry.id === 'string' ? entry.id : `${entry.timestamp}-${index}`,
        type: typeof entry.type === 'string' ? entry.type : 'grounding',
        timestamp: entry.timestamp,
      }
    })
    .filter((entry) => entry && !Number.isNaN(Date.parse(entry.timestamp)))
    .sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp))
}

function readSessionEntries() {
  if (!canUseLocalStorage()) {
    return []
  }

  try {
    return normalizeEntries(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]'))
  } catch {
    return []
  }
}

function writeSessionEntries(entries) {
  if (!canUseLocalStorage()) {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

function createEntry(type) {
  const timestamp = new Date().toISOString()
  const id =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${timestamp}-${Math.random().toString(36).slice(2)}`

  return {
    id,
    type,
    timestamp,
  }
}

function formatTimestamp(timestamp) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(timestamp))
}

export function useSessionLedger() {
  const [entries, setEntries] = useState(readSessionEntries)

  useEffect(() => {
    if (!canUseLocalStorage()) {
      return undefined
    }

    const handleStorage = (event) => {
      if (event.key === STORAGE_KEY) {
        setEntries(readSessionEntries())
      }
    }

    window.addEventListener('storage', handleStorage)

    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const recordSession = useCallback((type = 'grounding') => {
    setEntries((currentEntries) => {
      const nextEntries = [...currentEntries, createEntry(type)]
      writeSessionEntries(nextEntries)
      return nextEntries
    })
  }, [])

  return {
    entries,
    recordSession,
  }
}

export function SessionLedger({ entries }) {
  const completionCount = entries.length
  const visibleNotches = useMemo(() => {
    return entries.slice(-60).map((entry, index) => ({
      id: entry.id,
      angle: (index % 6) - 2.5,
      depth: index % 3,
    }))
  }, [entries])
  const lastEntry = entries.at(-1)

  return (
    <section className="session-ledger" aria-label="Grounding evidence history">
      <div className="session-ledger__copy">
        <p className="session-ledger__kicker">Evidence gathered</p>
        <h2>
          {completionCount}
          <span>{completionCount === 1 ? ' grounding moment' : ' grounding moments'}</span>
        </h2>
        <p>
          These marks are not a score. Each one is proof that you have returned
          to your body and can do it again.
        </p>
      </div>

      <div
        className="session-ledger__cedar"
        aria-label={`${completionCount} completed grounding sessions`}
      >
        {completionCount === 0 ? (
          <p className="session-ledger__empty">
            Your first completed cycle will leave a quiet notch here.
          </p>
        ) : (
          <div className="session-ledger__notches" aria-hidden="true">
            {visibleNotches.map((notch) => (
              <span
                key={notch.id}
                className={`session-ledger__notch session-ledger__notch--depth-${notch.depth}`}
                style={{ '--notch-angle': `${notch.angle}deg` }}
              />
            ))}
          </div>
        )}
      </div>

      <p className="session-ledger__meta">
        {lastEntry
          ? `Most recent evidence: ${formatTimestamp(lastEntry.timestamp)}`
          : 'Complete a breathing cycle to begin your evidence trail.'}
      </p>
    </section>
  )
}
