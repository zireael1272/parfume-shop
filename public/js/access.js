"use strict";
document.addEventListener("DOMContentLoaded", () => {
    const checkoutBtn = document.getElementById("checkout-btn");
    const wrapper = document.querySelector(".wrapper");
    if (!checkoutBtn)
        return;
    if (!wrapper)
        return;
    checkoutBtn.addEventListener("click", function (e) {
        const isAuth = localStorage.getItem("isLoggedIn") === "true";
        if (!isAuth) {
            e.preventDefault();
            alert("Please log in before proceeding to checkout.");
            wrapper.classList.add("active-popup");
        }
    });
});
