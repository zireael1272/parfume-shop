async function loadProducts() {
  try {
    const res = await fetch("/api/products");
    const products = await res.json();

    const list = document.getElementById("productList");
    list.innerHTML = "";

    products.forEach((p) => {
      const element = document.createElement("div");
      element.classList.add("product");

      element.innerHTML = `
          <img src="${p.image}" class="product-img" alt="${p.name}">
          <div class="product-info">
            <h2 class="product-title">${p.name}</h2>
            <p class="category">${p.category}</p>
            <p class="product-price">$${p.price}</p>
            <a class="add-to-cart" onclick="addToCart(this.closest('.product'))">Add to cart</a>
          </div>
        `;

      list.appendChild(element);
    });
  } catch (err) {
    console.log("LOAD PRODUCTS ERROR:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadProducts);
