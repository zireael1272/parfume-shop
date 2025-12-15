document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("ordersContainer") as HTMLDivElement;
  const logoutBtn = document.getElementById("adm-logout") as HTMLAnchorElement;

  const ALL_STATUSES = [
    "Paid",
    "In progress",
    "In transit",
    "Delivered",
    "Cancelled",
  ];

  let availableDeliveryMethods: any[] = [];

  async function loadDeliveryMethods() {
    try {
      const res = await fetch("/api/delivery-methods");
      if (res.ok) {
        availableDeliveryMethods = await res.json();
      }
    } catch (err) {
      console.error("Error loading delivery methods:", err);
    }
  }

  function createOrderCard(order: any) {
    const card = document.createElement("div");

    card.style.marginBottom = "24px";

    let statusOptions = "";
    ALL_STATUSES.forEach((status) => {
      const isSelected = order.status === status ? "selected" : "";
      statusOptions += `<option value="${status}" ${isSelected}>${status}</option>`;
    });

    let deliveryOptions = "";
    const currentDeliveryId = order.deliveryMethodId
      ? order.deliveryMethodId._id
      : "";

    availableDeliveryMethods.forEach((method: any) => {
      const isSelected = method._id === currentDeliveryId ? "selected" : "";
      deliveryOptions += `<option value="${method._id}" ${isSelected}>${method.type} (${method.estimatedDays} days)</option>`;
    });

    const itemsHtml = order.listItems
      .map((item: any) => `<li class="item">${item.name} (x${item.quantity})</li>`)
      .join("");

    const userEmail = order.userId ? order.userId.email : "Unknown User";
    const userFullname = order.fullname || order.userId?.fullname || "-";
    const userPhone = order.phone || order.userId?.phone || "-";

    const thumbnailSrc = order.listItems?.[0]?.image || "images/placeholder.png";

    card.innerHTML = `
      <div class="order-card-content">
        
        <div class="order-details-wrapper">
            <img class="orderImg" src="${thumbnailSrc}" alt="Order Thumbnail">
            
            <div class="order-info">
              <p class="label"><strong>User:</strong> ${userEmail}</p>
              <p class="label"><strong>Full Name:</strong> ${userFullname}</p>
              <p class="label"><strong>Phone:</strong> ${userPhone}</p>
              <p class="label"><strong>Total:</strong> $${order.sum.toFixed(2)}</p>
              <p class="label"><strong>Address:</strong> ${order.address}</p>
              
              <p class="label"><strong>Items:</strong></p>
              <ul class="order-items-list">${itemsHtml}</ul>
            </div>
        </div>

        <div class="order-controls">
          <label>
            Status:
            <select class="input-control control-select status-select">
              ${statusOptions}
            </select>
          </label>

          <label>
             Delivery Method:
            <select class="input-control control-select delivery-select" >
              ${deliveryOptions}
            </select>
          </label>

          <button class="manage-product-btn btn update-btn" data-id="${order._id}">Update Order</button>
        </div>
      </div>
    `;

    const updateBtn = card.querySelector(".update-btn") as HTMLButtonElement;
    const statusSelect = card.querySelector(".status-select") as HTMLSelectElement;
    const deliverySelect = card.querySelector(
      ".delivery-select"
    ) as HTMLSelectElement;

    if (updateBtn && statusSelect && deliverySelect) {
      updateBtn.addEventListener("click", async () => {
        const newStatus = statusSelect.value;
        const newDeliveryId = deliverySelect.value;
        await updateOrder(order._id, newStatus, newDeliveryId);
      });
    }

    return card;
  }

  async function updateOrder(
    orderId: string,
    status: string,
    deliveryMethodId: string
  ) {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, deliveryMethodId }),
      });

      if (res.ok) {
        alert("Order updated successfully!");
        loadOrders();
      } else {
        alert("Error updating order");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  }

  async function loadOrders() {
    if (!container) return;
    container.innerHTML = "<p>Loading orders...</p>";

    await loadDeliveryMethods();

    try {
      const res = await fetch("/api/orders");
      const orders: any[] = await res.json();

      container.innerHTML = "";

      if (orders.length === 0) {
        container.innerHTML = "<p>No orders found.</p>";
        return;
      }

      orders.forEach((order) => {
        const card = createOrderCard(order);
        if (card) {
          container.appendChild(card);
        }
      });
    } catch (err) {
      console.error(err);
      container.innerHTML = "<p>Error loading orders.</p>";
    }
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.clear();
      window.location.href = "/index";
    });
  }

  loadOrders();
});
