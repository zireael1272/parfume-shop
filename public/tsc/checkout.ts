document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cartItems");
  const totalDisplay = document.getElementById("checkoutTotal");
  const formStep1 = document.getElementById("form-step-1");
  const formStep2 = document.getElementById("form-step-2");
  const toPaymentBtn = document.getElementById("toPayment");
  const PaymentBtn = document.getElementById("payment-btn");

  const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
  let total = 0;

  const orderData = {
    userId: localStorage.getItem("userId"),
    address: {},
    listItems: cartItems,
    sum: 0,
  };

  cartItems.forEach(
    (item: { price: number; quantity: number; image: any; name: any }) => {
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
      if (cartItemsContainer) cartItemsContainer.appendChild(div);
    }
  );

  orderData.sum = total;
  if (!totalDisplay) return;
  totalDisplay.textContent = `$${total.toFixed(2)}`;

  if (!toPaymentBtn) return;
  toPaymentBtn.addEventListener("click", () => {
    const nameinp = document.getElementById("fullName") as HTMLInputElement;
    const name = nameinp.value.trim();
    const phoneinp = document.getElementById("phone") as HTMLInputElement;
    const phone = phoneinp.value.trim();
    const cityinp = document.getElementById("city") as HTMLInputElement;
    const city = cityinp.value.trim();
    const streetinp = document.getElementById("street") as HTMLInputElement;
    const street = streetinp.value.trim();
    const houseinp = document.getElementById("house") as HTMLInputElement;
    const house = houseinp.value.trim();
    const apartmentinp = document.getElementById("apartment") as HTMLInputElement;
    const apartment = apartmentinp.value.trim();

    if (!name || !phone || !street || !house || !city) {
      alert("Please fill in all fields.");
      return;
    }

    orderData.userId = JSON.parse(localStorage.getItem("userId") ?? "")._id;
    orderData.listItems = cartItems;
    orderData.sum = total;

    orderData.address = {
      fullName: name,
      phone,
      city,
      street,
      house,
      apartment,
    };

    if (!PaymentBtn) return;

    formStep1?.classList.add("hidden");
    formStep2?.classList.remove("hidden");
    toPaymentBtn.classList.add("hidden");
    PaymentBtn.classList.remove("hidden");
  });

  const cardNumberInput = formStep2?.querySelector(
    'input[placeholder="1234 5678 9012 3456"]'
  );
  const expiryDateInput = formStep2?.querySelector('input[placeholder="MM/YY"]');
  const cvcInput = formStep2?.querySelector('input[placeholder="123"]');

  cardNumberInput?.addEventListener("input", formatCardNumber);
  expiryDateInput?.addEventListener("input", formatExpiryDate);
  cvcInput?.addEventListener("input", formatCVC);

  function formatCardNumber(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, "");
    if (value.length > 16) value = value.slice(0, 16);
    value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    input.value = value;
  }

  function formatExpiryDate(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) value = value.substring(0, 2) + "/" + value.substring(2);
    input.value = value;
  }

  function formatCVC(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, "");
    if (value.length > 3) value = value.slice(0, 3);
    input.value = value;
  }

  if (!PaymentBtn) return;
  PaymentBtn.addEventListener("click", async () => {
    const cardNumberinp = cardNumberInput as HTMLInputElement;
    const cardNumber = cardNumberinp.value.replace(/\s/g, "");
    const expiryinp = expiryDateInput as HTMLInputElement;
    const expiry = expiryinp.value.trim();
    const cvcinp = cvcInput as HTMLInputElement;
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
      const res = await fetch("/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error(err);
        alert("Order failed: " + err.message);
        return;
      }

      localStorage.removeItem("cartItems");
      window.location.href = "/success";
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  });
});
