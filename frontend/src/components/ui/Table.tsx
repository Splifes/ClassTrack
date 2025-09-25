import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '../../lib/utils'

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  striped?: boolean
  bordered?: boolean
  hover?: boolean
  responsive?: boolean
}

const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ className, striped, bordered, hover, responsive, children, ...props }, ref) => {
    const table = (
      <table
        ref={ref}
        className={cn(
          'table',
          striped && 'table-striped',
          bordered && 'table-bordered',
          hover && 'table-hover',
          className
        )}
        {...props}
      >
        {children}
      </table>
    )

    if (responsive) {
      return <div className="table-responsive">{table}</div>
    }

    return table
  }
)

const TableHeader = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn(className)} {...props} />
  )
)

const TableBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn(className)} {...props} />
  )
)

const TableFooter = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot ref={ref} className={cn(className)} {...props} />
  )
)

const TableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr ref={ref} className={cn(className)} {...props} />
  )
)

const TableHead = forwardRef<HTMLTableCellElement, HTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th ref={ref} className={cn(className)} {...props} />
  )
)

const TableCell = forwardRef<HTMLTableCellElement, HTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={cn(className)} {...props} />
  )
)

Table.displayName = 'Table'
TableHeader.displayName = 'TableHeader'
TableBody.displayName = 'TableBody'
TableFooter.displayName = 'TableFooter'
TableRow.displayName = 'TableRow'
TableHead.displayName = 'TableHead'
TableCell.displayName = 'TableCell'

export { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell }
