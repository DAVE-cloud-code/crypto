const token = localStorage.getItem("adminToken");
let currentPage = 1;
const usersPerPage = 5;
let allUsers = [];

// Redirect to login if admin is not logged in
if (!token) {
  window.location.href = 'admin.html'; 
}


// Hamburger toggle
const hamburger = document.getElementById("hamburger");
const sidebar = document.getElementById("sidebar");

// Toggle sidebar visibility
hamburger.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

// Fetch and display users
const fetchAndDisplayUsers = async () => {
  try {
    const res = await fetch("https://oreantrade.onrender.com/api/auth/get-users", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    allUsers = await res.json();
    displayUsers();
  } catch (err) {
    console.error("Error fetching users:", err);
  }
};

// Display users in the table
const displayUsers = () => {
  const tbody = document.getElementById("userTableBody");
  tbody.innerHTML = "";

  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = allUsers.slice(startIndex, startIndex + usersPerPage);

  currentUsers.forEach((user, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${startIndex + index + 1}</td>
    <td>${user.fullname}</td>
    <td>${user.email}</td>
    <td>${user.username}</td>
    <td>${user.role}</td>
    <td>
      <button class="email-btn" onclick="sendEmail('${user.email}')">📧 Email</button>
      <button class="view-btn" onclick='viewDetails(${JSON.stringify(user)})'>🔍 View</button>
      <button class="delete-btn" onclick="deleteUser('${user._id}')">🗑️ Delete</button>
    </td>
  `;
    tbody.appendChild(row);
  });

  document.getElementById("pageInfo").textContent = `Page ${currentPage} of ${Math.ceil(allUsers.length / usersPerPage)}`;
};


// Pagination functionality
document.getElementById("prevPage").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    displayUsers();
  }
});

document.getElementById("nextPage").addEventListener("click", () => {
  if (currentPage * usersPerPage < allUsers.length) {
    currentPage++;
    displayUsers();
  }
});

// Email functionality
let selectedEmail = "";

window.sendEmail = (email) => {
  selectedEmail = email;
  document.getElementById("emailRecipient").textContent = `To: ${email}`;
  document.getElementById("emailMessage").value = "";
  document.getElementById("emailModal").style.display = "block";
};

// Close the modal
document.getElementById("closeEmailModal").addEventListener("click", () => {
  document.getElementById("emailModal").style.display = "none";
});

// Send email
document.getElementById("sendEmailBtn").addEventListener("click", async () => {
  const message = document.getElementById("emailMessage").value.trim();

  if (!message) {
    alert("Message cannot be empty.");
    return;
  }

  try {
    const res = await fetch("https://oreantrade.onrender.com/api/auth/send-email", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: selectedEmail,
        message
      })
    });

    if (!res.ok) throw new Error("Failed to send email");

    alert("Email sent successfully!");
    document.getElementById("emailModal").style.display = "none";
  } catch (err) {
    console.error("Email send error:", err);
    alert("Failed to send email.");
  }
});


window.viewDetails = (user) => {
  // Save the user data to localStorage
  localStorage.setItem('selectedUser', JSON.stringify(user));

  // Redirect to the user details page
  window.location.href = './user-details.html';
};

// Delete user functionality
window.deleteUser = async (userId) => {
  if (!confirm("Are you sure you want to delete this user?")) return;

  try {
    const res = await fetch(`https://oreantrade.onrender.com/api/auth/delete-user/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) throw new Error("Failed to delete user");

    alert("User deleted successfully");
    await fetchAndDisplayUsers();
  } catch (err) {
    console.error("Delete error:", err);
  }
};
// Initialize and fetch users
fetchAndDisplayUsers();


