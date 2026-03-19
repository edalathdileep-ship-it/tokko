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
        <div className="w-16 h-16 rounded-2xl bg-accent-red/10 border border-accent-red/20 flex items-center justify-center mx-auto mb-6 text-2xl">
          ⚠️
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
