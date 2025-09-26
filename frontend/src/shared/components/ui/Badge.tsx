import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '../../../lib/utils'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'
  pill?: boolean
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'primary', pill, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'badge',
          `bg-${variant}`,
          pill && 'rounded-pill',
          className
        )}
        {...props}
      />
    )
  }
)

Badge.displayName = 'Badge'

export { Badge }
