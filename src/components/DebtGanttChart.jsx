import React from 'react';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';

const COLORS = {
  'Credit Card': '#ef4444',
  'Student Loan': '#3b82f6',
  'Car Loan': '#10b981',
  'Personal Loan': '#f59e0b',
  'Mortgage': '#8b5cf6',
  'Medical': '#ec4899',
  'Other': '#6b7280'
};

export default function DebtGanttChart({ debtTimeline, startDate }) {
  if (!debtTimeline || debtTimeline.length === 0) {
    return (
      <div className="gantt-chart-empty">
        <p>No debt data to display. Please add your debts on the landing page.</p>
      </div>
    );
  }

  // Transform data for horizontal bar chart (Gantt style)
  const chartData = debtTimeline.map(debt => ({
    name: debt.name,
    category: debt.category,
    // Start position (number of months from start)
    start: debt.startMonth,
    // Duration (how many months this debt takes)
    duration: debt.endMonth - debt.startMonth,
    endMonth: debt.endMonth,
    totalInterest: debt.totalInterest,
    isPaidOff: debt.isPaidOff,
    endDate: debt.endDate
  }));

  // Find max months for chart scale
  const maxMonths = Math.max(...chartData.map(d => d.endMonth), 1);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{data.name}</p>
          <p style={{ margin: '5px 0', color: '#666' }}>{data.category}</p>
          <p style={{ margin: '5px 0' }}>
            Payoff: {data.endMonth} months {data.endDate ? `(${format(data.endDate, 'MMM yyyy')})` : ''}
          </p>
          <p style={{ margin: '5px 0' }}>
            Interest Paid: ${data.totalInterest.toFixed(2)}
          </p>
          {data.isPaidOff && (
            <p style={{ margin: '5px 0', color: '#10b981', fontWeight: 'bold' }}>✓ Paid Off</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="gantt-chart" style={{ width: '100%', height: '400px' }}>
      <h2 style={{ marginBottom: '20px' }}>Debt Payoff Timeline</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="number" 
            label={{ value: 'Months', position: 'insideBottom', offset: -10 }}
            domain={[0, maxMonths]}
            ticks={Array.from({ length: Math.ceil(maxMonths / 6) + 1 }, (_, i) => i * 6)}
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            width={90}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            payload={Object.keys(COLORS).map(key => ({
              value: key,
              type: 'square',
              color: COLORS[key]
            }))}
          />
          {/* Invisible bar for positioning (represents start time) */}
          <Bar dataKey="start" stackId="a" fill="transparent" />
          {/* Visible bar (represents duration) */}
          <Bar dataKey="duration" stackId="a" radius={[0, 8, 8, 0]}>
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[entry.category] || COLORS['Other']}
                opacity={entry.isPaidOff ? 0.7 : 1}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
