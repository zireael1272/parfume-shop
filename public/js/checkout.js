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
    const cartItemsContainer = document.getElementById("cartItems");
    const totalDisplay = document.getElementById("checkoutTotal");
    const formStep1 = document.getElementById("form-step-1");
    const formStep2 = document.getElementById("form-step-2");
    const toPaymentBtn = document.getElementById("toPayment");
    const PaymentBtn = document.getElementById("payment-btn");
    const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    let total = 0;
    if (window.loadUserDataToForms) {
        window.loadUserDataToForms();
    }
    const orderData = {
        userId: localStorage.getItem("userId"),
        fullname: "",
        phone: "",
        address: {},
        listItems: cartItems,
        sum: 0,
    };
    cartItems.forEach((item) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-title-price">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-price">$${itemTotal.toFixed(2)}</div>
      </div>
      <div class="quantity-display">x${item.quantity}</div>
    `;
        if (cartItemsContainer)
            cartItemsContainer.appendChild(div);
    });
    orderData.sum = total;
    if (!totalDisplay)
        return;
    totalDisplay.textContent = `$${total.toFixed(2)}`;
    if (!toPaymentBtn)
        return;
    toPaymentBtn.addEventListener("click", () => {
        const nameInp = document.getElementById("fullName");
        const phoneInp = document.getElementById("phone");
        const cityInp = document.getElementById("city");
        const streetInp = document.getElementById("street");
        const houseInp = document.getElementById("house");
        const apartmentInp = document.getElementById("apartment");
        const fullname = nameInp.value.trim();
        const phone = phoneInp.value.trim();
        const city = cityInp.value.trim();
        const street = streetInp.value.trim();
        const house = houseInp.value.trim();
        const apartment = apartmentInp.value.trim();
        if (!fullname || !phone || !street || !house || !city) {
            alert("Please fill in all fields.");
            return;
        }
        const storedUserId = localStorage.getItem("userId");
        const userIdString = storedUserId;
        orderData.userId = userIdString;
        orderData.fullname = fullname;
        orderData.phone = phone;
        orderData.listItems = cartItems;
        orderData.sum = total;
        orderData.address = {
            city,
            street,
            house,
            apartment,
        };
        if (!PaymentBtn)
            return;
        formStep1 === null || formStep1 === void 0 ? void 0 : formStep1.classList.add("hidden");
        formStep2 === null || formStep2 === void 0 ? void 0 : formStep2.classList.remove("hidden");
        toPaymentBtn.classList.add("hidden");
        PaymentBtn.classList.remove("hidden");
    });
    const cardNumberInput = formStep2 === null || formStep2 === void 0 ? void 0 : formStep2.querySelector('input[placeholder="1234 5678 9012 3456"]');
    const expiryDateInput = formStep2 === null || formStep2 === void 0 ? void 0 : formStep2.querySelector('input[placeholder="MM/YY"]');
    const cvcInput = formStep2 === null || formStep2 === void 0 ? void 0 : formStep2.querySelector('input[placeholder="123"]');
    cardNumberInput === null || cardNumberInput === void 0 ? void 0 : cardNumberInput.addEventListener("input", formatCardNumber);
    expiryDateInput === null || expiryDateInput === void 0 ? void 0 : expiryDateInput.addEventListener("input", formatExpiryDate);
    cvcInput === null || cvcInput === void 0 ? void 0 : cvcInput.addEventListener("input", formatCVC);
    function formatCardNumber(event) {
        const input = event.target;
        let value = input.value.replace(/\D/g, "");
        if (value.length > 16)
            value = value.slice(0, 16);
        value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
        input.value = value;
    }
    function formatExpiryDate(event) {
        const input = event.target;
        let value = input.value.replace(/\D/g, "");
        if (value.length > 4)
            value = value.slice(0, 4);
        if (value.length > 2)
            value = value.substring(0, 2) + "/" + value.substring(2);
        input.value = value;
    }
    function formatCVC(event) {
        const input = event.target;
        let value = input.value.replace(/\D/g, "");
        if (value.length > 3)
            value = value.slice(0, 3);
        input.value = value;
    }
    if (!PaymentBtn)
        return;
    PaymentBtn.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
        const cardNumberinp = cardNumberInput;
        const cardNumber = cardNumberinp.value.replace(/\s/g, "");
        const expiryinp = expiryDateInput;
        const expiry = expiryinp.value.trim();
        const cvcinp = cvcInput;
        const cvc = cvcinp.value.trim();
        if (cardNumber.length !== 16) {
            alert("Please enter a valid 16-digit card number.");
            return;
        }
        if (!/^\d{2}\/\d{2}$/.test(expiry)) {
            alert("Please enter a valid expiry date (MM/YY).");
            return;
        }
        if (cvc.length !== 3) {
            alert("Please enter a valid 3-digit CVC.");
            return;
        }
        try {
            const res = yield fetch("/api/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData),
            });
            if (!res.ok) {
                const err = yield res.json();
                console.error(err);
                alert("Order failed: " + err.message);
                return;
            }
            localStorage.removeItem("cartItems");
            window.location.href = "/success";
        }
        catch (err) {
            console.error(err);
            alert("Server error");
        }
    }));
});
