import React, { useState } from "react";

export default function LandingPage({ onSubmit }) {
  const [debts, setDebts] = useState([
    { category: "", name: "", amount: "", rate: "", minPayment: "" },
  ]);
  const [extraPayment, setExtraPayment] = useState("");
  const [payInterval, setPayInterval] = useState("Monthly");

  // Handlers to add/remove/update debts

  return (
    <div className="landing-page">
      <h1>Debt Payoff Visualizer</h1>
      <h2>Step 1: Add Your Debts</h2>
      <form>
        {debts.map((debt, idx) => (
          <div key={idx} className="debt-row">
            <select
              value={debt.category}
              onChange={e => {/* update debt category */}}
            >
              <option value="">Category</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Student Loan">Student Loan</option>
              <option value="Car Loan">Car Loan</option>
              {/* ...add more categories */}
            </select>
            <input placeholder="Debt Name" value={debt.name} />
            <input placeholder="Amount" value={debt.amount} type="number" />
            <input placeholder="Interest Rate (%)" value={debt.rate} type="number" />
            <input placeholder="Minimum Payment" value={debt.minPayment} type="number" />
          </div>
        ))}
        <button type="button" onClick={() => {/* add new debt */}}>
          + Add More
        </button>
      </form>
      <h2>Step 2: Set Your Extra Payments</h2>
      <input
        placeholder="Extra Payment Amount"
        value={extraPayment}
        onChange={e => setExtraPayment(e.target.value)}
        type="number"
      />
      <select value={payInterval} onChange={e => setPayInterval(e.target.value)}>
        <option>Monthly</option>
        <option>Biweekly</option>
        <option>Weekly</option>
      </select>
      <br />
      <button
        onClick={() => {
          // handle submit: validate data and pass up to parent
          onSubmit({ debts, extraPayment, payInterval });
        }}
      >
        Start My Debt-Free Plan
      </button>
    </div>
  );
}