# Kaira — Full-Stack E-Commerce Platform

A scalable, full-stack e-commerce web application built with **Angular** on the frontend and **Django REST Framework** on the backend. Kaira supports modular product browsing, user authentication, cart management, and order processing through a clean API-driven architecture.

---

## 🚀 Live Demo

[> 🔗 *(Add your deployed link here — e.g., Vercel for frontend, Render/Railway for backend)*
](https://kaira-ecommerce-frontend-buln7710x-sudevanss4-1474s-projects.vercel.app/login)
---

## 📸 Screenshots

<img width="1891" height="856" alt="image" src="https://github.com/user-attachments/assets/f6b024e8-fb64-46e9-a329-56d889f717f5" />

<img width="1910" height="825" alt="image" src="https://github.com/user-attachments/assets/655a682a-2265-4196-8c07-2e8c5f87a836" />


---

## ✨ Features

- 🛍️ **Product Catalog** — Browse and filter products with a responsive UI
- 🔐 **User Authentication** — Register, login, and session management via JWT
- 🛒 **Shopping Cart** — Add, update, and remove items with real-time feedback
- 📦 **Order Management** — Place and track orders through the REST API
- 🧩 **Modular Angular Architecture** — Feature modules with lazy-loaded routes
- 🌐 **RESTful API** — Clean, resource-based API endpoints powered by DRF
- 📱 **Responsive Design** — Mobile-friendly layout across all screen sizes

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular, TypeScript, HTML5, CSS3 |
| Backend | Python, Django, Django REST Framework |
| Database | SQLite *(development)* → PostgreSQL *(production-ready)* |
| Auth | JWT (JSON Web Tokens) |
| API | RESTful, JSON |

---

## 📁 Project Structure

```
Kaira---ecommerce-project/
├── backend/               # Django project
│   ├── manage.py
│   ├── requirements.txt
│   ├── config/            # Settings, URLs, WSGI
│   └── apps/              # Django apps (products, orders, users, etc.)
├── frontend/              # Angular project
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── modules/
│   └── angular.json
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+ and npm
- Angular CLI (`npm install -g @angular/cli`)

---

### 🔧 Backend Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Apply migrations
python manage.py migrate

# 5. Create a superuser (optional, for admin panel)
python manage.py createsuperuser

# 6. Start the development server
python manage.py runserver
```

Backend will run at: `http://localhost:8000`

---

### 🎨 Frontend Setup

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Start the Angular dev server
ng serve
```

Frontend will run at: `http://localhost:4200`

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register/` | Register a new user |
| POST | `/api/auth/login/` | Login and receive JWT token |
| GET | `/api/products/` | List all products |
| GET | `/api/products/:id/` | Get product details |
| POST | `/api/cart/` | Add item to cart |
| GET | `/api/orders/` | Get user orders |
| POST | `/api/orders/` | Place a new order |

---

## 🗃️ Database

This project uses **SQLite** for local development (no setup required). For production deployment, it is designed to be switched to **PostgreSQL** by updating the `DATABASES` config in Django settings.

---

## 🔮 Planned Improvements

- [ ] Deploy frontend on Vercel, backend on Railway/Render
- [ ] Switch to PostgreSQL for production
- [ ] Add product search and category filtering
- [ ] Integrate a real payment gateway (Razorpay / Stripe)
- [ ] Write unit and integration tests
- [ ] Add product image upload support

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---

## 👨‍💻 Author

**Sudev A**
Passionate Python developer and designer.
🔗 [GitHub](https://github.com/sudev-sep)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).



**readme is generated using claude AI**
