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
          'inline-flex items-center justify-center gap-2 font-grotesk font-bold rounded-[9px] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none',
          // Sizes
          size === 'sm' && 'text-[0.76rem] px-[14px] h-[34px]',
          size === 'md' && 'text-[0.84rem] px-[22px] h-[44px]',
          size === 'lg' && 'text-[0.96rem] px-[32px] h-[50px]',
          // Variants
          variant === 'primary' && [
            'bg-accent text-black',
            'hover:bg-accent-hover hover:shadow-btn-glow hover:-translate-y-0.5',
          ],
          variant === 'outline' && [
            'bg-transparent text-text border border-border',
            'hover:border-accent hover:text-accent',
          ],
          variant === 'ghost' && [
            'bg-transparent text-text-muted border-none',
            'hover:text-text',
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
