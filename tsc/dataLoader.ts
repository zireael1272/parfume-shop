async function loadUserDataToForms() {
  const userId = localStorage.getItem("userId");

  if (!userId) return;

  try {
    const response = await fetch(`/api/user/${userId}`);
    const data = await response.json();

    if (response.ok) {
      console.log("dataLoader: Данные загружены");

      const nameInp = document.getElementById("fullName") as HTMLInputElement;
      const emailInp = document.getElementById("email") as HTMLInputElement;
      const phoneInp = document.getElementById("phone") as HTMLInputElement;

      const citySel = document.getElementById("city") as HTMLInputElement;
      const streetInp = document.getElementById("street") as HTMLInputElement;
      const houseInp = document.getElementById("house") as HTMLInputElement;
      const aptInp = document.getElementById("apartment") as HTMLInputElement;

      if (nameInp) nameInp.value = data.user.fullname || "";
      if (emailInp) emailInp.value = data.user.email || "";
      if (phoneInp) phoneInp.value = data.user.phone || "";

      if (data.address) {
        if (citySel) citySel.value = data.address.city || "";
        if (streetInp) streetInp.value = data.address.street || "";
        if (houseInp) houseInp.value = data.address.house || "";
        if (aptInp) aptInp.value = data.address.apartment || "";
      }
    }
  } catch (error) {
    console.error("dataLoader: Ошибка загрузки:", error);
  }
}

window.loadUserDataToForms = loadUserDataToForms;
