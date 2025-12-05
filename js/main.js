"use strict";
let cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
function addToCart(productCard) {
    const name = productCard.querySelector(".product-title").textContent;
    const priceText = productCard.querySelector(".product-price").textContent;
    const price = parseFloat(priceText.replace("$", ""));
    const imgSrc = productCard.querySelector(".product-img").src;
    const existingItem = cartItems.find((item) => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    }
    else {
        cartItems.push({
            name,
            price,
            quantity: 1,
            image: imgSrc,
        });
    }
    updateLocalStorage();
    updateCartCount();
}
function displayCartItems() {
    const cartContainer = document.getElementById("cartItems");
    const totalElement = document.getElementById("cartTotal");
    if (!cartContainer)
        return;
    cartContainer.innerHTML = "";
    let total = 0;
    cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    cartItems.forEach((item) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.innerHTML = `
    <img src="${item.image}" alt="${item.name}" />
    <div class="cart-title-price">
      <div class="cart-item-title">${item.name}</div>
      <div class="cart-item-price">$${itemTotal.toFixed(2)}</div>
    </div>
    <div class="quantity-controls">
      <button class="control-btn" onclick="changeQuantity('${item.name}', -1)">
        -
      </button>
      <input
        type="text"
        name=""
        class="cart-item-quantity"
        value="${item.quantity}"
        min="1"
        onchange="updateQuantity('${item.name}', this.value)"
        readonly
      />
      <button class="control-btn"  onclick="changeQuantity('${item.name}', 1)">
        +
      </button>
    </div>
    <button type="button" class="remove-from-cart" onclick="removeItem('${item.name}')">
    <svg class="icon-trash" width="32" height="32">
    <use href="./images/icons.svg#icon-trash"></use>
  </svg>
    </button>
    `;
        cartContainer.appendChild(cartItem);
    });
    if (totalElement) {
        totalElement.textContent = `Total: $${total.toFixed(2)}`;
    }
}
function removeItem(name) {
    cartItems = cartItems.filter((item) => item.name !== name);
    updateLocalStorage();
    updateCartCount();
    if (document.getElementById("cartItems")) {
        displayCartItems();
    }
}
function changeQuantity(name, delta) {
    const item = cartItems.find((item) => item.name === name);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeItem(name);
        }
        else {
            updateLocalStorage();
            updateCartCount();
            displayCartItems();
        }
    }
}
function updateCartCount() {
    const cartCount = document.getElementById("cart-count");
    const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = itemCount;
    }
}
window.onload = function () {
    updateCartCount();
    if (document.getElementById("cartItems")) {
        displayCartItems();
    }
};
function updateLocalStorage() {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
}
