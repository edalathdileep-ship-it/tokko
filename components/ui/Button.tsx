'use client'
import { cn } from '@/lib/utils'
import { type ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          // Base
          'inline-flex items-center justify-center gap-2 font-grotesk font-bold rounded-[9px] transition-all duration-150 cursor-pointer select-none',
          // Disabled state
          'disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none',
          // Sizes
          size === 'sm' && 'text-[0.76rem] px-[14px] h-[34px]',
          size === 'md' && 'text-[0.84rem] px-[22px] h-[44px]',
          size === 'lg' && 'text-[0.96rem] px-[32px] h-[50px]',
          // Primary variant
          variant === 'primary' && [
            // Active state
            'bg-accent text-black shadow-sm',
            // Hover — subtle lift, slight brightness
            'hover:bg-[#00f0a8] hover:-translate-y-[2px] hover:shadow-md',
            // Pressed — sink down
            'active:translate-y-[1px] active:bg-[#00cc8e] active:shadow-none',
          ],
          // Outline variant
          variant === 'outline' && [
            'bg-transparent text-text border border-border',
            'hover:border-accent/50 hover:text-accent hover:-translate-y-[2px]',
            'active:translate-y-[1px] active:border-accent active:text-accent',
          ],
          // Ghost variant
          variant === 'ghost' && [
            'bg-transparent text-text-muted border-none',
            'hover:text-text hover:bg-bg-surface',
            'active:bg-bg-s2',
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
