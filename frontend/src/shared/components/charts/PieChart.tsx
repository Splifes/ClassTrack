import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { ChartData } from '../../types/reports'

interface PieChartProps {
  data: ChartData[]
  title?: string
  height?: number
  showLegend?: boolean
  showLabels?: boolean
  className?: string
}

const COLORS = ['#0d6efd', '#6c757d', '#28a745', '#dc3545', '#ffc107', '#17a2b8', '#6f42c1', '#e83e8c']

export function PieChart({ 
  data, 
  title, 
  height = 300,
  showLegend = true,
  showLabels = true,
  className = ''
}: PieChartProps) {
  const renderLabel = (entry: any) => {
    if (!showLabels) return ''
    return `${entry.name}: ${entry.percentage ? `${entry.percentage.toFixed(1)}%` : entry.value}`
  }

  return (
    <div className={className}>
      {title && <h6 className="mb-3">{title}</h6>}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color || COLORS[index % COLORS.length]} 
              />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          {showLegend && <Legend />}
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  )
}
