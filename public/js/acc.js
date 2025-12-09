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
const navLinks = document.querySelectorAll(".vertical-nav a");
const contactSection = document.getElementById("contact");
const ChangeBtn = document.getElementById("change-btn");
const AllInputs = document.querySelectorAll(".contact-info .input, .contact-info select");
const nameInput = document.getElementById("personal-data");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const citySelect = document.getElementById("city");
const streetInput = document.getElementById("street");
const houseInput = document.getElementById("home");
const aptInput = document.getElementById("apartment");
const userId = localStorage.getItem("userId");
const historySection = document.getElementById("history");
function showSection(sectionId) {
    if (!contactSection)
        return;
    if (!historySection)
        return;
    contactSection.style.display = "none";
    historySection.style.display = "none";
    if (sectionId === "contact") {
        contactSection.style.display = "flex";
    }
    else if (sectionId === "history") {
        historySection.style.display = "block";
    }
    navLinks.forEach((l) => l.classList.remove("active"));
    const activeLink = document.querySelector(`.vertical-nav a[data-section="${sectionId}"]`);
    if (activeLink)
        activeLink.classList.add("active");
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
function updateUserData() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!userId) {
            alert("User ID not found. Please relogin.");
            return false;
        }
        const fullNameVal = nameInput.value;
        const phoneVal = phoneInput.value;
        const cityVal = citySelect.value;
        const streetVal = streetInput.value;
        const houseVal = houseInput.value;
        const aptVal = aptInput.value;
        const userData = {
            fullname: fullNameVal,
            phone: phoneVal,
            city: cityVal,
            street: streetVal,
            house: houseVal,
            apartment: aptVal,
        };
        try {
            const response = yield fetch(`/api/user/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });
            if (response.ok) {
                return true;
            }
            else {
                const result = yield response.json();
                alert("Error saving data: " + result.message);
                return false;
            }
        }
        catch (error) {
            console.error("Network error:", error);
            alert("Network error. Please try again.");
            return false;
        }
    });
}
document.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
    showSection("contact");
    try {
        const response = yield fetch(`/api/user/${userId}`);
        const data = yield response.json();
        if (response.ok) {
            if (nameInput)
                nameInput.value = data.user.fullname || "";
            if (emailInput)
                emailInput.value = data.user.email;
            if (phoneInput)
                phoneInput.value = data.user.phone || "";
            if (data.address) {
                if (citySelect)
                    citySelect.value = data.address.city || "";
                if (streetInput)
                    streetInput.value = data.address.street || "";
                if (houseInput)
                    houseInput.value = data.address.house || "";
                if (aptInput)
                    aptInput.value = data.address.apartment || "";
            }
            console.log("Данные успешно загружены из БД");
        }
        else {
            console.error("Ошибка загрузки данных:", data.message);
        }
    }
    catch (error) {
        console.error("Ошибка сети при загрузке:", error);
    }
}));
window.updateUserData = updateUserData;
