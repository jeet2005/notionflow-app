/* ---------- AUTH GUARD ---------- */
const API_URL = "http://127.0.0.1:8000";
const token = localStorage.getItem("token");
if (!token) {
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
let pages = [];
let activePageId = null;

/* ---------- INIT ---------- */
async function init() {
  await loadPages();
  if (pages.length === 0) {
    await createPageAPI("Welcome", "Welcome to NotionFlow! This is your first page. Start writing...");
  }
  selectPage(pages[0].id);
  renderPages();
}

init();

/* ---------- API FUNCTIONS ---------- */

async function loadPages() {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${API_URL}/pages/?user_id=current_user`, {
      method: "GET",
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    if (response.ok) {
      pages = await response.json();
      console.log("Pages loaded:", pages);
    } else {
      console.error("Failed to load pages:", response.statusText);
    }
  } catch (error) {
    console.error("Error loading pages:", error);
  }
}

async function createPageAPI(title, content) {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${API_URL}/pages/?user_id=current_user`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ title, content })
    });
    if (response.ok) {
      const newPage = await response.json();
      pages.unshift(newPage);
      return newPage.id;
    } else {
      console.error("Failed to create page:", response.statusText);
    }
  } catch (error) {
    console.error("Error creating page:", error);
  }
}

async function updatePageAPI(pageId, title, content) {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${API_URL}/pages/${pageId}?user_id=current_user`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      console.error("Failed to update page:", response.statusText);
    }
  } catch (error) {
    console.error("Error updating page:", error);
  }
}

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
  createPageAPI(title, "").then(id => {
    if (id) {
      selectPage(id);
      renderPages();
    }
  });
}

function updateTitle(el) {
  const page = pages.find(p => p.id === activePageId);
  page.title = el.innerText;
  updatePageAPI(activePageId, page.title, page.content);
  renderPages();
}

function updateContent(el) {
  const page = pages.find(p => p.id === activePageId);
  page.content = el.value;
  updatePageAPI(activePageId, page.title, page.content);
}
