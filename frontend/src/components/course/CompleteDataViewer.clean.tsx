import { useState } from 'react';
import { api } from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '../../shared/components/ui';
import { TabContent } from './TabContent';

type TabType = 'overview' | 'materials' | 'announcements' | 'coursework' | 'students' | 'submissions';

interface CompleteDataViewerProps {
  courseId: string;
}

export function CompleteDataViewer({ courseId }: CompleteDataViewerProps) {
  const [activeSection, setActiveSection] = useState<TabType>('overview');
  const [showRawData, setShowRawData] = useState(false);

  return (
    <div className="complete-data-viewer">
      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Análisis del Curso</h2>
          <p className="text-muted">Datos disponibles de Google Classroom</p>
        </div>
        <Button 
          variant={showRawData ? 'primary' : 'outline-primary'}
          onClick={() => setShowRawData(!showRawData)}
          size="sm"
        >
          {showRawData ? 'Ocultar Datos Crudos' : 'Mostrar Datos Crudos'}
        </Button>
      </div>

      {/* Navegación entre pestañas */}
      <ul className="nav nav-pills mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeSection === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveSection('overview')}
          >
            📊 Resumen
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeSection === 'materials' ? 'active' : ''}`}
            onClick={() => setActiveSection('materials')}
          >
            📄 Materiales
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeSection === 'announcements' ? 'active' : ''}`}
            onClick={() => setActiveSection('announcements')}
          >
            📢 Anuncios
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeSection === 'coursework' ? 'active' : ''}`}
            onClick={() => setActiveSection('coursework')}
          >
            📚 Tareas
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeSection === 'students' ? 'active' : ''}`}
            onClick={() => setActiveSection('students')}
          >
            👥 Estudiantes
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeSection === 'submissions' ? 'active' : ''}`}
            onClick={() => setActiveSection('submissions')}
          >
            📝 Entregas
          </button>
        </li>
      </ul>

      {/* Contenido de las pestañas */}
      <div className="tab-content">
        {/* Pestaña de Resumen */}
        {activeSection === 'overview' && (
          <Card>
            <CardHeader>
              <CardTitle>📊 Resumen del Curso</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Selecciona una pestaña para ver los detalles del curso.</p>
            </CardContent>
          </Card>
        )}

        {/* Pestaña de Materiales */}
        {activeSection === 'materials' && (
          <TabContent
            courseId={courseId}
            fetchData={api.getCourseMaterials}
            tabName="Materiales"
            renderData={(data) => (
              <div>Contenido de Materiales</div>
            )}
          />
        )}

        {/* Pestaña de Anuncios */}
        {activeSection === 'announcements' && (
          <TabContent
            courseId={courseId}
            fetchData={api.getCourseAnnouncements}
            tabName="Anuncios"
            renderData={(data) => (
              <div>Contenido de Anuncios</div>
            )}
          />
        )}
      </div>
    </div>
  );
}
