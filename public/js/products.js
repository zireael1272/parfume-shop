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
function loadProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield fetch("/api/products");
            const products = yield res.json();
            const list = document.getElementById("productList");
            if (!list)
                return;
            list.innerHTML = "";
            products.forEach((p) => {
                const element = document.createElement("div");
                element.classList.add("product");
                element.setAttribute("data-id", p._id);
                element.innerHTML = `
          <img src="${p.image}" class="product-img" alt="${p.title}">
          <div class="product-info">
            <h2 class="product-title">${p.title}</h2>
            <p class="category">${p.category}</p>
            <p class="product-price">$${p.price}</p>
            <button type="button" class="add-to-cart-btn btn" onclick="addToCart(this.closest('.product'))">Add to cart</button>
          </div>
        `;
                list.appendChild(element);
            });
        }
        catch (err) {
            console.log("LOAD PRODUCTS ERROR:", err);
        }
    });
}
document.addEventListener("DOMContentLoaded", loadProducts);
