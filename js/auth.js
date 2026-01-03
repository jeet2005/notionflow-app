function switchTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.form').forEach(f => f.classList.remove('active'));

  document.querySelector(`.tab[onclick*="${tab}"]`).classList.add('active');
  document.getElementById(tab).classList.add('active');

  document.getElementById('error').style.display = 'none';
}

// Apply theme
const theme = localStorage.getItem("theme") || "system";
let actualTheme = theme;
if (theme === "system") {
  actualTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
document.body.classList.toggle("dark", actualTheme === "dark");

function submitAuth(e, type) {
  e.preventDefault();

  const email = document.getElementById(type + 'Email').value.trim();
  const password = document.getElementById(type + 'Password').value.trim();
  const errorBox = document.getElementById('error');
  const btn = document.getElementById(type + 'Btn');

  errorBox.style.display = 'none';

  if (!email.includes('@')) {
    showError('Please enter a valid email');
    return;
  }

  if (password.length < 6) {
    showError('Password must be at least 6 characters');
    return;
  }

  btn.disabled = true;
  btn.innerHTML = `<span class="loader"></span>${type === 'signin' ? 'Signing In' : 'Creating Account'}`;

  setTimeout(() => {
    localStorage.setItem('user', JSON.stringify({ email }));
    window.location.href = "workspace.html";
  }, 1200);
}

function showError(msg) {
  const errorBox = document.getElementById('error');
  errorBox.textContent = msg;
  errorBox.style.display = 'block';
}
