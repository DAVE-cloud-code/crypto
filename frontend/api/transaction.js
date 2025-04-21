
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token"); // adjust if you're storing it differently
  const tableBody = document.querySelector("#transactionsTable tbody");

  const fetchTransactions = async () => {
    try {
      const res = await fetch("https://oreantrade.onrender.com/api/user/transactions", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      const data = await res.json();

      if (res.ok) {
        data.transactions.forEach((tx, index) => {
          const row = document.createElement("tr");

          row.innerHTML = `
            <td>${index + 1}</td>
            <td>${tx.type}</td>
            <td>${tx.amount}</td>
            <td>${tx.status}</td>
            <td>${new Date(tx.createdAt).toLocaleString()}</td>
          `;

          tableBody.appendChild(row);
        });
      } else {
        alert("Error fetching transactions: " + data.message);
      }
    } catch (err) {
      console.error("Error loading transactions:", err);
    }
  };

  fetchTransactions();
});



document.addEventListener("DOMContentLoaded", () => {
    const logoutLink = document.getElementById("logoutLink");
  
    logoutLink.addEventListener("click", logoutUser);
  
    function logoutUser() {
      localStorage.removeItem("token");
      window.location.href = "signin.html";
    }
  });
  
  
  