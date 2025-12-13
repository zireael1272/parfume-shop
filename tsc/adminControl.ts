document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    if (e.target instanceof Element && e.target.closest("#adm-logout")) {
      e.preventDefault();
      localStorage.clear();
      window.location.href = "/index";
    }
  });
});
