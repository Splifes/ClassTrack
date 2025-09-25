import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { TimeSeriesData } from '../../types/reports'

interface LineChartProps {
  data: TimeSeriesData[]
  title?: string
  lines: {
    key: keyof TimeSeriesData
    color: string
    name: string
  }[]
  height?: number
  showLegend?: boolean
  className?: string
}

export function LineChart({ 
  data, 
  title, 
  lines,
  height = 300,
  showLegend = true,
  className = ''
}: LineChartProps) {
  return (
    <div className={className}>
      {title && <h6 className="mb-3">{title}</h6>}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
            labelFormatter={(value) => `Date: ${new Date(value).toLocaleDateString()}`}
          />
          {showLegend && <Legend />}
          {lines.map(line => (
            <Line 
              key={line.key}
              type="monotone" 
              dataKey={line.key} 
              stroke={line.color}
              strokeWidth={2}
              name={line.name}
              dot={{ fill: line.color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}
