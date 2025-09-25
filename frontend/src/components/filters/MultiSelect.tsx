import { useState } from 'react'

interface Option {
  value: string
  label: string
}

interface MultiSelectProps {
  options: Option[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  className?: string
}

export function MultiSelect({ 
  options, 
  selected, 
  onChange, 
  placeholder = "Select options...",
  className = ""
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter(s => s !== value)
      : [...selected, value]
    onChange(newSelected)
  }

  const handleClear = () => {
    onChange([])
  }

  const getDisplayText = () => {
    if (selected.length === 0) return placeholder
    if (selected.length === 1) {
      const option = options.find(o => o.value === selected[0])
      return option?.label || selected[0]
    }
    return `${selected.length} selected`
  }

  return (
    <div className={`dropdown ${className}`}>
      <button
        className="btn btn-outline-secondary dropdown-toggle w-100 text-start"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="me-auto">{getDisplayText()}</span>
      </button>

      {isOpen && (
        <div className="dropdown-menu show w-100" style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {selected.length > 0 && (
            <>
              <button
                className="dropdown-item text-danger"
                onClick={handleClear}
              >
                <svg width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                </svg>
                Clear all
              </button>
              <div className="dropdown-divider"></div>
            </>
          )}
          
          {options.map(option => (
            <label
              key={option.value}
              className="dropdown-item d-flex align-items-center"
              style={{ cursor: 'pointer' }}
            >
              <input
                type="checkbox"
                className="form-check-input me-2"
                checked={selected.includes(option.value)}
                onChange={() => handleToggle(option.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
      )}
      
      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100" 
          style={{ zIndex: -1 }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
