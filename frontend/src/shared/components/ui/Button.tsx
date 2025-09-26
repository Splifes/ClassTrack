import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '../../../lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link' | 'outline-primary' | 'outline-secondary' | 'outline-success' | 'outline-danger' | 'outline-warning' | 'outline-info' | 'outline-light' | 'outline-dark'
  size?: 'sm' | 'lg'
  outline?: boolean
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size, outline, loading, disabled, children, ...props }, ref) => {
    const baseClasses = 'btn'
    
    // Handle outline variants
    let variantClass = ''
    if (variant.startsWith('outline-')) {
      variantClass = `btn-${variant}`
    } else {
      variantClass = outline ? `btn-outline-${variant}` : `btn-${variant}`
    }
    
    const sizeClass = size ? `btn-${size}` : ''
    
    return (
      <button
        className={cn(
          baseClasses,
          variantClass,
          sizeClass,
          loading && 'disabled',
          className
        )}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading && (
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
