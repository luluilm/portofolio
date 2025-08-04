function toggleMode() {
  const body = document.body;
  const toggleBtn = document.querySelector('.toggle-mode');
  body.classList.toggle('dark-mode');

  // Update button text based on the current mode
  if (body.classList.contains('dark-mode')) {
    toggleBtn.textContent = 'Light Mode';
  } else {
    toggleBtn.textContent = 'Dark Mode';
  }
}

// Set default button text on page load
window.onload = function () {
  const toggleBtn = document.querySelector('.toggle-mode');
  const body = document.body;
  if (body.classList.contains('dark-mode')) {
    toggleBtn.textContent = 'Light Mode';
  } else {
    toggleBtn.textContent = 'Dark Mode';
  }
};
