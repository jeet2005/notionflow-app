/* ---------- AUTH GUARD ---------- */
const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
  window.location.href = "auth.html";
}

/* ---------- THEME ---------- */
function applyTheme() {
  const theme = localStorage.getItem("theme") || "system";
  let actualTheme = theme;
  if (theme === "system") {
    actualTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  document.body.classList.toggle("dark", actualTheme === "dark");
}
applyTheme();

// Listen for system theme changes
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  if (localStorage.getItem("theme") === "system") {
    applyTheme();
  }
});

/* ---------- DATA ---------- */
let pages = JSON.parse(localStorage.getItem("pages")) || [];
let activePageId = null;

/* ---------- INIT ---------- */
if (pages.length === 0) {
  const welcomePage = {
    id: Date.now().toString(),
    title: "Welcome",
    content: "Welcome to NotionFlow! This is your first page. Start writing...",
    createdAt: Date.now()
  };
  pages.push(welcomePage);
  save();
  selectPage(welcomePage.id);
} else {
  selectPage(pages[0].id);
}

renderPages();

/* ---------- FUNCTIONS ---------- */

function renderPages() {
  const container = document.getElementById("pages");
  container.innerHTML = "";

  pages.forEach(page => {
    const div = document.createElement("div");
    div.className = "page" + (page.id === activePageId ? " active" : "");
    div.textContent = page.title;
    div.onclick = () => selectPage(page.id);
    container.appendChild(div);
  });
}

function selectPage(id) {
  activePageId = id;
  const page = pages.find(p => p.id === id);
  renderPages();

  document.getElementById("editorContent").innerHTML = `
    <h1 contenteditable="true" oninput="updateTitle(this)">
      ${page.title}
    </h1>
    <textarea oninput="updateContent(this)">${page.content}</textarea>
  `;
}

function createPage(title = "Untitled") {
  const page = {
    id: Date.now().toString(),
    title,
    content: "",
    createdAt: Date.now()
  };

  pages.unshift(page);
  save();
  selectPage(page.id);
}

function updateTitle(el) {
  const page = pages.find(p => p.id === activePageId);
  page.title = el.innerText;
  save();
  renderPages();
}

function updateContent(el) {
  const page = pages.find(p => p.id === activePageId);
  page.content = el.value;
  save();
}

function save() {
  localStorage.setItem("pages", JSON.stringify(pages));
}
