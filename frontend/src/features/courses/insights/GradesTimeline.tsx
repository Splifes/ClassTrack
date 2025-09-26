import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TimelinePoint } from '../../../services/courseService';

interface Props {
  data: TimelinePoint[];
}

const GradesTimeline: React.FC<Props> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="card h-100">
        <div className="card-body text-center">
          <h5 className="card-title">Evolución de Notas</h5>
          <p>Aún no hay suficientes datos para mostrar tu evolución.</p>
        </div>
      </div>
    )
  }

  const formattedData = data.map(point => ({
    ...point,
    date: new Date(point.date).toLocaleDateString(),
  }));

  return (
    <div className="card h-100">
      <div className="card-body">
        <h5 className="card-title mb-4">Evolución de Notas</h5>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="score" name="Calificación" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GradesTimeline;
