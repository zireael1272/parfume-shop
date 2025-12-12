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
const productForm = document.querySelector(".form-product");
if (productForm) {
    productForm.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        e.preventDefault();
        const imageInput = document.getElementById("imageProduct");
        if (!imageInput)
            return;
        const file = (_a = imageInput.files) === null || _a === void 0 ? void 0 : _a[0];
        const imagePath = file ? `images/${file.name}` : "";
        const titleProduct = document.getElementById("titleProduct");
        const category = document.getElementById("category");
        const priceProduct = document.getElementById("priceProduct");
        const stockProduct = document.getElementById("stockProduct");
        if (!titleProduct || !category || !priceProduct || !stockProduct || !imageInput)
            return;
        const productData = {
            title: titleProduct.value,
            category: category.value,
            price: priceProduct.value,
            stock: stockProduct.value,
            image: imagePath,
        };
        try {
            const response = yield fetch("/api/productAdd", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(productData),
            });
            const result = yield response.json();
            if (response.ok) {
                alert("Product added successfully!");
                productForm.reset();
            }
            else {
                alert("Error: " + result.message);
            }
        }
        catch (error) {
            console.error("Error:", error);
            alert("Something went wrong");
        }
    }));
}
