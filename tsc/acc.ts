const navLinks = document.querySelectorAll(".vertical-nav a");
const contactSection = document.getElementById("contact");
const ChangeBtn = document.getElementById("change-btn");
const AllInputs = document.querySelectorAll(
  ".contact-info .input, .contact-info select"
);

const nameInput = document.getElementById("personal-data");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const citySelect = document.getElementById("city");
const streetInput = document.getElementById("street");
const houseInput = document.getElementById("home");
const aptInput = document.getElementById("apartment");
const userId = localStorage.getItem("userId");

const historySection = document.getElementById("history");

function showSection(sectionId: string | null) {
  if (!contactSection) return;
  if (!historySection) return;
  contactSection.style.display = "none";
  historySection.style.display = "none";

  if (sectionId === "contact") {
    contactSection.style.display = "flex";
  } else if (sectionId === "history") {
    historySection.style.display = "block";
  }

  navLinks.forEach((l) => l.classList.remove("active"));
  const activeLink = document.querySelector(
    `.vertical-nav a[data-section="${sectionId}"]`
  );
  if (activeLink) activeLink.classList.add("active");
}

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const sectionId = link.getAttribute("data-section");

    if (sectionId === "logout") {
      localStorage.clear();
      window.location.href = "/index";
      return;
    }

    showSection(sectionId);
  });
});

async function updateUserData() {
  if (!userId) {
    alert("User ID not found. Please relogin.");
    return false;
  }

  const fullNameVal = (nameInput as HTMLInputElement).value;
  const phoneVal = (phoneInput as HTMLInputElement).value;
  const cityVal = (citySelect as HTMLInputElement).value;
  const streetVal = (streetInput as HTMLInputElement).value;
  const houseVal = (houseInput as HTMLInputElement).value;
  const aptVal = (aptInput as HTMLInputElement).value;

  const userData = {
    fullname: fullNameVal,
    phone: phoneVal,
    city: cityVal,
    street: streetVal,
    house: houseVal,
    apartment: aptVal,
  };

  try {
    const response = await fetch(`/api/user/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      return true;
    } else {
      const result = await response.json();
      alert("Error saving data: " + result.message);
      return false;
    }
  } catch (error) {
    console.error("Network error:", error);
    alert("Network error. Please try again.");
    return false;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  showSection("contact");

  try {
    const response = await fetch(`/api/user/${userId}`);
    const data = await response.json();

    if (response.ok) {
      if (nameInput)
        (nameInput as HTMLInputElement).value = data.user.fullname || "";
      if (emailInput) (emailInput as HTMLInputElement).value = data.user.email;
      if (phoneInput) (phoneInput as HTMLInputElement).value = data.user.phone || "";

      if (data.address) {
        if (citySelect)
          (citySelect as HTMLInputElement).value = data.address.city || "";
        if (streetInput)
          (streetInput as HTMLInputElement).value = data.address.street || "";
        if (houseInput)
          (houseInput as HTMLInputElement).value = data.address.house || "";
        if (aptInput)
          (aptInput as HTMLInputElement).value = data.address.apartment || "";
      }
      console.log("Данные успешно загружены из БД");
    } else {
      console.error("Ошибка загрузки данных:", data.message);
    }
  } catch (error) {
    console.error("Ошибка сети при загрузке:", error);
  }
});

(window as any).updateUserData = updateUserData;
