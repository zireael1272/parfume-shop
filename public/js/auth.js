document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.querySelector(".wrapper");
  const loginForm = document.querySelector(".form-box.login");
  const registerForm = document.querySelector(".form-box.register");
  const registerLink = document.querySelector(".register-link");
  const loginLink = document.querySelector(".login-link");
  const registerFormElement = document.getElementById("registerForm");
  const closeModal = document.querySelector(".close-btn");

  function isUserLoggedIn() {
    return localStorage.getItem("isLoggedIn") === "true";
  }

  document.querySelector(".account").addEventListener("click", (e) => {
    e.preventDefault();

    if (isUserLoggedIn()) {
      window.location.href = "account.html";
    } else {
      wrapper.classList.add("active-popup");
      loginForm.classList.add("active");
      registerForm.classList.remove("active");
    }
  });

  registerLink.addEventListener("click", (e) => {
    e.preventDefault();
    wrapper.classList.add("active");
  });

  loginLink.addEventListener("click", (e) => {
    e.preventDefault();
    wrapper.classList.remove("active");
  });

  if (closeModal) {
    closeModal.addEventListener("click", () => {
      wrapper.classList.remove("active-popup", "active");
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === wrapper) {
      wrapper.classList.remove("active-popup", "active");
    }
  });

  if (registerFormElement) {
    registerFormElement.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = registerFormElement
        .querySelector('input[type="email"]')
        .value.trim();
      const password = registerFormElement.querySelector(".password").value.trim();
      const passwordAgain = registerFormElement
        .querySelector(".password-again")
        .value.trim();

      if (!email || !password || !passwordAgain) {
        alert("Please fill in all fields.");
        return;
      }

      if (password !== passwordAgain) {
        alert("Passwords do not match.");
        return;
      }

      try {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("userEmail", email);
          window.location.href = "account.html";
        } else {
          alert(data.message || "Registration failed.");
        }
      } catch (err) {
        console.error(err);
        alert("Server error");
      }
    });
  }

  const loginFormElement = document.getElementById("loginForm");
  if (loginFormElement) {
    loginFormElement.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = loginFormElement
        .querySelector('input[type="email"]')
        .value.trim();
      const password = loginFormElement
        .querySelector('input[type="password"]')
        .value.trim();

      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("userEmail", email);
          localStorage.setItem("userRole", data.user.role);
          if (data.user.role === "admin") {
            window.location.href = "admPanel.html";
          } else {
            window.location.href = "account.html";
          }
        } else {
          alert(data.message || "Login failed.");
        }
      } catch (err) {
        console.error(err);
        alert("Server error");
      }
    });
  }
});
