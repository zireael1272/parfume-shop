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
const productContainer = document.getElementById("productList");
function getCategoryFromURL() {
    const page = window.location.pathname;
    if (page.includes("woman"))
        return "Woman";
    if (page.includes("man"))
        return "Man";
    if (page.includes("unisex"))
        return "Unisex";
    return null;
}
const currentCategory = getCategoryFromURL();
function loadProductsCategory() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch("/api/products");
            const dbProducts = yield response.json();
            if (!Array.isArray(dbProducts))
                return;
            const filtered = dbProducts.filter((item) => item.category === currentCategory);
            renderProducts(filtered);
        }
        catch (error) {
            console.error("Failed to load products:", error);
        }
    });
}
function renderProducts(products) {
    products.forEach((item) => {
        const product = document.createElement("div");
        product.className = "product";
        product.innerHTML = `
    <img src="${item.image}" class="product-img" alt="${item.title}">
    <div class="product-info">
      <h2 class="product-title">${item.title}</h2>
      <p class="category">${item.category}</p>
      <p class="product-price">$${item.price}</p>
      <a class="add-to-cart-btn btn" onclick="addToCart(this.closest('.product'))">Add to cart</a>
    </div>
  `;
        if (!productContainer)
            return;
        productContainer.appendChild(product);
    });
}
loadProductsCategory();
