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

async function submitAuth(e, type) {
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

  const endpoint = type === 'signin' ? '/auth/login' : '/auth/register';
  const body = type === 'signin' ? { email, password } : { email, password, display_name: '' };

  try {
    const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.access_token);
      window.location.href = "workspace.html";
    } else {
      showError(data.detail || 'Authentication failed');
      btn.disabled = false;
      btn.innerHTML = type === 'signin' ? 'Sign In' : 'Create Account';
    }
  } catch (error) {
    showError('Network error. Please try again.');
    btn.disabled = false;
    btn.innerHTML = type === 'signin' ? 'Sign In' : 'Create Account';
  }
}

function showError(msg) {
  const errorBox = document.getElementById('error');
  errorBox.textContent = msg;
  errorBox.style.display = 'block';
}
