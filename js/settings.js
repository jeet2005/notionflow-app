// ---------- AUTH GUARD ----------
const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
  window.location.href = "auth.html";
}

// ---------- INIT ----------
document.getElementById("email").value = user.email || "user@example.com";
document.getElementById("userId").value = user.id || "local-user";
document.getElementById("createdAt").textContent =
  new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

document.getElementById("displayName").value =
  localStorage.getItem("displayName") || "";

const savedTheme = localStorage.getItem("theme") || "system";
setTheme(savedTheme, false);

// Listen for system theme changes
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  if (localStorage.getItem("theme") === "system") {
    setTheme("system", false);
  }
});

// ---------- FUNCTIONS ----------
function goBack() {
  window.location.href = "workspace.html";
}

function switchTab(tab) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));

  document.querySelector(`.tab[onclick*="${tab}"]`).classList.add("active");
  document.getElementById(tab).classList.add("active");
}

function saveProfile() {
  const name = document.getElementById("displayName").value.trim();
  localStorage.setItem("displayName", name);
  alert("Profile saved");
}

function setTheme(theme, persist = true) {
  let actualTheme = theme;
  if (theme === "system") {
    actualTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  document.body.classList.toggle("dark", actualTheme === "dark");
  document.querySelectorAll(".theme").forEach(t => t.classList.remove("active"));

  document.querySelector(`.theme[onclick*="${theme}"]`)?.classList.add("active");

  if (persist) localStorage.setItem("theme", theme);
}
