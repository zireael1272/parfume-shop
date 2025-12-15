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
document.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
    const container = document.getElementById("ordersContainer");
    const logoutBtn = document.getElementById("adm-logout");
    const ALL_STATUSES = [
        "Paid",
        "In progress",
        "In transit",
        "Delivered",
        "Cancelled",
    ];
    let availableDeliveryMethods = [];
    function loadDeliveryMethods() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield fetch("/api/delivery-methods");
                if (res.ok) {
                    availableDeliveryMethods = yield res.json();
                }
            }
            catch (err) {
                console.error("Error loading delivery methods:", err);
            }
        });
    }
    function createOrderCard(order) {
        var _a, _b, _c, _d;
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
        availableDeliveryMethods.forEach((method) => {
            const isSelected = method._id === currentDeliveryId ? "selected" : "";
            deliveryOptions += `<option value="${method._id}" ${isSelected}>${method.type} (${method.estimatedDays} days)</option>`;
        });
        const itemsHtml = order.listItems
            .map((item) => `<li class="item">${item.name} (x${item.quantity})</li>`)
            .join("");
        const userEmail = order.userId ? order.userId.email : "Unknown User";
        const userFullname = order.fullname || ((_a = order.userId) === null || _a === void 0 ? void 0 : _a.fullname) || "-";
        const userPhone = order.phone || ((_b = order.userId) === null || _b === void 0 ? void 0 : _b.phone) || "-";
        const thumbnailSrc = ((_d = (_c = order.listItems) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.image) || "images/placeholder.png";
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
        const updateBtn = card.querySelector(".update-btn");
        const statusSelect = card.querySelector(".status-select");
        const deliverySelect = card.querySelector(".delivery-select");
        if (updateBtn && statusSelect && deliverySelect) {
            updateBtn.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                const newStatus = statusSelect.value;
                const newDeliveryId = deliverySelect.value;
                yield updateOrder(order._id, newStatus, newDeliveryId);
            }));
        }
        return card;
    }
    function updateOrder(orderId, status, deliveryMethodId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield fetch(`/api/orders/${orderId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status, deliveryMethodId }),
                });
                if (res.ok) {
                    alert("Order updated successfully!");
                    loadOrders();
                }
                else {
                    alert("Error updating order");
                }
            }
            catch (err) {
                console.error(err);
                alert("Server error");
            }
        });
    }
    function loadOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!container)
                return;
            container.innerHTML = "<p>Loading orders...</p>";
            yield loadDeliveryMethods();
            try {
                const res = yield fetch("/api/orders");
                const orders = yield res.json();
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
            }
            catch (err) {
                console.error(err);
                container.innerHTML = "<p>Error loading orders.</p>";
            }
        });
    }
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.clear();
            window.location.href = "/index";
        });
    }
    loadOrders();
}));
