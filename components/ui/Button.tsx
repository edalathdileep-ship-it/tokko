'use client'
import { cn } from '@/lib/utils'
import { type ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const BtnArrow = () => (
  <img src="/btn-arrow.svg" alt="" width={8} height={14} style={{ flexShrink: 0 }} />
)

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-grotesk font-bold rounded-[9px] select-none',
          'transition-all duration-[80ms] ease-out cursor-pointer',
          'disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none',
          size === 'sm' && 'text-[0.76rem] px-[14px] h-[34px]',
          size === 'md' && 'text-[0.84rem] px-[22px] h-[44px]',
          size === 'lg' && 'text-[0.96rem] px-[32px] h-[50px]',
          variant === 'primary' && [
            'bg-accent text-black',
            'hover:brightness-110',
            'active:scale-[0.96] active:brightness-90',
          ],
          variant === 'outline' && [
            'bg-transparent text-text border border-border',
            'hover:border-accent/40 hover:text-accent',
            'active:scale-[0.96] active:bg-bg-surface',
          ],
          variant === 'ghost' && [
            'bg-transparent text-text-muted',
            'hover:text-text hover:bg-bg-surface',
            'active:scale-[0.96]',
          ],
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            {children}
          </>
        ) : children}
      </button>
    )
  }
)
Button.displayName = 'Button'
