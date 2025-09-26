import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '../../../lib/utils'

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'lg'
  variant?: 'border' | 'grow'
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'
}

const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size, variant = 'border', color, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          `spinner-${variant}`,
          size && `spinner-${variant}-${size}`,
          color && `text-${color}`,
          className
        )}
        role="status"
        {...props}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    )
  }
)

Spinner.displayName = 'Spinner'

export { Spinner }
