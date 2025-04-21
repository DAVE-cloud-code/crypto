document.getElementById('loan-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const amount = Number(document.getElementById('loan-amount').value);
  const duration = Number(document.getElementById('loan-duration').value);
  const monthlyIncome = Number(document.getElementById('monthly-income').value);
  const acceptedTerms = document.getElementById('accept-terms').checked;

  if (!acceptedTerms) {
    alert('Please accept the terms of the loan.');
    return;
  }

  const token = localStorage.getItem('token'); // Or however you're storing the token
  const loanData = { amount, duration, monthlyIncome, acceptedTerms };

  try {
    const res = await fetch('https://oreantrade.onrender.com/api/user/place-loan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(loanData)
    });

    const data = await res.json();
    console.log('Loan submitted:', data);
    document.getElementById('loan-form').reset();
    fetchLoans();
  } catch (error) {
    console.error('Error submitting loan:', error);
  }
});

async function fetchLoans() {
  const token = localStorage.getItem('token');

  try {
    const res = await fetch('https://oreantrade.onrender.com/api/user/get-loan', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await res.json();
    const tbody = document.querySelector('#loan-table tbody');
    tbody.innerHTML = '';

    data.forEach(loan => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${loan.amount}</td>
        <td>${loan.duration}</td>
        <td>${loan.monthlyIncome}</td>
        <td>${loan.status || 'pending'}</td>
        <td>${loan.totalPayable || 'N/A'}</td>
      `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error('Error fetching loans:', error);
  }
}

document.addEventListener('DOMContentLoaded', fetchLoans);


  
  document.addEventListener("DOMContentLoaded", () => {
    const logoutLink = document.getElementById("logoutLink");
  
    logoutLink.addEventListener("click", logoutUser);
  
    function logoutUser() {
      localStorage.removeItem("token");
      window.location.href = "../signin.html";
    }
  });

  
  