import { getDashboardData } from './userAPI.js';

const token = localStorage.getItem('token');

async function loadUserDashboard() {
  try {
    const data = await getDashboardData(token);
    const userCurrency = data.currency || 'USD';

    const formatCurrency = (amount) =>
      new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: userCurrency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);

    const userBalance = parseFloat(data.mainBalance || 0);
    const userProfit = parseFloat(data.profitBalance || 0);
    const walletBalance = parseFloat(data.mainBalance || 0);
    const mainBalance = parseFloat(data.mainBalance || 0);
    const profitBalance = parseFloat(data.profitBalance || 0);
    const bonusBalance = parseFloat(data.bonusBalance || 0);
    const totalBalance = mainBalance + profitBalance + bonusBalance;

    const safeSetText = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };

    safeSetText('user-fullname', data.fullname);
    safeSetText('header-fullname', data.fullname);
    safeSetText('user-username', data.username);
    safeSetText('greeting-name', data.username);

    safeSetText('user-balance', formatCurrency(userBalance));
    safeSetText('wallet-balance', formatCurrency(walletBalance));
    safeSetText('user-profit', formatCurrency(userProfit));
    safeSetText('total-balance', formatCurrency(totalBalance));
    safeSetText('deposit-balance', formatCurrency(mainBalance));
    safeSetText('profit-balance', formatCurrency(profitBalance));
    safeSetText('bonus-balance', formatCurrency(bonusBalance));

    const aiTradingEl = document.getElementById('ai-trading');
    if (aiTradingEl) {
      const tradingStatus = data.aiTradingEnabled ? 'Active ✅' : 'Inactive ❌';
      const tradingColor = data.aiTradingEnabled ? 'green' : 'red';
      aiTradingEl.textContent = tradingStatus;
      aiTradingEl.className = tradingColor;
    }

    const withdrawals = data.withdrawals || [];
    const tbody = document.querySelector('#withdrawal-table tbody');

    if (tbody) {
      tbody.innerHTML = '';

      if (withdrawals.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3">No withdrawal history available.</td></tr>`;
      } else {
        withdrawals.forEach(tx => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${formatCurrency(tx.amount)}</td>
            <td style="color: ${tx.status === 'completed' ? 'green' : tx.status === 'pending' ? 'orange' : 'red'}">
              ${tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
            </td>
            <td>${new Date(tx.createdAt).toLocaleString()}</td>
          `;
          tbody.appendChild(row);
        });
      }
    } else {
      console.warn('Withdrawal table or tbody not found in DOM.');
    }

  } catch (error) {
    console.error('Error loading dashboard data:', error);
  }
}

window.addEventListener('DOMContentLoaded', loadUserDashboard);
