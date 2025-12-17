document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/pages/authModal.html");
    if (response.ok) {
      const html = await response.text();
      document.body.insertAdjacentHTML("beforeend", html);
      initAuthLogic();
    } else {
      console.error("Failed to load auth modal");
    }
  } catch (err) {
    console.error("Error loading auth component:", err);
  }
});

function initAuthLogic() {
  const wrapper = document.querySelector(".wrapper");
  const loginForm = document.querySelector(".form-box.login");
  const registerForm = document.querySelector(".form-box.register");
  const registerLink = document.querySelector(".register-link");
  const loginLink = document.querySelector(".login-link");
  const closeBtn = document.getElementById("closeBtn");
  const registerFormElement = document.getElementById("registerForm");
  const loginFormElement = document.getElementById("loginForm");

  function isUserLoggedIn() {
    return localStorage.getItem("isLoggedIn") === "true";
  }

  function getUserRole() {
    return localStorage.getItem("userRole");
  }

  const accountBtn = document.querySelector(".account-btn");
  if (accountBtn) {
    accountBtn.addEventListener("click", (e) => {
      e.preventDefault();

      if (isUserLoggedIn()) {
        const role = getUserRole();
        if (role === "admin") {
          window.location.href = "/admPanel";
        } else {
          window.location.href = "/account";
        }
      } else {
        if (wrapper) {
          wrapper.classList.add("active-popup");
          loginForm?.classList.add("active");
          registerForm?.classList.remove("active");
        }
      }
    });
  }

  if (registerLink && wrapper) {
    registerLink.addEventListener("click", (e) => {
      e.preventDefault();
      wrapper.classList.add("active");
    });
  }

  if (loginLink && wrapper) {
    loginLink.addEventListener("click", (e) => {
      e.preventDefault();
      wrapper.classList.remove("active");
    });
  }

  if (closeBtn && wrapper) {
    closeBtn.addEventListener("click", () => {
      wrapper.classList.remove("active-popup");
    });
  }

  window.addEventListener("click", (e) => {
    if (!wrapper) return;
    if (e.target === wrapper) {
      wrapper.classList.remove("active-popup");
    }
  });

  if (registerFormElement) {
    registerFormElement.addEventListener("submit", async (e) => {
      e.preventDefault();

      const emailInput = registerFormElement.querySelector(
        'input[name="email"]'
      ) as HTMLInputElement;
      const passInput = registerFormElement.querySelector(
        ".password"
      ) as HTMLInputElement;
      const passAgainInput = registerFormElement.querySelector(
        ".password-again"
      ) as HTMLInputElement;

      const email = emailInput?.value.trim();
      const password = passInput?.value.trim();
      const passwordAgain = passAgainInput?.value.trim();

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
          localStorage.setItem("userRole", "user");
          window.location.href = "/account";
        } else {
          alert(data.message || "Registration failed.");
        }
      } catch (err) {
        console.error(err);
        alert("Server error");
      }
    });
  }

  if (loginFormElement) {
    loginFormElement.addEventListener("submit", async (e) => {
      e.preventDefault();

      const emailInput = loginFormElement.querySelector(
        'input[name="email"]'
      ) as HTMLInputElement;
      const passInput = loginFormElement.querySelector(
        'input[name="password"]'
      ) as HTMLInputElement;

      const email = emailInput?.value.trim();
      const password = passInput?.value.trim();

      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("userId", data.user.id);
          localStorage.setItem("userEmail", email);
          localStorage.setItem("userRole", data.user.role);

          if (data.user.role === "admin") {
            window.location.href = "/admPanel";
          } else {
            window.location.href = "/";
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
}
