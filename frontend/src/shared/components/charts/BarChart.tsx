import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { ChartData } from '../../types/reports'

interface BarChartProps {
  data: ChartData[]
  title?: string
  xAxisKey?: string
  yAxisKey?: string
  color?: string
  height?: number
  showLegend?: boolean
  className?: string
}

export function BarChart({ 
  data, 
  title, 
  xAxisKey = 'name', 
  yAxisKey = 'value',
  color = '#0d6efd',
  height = 300,
  showLegend = false,
  className = ''
}: BarChartProps) {
  return (
    <div className={className}>
      {title && <h6 className="mb-3">{title}</h6>}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={xAxisKey} 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          {showLegend && <Legend />}
          <Bar 
            dataKey={yAxisKey} 
            fill={color}
            radius={[2, 2, 0, 0]}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}
