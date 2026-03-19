'use client'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Tokko error boundary]', error)
  }, [error])

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-accent-red/10 border border-accent-red/20 flex items-center justify-center mx-auto mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </div>
        <h2 className="font-grotesk font-bold text-[1.6rem] tracking-tight mb-2">
          Something went wrong
        </h2>
        <p className="font-sans text-[0.9rem] text-text-muted mb-8 leading-relaxed">
          An unexpected error occurred. This has been logged and we&apos;ll look into it.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="font-grotesk font-medium text-[0.88rem] bg-accent text-black px-6 py-2.5 rounded-xl hover:bg-accent-hover transition-colors"
          >
            Try again
          </button>
          <a
            href="/"
            className="font-grotesk font-medium text-[0.88rem] border border-border text-text-muted px-6 py-2.5 rounded-xl hover:text-text hover:border-border/80 transition-colors"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  )
}
