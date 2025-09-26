import React from 'react';
import { HeaderStats } from '../../../services/courseService';

interface Props {
  stats: HeaderStats | undefined;
}

const HeaderStatsComponent: React.FC<Props> = ({ stats }) => {
  if (!stats) {
    return (
      <div className="row">
        <div className="col-12">
          <div className="alert alert-info">
            No hay estadísticas disponibles para este curso aún.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-md-6 mb-3">
        <div className="card text-center h-100">
          <div className="card-body">
            <h5 className="card-title">Tu Promedio</h5>
            <p className="card-text fs-1 fw-bold">{stats.student_average || 'N/A'}</p>
          </div>
        </div>
      </div>
      <div className="col-md-6 mb-3">
        <div className="card text-center h-100">
          <div className="card-body">
            <h5 className="card-title">Promedio de la Clase</h5>
            <p className="card-text fs-1 fw-bold">{stats.class_average || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderStatsComponent;
