import { Button } from '../../../../shared/components/ui'
import type { DataViewerHeaderProps } from '../../types/dataViewer'

export function DataViewerHeader({ showRawData, onToggleRawData }: DataViewerHeaderProps) {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2>Análisis del Curso</h2>
        <p className="text-muted">Datos disponibles de Google Classroom</p>
      </div>
      <Button 
        variant={showRawData ? 'primary' : 'outline-primary'}
        onClick={onToggleRawData}
        size="sm"
      >
        {showRawData ? 'Ocultar Datos Crudos' : 'Mostrar Datos Crudos'}
      </Button>
    </div>
  )
}
