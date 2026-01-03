// Mimic React useEffect console error
const path = window.location.pathname;
console.error("404 Error: User attempted to access non-existent route:", path);

document.getElementById("path").textContent = `Path: ${path}`;