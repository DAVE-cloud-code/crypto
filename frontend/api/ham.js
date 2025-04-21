
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