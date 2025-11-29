document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    if (e.target.closest("#adm-logout")) {
      e.preventDefault();
      localStorage.clear();
      window.location.href = "index.html";
    }
  });

  const ordersContainer = document.getElementById("ordersContainer");
  if (!ordersContainer) return;

  const orders = [
    {
      id: 1,
      products: [
        { name: "Blanche", quantity: 1, price: 189.2, image: "images/blanche.png" },
      ],
      total: 189.2,
      status: "Pending",
    },
    {
      id: 2,
      products: [
        {
          name: "Angels Share",
          quantity: 2,
          price: 336.5,
          image: "images/angel.png",
        },
        { name: "Cloud", quantity: 1, price: 63.1, image: "images/cloud.png" },
      ],
      total: 736.1,
      status: "Pending",
    },
  ];

  orders.forEach((order) => {
    const orderCard = document.createElement("div");
    orderCard.className = "order-card";

    const firstProduct = order.products[0];

    orderCard.innerHTML = `
      <div class="order-info">
        <div class="order-block">
          <img src="${firstProduct.image}" alt="${firstProduct.name}" />
          <div class="order-details">
            <p>Order Number: ${order.id}</p>
            <p>Total: $${order.total.toFixed(2)}</p>
            <p>Products: ${
              order.products.length > 1
                ? firstProduct.name + " + " + (order.products.length - 1) + " more"
                : firstProduct.name
            }</p>
          </div>
        </div>
        <select class="status-select">
        <option value="Pending" ${
          order.status === "Pending" ? "selected" : ""
        }>Pending</option>
        <option value="Shipped" ${
          order.status === "Shipped" ? "selected" : ""
        }>Shipped</option>
        <option value="Delivered" ${
          order.status === "Delivered" ? "selected" : ""
        }>Delivered</option>
        <option value="Canceled" ${
          order.status === "Canceled" ? "selected" : ""
        }>Canceled</option>
      </select>
      </div>
      
    `;

    const select = orderCard.querySelector(".status-select");
    select.addEventListener("change", (e) => {
      order.status = e.target.value;
      alert(`Order ${order.id} status changed to ${order.status}`);
    });

    ordersContainer.appendChild(orderCard);
  });
});
