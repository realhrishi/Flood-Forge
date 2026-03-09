Flood-Forge — AI Powered Flood Risk Prediction & Alert System

Flood-Forge is an intelligent flood monitoring and prediction platform that combines machine learning, real-time weather data, and interactive visualization to detect potential flood risks and alert users early.

The platform analyzes environmental and rainfall data to estimate flood probability for different locations and displays risk zones on a live map.

🚀 Features

🌧 Flood Risk Prediction using trained ML models (Random Forest / XGBoost)

🗺 Interactive Flood Map showing risk zones

📡 Live Rainfall Radar Visualization

🔔 Automated Alerts System

📍 Location-based Flood Monitoring

🔐 User Authentication

☁ Cloud database integration with Supabase

📲 Notification support via Twilio

🧠 System Architecture
                Weather APIs
                     │
                     │
              Data Collection
                     │
                     ▼
             Feature Processing
                     │
                     ▼
          Machine Learning Model
        (Random Forest / XGBoost)
                     │
                     ▼
           Flood Risk Prediction
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
     Alert Generation      Risk Visualization
          │                     │
          ▼                     ▼
     Twilio Notifications     React Dashboard
🛠 Tech Stack
Frontend

React

Vite

CSS / Tailwind

Interactive Maps

Rainfall Radar Visualization

Backend

FastAPI

Python

REST APIs

Machine Learning

Scikit-Learn

XGBoost

Pandas

NumPy

Cloud Services

Supabase (Database & Auth)

OpenWeather API (Weather Data)

Twilio (Alert System)

📂 Project Structure
Flood-Forge
│
├── backend
│   ├── routes
│   ├── services
│   ├── models
│   ├── database
│   ├── ml_model
│   └── main.py
│
├── src
│   ├── components
│   ├── pages
│   ├── services
│
├── public
├── package.json
├── vite.config.js
└── README.md
⚙️ Setup Instructions
1️⃣ Clone the repository
git clone https://github.com/realhrishi/Flood-Forge.git
cd Flood-Forge
2️⃣ Backend setup
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

Backend will run on:

http://localhost:8000
3️⃣ Frontend setup
npm install
npm run dev

Frontend will run on:

http://localhost:5173
🔐 Environment Variables

Create a file:

backend/.env

Example:

SUPABASE_URL=
SUPABASE_KEY=
OPENWEATHER_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
📊 Machine Learning Model

Flood-Forge uses supervised learning models trained on historical flood-related datasets.

Models used:

Random Forest

XGBoost

Features include:

Rainfall

Temperature

Humidity

Location parameters

Historical flood indicators

The trained model predicts the probability of flood occurrence.

🎯 Future Improvements

Satellite rainfall integration

Deep learning flood prediction

Real-time disaster alert broadcasting

Mobile application

Government disaster management integration

👨‍💻 Author

Hrishiraj Chowdhury

GitHub:
https://github.com/realhrishi

⭐ If you like the project

Give the repository a star ⭐
