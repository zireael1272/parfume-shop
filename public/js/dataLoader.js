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
function loadUserDataToForms() {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = localStorage.getItem("userId");
        if (!userId)
            return;
        try {
            const response = yield fetch(`/api/user/${userId}`);
            const data = yield response.json();
            if (response.ok) {
                console.log("dataLoader: Данные загружены");
                // Теперь ID везде одинаковые!
                const nameInp = document.getElementById("fullName");
                const emailInp = document.getElementById("email");
                const phoneInp = document.getElementById("phone");
                const citySel = document.getElementById("city");
                const streetInp = document.getElementById("street");
                const houseInp = document.getElementById("house");
                const aptInp = document.getElementById("apartment");
                if (nameInp)
                    nameInp.value = data.user.fullname || "";
                if (emailInp)
                    emailInp.value = data.user.email || "";
                if (phoneInp)
                    phoneInp.value = data.user.phone || "";
                if (data.address) {
                    if (citySel)
                        citySel.value = data.address.city || "";
                    if (streetInp)
                        streetInp.value = data.address.street || "";
                    if (houseInp)
                        houseInp.value = data.address.house || "";
                    if (aptInp)
                        aptInp.value = data.address.apartment || "";
                }
            }
        }
        catch (error) {
            console.error("dataLoader: Ошибка загрузки:", error);
        }
    });
}
window.loadUserDataToForms = loadUserDataToForms;
