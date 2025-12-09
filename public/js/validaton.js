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
const changeBtn = document.getElementById("change-btn");
const allInputs = document.querySelectorAll(".contact-info .input, .contact-info select");
if (phoneInput) {
    phoneInput.addEventListener("input", (e) => {
        const target = e.target;
        let value = (target === null || target === void 0 ? void 0 : target.value.replace(/\D/g, "")) || "";
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
    changeBtn.addEventListener("click", (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        e.preventDefault();
        if (!nameInput)
            return;
        const isReadOnly = nameInput.hasAttribute("readonly");
        if (isReadOnly) {
            startEditing();
        }
        else {
            if (validateForm()) {
                yield saveData();
            }
        }
    }));
}
function startEditing() {
    console.log("Включаем режим редактирования...");
    if (nameInput) {
        const input = nameInput;
        input.removeAttribute("readonly");
        input.classList.add("editable");
    }
    if (phoneInput) {
        const input = phoneInput;
        input.removeAttribute("readonly");
        input.classList.add("editable");
    }
    if (citySelect) {
        const select = citySelect;
        select.disabled = false;
        select.classList.add("editable");
    }
    [streetInput, houseInput, aptInput].forEach((el) => {
        if (el) {
            const input = el;
            input.removeAttribute("readonly");
            input.classList.add("editable");
        }
    });
    // Меняем текст кнопки
    if (changeBtn)
        changeBtn.innerText = "Save data";
}
function validateForm() {
    let isValid = true;
    if (!nameInput)
        return;
    const namePartsinp = nameInput;
    const nameParts = namePartsinp.value.trim().split(/\s+/);
    if (nameParts.length !== 2) {
        nameInput.classList.add("error");
        isValid = false;
        alert("The full name must consist of 2 words");
    }
    else {
        nameInput.classList.remove("error");
    }
    if (!phoneInput)
        return;
    const phoneDigitsinp = phoneInput;
    const phoneDigits = phoneDigitsinp.value.replace(/\D/g, "");
    if (phoneDigits.length !== 12) {
        phoneInput.classList.add("error");
        isValid = false;
        alert("The phone number must be in the format +380XXXXXXXXXX");
    }
    else {
        phoneInput.classList.remove("error");
    }
    if (!streetInput)
        return;
    const streetInputinp = streetInput;
    if (/\d/.test(streetInputinp.value)) {
        streetInput.classList.add("error");
        isValid = false;
        alert("The street should not contain numbers");
    }
    else {
        streetInput.classList.remove("error");
    }
    return isValid;
}
function saveData() {
    return __awaiter(this, void 0, void 0, function* () {
        const updateFunc = window.updateUserData;
        if (updateFunc) {
            const success = yield updateFunc();
            if (success) {
                allInputs.forEach((element) => {
                    const input = element;
                    input.setAttribute("readonly", "true");
                    input.disabled = true;
                    input.classList.remove("error");
                });
                if (changeBtn)
                    changeBtn.innerText = "Change data";
                console.log("Data save success!");
            }
            else {
                console.log("Save failed, keeping edit mode open.");
            }
        }
    });
}
