import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCourseInsights, CourseInsights } from '../../../services/courseService';
import { api } from '../../../services/api';
import HeaderStats from './HeaderStats';
import GradesTimeline from './GradesTimeline';
import AssignmentsTable from './AssignmentsTable';
import Suggestions from './Suggestions';

const InsightsPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [insights, setInsights] = useState<CourseInsights | null>(null);
  const [completeData, setCompleteData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingComplete, setLoadingComplete] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showRawData, setShowRawData] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<string>('');

  useEffect(() => {
    if (!courseId) {
      console.log('No courseId found');
      return;
    }

    console.log('Fetching insights for courseId:', courseId);

    const fetchInsights = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCourseInsights(courseId);
        console.log('Insights data received:', data);
        setInsights(data);
      } catch (err) {
        console.error('Error fetching insights:', err);
        setError(`Failed to load course insights: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [courseId]);

  const fetchCompleteData = async () => {
    if (!courseId) return;
    
    try {
      setLoadingComplete(true);
      const data = await api.getCompleteCoursData(courseId);
      setCompleteData(data);
      setShowRawData(true);
    } catch (err) {
      console.error('Failed to load complete course data:', err);
      setError('Failed to load complete course data.');
    } finally {
      setLoadingComplete(false);
    }
  };

  const copyToClipboard = async (data: any) => {
    try {
      const jsonString = JSON.stringify(data, null, 2);
      await navigator.clipboard.writeText(jsonString);
      setCopySuccess('✅ JSON copiado al portapapeles!');
      setTimeout(() => setCopySuccess(''), 3000);
    } catch (err) {
      setCopySuccess('❌ Error al copiar');
      setTimeout(() => setCopySuccess(''), 3000);
    }
  };

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  }

  if (error) {
    return <div className="alert alert-danger mx-3">{error}</div>;
  }

  if (!insights) {
    return <div className="alert alert-info mx-3">No insights available for this course yet.</div>;
  }

  console.log('Rendering insights:', insights);

  return (
    <div className="container-fluid mt-3">
      {/* Header con botones de acción */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📊 Course Insights</h2>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-primary btn-sm"
            onClick={fetchCompleteData}
            disabled={loadingComplete}
          >
            {loadingComplete ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Cargando...
              </>
            ) : (
              '🔍 Ver Datos Completos'
            )}
          </button>
          
          {insights && (
            <button 
              className="btn btn-outline-success btn-sm"
              onClick={() => copyToClipboard(insights)}
            >
              📋 Copiar Insights JSON
            </button>
          )}
          
          {completeData && (
            <button 
              className="btn btn-outline-success btn-sm"
              onClick={() => copyToClipboard(completeData)}
            >
              📋 Copiar Datos Completos JSON
            </button>
          )}
        </div>
      </div>

      {/* Mensaje de éxito al copiar */}
      {copySuccess && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {copySuccess}
        </div>
      )}

      {/* Debug info */}
      <div className="alert alert-info mb-3">
        <strong>Debug Info:</strong>
        <br />
        Course ID: {courseId}
        <br />
        Insights loaded: {insights ? 'Yes' : 'No'}
        <br />
        Timeline items: {insights?.timeline?.length || 0}
        <br />
        Assignments: {insights?.assignments?.length || 0}
        <br />
        Suggestions: {insights?.suggestions?.length || 0}
        <br />
        Header stats: {insights?.header_stats ? JSON.stringify(insights.header_stats) : 'None'}
      </div>

      <HeaderStats stats={insights.header_stats} />
      
      {insights.suggestions && insights.suggestions.length > 0 && (
        <Suggestions suggestions={insights.suggestions} />
      )}

      <div className="row mt-4">
        <div className="col-12 col-lg-6 mb-4">
          {insights.timeline && insights.timeline.length > 0 ? (
            <GradesTimeline data={insights.timeline} />
          ) : (
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">📈 Grades Timeline</h5>
              </div>
              <div className="card-body">
                <p className="text-muted">No graded assignments found yet.</p>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-lg-6 mb-4">
          {insights.assignments && insights.assignments.length > 0 ? (
            <AssignmentsTable assignments={insights.assignments} />
          ) : (
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">📝 Assignments</h5>
              </div>
              <div className="card-body">
                <p className="text-muted">No assignments found for this course.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sección de datos completos */}
      {showRawData && completeData && (
        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">🔍 Datos Completos del Curso</h5>
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setShowRawData(false)}
                  >
                    ❌ Ocultar
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => copyToClipboard(completeData)}
                  >
                    📋 Copiar JSON
                  </button>
                </div>
              </div>
              <div className="card-body">
                {/* Resumen de datos */}
                <div className="row mb-3">
                  <div className="col-md-3">
                    <div className="card bg-light">
                      <div className="card-body text-center">
                        <h6 className="card-title">📚 Materiales</h6>
                        <h4 className="text-primary">{completeData.materials?.length || 0}</h4>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card bg-light">
                      <div className="card-body text-center">
                        <h6 className="card-title">📝 Tareas</h6>
                        <h4 className="text-success">{completeData.coursework?.length || 0}</h4>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card bg-light">
                      <div className="card-body text-center">
                        <h6 className="card-title">👥 Estudiantes</h6>
                        <h4 className="text-info">{completeData.students?.length || 0}</h4>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card bg-light">
                      <div className="card-body text-center">
                        <h6 className="card-title">👨‍🏫 Profesores</h6>
                        <h4 className="text-warning">{completeData.teachers?.length || 0}</h4>
                      </div>
                    </div>
                  </div>
                </div>

                {/* JSON Raw Data */}
                <div className="mt-3">
                  <h6>📄 Datos Raw (JSON):</h6>
                  <pre className="bg-dark text-light p-3 rounded" style={{ maxHeight: '400px', overflow: 'auto', fontSize: '12px' }}>
                    <code>{JSON.stringify(completeData, null, 2)}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsightsPage;
