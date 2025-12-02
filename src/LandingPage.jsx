import React, { useState } from "react";

export default function LandingPage({ onSubmit }) {
  const [debts, setDebts] = useState([
    { category: "", name: "", amount: "", rate: "", minPayment: "" },
  ]);
  const [extraPayment, setExtraPayment] = useState("");
  const [payInterval, setPayInterval] = useState("Monthly");

  const updateDebt = (index, field, value) => {
    const newDebts = [...debts];
    newDebts[index][field] = value;
    setDebts(newDebts);
  };

  const addDebt = () => {
    setDebts([...debts, { category: "", name: "", amount: "", rate: "", minPayment: "" }]);
  };

  const removeDebt = (index) => {
    if (debts.length > 1) {
      setDebts(debts.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = () => {
    // Basic validation
    const validDebts = debts.filter(d => d.name && d.amount && d.rate && d.minPayment);
    if (validDebts.length === 0) {
      alert("Please add at least one complete debt entry");
      return;
    }
    if (!extraPayment || parseFloat(extraPayment) < 0) {
      alert("Please enter a valid extra payment amount");
      return;
    }
    onSubmit({ debts: validDebts, extraPayment, payInterval });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        padding: '40px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '42px',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '10px'
          }}>
            💰 Debt Payoff Visualizer
          </h1>
          <p style={{ fontSize: '18px', color: '#6b7280' }}>
            Take control of your financial future
          </p>
        </div>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px'
            }}>1</span>
            Add Your Debts
          </h2>
          
          <div style={{ display: 'grid', gap: '16px' }}>
            {debts.map((debt, idx) => (
              <div key={idx} style={{
                padding: '20px',
                backgroundColor: '#f9fafb',
                borderRadius: '12px',
                border: '2px solid #e5e7eb'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                  gap: '12px'
                }}>
                  <select
                    value={debt.category}
                    onChange={e => updateDebt(idx, 'category', e.target.value)}
                    style={{
                      padding: '12px',
                      fontSize: '14px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      backgroundColor: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">Select Category</option>
                    <option value="Credit Card">💳 Credit Card</option>
                    <option value="Student Loan">🎓 Student Loan</option>
                    <option value="Car Loan">🚗 Car Loan</option>
                    <option value="Personal Loan">💵 Personal Loan</option>
                    <option value="Mortgage">🏠 Mortgage</option>
                    <option value="Medical">🏥 Medical</option>
                    <option value="Other">📋 Other</option>
                  </select>
                  
                  <input
                    placeholder="Debt Name"
                    value={debt.name}
                    onChange={e => updateDebt(idx, 'name', e.target.value)}
                    style={{
                      padding: '12px',
                      fontSize: '14px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px'
                    }}
                  />
                  
                  <input
                    placeholder="Balance"
                    value={debt.amount}
                    type="number"
                    onChange={e => updateDebt(idx, 'amount', e.target.value)}
                    style={{
                      padding: '12px',
                      fontSize: '14px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px'
                    }}
                  />
                  
                  <input
                    placeholder="Interest Rate %"
                    value={debt.rate}
                    type="number"
                    step="0.1"
                    onChange={e => updateDebt(idx, 'rate', e.target.value)}
                    style={{
                      padding: '12px',
                      fontSize: '14px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px'
                    }}
                  />
                  
                  <input
                    placeholder="Min Payment"
                    value={debt.minPayment}
                    type="number"
                    onChange={e => updateDebt(idx, 'minPayment', e.target.value)}
                    style={{
                      padding: '12px',
                      fontSize: '14px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px'
                    }}
                  />
                </div>
                
                {debts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDebt(idx)}
                    style={{
                      marginTop: '12px',
                      padding: '8px 16px',
                      fontSize: '14px',
                      color: '#ef4444',
                      backgroundColor: 'transparent',
                      border: '1px solid #ef4444',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    ✕ Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <button
            type="button"
            onClick={addDebt}
            style={{
              marginTop: '16px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '500',
              color: '#3b82f6',
              backgroundColor: '#eff6ff',
              border: '2px dashed #3b82f6',
              borderRadius: '8px',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            ➕ Add Another Debt
          </button>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{
              backgroundColor: '#10b981',
              color: 'white',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px'
            }}>2</span>
            Set Your Extra Payment
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '12px',
            padding: '20px',
            backgroundColor: '#f0fdf4',
            borderRadius: '12px',
            border: '2px solid #86efac'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Extra Payment Amount
              </label>
              <input
                placeholder="e.g., 500"
                value={extraPayment}
                onChange={e => setExtraPayment(e.target.value)}
                type="number"
                style={{
                  padding: '12px',
                  fontSize: '16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  width: '95%'
                }}
              />
            </div>
            
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Payment Frequency
              </label>
              <select
                value={payInterval}
                onChange={e => setPayInterval(e.target.value)}
                style={{
                  padding: '12px',
                  fontSize: '16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  width: '100%',
                  cursor: 'pointer',
                  backgroundColor: 'white'
                }}
              >
                <option>Monthly</option>
                <option>Biweekly</option>
                <option>Weekly</option>
              </select>
            </div>
          </div>
        </section>

        <button
          onClick={handleSubmit}
          style={{
            width: '100%',
            padding: '16px',
            fontSize: '18px',
            fontWeight: '600',
            color: 'white',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseOver={e => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
          }}
          onMouseOut={e => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
          }}
        >
          🚀 Start My Debt-Free Plan
        </button>
      </div>
    </div>
  );
}