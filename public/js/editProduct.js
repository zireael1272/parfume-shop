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
    const productSelector = document.getElementById("productSelector");
    const form = document.querySelector(".form-product");
    const imageInput = document.getElementById("imageProduct");
    const previewImage = document.getElementById("previewImage");
    const titleInput = document.getElementById("titleProduct");
    const categoryInput = document.getElementById("categoryProduct");
    const priceInput = document.getElementById("priceProduct");
    const stockInput = document.getElementById("stockProduct");
    let currentProductId = null;
    let currentImage = "";
    try {
        const res = yield fetch("/api/products");
        const products = yield res.json();
        products.forEach((p) => {
            const option = document.createElement("option");
            option.value = p._id;
            option.textContent = p.title;
            option.dataset.product = JSON.stringify(p);
            productSelector.appendChild(option);
        });
    }
    catch (err) {
        console.error("Error loading products:", err);
    }
    productSelector.addEventListener("change", (e) => {
        const target = e.target;
        const selectedOption = target.options[target.selectedIndex];
        if (!selectedOption.value) {
            if (form)
                form.reset();
            previewImage.style.display = "none";
            currentProductId = null;
            return;
        }
        const productData = selectedOption.dataset.product || "{}";
        const product = JSON.parse(productData);
        currentProductId = product._id;
        currentImage = product.image;
        titleInput.value = product.title;
        categoryInput.value = product.category;
        priceInput.value = product.price;
        stockInput.value = product.stock;
        previewImage.src = product.image;
        previewImage.style.display = "block";
    });
    form.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        if (!currentProductId) {
            alert("Please select a product first.");
            return;
        }
        let imagePath = currentImage;
        if (imageInput.files && imageInput.files[0]) {
            imagePath = `images/${imageInput.files[0].name}`;
        }
        const updateData = {
            price: parseFloat(priceInput.value),
            stock: parseInt(stockInput.value),
            image: imagePath,
        };
        try {
            const res = yield fetch(`/api/products/${currentProductId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updateData),
            });
            const result = yield res.json();
            if (res.ok) {
                alert("Product updated successfully!");
                location.reload();
            }
            else {
                alert("Error: " + result.message);
            }
        }
        catch (err) {
            console.error(err);
            alert("Server error");
        }
    }));
}));
