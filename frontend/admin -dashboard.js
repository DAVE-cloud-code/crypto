

const token = localStorage.getItem("token"); // Or wherever you're storing it

const fetchUserCount = async () => {
  try {
    const res = await fetch("https://oreantrade.onrender.com/api/auth/get-users", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) throw new Error("Failed to fetch users");
    const users = await res.json();
    document.getElementById("userCount").textContent = users.length;
  } catch (err) {
    console.error("Error fetching user count:", err);
  }
};

fetchUserCount();