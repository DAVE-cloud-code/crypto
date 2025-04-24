import { getDashboardData } from './userAPI.js';

document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    let isOpen = false;

    hamburger.addEventListener('click', () => {
      isOpen = !isOpen;

      if (isOpen) {
        sidebar.classList.add('active');
        overlay.style.display = 'block';
        hamburger.innerHTML = '&times;'; // close icon
      } else {
        sidebar.classList.remove('active');
        overlay.style.display = 'none';
        hamburger.innerHTML = '&#9776;'; // hamburger icon
      }
    });

    overlay.addEventListener('click', () => {
      sidebar.classList.remove('active');
      overlay.style.display = 'none';
      hamburger.innerHTML = '&#9776;';
      isOpen = false;
    });
  });
        
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
      
      document.getElementById('user-balance').textContent = formatCurrency(userBalance);
      document.getElementById('wallet-balance').textContent = formatCurrency(walletBalance);
      document.getElementById('user-profit').textContent = formatCurrency(userProfit);
      
      document.getElementById('total-balance').textContent = formatCurrency(totalBalance);
      document.getElementById('deposit-balance').textContent = formatCurrency(mainBalance);
      document.getElementById('profit-balance').textContent = formatCurrency(profitBalance);
      document.getElementById('bonus-balance').textContent = formatCurrency(bonusBalance);
  
      
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