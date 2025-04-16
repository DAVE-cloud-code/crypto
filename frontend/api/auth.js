

document.addEventListener("DOMContentLoaded", () => {
  const logoutLink = document.getElementById("logoutLink");

  logoutLink.addEventListener("click", logoutUser);

  function logoutUser() {
    localStorage.removeItem("token");
    window.location.href = "signin.html";
  }
});


