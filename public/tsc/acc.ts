const navLinks = document.querySelectorAll(".vertical-nav a");
const contactSection = document.getElementById("contact");
const historySection = document.getElementById("history");

function showSection(sectionId: string | null) {
  if (!contactSection) return;
  if (!historySection) return;
  contactSection.style.display = "none";
  historySection.style.display = "none";

  if (sectionId === "contact") {
    contactSection.style.display = "flex";
  } else if (sectionId === "history") {
    historySection.style.display = "block";
  }

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
      window.location.href = "/index";
      return;
    }

    showSection(sectionId);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  showSection("contact");
});
