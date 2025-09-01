# Project Setup Guide

This repository contains a **Django backend** and a **React frontend**.  
Follow the steps below to set up and run both parts of the application.

---

## 🚀 Backend (Django)

1. Navigate to the backend folder:
   ```bash
   cd "Backend Django"
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   ```

   - On **Windows**:
     ```bash
     venv\Scripts\activate
     ```
   - On **Mac/Linux**:
     ```bash
     source venv/bin/activate
     ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:  
   Create a `.env` file in the **Backend Django** folder with the following variables (example):
   ```env
   DEBUG=True
   SECRET_KEY=your-secret-key
   DATABASE_URL=sqlite:///db.sqlite3
   ALLOWED_HOSTS=127.0.0.1,localhost
   ```

   > ⚠️ Replace `your-secret-key` with a secure key. You can generate one using:
   > ```bash
   > python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
   > ```

5. Run database migrations:
   ```bash
   python manage.py migrate
   ```

6. Start the Django development server:
   ```bash
   daphne slack_clone.asgi:application
   ```

The backend should now be running at:  
👉 http://127.0.0.1:8000/

---

## 🎨 Frontend (React)

1. Navigate to the frontend folder:
   ```bash
   cd "Frontend React"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:  
   Create a `.env` file in the **Frontend React** folder with the following variables (example):
   ```env
   VITE_API_URL=http://127.0.0.1:8000/api
   ```

   > ⚠️ Make sure the API URL matches your backend server address.

4. Start the development server:
   ```bash
   npm run dev
   ```

The frontend should now be running at (default):  
👉 http://localhost:5173/

---

## ✅ Notes

- Make sure **Python 3.9+** and **Node.js 16+** are installed.  
- Keep the backend running when using the frontend to enable API communication.  
- Update `.env` files in both frontend and backend as needed for your environment.  
- Add `.env` to your `.gitignore` to avoid committing sensitive data.

---

## 📂 Project Structure

```
root/
│── Backend Django/   # Django backend
│   ├── .env          # Environment variables (not committed to git)
│── Frontend React/   # React frontend
│   ├── .env          # Environment variables (not committed to git)
│── README.md         # Setup instructions
```

---

## 🛠 Tech Stack

- **Backend:** Django, Django REST Framework  
- **Frontend:** React (Vite)  
- **Database:** SQLite (default, can be changed)  

---


# Backend
cd "Backend Django"
python -m venv venv
venv\Scripts\activate  # or source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
(python manage.py runserver 
            (or)
daphne slack_clone.asgi:application)

# Frontend
cd "Frontend React"
npm install
npm run dev
