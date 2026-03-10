# Quiz App - MERN Stack Architecture

A modern, full-stack quiz application built with **MongoDB, Express, React, and Node.js (MERN)** using proper MVC architecture.

## 📁 Project Structure

```
quiz-app/
├── backend/                    # Express.js API Server (MVC)
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── controllers/        # Business logic
│   │   ├── models/             # Mongoose schemas
│   │   ├── middleware/         # Auth & role middleware
│   │   ├── routes/             # API routes
│   │   ├── utils/              # Utilities
│   │   └── server.js           # Express entry point
│   ├── package.json
│   ├── .env
│   ├── .gitignore
│   └── BACKEND_SETUP.md        # API documentation
│
├── frontend/                   # React Client (Component-based)
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── context/            # Auth state management
│   │   ├── services/           # API service layer
│   │   ├── App.jsx
│   │   └── index.jsx
│   ├── public/
│   ├── package.json
│   ├── .env
│   ├── .gitignore
│   └── FRONTEND_SETUP.md       # Component documentation
│
├── .gitignore
├── README.md                   # This file
└── QUICKSTART.md               # Quick start & migration guide
```

## 🚀 Quick Start

### Backend
```bash
cd backend
npm install
npm run dev  # http://localhost:5000
```

### Frontend (New Terminal)
```bash
cd frontend
npm install
npm start    # http://localhost:3000
```

## 🏗️ Architecture

### Backend - MVC Pattern
- **Model**: Mongoose schemas (User, Quiz, Result)
- **View**: RESTful JSON API endpoints
- **Controller**: Request handling & business logic
- **Middleware**: JWT auth, role-based access

### Frontend - Component-Based
- **Context API** for auth state management
- **React Router** for client-side navigation
- **Axios** for API communication
- **Component-scoped** CSS styling

## 🔐 Key Features

### Authentication
- JWT-based authentication
- Role-based access (Creator/Candidate)
- Secure password hashing

### For Creators
- Create quizzes with MCQs
- Edit & delete quizzes
- View quiz statistics
- Track candidate performance

### For Candidates
- Browse available quizzes
- Take quizzes with timer
- View detailed results
- Track performance history

## 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Migration guide & setup
- **[backend/BACKEND_SETUP.md](./backend/BACKEND_SETUP.md)** - API documentation
- **[frontend/FRONTEND_SETUP.md](./frontend/FRONTEND_SETUP.md)** - Component guide

## 🔧 Technology Stack

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT + bcryptjs
- CORS enabled

### Frontend
- React 18
- React Router v6
- Axios
- Context API

## ⚙️ Configuration

**Backend `.env`:**
```env
MONGODB_URI=mongodb://localhost:27017/quiz-app
JWT_SECRET=your_secret_key_here
PORT=5000
```

**Frontend `.env`:**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🧹 Old Codebase Removed

- ✅ Removed monolithic server.js
- ✅ Removed EJS templates (converted to React)
- ✅ Removed server-side session management
- ✅ Removed root-level node_modules
- ✅ Removed root-level package.json
- ✅ Separated backend & frontend completely

## 📖 API Endpoints

All endpoints start with `/api`:

**Auth**: `POST /auth/register`, `POST /auth/login`, `GET /auth/me`

**Quizzes**: `GET /quizzes`, `POST /quizzes`, `PUT /quizzes/:id`, `DELETE /quizzes/:id`

**Results**: `POST /results/submit`, `GET /results/:id`, `GET /results/candidate/my-results`

See [backend/BACKEND_SETUP.md](./backend/BACKEND_SETUP.md) for full API docs.

## 🚢 Ready for Deployment

- Backend: Deploy to Heroku, Railway, AWS
- Frontend: Deploy to Vercel, Netlify, or GitHub Pages
- Database: Use MongoDB Atlas

## 📄 License

ISC License

---

**See [QUICKSTART.md](./QUICKSTART.md) for detailed setup instructions.**
