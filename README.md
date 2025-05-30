# Barber-Management

A full-stack salon & barber-shop management platform.  
Users can browse and book salons, manage profiles, reviews & payments.  
Salon owners can register, configure services, and manage bookings.

---

## Table of Contents

1. [Features](#features)  
2. [Tech Stack](#tech-stack)  
3. [Repository Structure](#repository-structure)  
4. [Getting Started](#getting-started)  
   - [Environment Variables](#environment-variables)  
   - [Backend Setup](#backend-setup)  
   - [Frontend Setup](#frontend-setup)  
5. [Available Scripts](#available-scripts)  
6. [API Reference](#api-reference)  
7. [Frontend Pages](#frontend-pages)  
8. [License](#license)  

---

## Features

- User registration, login & profile management  
- Salon registration & authentication  
- Service CRUD & assignment  
- Browse salons, search, reviews & ratings  
- Booking management (upcoming, past, cancelled)  
- Payment methods, transaction history & invoices  
- Multi-step salon setup wizard  

---

## Tech Stack

- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt  
- **Frontend**: React (via Vite), Tailwind CSS, Axios, React Router  
- **DevTools**: ESLint, nodemon  

---

## Repository Structure

```
.
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   ├── .env
│   ├── app.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── main.jsx
│   ├── .env
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── .gitignore
└── README.md
```

---

## Getting Started

```

### Backend Setup

```bash
cd backend
npm install
npm run dev
# Server runs on http://localhost:4000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
# App served at http://localhost:5173
```

---

## Available Scripts

### Backend (`/backend/package.json`)
- `npm run dev` — start server with nodemon  

### Frontend (`/frontend/package.json`)
- `npm run dev` — run Vite dev server  
- `npm run build` — build for production  
- `npm run lint` — run ESLint  

---

## API Reference

### Users
- POST `/users/register` — registerUser  
- POST `/users/login` — loginUser  
- GET  `/users/profile` — getUserProfile (Auth)  
- GET  `/users/logout` — logoutUser (Auth)  

### Stores
- POST `/stores/register` — registerStore  
- POST `/stores/login` — loginStore  
- GET  `/stores/get-store` — getStore (Auth)  
- GET  `/stores/getallstores` — getAllStores  
- POST `/stores/add-service` — includedServices (Auth)  

### Services
- GET `/services/get-services` — getServices  

---

## Frontend Pages

- **Home** — HomePage.jsx  
- **User Login/Signup** — UserLogin.jsx, UserSignUp.jsx  
- **Salon Landing** — StoreLandingPage.jsx  
- **Salon Login/Register** — StoreLogin.jsx, StoreRegister.jsx  
- **Salon Dashboard** — StoreHomePage.jsx  
- **Salon Setup Wizard** — StoreSetup.jsx  
- **User Profile** — UserProfile.jsx  

---

## License

MIT © Barber-Management Team
