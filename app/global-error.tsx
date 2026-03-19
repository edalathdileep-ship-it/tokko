'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: '#0a0a0f', color: '#e8e8f0', margin: 0 }}>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}>
          <div style={{ maxWidth: '28rem', width: '100%', textAlign: 'center' }}>
            <div style={{
              width: '4rem', height: '4rem', borderRadius: '1rem',
              backgroundColor: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem', fontSize: '1.5rem',
            }}>
              ⚠️
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
              Something went wrong
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#6b6b85', marginBottom: '2rem', lineHeight: 1.6 }}>
              A critical error occurred. Please try refreshing the page.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                onClick={reset}
                style={{
                  backgroundColor: '#00e5a0', color: '#000', border: 'none',
                  padding: '0.625rem 1.5rem', borderRadius: '0.75rem',
                  fontWeight: 500, fontSize: '0.88rem', cursor: 'pointer',
                }}
              >
                Try again
              </button>
              <a
                href="/"
                style={{
                  border: '1px solid #2a2a3a', color: '#6b6b85',
                  padding: '0.625rem 1.5rem', borderRadius: '0.75rem',
                  fontWeight: 500, fontSize: '0.88rem', textDecoration: 'none',
                }}
              >
                Go home
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
