async function loadProducts() {
  try {
    const res = await fetch("/api/products");
    const products = await res.json();

    const list = document.getElementById("productList");
    if (!list) return;
    list.innerHTML = "";

    products.forEach(
      (p: {
        _id: any;
        image: any;
        name: string;
        category: string;
        price: number;
      }) => {
        const element = document.createElement("div");
        element.classList.add("product");
        element.setAttribute("data-id", p._id);

        element.innerHTML = `
          <img src="${p.image}" class="product-img" alt="${p.name}">
          <div class="product-info">
            <h2 class="product-title">${p.name}</h2>
            <p class="category">${p.category}</p>
            <p class="product-price">$${p.price}</p>
            <button type="button" class="add-to-cart-btn btn" onclick="addToCart(this.closest('.product'))">Add to cart</button>
          </div>
        `;

        list.appendChild(element);
      }
    );
  } catch (err) {
    console.log("LOAD PRODUCTS ERROR:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadProducts);
