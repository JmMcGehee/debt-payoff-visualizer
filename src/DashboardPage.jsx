import React, { useState, useEffect } from "react";
import { calculateDebtPayoff } from "./utils/debtCalculator";
import DebtGanttChart from "./components/DebtGanttChart";
import MetricsHeader from "./components/MetricsHeader";

export default function DashboardPage({
  debts,
  extraPayment,
  payInterval,
}) {
  const [currentDebts, setCurrentDebts] = useState(debts);
  const [currentExtraPayment, setCurrentExtraPayment] = useState(extraPayment);
  const [calculationResults, setCalculationResults] = useState(null);

  // Calculate debt payoff whenever debts or extra payment changes
  useEffect(() => {
    if (currentDebts && currentDebts.length > 0) {
      const results = calculateDebtPayoff(currentDebts, currentExtraPayment);
      setCalculationResults(results);
    }
  }, [currentDebts, currentExtraPayment]);

  const handleStrategyChange = (strategy) => {
    let reorderedDebts = [...currentDebts];
    
    if (strategy === 'snowball') {
      // Smallest balance first
      reorderedDebts.sort((a, b) => parseFloat(a.balance || a.amount) - parseFloat(b.balance || b.amount));
    } else if (strategy === 'avalanche') {
      // Highest interest first
      reorderedDebts.sort((a, b) => parseFloat(b.rate) - parseFloat(a.rate));
    }
    
    // Update order property
    reorderedDebts = reorderedDebts.map((debt, index) => ({ ...debt, order: index }));
    setCurrentDebts(reorderedDebts);
  };

  return (
    <div className="dashboard-page" style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1>Your Debt Payoff Timeline</h1>
      
      {calculationResults && (
        <>
          <MetricsHeader calculationResults={calculationResults} />
          
          <section className="extra-payment-control" style={{ marginBottom: '30px' }}>
            <label style={{ fontSize: '16px', fontWeight: '500' }}>
              Extra Payment Amount: 
              <input
                style={{ 
                  marginLeft: '10px', 
                  padding: '8px', 
                  fontSize: '16px', 
                  width: '150px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px'
                }}
                value={currentExtraPayment}
                type="number"
                onChange={e => setCurrentExtraPayment(parseFloat(e.target.value) || 0)}
              />
              <span style={{ marginLeft: '8px' }}>/ {payInterval}</span>
            </label>
          </section>

          <DebtGanttChart 
            debtTimeline={calculationResults.debtTimeline} 
            startDate={new Date()}
          />
        </>
      )}

      <section className="debt-list" style={{ marginTop: '40px' }}>
        <h2>Your Debts (in payoff order)</h2>
        <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
          {currentDebts.map((debt, idx) => (
            <div 
              key={idx} 
              style={{
                padding: '15px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                backgroundColor: '#f9fafb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <strong style={{ fontSize: '18px' }}>{idx + 1}. {debt.name}</strong>
                <div style={{ color: '#6b7280', marginTop: '5px' }}>
                  {debt.category} • ${parseFloat(debt.balance || debt.amount).toFixed(2)} @ {debt.rate}% • Min: ${debt.minPayment}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="strategy-options" style={{ marginTop: '40px', paddingBottom: '40px' }}>
        <h2>Try Different Payoff Strategies</h2>
        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
          <button 
            onClick={() => handleStrategyChange('snowball')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Snowball (Smallest First)
          </button>
          <button 
            onClick={() => handleStrategyChange('avalanche')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Avalanche (Highest Interest)
          </button>
        </div>
      </section>
    </div>
  );
}