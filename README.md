# 🚗 Car Price Prediction Web App

A machine learning web application that predicts the resale price of used cars in India using Linear Regression. Users can enter car details such as brand, model, year, kilometers driven, fuel type, transmission, and seller type to get an estimated resale price instantly.

---

## 📌 Project Description

The **Car Price Prediction Web App** is built with Flask and a trained machine learning model. It uses car attributes submitted through a clean web interface, prepares the input features in the same format used during training, and returns an estimated resale price through a Flask API.

---

## 🚀 Features

- Predict car resale price instantly
- Clean and modern user interface
- Dynamic brand and model selection
- Real-time prediction using a Flask API
- Machine learning model using Linear Regression
- Responsive design for desktop and mobile screens

---

## 🛠️ Tech Stack

- **Python**
- **Flask**
- **Scikit-learn**
- **Pandas**
- **NumPy**
- **HTML**
- **CSS**
- **JavaScript**

---

## 📁 Project Structure

```text
Car Price Prediction Web App/
├── app.py
├── model.pkl
├── columns.pkl
├── india_used_cars_dataset.csv
├── templates/
│   └── index.html
└── static/
    ├── style.css
    └── script.js
```

> Note: `model.pkl` and `columns.pkl` are required to run predictions. The dataset file is used for training or reference if included in the project.

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone <repository-url>
```

### 2. Navigate to the project folder

```bash
cd "Car Price Prediction Web App"
```

### 3. Install dependencies

```bash
pip install flask pandas numpy scikit-learn
```

### 4. Run the application

```bash
python app.py
```

### 5. Open in browser

Visit:

```text
http://127.0.0.1:5000
```

---

## ▶️ Usage

1. Open the web app in your browser.
2. Select the car brand.
3. Choose the car model from the dynamic model dropdown.
4. Enter the manufacturing year.
5. Enter the kilometers driven.
6. Select fuel type, transmission type, and seller type.
7. Click **Predict Price**.
8. View the estimated resale price displayed on the result screen.

---

## 📊 Model Details

- **Algorithm:** Linear Regression
- **Feature Engineering:** Car age is calculated from the manufacturing year.
- **Data Preprocessing:** Categorical fields are handled using one-hot encoded feature columns.
- **Evaluation Metrics:** R2 score and Mean Squared Error are used to evaluate model performance.

---

## 📌 Future Improvements

- Add more advanced machine learning models
- Improve dataset quality and size
- Deploy the application to the cloud
- Add car image preview
- Add model comparison and prediction confidence

---

## 👨‍💻 Author

**Sudeshwar T S**

---

## ⭐ Acknowledgement

This project demonstrates how machine learning can be integrated with a Flask web application to create a practical and interactive prediction tool.
