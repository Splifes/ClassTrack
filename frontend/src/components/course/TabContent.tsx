import { useApi } from '../../hooks/useApi'
import { Card, CardContent } from '../../shared/components/ui'

interface TabContentProps {
  courseId: string
  fetchData: (courseId: string) => Promise<any>
  renderData: (data: any) => React.ReactNode
  tabName: string
}

export function TabContent({ courseId, fetchData, renderData, tabName }: TabContentProps) {
  const { data, loading, error } = useApi(() => fetchData(courseId), [courseId])

  if (loading) {
    return (
      <Card>
        <CardContent className="text-center py-5">
          <div className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted small">Loading {tabName}...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <div className="alert alert-danger mb-0">
            <h6 className="alert-heading small">Error Loading {tabName}</h6>
            <p className="small mb-0">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card>
        <CardContent>
          <p className="text-muted text-center py-4 mb-0">No data available for {tabName}.</p>
        </CardContent>
      </Card>
    )
  }

  return <>{renderData(data)}</>
}
