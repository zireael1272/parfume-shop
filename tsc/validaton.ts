const changeBtn = document.getElementById("change-btn");
const allInputs = document.querySelectorAll(
  ".contact-info .input, .contact-info select"
);

if (phoneInput) {
  phoneInput.addEventListener("input", (e) => {
    const target = e.target as HTMLInputElement;
    let value = target?.value.replace(/\D/g, "") || "";
    if (!value.startsWith("380")) {
      value = "380";
    }

    if (value.length > 12) {
      value = value.substring(0, 12);
    }

    let formattedValue = "+380";
    if (value.length > 3) {
      formattedValue += " (" + value.substring(3, 5);
    }
    if (value.length > 5) {
      formattedValue += ") " + value.substring(5, 8);
    }
    if (value.length > 8) {
      formattedValue += " " + value.substring(8, 10);
    }
    if (value.length > 10) {
      formattedValue += " " + value.substring(10, 12);
    }

    target.value = formattedValue;
  });
}

if (changeBtn) {
  changeBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    e.preventDefault();
    if (!nameInput) return;

    const isReadOnly = nameInput.hasAttribute("readonly");

    if (isReadOnly) {
      startEditing();
    } else {
      if (validateForm()) {
        await saveData();
      }
    }
  });
}

function startEditing() {
  allInputs.forEach((input) => {
    input.removeAttribute("readonly");
  });
  if (changeBtn) changeBtn.innerText = "Save data";
}

function validateForm() {
  let isValid = true;

  if (!nameInput) return;
  const namePartsinp = nameInput as HTMLInputElement;
  const nameParts = namePartsinp.value.trim().split(/\s+/);

  if (nameParts.length !== 2) {
    nameInput.classList.add("error");
    isValid = false;
    alert("The full name must consist of 2 words");
  } else {
    nameInput.classList.remove("error");
  }
  if (!phoneInput) return;
  const phoneDigitsinp = phoneInput as HTMLInputElement;
  const phoneDigits = phoneDigitsinp.value.replace(/\D/g, "");

  if (phoneDigits.length !== 12) {
    phoneInput.classList.add("error");
    isValid = false;
    alert("The phone number must be in the format +380XXXXXXXXXX");
  } else {
    phoneInput.classList.remove("error");
  }

  if (!streetInput) return;
  const streetInputinp = streetInput as HTMLInputElement;

  if (/\d/.test(streetInputinp.value)) {
    streetInput.classList.add("error");
    isValid = false;
    alert("The street should not contain numbers");
  } else {
    streetInput.classList.remove("error");
  }

  return isValid;
}

async function saveData() {
  const isSaved = await updateUserData();

  if (isSaved) {
    allInputs.forEach((input) => {
      input.setAttribute("readonly", "true");
      input.classList.remove("error");
    });

    if (changeBtn) changeBtn.innerText = "Change data";
    console.log("Data save success!");
  } else {
    console.log("Save failed, keeping edit mode open.");
  }
}
