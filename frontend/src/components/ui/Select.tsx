import { SelectHTMLAttributes, forwardRef } from 'react'
import { cn } from '../../lib/utils'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  options: SelectOption[]
  placeholder?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, placeholder, id, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`
    
    return (
      <div className="mb-3">
        {label && (
          <label htmlFor={selectId} className="form-label">
            {label}
            {props.required && <span className="text-danger ms-1">*</span>}
          </label>
        )}
        <select
          className={cn(
            'form-select',
            error && 'is-invalid',
            className
          )}
          ref={ref}
          id={selectId}
          aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-help` : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <div id={`${selectId}-error`} className="invalid-feedback">
            {error}
          </div>
        )}
        {helperText && !error && (
          <div id={`${selectId}-help`} className="form-text">
            {helperText}
          </div>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export { Select }
