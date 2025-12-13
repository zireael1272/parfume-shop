document.addEventListener("DOMContentLoaded", async () => {
  const productSelector = document.getElementById(
    "productSelector"
  ) as HTMLSelectElement;
  const form = document.querySelector(".form-product") as HTMLFormElement;

  const imageInput = document.getElementById("imageProduct") as HTMLInputElement;
  const previewImage = document.getElementById("previewImage") as HTMLInputElement;
  const titleInput = document.getElementById("titleProduct") as HTMLInputElement;
  const categoryInput = document.getElementById(
    "categoryProduct"
  ) as HTMLInputElement;
  const priceInput = document.getElementById("priceProduct") as HTMLInputElement;
  const stockInput = document.getElementById("stockProduct") as HTMLInputElement;

  let currentProductId: string | null = null;
  let currentImage = "";

  try {
    const res = await fetch("/api/products");
    const products = await res.json();

    products.forEach((p: { _id: string; title: string }) => {
      const option = document.createElement("option");
      option.value = p._id;
      option.textContent = p.title;
      option.dataset.product = JSON.stringify(p);
      productSelector.appendChild(option);
    });
  } catch (err) {
    console.error("Error loading products:", err);
  }

  productSelector.addEventListener("change", (e) => {
    const target = e.target as HTMLSelectElement;
    const selectedOption = target.options[target.selectedIndex];

    if (!selectedOption.value) {
      if (form) form.reset();
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

  form.addEventListener("submit", async (e) => {
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
      const res = await fetch(`/api/products/${currentProductId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const result = await res.json();

      if (res.ok) {
        alert("Product updated successfully!");
        location.reload();
      } else {
        alert("Error: " + result.message);
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  });
});
