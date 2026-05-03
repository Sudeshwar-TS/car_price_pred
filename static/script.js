const MIN_YEAR = 1990;
const MAX_YEAR = 2025;

const carData = {
    "Maruti Suzuki": ["Swift", "Baleno", "Dzire", "Celerio", "Alto", "Wagon R", "Brezza", "S-Presso", "Vitara Brezza", "Ertiga"],
    "Hyundai": ["i20", "Creta", "Verna", "Venue", "i10", "Grand i10 Nios", "Elantra", "Kona Electric", "Aura"],
    "Tata": ["Nexon", "Punch", "Harrier", "Safari", "Altroz", "Tiago", "Tigor", "Xenon", "Camo"],
    "Honda": ["City", "Amaze", "Jazz", "CR-V", "Civic", "HR-V", "Accord"],
    "Toyota": ["Fortuner", "Innova", "Innova Crysta", "Corolla", "Camry", "Glanza", "Urban Cruiser"],
    "Mahindra": ["Scorpio", "XUV700", "XUV500", "Bolero", "Thar", "XUV300", "KUV100", "Alturas"],
    "Skoda": ["Octavia", "Superb", "Slavia", "Rapid", "Kushaq"],
    "MG": ["Hector", "Astor", "ZS EV", "Gloster"],
    "Kia": ["Seltos", "Sonet", "Carens", "Niro"],
    "Volkswagen": ["Polo", "Vento", "Tiguan", "Passat"],
    "Renault": ["Duster", "Kwid", "Captur"],
    "Citroen": ["C3", "C5 Aircross", "Cactus"],
    "Datsun": ["GO", "GO+", "Redi-GO"],
    "Force": ["Gurkha"],
    "BYD": ["Atto 3", "Yuan Plus"]
};

document.addEventListener("DOMContentLoaded", () => {
    populateYears();
    document.getElementById("brand").addEventListener("change", loadModels);
    document.getElementById("carForm").addEventListener("submit", (event) => {
        event.preventDefault();
        predictPrice();
    });
});

function populateYears() {
    const yearSelect = document.getElementById("year");

    for (let year = MAX_YEAR; year >= MIN_YEAR; year--) {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
}

function loadModels() {
    const brand = document.getElementById("brand").value;
    const modelSelect = document.getElementById("model");
    modelSelect.innerHTML = '<option value="">Select Model</option>';

    (carData[brand] || []).forEach((model) => {
        const option = document.createElement("option");
        option.value = model;
        option.textContent = model;
        modelSelect.appendChild(option);
    });
}

function validateInputs() {
    const brand = getValue("brand");
    const model = getValue("model");
    const year = Number(getValue("year"));
    const kmsDriven = Number(getValue("kmsDriven"));
    const fuelType = getValue("fuelType");
    const transmission = getValue("transmission");
    const sellerType = getValue("sellerType");

    clearError();

    if (!brand) return showError("Please select a car brand");
    if (!model) return showError("Please select a car model");
    if (!year) return showError("Please select a year");
    if (!Number.isFinite(kmsDriven) || getValue("kmsDriven") === "") return showError("Please enter KM driven");
    if (kmsDriven < 0) return showError("KM driven must be a positive number");
    if (!fuelType) return showError("Please select fuel type");
    if (!transmission) return showError("Please select transmission type");
    if (!sellerType) return showError("Please select seller type");
    if (year < MIN_YEAR || year > MAX_YEAR) return showError(`Please select a valid year (${MIN_YEAR}-${MAX_YEAR})`);

    return true;
}

async function predictPrice() {
    if (!validateInputs()) return;

    const payload = {
        brand: getValue("brand"),
        model: getValue("model"),
        year: getValue("year"),
        kms_driven: getValue("kmsDriven"),
        fuel_type: getValue("fuelType"),
        transmission: getValue("transmission"),
        seller_type: getValue("sellerType")
    };

    showLoader();

    try {
        const response = await fetch("/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const data = await response.json();

        if (!response.ok || !data.success) {
            hideLoader();
            showForm();
            showError(data.error || "An error occurred while predicting the price");
            return;
        }

        displayResult(data, payload);
    } catch {
        hideLoader();
        showForm();
        showError("Network error. Please try again.");
    }
}

function displayResult(data, payload) {
    hideLoader();
    document.getElementById("form-section").style.display = "none";
    document.getElementById("priceDisplay").textContent = data.formatted_price;
    document.getElementById("resultBrand").textContent = payload.brand;
    document.getElementById("resultModel").textContent = payload.model;
    document.getElementById("resultAge").textContent = `${MAX_YEAR - Number(payload.year)} years`;
    document.getElementById("resultKms").textContent = `${formatNumber(payload.kms_driven)} KM`;
    document.getElementById("result-section").classList.remove("hidden");
    scrollToCard();
}

function resetForm() {
    document.getElementById("carForm").reset();
    document.getElementById("model").innerHTML = '<option value="">Select Model</option>';
    clearError();
    hideLoader();
    showForm();
    document.getElementById("result-section").classList.add("hidden");
    scrollToCard();
}

function showLoader() {
    document.getElementById("loader").classList.remove("hidden");
    document.getElementById("form-section").style.display = "none";
    document.getElementById("result-section").classList.add("hidden");
}

function hideLoader() {
    document.getElementById("loader").classList.add("hidden");
}

function showForm() {
    document.getElementById("form-section").style.display = "block";
}

function showError(message) {
    const errorMessage = document.getElementById("errorMessage");
    errorMessage.textContent = message;
    errorMessage.classList.add("show");
    return false;
}

function clearError() {
    const errorMessage = document.getElementById("errorMessage");
    errorMessage.textContent = "";
    errorMessage.classList.remove("show");
}

function getValue(id) {
    return document.getElementById(id).value.trim();
}

function formatNumber(value) {
    return Number(value).toLocaleString("en-IN");
}

function scrollToCard() {
    setTimeout(() => {
        document.querySelector(".glass-card").scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
}
