const orders = [
  {
    orderNumber: "001",
    date: "2025-11-17",
    status: "Delivered",
    items: [
      { name: "Blanche", quantity: 2, image: "images/blanche.png", price: 189.2 },
      { name: "Cloud", quantity: 1, image: "images/cloud.png", price: 63.1 },
      { name: "Angels Share", quantity: 1, image: "images/angel.png", price: 336.5 },
    ],
  },
  {
    orderNumber: "002",
    date: "2025-11-10",
    status: "In Transit",
    items: [
      {
        name: "Stronger with You",
        quantity: 1,
        image: "images/you.png",
        price: 97.4,
      },
    ],
  },
];

const orderItemsContainer = document.getElementById("orderItems");

orders.forEach((order) => {
  const orderCard = document.createElement("div");
  orderCard.className = "order-card";

  const orderHeader = document.createElement("div");
  orderHeader.className = "order-header";
  orderHeader.innerHTML = `
    <span>Order #${order.orderNumber} - ${order.date}</span>
    <span class="order-status">${order.status}</span>
  `;
  orderCard.appendChild(orderHeader);

  const orderSummary = document.createElement("div");
  orderSummary.className = "order-summary";
  const firstItem = order.items[0];
  let moreText = order.items.length > 1 ? ` +${order.items.length - 1}` : "";
  orderSummary.innerHTML = `
    <span>${moreText}</span>
    <img src="${firstItem.image}" alt="${firstItem.name}">
  `;
  orderCard.appendChild(orderSummary);

  const orderItemsDiv = document.createElement("div");
  orderItemsDiv.className = "order-items";

  order.items.forEach((item) => {
    const orderItem = document.createElement("div");
    orderItem.className = "order-item";
    orderItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="order-item-info">
        <span class="item-name">${item.name}</span>
        <span class="item-quantity">x${item.quantity}</span>
      </div>
      <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
    `;
    orderItemsDiv.appendChild(orderItem);
  });

  const total = order.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const orderTotal = document.createElement("div");
  orderTotal.className = "order-total";
  orderTotal.textContent = `Total: $${total.toFixed(2)}`;
  orderCard.appendChild(orderTotal);
  orderCard.appendChild(orderItemsDiv);

  orderCard.addEventListener("click", () => {
    orderItemsDiv.style.display =
      orderItemsDiv.style.display === "flex" ? "none" : "flex";
  });

  if (!orderItemsContainer) return;
  orderItemsContainer.appendChild(orderCard);
});
