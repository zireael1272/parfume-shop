const productForm = document.querySelector(".form-product") as HTMLFormElement;

if (productForm) {
  productForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const imageInput = document.getElementById("imageProduct") as HTMLInputElement;
    if (!imageInput) return;
    const file = imageInput.files?.[0];
    const imagePath = file ? `images/${file.name}` : "";

    const titleProduct = document.getElementById("titleProduct") as HTMLInputElement;
    const category = document.getElementById("category") as HTMLInputElement;
    const priceProduct = document.getElementById("priceProduct") as HTMLInputElement;
    const stockProduct = document.getElementById("stockProduct") as HTMLInputElement;

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
      const response = await fetch("/api/productAdd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Product added successfully!");
        productForm.reset();
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  });
}
