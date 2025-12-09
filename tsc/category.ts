const productContainer = document.getElementById("productList");

function getCategoryFromURL() {
  const page = window.location.pathname;

  if (page.includes("woman")) return "Woman";
  if (page.includes("man")) return "Man";
  if (page.includes("unisex")) return "Unisex";

  return null;
}

const currentCategory = getCategoryFromURL();

async function loadProductsCategory() {
  try {
    const response = await fetch("/api/products");
    const dbProducts = await response.json();

    if (!Array.isArray(dbProducts)) return;

    const filtered = dbProducts.filter((item) => item.category === currentCategory);

    renderProducts(filtered);
  } catch (error) {
    console.error("Failed to load products:", error);
  }
}
function renderProducts(products: any[]) {
  products.forEach((item) => {
    const product = document.createElement("div");
    product.className = "product";

    product.innerHTML = `
    <img src="${item.image}" class="product-img" alt="${item.name}">
    <div class="product-info">
      <h2 class="product-title">${item.name}</h2>
      <p class="category">${item.category}</p>
      <p class="product-price">$${item.price}</p>
      <a class="add-to-cart-btn btn" onclick="addToCart(this.closest('.product'))">Add to cart</a>
    </div>
  `;
    if (!productContainer) return;
    productContainer.appendChild(product);
  });
}

loadProductsCategory();
