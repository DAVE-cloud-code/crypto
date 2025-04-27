import { getDashboardData } from '../api/userAPI.js';

let main, bonus, profit;
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');

  async function loadUserSettings() {
    try {
      const data = await getDashboardData(token);
      // Populate profile info
      document.getElementById('edit-fullname').value = data.fullname || '';
      document.getElementById('edit-username').value = data.username || '';
      document.getElementById('edit-email').value = data.email || '';
      document.getElementById('edit-phone').value = data.phone || '';
      document.getElementById('country').value = data.country || '';
      // Populate balance fields
     // Populate balance fields
     main = parseFloat(data.mainBalance || 0);
     profit = parseFloat(data.profitBalance || 0);
     bonus = parseFloat(data.bonusBalance || 0);
      const deposits = parseFloat(data.deposits[2] || 0);
      const total = main + profit + bonus;
      const userCurrency = data.currency || 'USD'; // Fallback to USD if not provided
      const formatter = new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: userCurrency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      
      document.getElementById('balance-main').value = formatter.format(main);
      document.getElementById('balance-profit').value = formatter.format(profit);
      document.getElementById('balance-bonus').value = formatter.format(bonus);
      document.getElementById('balance-deposits').value = formatter.format(deposits);
      document.getElementById('balance-total').value = formatter.format(total);
    } catch (err) {
      console.error('Error loading settings:', err);
    }
  }

  // Handle profile update
  document.getElementById('user-basic-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const updatedUser = {
      fullname: document.getElementById('edit-fullname').value,
      username: document.getElementById('edit-username').value,
      email: document.getElementById('edit-email').value,
      phone: document.getElementById('edit-phone').value,
      country: document.getElementById('country').value,
      currency: document.getElementById('currency').value
    };

    try {
      const res = await fetch('https://oreantrade.onrender.com/api/user/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedUser)
      });

      const result = await res.json();
      const msg = document.getElementById('profile-update-msg');
      if (res.ok) {
        msg.textContent = '✅ Profile updated successfully.';
        msg.style.color = 'green';
      } else {
        msg.textContent = result.message || '❌ Failed to update profile.';
        msg.style.color = 'red';
      }
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  });

  // Handle password update
  document.getElementById('password-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const oldPassword = document.getElementById('current-pass').value;
    const newPassword = document.getElementById('new-pass').value;
    const confirmPassword = document.getElementById('confirm-pass').value;
    const msg = document.getElementById('pass-update-msg');
    const errorMsg = document.getElementById('passwordError');
  
    // Clear previous messages
    msg.textContent = '';
    errorMsg.textContent = '';
  
    if (newPassword !== confirmPassword) {
      errorMsg.textContent = '❌ Passwords do not match!';
      errorMsg.style.color = 'red';
      return;
    }
  
    try {
      const res = await fetch('https://oreantrade.onrender.com/api/auth/update-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          oldPassword,
          newPassword
        })
      });
  
      const result = await res.json();
  
      if (res.ok) {
        msg.textContent = '✅ Password updated successfully!';
        msg.style.color = 'green';
        msg.style.display = 'block';
  
        // Clear input fields
        document.getElementById('current-pass').value = '';
        document.getElementById('new-pass').value = '';
        document.getElementById('confirm-pass').value = '';
      } else {
        errorMsg.textContent = result.message || '❌ Error updating password.';
        errorMsg.style.color = 'red';
      }
    } catch (err) {
      console.error(err);
      errorMsg.textContent = '❌ Something went wrong.';
      errorMsg.style.color = 'red';
    }
  });
  

  document.getElementById('transferForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const from = document.getElementById('fromBalance').value;
    const to = document.getElementById('toBalance').value;
    const amount = parseFloat(document.getElementById('transferAmount').value);
    const token = localStorage.getItem('token');
    const data = await getDashboardData(token)
  
    const errorMsg = document.getElementById('transferError');
    const successMsg = document.getElementById('transferSuccess');
    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';
  
    if (from === to) {
      errorMsg.textContent = "Can't transfer to the same balance";
      errorMsg.style.display = 'block';
      return;
    }
  
    if (isNaN(amount) || amount <= 0) {
      errorMsg.textContent = "Enter a valid amount";
      errorMsg.style.display = 'block';
      return;
    }
  
    // Balance logic
    const balances = { main, bonus, profit };
  
    if (balances[from] >= amount) {
      balances[from] -= amount;
      balances[to] += amount;
    } else {
      errorMsg.textContent = "Insufficient funds";
      errorMsg.style.display = 'block';
      return;
    }
  
    // Send update to server
    try {
      const res = await fetch('https://oreantrade.onrender.com/api/user/update-balance', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          mainBalance: balances.main,
          bonusBalance: balances.bonus,
          profitBalance: balances.profit
        })
      });
  
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || 'Error updating balances on server');
      }

      const userCurrency = data.currency || 'USD'; // Fallback to USD if not provided
      const formatter = new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: userCurrency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      // Update memory + UI
      main = balances.main;
      bonus = balances.bonus;
      profit = balances.profit;
  
      document.getElementById('balance-main').value = formatter.format(main);
      document.getElementById('balance-bonus').value = formatter.format(bonus);
      document.getElementById('balance-profit').value = formatter.format(profit);
  
      successMsg.textContent = `✅ Successfully transferred ${formatter.format(amount)} from ${from} to ${to}`;
      successMsg.style.display = 'block';
  
    } catch (err) {
      console.error('Transfer error:', err);
      errorMsg.textContent = '❌ Failed to update server.';
      errorMsg.style.display = 'block';
    }
});

const openModalBtn = document.getElementById('openTransferModal');
const transferModal = document.getElementById('transferModal');
const closeModalBtn = document.getElementById('closeModal');

openModalBtn.addEventListener('click', () => {
  transferModal.style.display = 'block';
});

closeModalBtn.addEventListener('click', () => {
  transferModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === transferModal) {
    transferModal.style.display = 'none';
  }
});

loadUserSettings();

})
