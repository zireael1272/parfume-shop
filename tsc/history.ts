document.addEventListener("DOMContentLoaded", async () => {
  const orderItemsContainer = document.getElementById("orderItems");

  if (!orderItemsContainer) return;

  const userId = localStorage.getItem("userId");

  if (!userId) {
    orderItemsContainer.innerHTML = "<p>Please log in to view your orders.</p>";
    return;
  }

  try {
    const response = await fetch(`/api/orders/user/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch orders");

    const orders = await response.json();

    if (orders.length === 0) {
      orderItemsContainer.innerHTML = "<p>You haven't placed any orders yet.</p>";
      return;
    }

    orders.forEach((order: any) => {
      const orderCard = document.createElement("div");
      orderCard.className = "order-card";

      const dateObj = new Date(order.createdAt);
      const dateString = dateObj.toLocaleDateString();
      const orderNumber = order._id.slice(-6).toUpperCase();

      const orderHeader = document.createElement("div");
      orderHeader.className = "order-header";

      orderHeader.innerHTML = `
            <div>Order #${orderNumber} - ${dateString}</div>
            <div class="order-header-right">
                <div class="order-status">${order.status}</div>
                <button type="button" class="btn cancel-btn hidden" data-id="${order._id}">Cancel order</button>
            </div>
        `;
      orderCard.appendChild(orderHeader);

      const cancelBtn = orderHeader.querySelector(".cancel-btn");
      if (cancelBtn) {
        if (["Paid", "In progress"].includes(order.status)) {
          cancelBtn.classList.remove("hidden");
        }
        cancelBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const target = e.target as HTMLElement;
          const id = target.getAttribute("data-id");
          cancelOrder(id);
        });
      }

      const orderSummary = document.createElement("div");
      orderSummary.className = "order-summary";

      const items: any[] = order.listItems || [];
      const firstItem = items[0];
      const imgPath = firstItem ? firstItem.image : "images/placeholder.png";
      let moreText = items.length > 1 ? ` +${items.length - 1}` : "";

      orderSummary.innerHTML = `
            <div>
                <img src="${imgPath}" alt="Product">
                <div>${moreText}</div>
            </div>
            <div>$${order.sum.toFixed(2)}</div>
        `;
      orderCard.appendChild(orderSummary);

      const orderItemsDiv = document.createElement("div");
      orderItemsDiv.className = "order-items";

      items.forEach((item: any) => {
        const orderItem = document.createElement("div");
        orderItem.className = "order-item";
        orderItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="order-item-info">
                    <div class="item-name">${item.name}</div>
                    <div class="item-quantity">x${item.quantity}</div>
                </div>
                <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            `;
        orderItemsDiv.appendChild(orderItem);
      });

      const orderTotal = document.createElement("div");
      orderTotal.className = "order-total";
      orderTotal.textContent = `Total: $${order.sum.toFixed(2)}`;

      orderItemsDiv.appendChild(orderTotal);
      orderCard.appendChild(orderItemsDiv);

      orderCard.addEventListener("click", () => {
        orderItemsDiv.classList.toggle("active");
      });

      orderItemsContainer.appendChild(orderCard);
    });
  } catch (error) {
    console.error("Error loading orders:", error);
    orderItemsContainer.innerHTML = "<p>Error loading orders.</p>";
  }
});

async function cancelOrder(orderId: string | null) {
  if (!orderId) return;
  if (!confirm("Are you sure you want to cancel this order?")) return;

  try {
    const res = await fetch(`/api/orders/${orderId}/cancel`, {
      method: "POST",
    });

    if (res.ok) {
      alert("Order cancelled");
      location.reload();
    } else {
      const data = await res.json();
      alert(data.message || "Error cancelling order");
    }
  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}
