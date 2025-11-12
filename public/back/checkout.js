document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cartItems");
  const totalDisplay = document.getElementById("checkoutTotal");
  const formStep1 = document.getElementById("form-step-1");
  const formStep2 = document.getElementById("form-step-2");
  const toPaymentBtn = document.getElementById("toPayment");
  const PaymentBtn = document.getElementById("payment-btn");

  const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
  let total = 0;

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
    cartItemsContainer.appendChild(div);
  });

  totalDisplay.textContent = `$${total.toFixed(2)}`;

  toPaymentBtn.addEventListener("click", () => {
    const name = document.getElementById("fullName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const city = document.getElementById("city").value.trim();

    if (!name || !phone || !address || !city) {
      alert("Please fill in all fields.");
      return;
    }

    formStep1.classList.add("hidden");
    formStep2.classList.remove("hidden");
    toPaymentBtn.classList.add("hidden");
    PaymentBtn.classList.remove("hidden");
  });

  const cardNumberInput = formStep2.querySelector(
    'input[placeholder="1234 5678 9012 3456"]'
  );
  const expiryDateInput = formStep2.querySelector('input[placeholder="MM/YY"]');
  const cvcInput = formStep2.querySelector('input[placeholder="123"]');

  if (cardNumberInput) {
    cardNumberInput.addEventListener("input", formatCardNumber);
    expiryDateInput.addEventListener("input", formatExpiryDate);
    cvcInput.addEventListener("input", formatCVC);
  }

  function formatCardNumber(event) {
    let value = event.target.value.replace(/\D/g, "");
    if (value.length > 16) value = value.slice(0, 16);
    value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    event.target.value = value;
  }

  function formatExpiryDate(event) {
    let value = event.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2)
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    event.target.value = value;
  }

  function formatCVC(event) {
    let value = event.target.value.replace(/\D/g, "");
    if (value.length > 3) value = value.substring(0, 3);
    event.target.value = value;
  }

  formStep2.addEventListener("submit", (e) => {
    e.preventDefault();

    const cardNumber = cardNumberInput.value.replace(/\s/g, "");
    const expiry = expiryDateInput.value.trim();
    const cvc = cvcInput.value.trim();

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

    alert("Payment completed successfully!");
    localStorage.removeItem("cartItems");
    window.location.href = "success.html";
  });
});
