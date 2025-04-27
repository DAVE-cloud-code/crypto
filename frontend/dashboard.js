
import { getDashboardData } from './api/userAPI.js';
      
const token = localStorage.getItem('token'); // Adjust if stored differently
async function loadUserDashboard() {
  try {
    const data = await getDashboardData(token);
    const userCurrency = data.currency || 'USD'; // fallback to USD if currency is missing
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
    
    // Set values dynamically
    document.getElementById('user-fullname').textContent = data.fullname;
    document.getElementById('header-fullname').textContent = data.fullname;
    document.getElementById('user-username').textContent = data.username;
    document.getElementById('greeting-name').textContent = data.username;
    
// Helper function to set balances
function setBalance(id, value) {
  const el = document.getElementById(id);
  const formatted = formatCurrency(value);
  el.textContent = formatted;
  el.setAttribute('data-real-value', formatted);
  el.setAttribute('data-hidden', 'false');
}

// Set balances
setBalance('user-balance', userBalance);
setBalance('wallet-balance', walletBalance);
setBalance('user-profit', userProfit);
setBalance('total-balance', totalBalance);
setBalance('deposit-balance', mainBalance);
setBalance('profit-balance', profitBalance);
setBalance('bonus-balance', bonusBalance);
    
    // Optional: AI Trading status
    const tradingStatus = data.aiTradingEnabled ? 'Active ✅' : 'Inactive ❌';
    const tradingColor = data.aiTradingEnabled ? 'green' : 'red';
    const aiTradingEl = document.getElementById('ai-trading');
    aiTradingEl.textContent = tradingStatus;
    aiTradingEl.className = tradingColor;

    // Optional: Avatar (if you support profile pictures)
    // document.getElementById('user-avatar').src = data.profilePicUrl || 'https://via.placeholder.com/60';
  } catch (err) {
    console.error('Dashboard load error:', err);
  }
}

loadUserDashboard();



const ctx = document.getElementById('balanceChart').getContext('2d');
  const badge = document.getElementById('growth-badge');

  const generateData = (days) => {
    const data = [];
    const labels = [];
    let balance = 1000;

    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      balance += Math.random() * 50 - 25;
      labels.push(date.toLocaleDateString());
      data.push(parseFloat(balance.toFixed(2)));
    }

    return { labels, data };
  };

  const updateGrowthBadge = (data) => {
    const start = data[0];
    const end = data[data.length - 1];
    const growth = (((end - start) / start) * 100).toFixed(2);
    badge.textContent = `${growth > 0 ? '+' : ''}${growth}%`;

    badge.classList.remove('negative');
    if (growth < 0) {
      badge.classList.add('negative');
    }
  };

  let currentData = generateData(7);
  updateGrowthBadge(currentData.data);

  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: currentData.labels,
      datasets: [{
        label: 'Balance',
        data: currentData.data,
        borderColor: '#1e3a8a',
        backgroundColor: 'rgba(30, 58, 138, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      animation: {
        duration: 1500,
        easing: 'easeOutQuart'
      },
      plugins: {
        tooltip: {
          mode: 'index',
          intersect: false,
        }
      },
      scales: {
        x: { display: true },
        y: { display: true }
      }
    }
  });

  document.getElementById('dateRange').addEventListener('change', (e) => {
    const range = e.target.value === 'all' ? 60 : parseInt(e.target.value);
    const newData = generateData(range);
    chart.data.labels = newData.labels;
    chart.data.datasets[0].data = newData.data;
    chart.update();
    updateGrowthBadge(newData.data);
  }); 
  

    
    

    