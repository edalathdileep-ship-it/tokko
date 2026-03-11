import { cn } from '@/lib/utils'

// ── Chip ──────────────────────────────────────────────────
type ChipVariant = 'green' | 'red' | 'purple' | 'orange' | 'muted'

const chipStyles: Record<ChipVariant, string> = {
  green:  'bg-accent/10 text-accent border border-accent/25',
  red:    'bg-accent-red/10 text-accent-red border border-accent-red/25',
  purple: 'bg-accent-purple/12 text-accent-purple border border-accent-purple/25',
  orange: 'bg-accent-orange/10 text-accent-orange border border-accent-orange/25',
  muted:  'bg-bg-s2 text-text-muted border border-border',
}

export function Chip({ children, variant = 'green', className }: {
  children: React.ReactNode
  variant?: ChipVariant
  className?: string
}) {
  return (
    <span className={cn(
      'inline-block font-mono text-[0.72rem] font-medium px-[10px] py-[4px] rounded-sm',
      chipStyles[variant],
      className
    )}>
      {children}
    </span>
  )
}

// ── Badge ─────────────────────────────────────────────────
type BadgeVariant = 'pro' | 'free' | 'new' | 'teams'

export function Badge({ variant }: { variant: BadgeVariant }) {
  return (
    <span className={cn(
      'inline-block font-mono text-[0.6rem] font-bold px-[10px] py-[3px] rounded-full tracking-[0.06em]',
      variant === 'pro'   && 'bg-gradient-to-r from-accent-purple to-accent text-black',
      variant === 'free'  && 'bg-bg-s2 text-text-muted border border-border',
      variant === 'new'   && 'bg-accent/10 text-accent border border-accent/25',
      variant === 'teams' && 'bg-accent-purple/12 text-accent-purple border border-accent-purple/25',
    )}>
      {variant.toUpperCase()}
    </span>
  )
}

// ── Eyebrow ───────────────────────────────────────────────
export function Eyebrow({ children, className }: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex items-center gap-[10px] font-mono text-[0.68rem] font-bold tracking-[0.14em] uppercase text-accent', className)}>
      <span className="w-[24px] h-px bg-accent flex-shrink-0" />
      {children}
    </div>
  )
}

// ── KickerPill ────────────────────────────────────────────
export function KickerPill({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 bg-accent/7 border border-accent/18 rounded-full px-[14px] py-[6px] font-mono text-[0.72rem] text-accent">
      <span className="w-[5px] h-[5px] rounded-full bg-accent animate-pulse-dot flex-shrink-0" />
      {children}
    </div>
  )
}
