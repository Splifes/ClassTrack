import { useState, useEffect } from 'react'

interface SearchBoxProps {
  placeholder?: string
  onSearch: (query: string) => void
  debounceMs?: number
  className?: string
}

export function SearchBox({ 
  placeholder = "Search...", 
  onSearch, 
  debounceMs = 300,
  className = ""
}: SearchBoxProps) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [query, onSearch, debounceMs])

  const handleClear = () => {
    setQuery('')
    onSearch('')
  }

  return (
    <div className={`position-relative ${className}`}>
      <input
        type="text"
        className="form-control"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ paddingRight: query ? '2.5rem' : '1rem' }}
      />
      <div className="position-absolute top-50 end-0 translate-middle-y me-2">
        {query ? (
          <button
            type="button"
            className="btn btn-sm btn-link text-muted p-0"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
            </svg>
          </button>
        ) : (
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="text-muted">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
        )}
      </div>
    </div>
  )
}
