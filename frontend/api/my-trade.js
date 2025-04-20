import { getDashboardData } from "./userAPI.js";
      
const token = localStorage.getItem('token'); // Adjust if stored differently
async function loadUserDashboard() {
  try {
    const data = await getDashboardData(token);
    const userBalance = parseFloat(data.mainBalance || 0);
    const userProfit = parseFloat(data.profitBalance || 0);
    const walletBalance = parseFloat(data.mainBalance || 0);
    // Set values dynamically
    document.getElementById('user-fullname').textContent = data.fullname;
    document.getElementById('header-fullname').textContent = data.fullname;
    document.getElementById('user-username').textContent = data.username;
    document.getElementById('greeting-name').textContent = data.username;

    document.getElementById('user-balance').textContent = `$${userBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('wallet-balance').textContent = `$${walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('user-profit').textContent = `$${userProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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


document.addEventListener('DOMContentLoaded', () => {
    const tradeHistory = document.getElementById('tradeHistory');
    const statusFilter = document.getElementById('tradeStatusFilter');
    const currentPageLabel = document.getElementById('currentPage');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const sortAsset = document.getElementById('sortAsset');
    const sortAmount = document.getElementById('sortAmount');
  
    const token = localStorage.getItem('token');
    let allTrades = [];
    let currentPage = 1;
    const tradesPerPage = 5;
    let currentSort = { field: null, order: 'asc' };
  
    if (!token) return console.error("User not authenticated");
  
    function appendToHistory(trade) {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${trade.asset}</td>
        <td>$${parseFloat(trade.amount).toFixed(2)}</td>
        <td>${trade.marketType}</td>
        <td>${trade.duration}</td>
        <td>${trade.leverage}x</td>
        <td>${trade.fromBalance === 'mainBalance' ? 'Main' : 'Profit'}</td>
      `;
      tradeHistory.appendChild(row);
    }
  
    function displayPage(page) {
      tradeHistory.innerHTML = '';
      const start = (page - 1) * tradesPerPage;
      const end = start + tradesPerPage;
      const paginatedTrades = allTrades.slice(start, end);
  
      if (paginatedTrades.length === 0) {
        tradeHistory.innerHTML = `<tr><td colspan="6">No trades found</td></tr>`;
      } else {
        paginatedTrades.forEach(trade => appendToHistory(trade));
      }
  
      currentPageLabel.textContent = `Page ${page}`;
      prevBtn.disabled = page === 1;
      nextBtn.disabled = end >= allTrades.length;
    }
  
    function sortTrades(field) {
      const order = currentSort.field === field && currentSort.order === 'asc' ? 'desc' : 'asc';
      currentSort = { field, order };
  
      allTrades.sort((a, b) => {
        let valA = a[field];
        let valB = b[field];
  
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
  
        if (valA < valB) return order === 'asc' ? -1 : 1;
        if (valA > valB) return order === 'asc' ? 1 : -1;
        return 0;
      });
  
      displayPage(currentPage);
    }
  
    function loadTrades(status = 'all') {
      fetch(`https://oreantrade.onrender.com/api/user/trades?status=${status}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          allTrades = data.trades || [];
          currentPage = 1;
          displayPage(currentPage);
        })
        .catch(err => console.error("Failed to load trades:", err));
    }
  
    // Filter
    statusFilter.addEventListener('change', () => {
      const status = statusFilter.value;
      loadTrades(status);
    });
  
    // Pagination
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        displayPage(currentPage);
      }
    });
  
    nextBtn.addEventListener('click', () => {
      if ((currentPage * tradesPerPage) < allTrades.length) {
        currentPage++;
        displayPage(currentPage);
      }
    });
  
    // Sorting
    sortAsset.addEventListener('click', () => sortTrades('asset'));
    sortAmount.addEventListener('click', () => sortTrades('amount'));
  
    // Initial load
    loadTrades();
  });
  




document.addEventListener("DOMContentLoaded", () => {
    const logoutLink = document.getElementById("logoutLink");
  
    logoutLink.addEventListener("click", logoutUser);
  
    function logoutUser() {
      localStorage.removeItem("token");
      window.location.href = "../signin.html";
    }
  });
  
  
  