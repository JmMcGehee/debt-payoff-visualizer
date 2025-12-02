import React from "react";

/**
 * Props:
 * - debts (array)
 * - extraPayment
 * - payInterval
 * - onDebtOrderChange (user reorders debts)
 * - onExtraPaymentChange
 * - paymentSchedule (array, user customizes months)
 */
export default function DashboardPage({
  debts,
  extraPayment,
  payInterval,
  payoffResults,
  onDebtOrderChange,
  onExtraPaymentChange,
  paymentSchedule,
}) {
  return (
    <div className="dashboard-page">
      <h1>Your Debt Payoff Timeline</h1>
      <section className="summary">
        <p>Estimated Debt-Free Date: <strong>{payoffResults.debtFreeDate}</strong></p>
        <p>Total Interest Saved: <strong>${payoffResults.interestSaved}</strong></p>
        <p>Projected Timeline: <strong>{payoffResults.months} months</strong></p>
        <label>
          Extra Payment:
          <input
            value={extraPayment}
            type="number"
            onChange={e => onExtraPaymentChange(e.target.value)}
          />
        </label>
      </section>

      <section className="debt-order">
        <h2>Drag debts to set your payoff priority</h2>
        {/* TODO: Replace this with react-beautiful-dnd or dnd-kit for drag-and-drop */}
        <ul>
          {debts.map((debt, idx) => (
            <li key={debt.id || idx}>
              <span className="drag-handle">::</span>
              {debt.name} - ${debt.amount} @ {debt.rate}% | Min: ${debt.minPayment}
            </li>
          ))}
        </ul>
      </section>

      <section className="payoff-timeline">
        <h2>Payoff Timeline</h2>
        {/* TODO: Integrate chart library here (Recharts, Victory, or D3.js) */}
        <div id="payoff-chart-placeholder">
          {/* visual timeline/chart showing payoff periods */}
        </div>
      </section>

      <section className="payment-schedule">
        <h2>Customize Payment Schedule (optional)</h2>
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Total Paid</th>
              <th>Extra Paid</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {/* paymentSchedule.map(...) */}
            <tr>
              <td>Jan 2026</td>
              <td>$2000</td>
              <td>$500</td>
              <td><button>Edit</button></td>
            </tr>
            {/* ...more months */}
          </tbody>
        </table>
      </section>

      <section className="strategy-options">
        <h2>Try Different Debt Ordering Strategies</h2>
        <button onClick={() => {/* reorder: smallest balance first */}}>Smallest Debt First</button>
        <button onClick={() => {/* reorder: highest interest first */}}>Highest Interest First</button>
        <button onClick={() => {/* reorder: custom/user defined */}}>Custom Order</button>
      </section>
    </div>
  );
}