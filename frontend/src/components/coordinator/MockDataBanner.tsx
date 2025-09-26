import React from 'react';

export default function MockDataBanner() {
  return (
    <div className="alert alert-info border-0 shadow-sm mb-4">
      <div className="d-flex align-items-center">
        <div className="me-3">
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
          </svg>
        </div>
        <div className="flex-grow-1">
          <h6 className="mb-1">📊 <strong>Modo Demostración Activo</strong></h6>
          <p className="mb-0 small">
            Visualizando datos simulados realistas para mostrar las capacidades del dashboard. 
            Los datos incluyen 8 cursos, 9 profesores y métricas detalladas de rendimiento.
          </p>
        </div>
        <div className="ms-3">
          <span className="badge bg-primary">DEMO</span>
        </div>
      </div>
      
      <hr className="my-3" />
      
      <div className="row text-center">
        <div className="col-md-3">
          <small className="text-muted d-block">Cursos Simulados</small>
          <strong className="text-primary">8</strong>
        </div>
        <div className="col-md-3">
          <small className="text-muted d-block">Profesores</small>
          <strong className="text-info">9</strong>
        </div>
        <div className="col-md-3">
          <small className="text-muted d-block">Alertas Generadas</small>
          <strong className="text-warning">6</strong>
        </div>
        <div className="col-md-3">
          <small className="text-muted d-block">Métricas Calculadas</small>
          <strong className="text-success">25+</strong>
        </div>
      </div>
    </div>
  );
}
