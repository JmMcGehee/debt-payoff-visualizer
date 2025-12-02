import React from 'react';
import { format } from 'date-fns';

export default function MetricsHeader({ calculationResults }) {
  if (!calculationResults) {
    return null;
  }

  const { debtFreeDate, totalInterestPaid, totalMonths, debtTimeline } = calculationResults;

  const totalDebtsPaid = debtTimeline.filter(d => d.isPaidOff).length;

  return (
    <div className="metrics-header" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      marginBottom: '30px',
      padding: '20px 0'
    }}>
      <div className="metric-card" style={{
        backgroundColor: '#f0f9ff',
        padding: '20px',
        borderRadius: '8px',
        border: '2px solid #3b82f6'
      }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#6b7280' }}>
          Debt-Free Date
        </h3>
        <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
          {debtFreeDate ? format(debtFreeDate, 'MMM dd, yyyy') : 'N/A'}
        </p>
      </div>

      <div className="metric-card" style={{
        backgroundColor: '#fef3c7',
        padding: '20px',
        borderRadius: '8px',
        border: '2px solid #f59e0b'
      }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#6b7280' }}>
          Total Interest Paid
        </h3>
        <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
          ${totalInterestPaid.toFixed(2)}
        </p>
      </div>

      <div className="metric-card" style={{
        backgroundColor: '#f0fdf4',
        padding: '20px',
        borderRadius: '8px',
        border: '2px solid #10b981'
      }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#6b7280' }}>
          Months Until Free
        </h3>
        <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
          {totalMonths} months
        </p>
      </div>

      <div className="metric-card" style={{
        backgroundColor: '#fce7f3',
        padding: '20px',
        borderRadius: '8px',
        border: '2px solid #ec4899'
      }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#6b7280' }}>
          Debts Status
        </h3>
        <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
          {totalDebtsPaid} paid / {debtTimeline.length} total
        </p>
      </div>
    </div>
  );
}
