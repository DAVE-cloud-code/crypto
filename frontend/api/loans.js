document.getElementById('loan-form').addEventListener('submit', function (e) {
    e.preventDefault();
  
    // Get form values
    const loanAmount = document.getElementById('loan-amount').value;
    const loanDuration = document.getElementById('loan-duration').value;
    const monthlyIncome = document.getElementById('monthly-income').value;
    const acceptTerms = document.getElementById('accept-terms').checked;
  
    // Check if the user accepted the terms
    if (!acceptTerms) {
      alert('Please accept the terms of the loan.');
      return;
    }
  
    // Prepare the loan data to be sent to the backend
    const loanData = {
      loanAmount: loanAmount,
      loanDuration: loanDuration,
      monthlyIncome: monthlyIncome
    };
  
    // Send the loan data to the backend
    fetch('http://localhost:5000/api/loans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loanData)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Loan submitted successfully:', data);
        // Clear form fields
        document.getElementById('loan-amount').value = '';
        document.getElementById('loan-duration').value = '';
        document.getElementById('monthly-income').value = '';
        document.getElementById('accept-terms').checked = false;
  
        // Fetch and update the table with the latest loan data
        fetchLoans();
      })
      .catch(error => {
        console.error('Error submitting loan:', error);
      });
  });
  
  // Fetch loans and update the table
  function fetchLoans() {
    fetch('http://localhost:5000/api/loans')
      .then(response => response.json())
      .then(data => {
        const loanTableBody = document.querySelector('#loan-table tbody');
        loanTableBody.innerHTML = ''; // Clear the table
  
        // Add new rows to the table
        data.forEach(loan => {
          const newRow = document.createElement('tr');
          newRow.innerHTML = `
            <td>${loan.loanAmount}</td>
            <td>${loan.loanDuration}</td>
            <td>${loan.monthlyIncome}</td>
          `;
          loanTableBody.appendChild(newRow);
        });
      })
      .catch(error => {
        console.error('Error fetching loans:', error);
      });
  }
  
  // Fetch loans when the page loads
  document.addEventListener('DOMContentLoaded', function () {
    fetchLoans();
  });
  

  
  document.addEventListener("DOMContentLoaded", () => {
    const logoutLink = document.getElementById("logoutLink");
  
    logoutLink.addEventListener("click", logoutUser);
  
    function logoutUser() {
      localStorage.removeItem("token");
      window.location.href = "../signin.html";
    }
  });

  
  