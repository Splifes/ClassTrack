import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '../../../lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, helperText, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    
    return (
      <div className="mb-3">
        {label && (
          <label htmlFor={inputId} className="form-label">
            {label}
            {props.required && <span className="text-danger ms-1">*</span>}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'form-control',
            error && 'is-invalid',
            className
          )}
          ref={ref}
          id={inputId}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-help` : undefined}
          {...props}
        />
        {error && (
          <div id={`${inputId}-error`} className="invalid-feedback">
            {error}
          </div>
        )}
        {helperText && !error && (
          <div id={`${inputId}-help`} className="form-text">
            {helperText}
          </div>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
