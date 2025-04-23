const token = localStorage.getItem("adminToken");
let currentPage = 1;
const usersPerPage = 5;
let allUsers = [];

const fetchAndDisplayUsers = async () => {
  try {
    const res = await fetch("http://localhost:1800/api/auth/get-users", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    allUsers = await res.json();
    displayUsers();
    // document.getElementById("totalUsers").textContent = allUsers.length;
  } catch (err) {
    console.error("Error fetching users:", err);
  }
};

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
        <button onclick="sendEmail('${user.email}')">📧 Email</button>
        <button onclick='viewDetails(${JSON.stringify(user)})'>🔍 View</button>
        <button onclick="deleteUser('${user._id}')">🗑️ Delete</button>
      </td>
    `;

    tbody.appendChild(row);
  });

  document.getElementById("pageInfo").textContent = `Page ${currentPage} of ${Math.ceil(allUsers.length / usersPerPage)}`;
};

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

window.sendEmail = (email) => {
  window.location.href = `mailto:${email}`;
};

window.viewDetails = (user) => {
  document.getElementById("modalFullname").textContent = user.fullname;
  document.getElementById("modalEmail").textContent = user.email;
  document.getElementById("modalUsername").textContent = user.username;
  document.getElementById("modalRole").textContent = user.role;
  document.getElementById("userModal").style.display = "block";
};

window.deleteUser = async (userId) => {
  if (!confirm("Are you sure you want to delete this user?")) return;

  try {
    const res = await fetch(`http://localhost:1800/api/auth/delete-user/${userId}`, {
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

document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("userModal").style.display = "none";
});

fetchAndDisplayUsers();
