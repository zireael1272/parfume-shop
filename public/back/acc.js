const navLinks = document.querySelectorAll(".vertical-nav a");
const sections = document.querySelectorAll(".content-section");

function showSection(sectionId) {
  sections.forEach((sec) => (sec.style.display = "none"));
  const activeSection = document.getElementById(sectionId);
  if (activeSection) activeSection.style.display = "block";

  navLinks.forEach((l) => l.classList.remove("active"));
  const activeLink = document.querySelector(
    `.vertical-nav a[data-section="${sectionId}"]`
  );
  if (activeLink) activeLink.classList.add("active");
}

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const sectionId = link.getAttribute("data-section");

    if (sectionId === "logout") {
      localStorage.clear();
      window.location.href = "main.html";
      return;
    }

    showSection(sectionId);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  showSection("contact");
});
