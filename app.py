import pickle

import pandas as pd
from flask import Flask, jsonify, render_template, request


MODEL_PATH = "model.pkl"
COLUMNS_PATH = "columns.pkl"
CURRENT_YEAR = 2025
MIN_YEAR = 1990

CATEGORICAL_FIELDS = {
    "Brand": "brand",
    "Model": "model",
    "Fuel_Type": "fuel_type",
    "Seller_Type": "seller_type",
    "Transmission": "transmission",
}


app = Flask(__name__, template_folder="templates", static_folder="static")


# Model loading
with open(MODEL_PATH, "rb") as file:
    model = pickle.load(file)

with open(COLUMNS_PATH, "rb") as file:
    feature_columns = pickle.load(file)


# Routes
@app.route("/")
def home():
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json(silent=True) or {}
        validated = validate_input(data)
        input_frame = build_feature_frame(validated)
        predicted_price = float(model.predict(input_frame)[0])

        return jsonify(
            {
                "success": True,
                "predicted_price": predicted_price,
                "formatted_price": format_price(predicted_price),
            }
        )
    except ValueError as error:
        return jsonify({"error": str(error)}), 400
    except Exception as error:
        return jsonify({"error": f"Prediction error: {error}"}), 500


# Prediction logic
def validate_input(data):
    brand = str(data.get("brand", "")).strip()
    car_model = str(data.get("model", "")).strip()
    fuel_type = str(data.get("fuel_type", "")).strip()
    transmission = str(data.get("transmission", "")).strip()
    seller_type = str(data.get("seller_type", "")).strip()

    if not all([brand, car_model, fuel_type, transmission, seller_type]):
        raise ValueError("All fields are required")

    try:
        year = int(data.get("year", CURRENT_YEAR))
        kms_driven = float(data.get("kms_driven", 0))
    except (TypeError, ValueError):
        raise ValueError("Year and KM driven must be valid numbers")

    if kms_driven < 0:
        raise ValueError("KM driven cannot be negative")

    if year < MIN_YEAR or year > CURRENT_YEAR:
        raise ValueError(f"Invalid year (must be {MIN_YEAR}-{CURRENT_YEAR})")

    return {
        "brand": brand,
        "model": car_model,
        "year": year,
        "kms_driven": kms_driven,
        "fuel_type": fuel_type,
        "transmission": transmission,
        "seller_type": seller_type,
    }


def build_feature_frame(data):
    row = dict.fromkeys(feature_columns, 0)
    row["Age"] = CURRENT_YEAR - data["year"]
    row["Kms_Driven"] = data["kms_driven"]

    for feature_name, request_key in CATEGORICAL_FIELDS.items():
        column_name = f"{feature_name}_{data[request_key]}"
        if column_name in row:
            row[column_name] = 1

    return pd.DataFrame([row], columns=feature_columns)


def format_price(predicted_price):
    if predicted_price < 100:
        return f"Rs. {predicted_price:.2f} Lakhs"

    return f"Rs. {predicted_price / 100000:.2f} Lakhs"


if __name__ == "__main__":
    app.run(debug=True, port=5000, use_reloader=False)
