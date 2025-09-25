export interface CsvColumn {
  key: string
  label: string
  formatter?: (value: any) => string
}

export interface CsvExportOptions {
  filename: string
  columns: CsvColumn[]
  data: any[]
  includeTimestamp?: boolean
}

export function exportToCsv({ filename, columns, data, includeTimestamp = true }: CsvExportOptions) {
  if (!data || data.length === 0) {
    throw new Error('No data to export')
  }

  // Create CSV headers
  const headers = columns.map(col => col.label)
  
  // Create CSV rows
  const rows = data.map(item => 
    columns.map(col => {
      const value = item[col.key]
      if (col.formatter) {
        return col.formatter(value)
      }
      
      // Handle different data types
      if (value === null || value === undefined) {
        return ''
      }
      
      if (typeof value === 'string') {
        // Escape quotes and wrap in quotes if contains comma or newline
        const escaped = value.replace(/"/g, '""')
        return escaped.includes(',') || escaped.includes('\n') || escaped.includes('"') 
          ? `"${escaped}"` 
          : escaped
      }
      
      if (typeof value === 'number') {
        return value.toString()
      }
      
      if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No'
      }
      
      if (value instanceof Date) {
        return value.toISOString()
      }
      
      return String(value)
    })
  )

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map(row => row.join(','))
    .join('\n')

  // Add BOM for UTF-8 encoding (helps with Excel)
  const bom = '\uFEFF'
  const csvWithBom = bom + csvContent

  // Create and download file
  const blob = new Blob([csvWithBom], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    
    // Add timestamp to filename if requested
    const finalFilename = includeTimestamp 
      ? `${filename}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.csv`
      : `${filename}.csv`
    
    link.setAttribute('download', finalFilename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

// Predefined formatters for common data types
export const csvFormatters = {
  date: (value: string | Date) => {
    if (!value) return ''
    const date = typeof value === 'string' ? new Date(value) : value
    return date.toLocaleDateString()
  },
  
  datetime: (value: string | Date) => {
    if (!value) return ''
    const date = typeof value === 'string' ? new Date(value) : value
    return date.toLocaleString()
  },
  
  percentage: (value: number) => {
    if (typeof value !== 'number') return ''
    return `${value.toFixed(1)}%`
  },
  
  currency: (value: number, currency = 'USD') => {
    if (typeof value !== 'number') return ''
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(value)
  },
  
  boolean: (value: boolean) => {
    return value ? 'Yes' : 'No'
  },
  
  array: (value: any[]) => {
    if (!Array.isArray(value)) return ''
    return value.join('; ')
  }
}
