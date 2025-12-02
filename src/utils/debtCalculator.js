import { addMonths, format } from 'date-fns';

/**
 * Calculate the debt payoff timeline using the debt snowball/avalanche method
 * @param {Array} debts - Array of debt objects with balance, rate, minPayment, order
 * @param {number} extraPayment - Extra payment amount per period
 * @param {Object} customPayments - Optional object with date keys and payment amounts
 * @returns {Object} Calculation results including timeline, totals, and individual debt lifecycles
 */
export function calculateDebtPayoff(debts, extraPayment = 0, customPayments = {}) {
  if (!debts || debts.length === 0) {
    return {
      debtFreeDate: null,
      totalInterestPaid: 0,
      totalMonths: 0,
      debtTimeline: [],
      monthlyBreakdown: []
    };
  }

  const startDate = new Date();
  
  // Sort debts by order (user's custom order or default)
  const sortedDebts = [...debts]
    .filter(d => d.balance > 0 && d.minPayment > 0)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // Initialize tracking
  const debtStates = sortedDebts.map(debt => ({
    ...debt,
    balance: parseFloat(debt.balance) || 0,
    rate: parseFloat(debt.rate) || 0,
    minPayment: parseFloat(debt.minPayment) || 0,
    totalInterestPaid: 0,
    startDate: new Date(startDate),
    endDate: null,
    monthsPaid: 0
  }));

  const monthlyBreakdown = [];
  let currentMonth = 0;
  let totalInterestPaid = 0;

  // Simulate month by month
  while (debtStates.some(d => d.balance > 0) && currentMonth < 600) { // 50 year max
    const currentDate = addMonths(startDate, currentMonth);
    const dateKey = format(currentDate, 'yyyy-MM');
    
    // Get extra payment for this month (custom or default)
    const monthlyExtraPayment = customPayments[dateKey] !== undefined 
      ? parseFloat(customPayments[dateKey]) 
      : parseFloat(extraPayment) || 0;

    let availableExtraPayment = monthlyExtraPayment;
    const monthData = {
      month: currentMonth,
      date: currentDate,
      payments: [],
      totalPaid: 0,
      totalInterest: 0,
      remainingBalance: 0
    };

    // Apply interest and minimum payments to all active debts
    for (let i = 0; i < debtStates.length; i++) {
      const debt = debtStates[i];
      if (debt.balance > 0) {
        // Calculate interest for the month
        const monthlyInterestRate = (debt.rate / 100) / 12;
        const interest = debt.balance * monthlyInterestRate;
        debt.balance += interest;
        debt.totalInterestPaid += interest;
        totalInterestPaid += interest;

        // Apply minimum payment
        const minPayment = Math.min(debt.minPayment, debt.balance);
        debt.balance -= minPayment;
        
        monthData.payments.push({
          debtName: debt.name,
          minPayment,
          extraPayment: 0,
          interest,
          remainingBalance: debt.balance
        });
        monthData.totalPaid += minPayment;
        monthData.totalInterest += interest;
      }
    }

    // Apply snowball: extra payment goes to first unpaid debt in order
    for (let debt of debtStates) {
      if (debt.balance > 0 && availableExtraPayment > 0) {
        const extraToThisDebt = Math.min(availableExtraPayment, debt.balance);
        debt.balance -= extraToThisDebt;
        availableExtraPayment -= extraToThisDebt;
        
        // Update the payment record for this debt
        const paymentRecord = monthData.payments.find(p => p.debtName === debt.name);
        if (paymentRecord) {
          paymentRecord.extraPayment = extraToThisDebt;
          paymentRecord.remainingBalance = debt.balance;
        }
        monthData.totalPaid += extraToThisDebt;

        // Mark debt as paid off
        if (debt.balance <= 0) {
          debt.balance = 0;
          debt.endDate = currentDate;
          debt.monthsPaid = currentMonth + 1;
        }
      }
    }

    // Calculate remaining total balance
    monthData.remainingBalance = debtStates.reduce((sum, d) => sum + d.balance, 0);
    monthlyBreakdown.push(monthData);

    currentMonth++;
  }

  // Find debt-free date
  const lastDebtPaidOff = debtStates
    .filter(d => d.endDate)
    .sort((a, b) => b.endDate - a.endDate)[0];
  
  const debtFreeDate = lastDebtPaidOff ? lastDebtPaidOff.endDate : null;

  // Build timeline for Gantt chart
  const debtTimeline = debtStates.map(debt => ({
    name: debt.name,
    category: debt.category,
    startDate: debt.startDate,
    endDate: debt.endDate || addMonths(startDate, currentMonth),
    startMonth: 0,
    endMonth: debt.endDate ? debt.monthsPaid : currentMonth,
    totalInterest: debt.totalInterestPaid,
    originalBalance: debt.balance + debt.totalInterestPaid, // rough estimate
    isPaidOff: debt.balance === 0
  }));

  return {
    debtFreeDate,
    totalInterestPaid,
    totalMonths: currentMonth,
    debtTimeline,
    monthlyBreakdown,
    finalDebtStates: debtStates
  };
}

/**
 * Compare different debt payoff strategies
 */
export function compareStrategies(debts, extraPayment) {
  // Avalanche: highest interest first
  const avalancheDebts = debts.map((d, i) => ({ ...d, order: i }))
    .sort((a, b) => parseFloat(b.rate) - parseFloat(a.rate))
    .map((d, i) => ({ ...d, order: i }));
  
  // Snowball: smallest balance first
  const snowballDebts = debts.map((d, i) => ({ ...d, order: i }))
    .sort((a, b) => parseFloat(a.balance) - parseFloat(b.balance))
    .map((d, i) => ({ ...d, order: i }));

  return {
    avalanche: calculateDebtPayoff(avalancheDebts, extraPayment),
    snowball: calculateDebtPayoff(snowballDebts, extraPayment),
    custom: calculateDebtPayoff(debts, extraPayment)
  };
}
