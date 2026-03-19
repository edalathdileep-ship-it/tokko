import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="font-grotesk font-bold text-[5rem] tracking-tighter text-accent/20 mb-2">
          404
        </div>
        <h2 className="font-grotesk font-bold text-[1.6rem] tracking-tight mb-2">
          Page not found
        </h2>
        <p className="font-sans text-[0.9rem] text-text-muted mb-8 leading-relaxed">
          This page doesn&apos;t exist or may have been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="font-grotesk font-medium text-[0.88rem] bg-accent text-black px-6 py-2.5 rounded-xl hover:bg-accent-hover transition-colors"
          >
            Go home
          </Link>
          <Link
            href="/dashboard"
            className="font-grotesk font-medium text-[0.88rem] border border-border text-text-muted px-6 py-2.5 rounded-xl hover:text-text hover:border-border/80 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
