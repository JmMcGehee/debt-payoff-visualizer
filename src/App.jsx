import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import LandingPage from "./LandingPage";
import DashboardPage from "./DashboardPage";

function AppRoutes() {
  const [debtData, setDebtData] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (data) => {
    // Add order property to each debt for prioritization
    const debtsWithOrder = data.debts.map((debt, index) => ({
      ...debt,
      balance: debt.amount, // Use 'balance' for calculator
      order: index
    }));
    
    setDebtData({
      ...data,
      debts: debtsWithOrder
    });
    navigate("/dashboard");
  };

  return (
    <Routes>
      <Route
        path="/"
        element={<LandingPage onSubmit={handleSubmit} />}
      />
      <Route
        path="/dashboard"
        element={
          debtData ? (
            <DashboardPage {...debtData} />
          ) : (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <h2>No debt data found</h2>
              <p>Please start by entering your debt info on the landing page.</p>
              <button 
                onClick={() => navigate("/")}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  marginTop: '20px'
                }}
              >
                Go to Landing Page
              </button>
            </div>
          )
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;