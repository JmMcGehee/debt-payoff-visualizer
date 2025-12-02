import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import DashboardPage from "./DashboardPage";

function App() {
  const [debtData, setDebtData] = useState(null);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              onSubmit={data => {
                setDebtData(data);
                window.location.href = "/dashboard"; // or use useNavigate hook for SPA-style nav
              }}
            />
          }
        />
        <Route
          path="/dashboard"
          element={
            debtData
              ? <DashboardPage {...debtData} payoffResults={{ debtFreeDate: "Dec 2027", interestSaved: 5000, months: 27 }} />
              : <div>Please start by entering your debt info on the landing page.</div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;