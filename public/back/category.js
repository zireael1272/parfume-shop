const productContainer = document.getElementById("productList");

let products = {
  data: [
    {
      productTitle: "Blanche",
      category: "Woman",
      price: "$189.2",
      image: "images/blanche.png",
    },
    {
      productTitle: "Angels Share",
      category: "Unisex",
      price: "$336.5",
      image: "images/angel.png",
    },
    {
      productTitle: "Stronger with You",
      category: "Man",
      price: "$97.4",
      image: "images/you.png",
    },
    {
      productTitle: "Cloud",
      category: "Woman",
      price: "$63.1",
      image: "images/cloud.png",
    },
  ],
};

function getCategoryFromURL() {
  const page = window.location.pathname;

  if (page.includes("woman")) return "Woman";
  if (page.includes("man")) return "Man";
  if (page.includes("unisex")) return "Unisex";

  return null;
}

const currentCategory = getCategoryFromURL();

// ---- ВАЖНО: Фильтрация товаров ----
const filteredProducts = products.data.filter(
  (item) => item.category === currentCategory
);

// Отрисовка только нужной категории
for (let i of filteredProducts) {
  const product = document.createElement("div");
  product.className = "product";
  product.innerHTML = `
      <img src="${i.image}" class="product-img" alt="product" />
      <div class="product-info">
        <h2 class="product-title">${i.productTitle}</h2>
        <p class="category">${i.category}</p>
        <p class="product-price">${i.price}</p>
        <a class="add-to-cart" onclick="addToCart(this.closest('.product'))">
          Add to cart
        </a>
      </div>
    `;

  productContainer.appendChild(product);
}
