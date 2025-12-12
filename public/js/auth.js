"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
document.addEventListener("DOMContentLoaded", () => {
    var _a;
    const wrapper = document.querySelector(".wrapper");
    const loginForm = document.querySelector(".form-box.login");
    const registerForm = document.querySelector(".form-box.register");
    const registerLink = document.querySelector(".register-link");
    const loginLink = document.querySelector(".login-link");
    const registerFormElement = document.getElementById("registerForm");
    const closeBtn = document.getElementById("closeBtn");
    if (!wrapper)
        return;
    if (!loginForm)
        return;
    if (!registerForm)
        return;
    if (!registerLink)
        return;
    if (!loginLink)
        return;
    function isUserLoggedIn() {
        return localStorage.getItem("isLoggedIn") === "true";
    }
    function getUserRole() {
        return localStorage.getItem("userRole");
    }
    (_a = document.querySelector(".account-btn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", (e) => {
        e.preventDefault();
        if (isUserLoggedIn()) {
            const role = getUserRole();
            if (role === "admin") {
                window.location.href = "/admPanel";
            }
            else {
                window.location.href = "/account";
            }
        }
        else {
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
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            wrapper.classList.remove("active-popup", "active");
        });
    }
    window.addEventListener("click", (e) => {
        if (e.target === wrapper) {
            wrapper.classList.remove("active-popup", "active");
        }
    });
    window.addEventListener("click", (e) => {
        if (e.target === wrapper) {
            wrapper.classList.remove("active-popup", "active");
        }
    });
    if (registerFormElement) {
        registerFormElement.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
            e.preventDefault();
            const emailinp = registerFormElement.querySelector('input[type="email"]');
            const email = emailinp.value.trim();
            const passwordinp = registerFormElement.querySelector(".password");
            const password = passwordinp.value.trim();
            const passwordAgaininp = registerFormElement.querySelector(".password-again");
            const passwordAgain = passwordAgaininp.value.trim();
            if (!email || !password || !passwordAgain) {
                alert("Please fill in all fields.");
                return;
            }
            if (password !== passwordAgain) {
                alert("Passwords do not match.");
                return;
            }
            try {
                const response = yield fetch("/api/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });
                const data = yield response.json();
                if (response.ok) {
                    localStorage.setItem("isLoggedIn", "true");
                    localStorage.setItem("userEmail", email);
                    window.location.href = "/index";
                }
                else {
                    alert(data.message || "Registration failed.");
                }
            }
            catch (err) {
                console.error(err);
                alert("Server error");
            }
        }));
    }
    const loginFormElement = document.getElementById("loginForm");
    if (loginFormElement) {
        loginFormElement.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
            e.preventDefault();
            const emailinp = loginFormElement.querySelector('input[type="email"]');
            const email = emailinp.value.trim();
            const passwordinp = loginFormElement.querySelector('input[type="password"]');
            const password = passwordinp.value.trim();
            try {
                const response = yield fetch("/api/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });
                const data = yield response.json();
                if (response.ok) {
                    localStorage.setItem("isLoggedIn", "true");
                    localStorage.setItem("userId", data.user.id);
                    localStorage.setItem("userEmail", email);
                    localStorage.setItem("userRole", data.user.role);
                    if (data.user.role === "admin") {
                        window.location.href = "/admPanel";
                    }
                    else {
                        window.location.href = "/index";
                    }
                }
                else {
                    alert(data.message || "Login failed.");
                }
            }
            catch (err) {
                console.error(err);
                alert("Server error");
            }
        }));
    }
});
