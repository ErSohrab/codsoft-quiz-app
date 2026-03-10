# MERN Migration & Quick Start Guide

## 📋 What Has Changed

Your Quiz App has been restructured from a monolithic EJS-based application to a modern **MERN Stack** with proper separation of concerns using MVC architecture.

### Before (Monolithic Structure)
```
quiz-app/
├── server.js (mixed concerns)
├── views/ (EJS templates)
├── public/ (frontend files)
├── controllers/
├── models/
├── routes/
└── middleware/
```

### After (MERN Structure)
```
quiz-app/
├── backend/ (Pure API Server)
│   └── src/ (MVC Architecture)
├── frontend/ (React SPA)
│   └── src/ (Component-based)
└── Documentation files
```

## 🚀 Quick Start Guide

### Step 1: Setup Backend

```bash
cd backend
npm install
npm run dev
```

Backend API runs on: `http://localhost:5000`

### Step 2: Setup Frontend

In a new terminal:
```bash
cd frontend
npm install
npm start
```

Frontend runs on: `http://localhost:3000`

### Step 3: Access the Application

Open browser and go to: `http://localhost:3000`

## 📝 Key Differences

### Backend Changes

| Feature | Before | After |
|---------|--------|-------|
| View Engine | EJS Templates | REST API (JSON) |
| Session Auth | express-session | JWT Tokens |
| Frontend | Server-rendered | SPA (React) |
| Templating | EJS | Not applicable |
| API Format | Server-rendered HTML | Clean JSON |

### Frontend Changes

| Feature | Before | After |
|---------|--------|-------|
| Framework | EJS Templates | React 18 |
| State | Server Session | Context API |
| Routing | Server-side | Client-side React Router |
| Styling | Embedded CSS | Component-scoped CSS |
| Build Tool | N/A | react-scripts |

## 🔧 Configuration

### Backend `.env`
```env
MONGODB_URI=mongodb://localhost:27017/quiz-app
JWT_SECRET=your_secret_key_here
PORT=5000
```

### Frontend `.env`
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 📚 File Mapping

### Old Files → New Location

| Old Path | New Path | Type |
|----------|----------|------|
| `server.js` | `backend/src/server.js` | Entry point |
| `config/database.js` | `backend/src/config/database.js` | Config |
| `models/*` | `backend/src/models/*` | MVC Model |
| `controllers/*` | `backend/src/controllers/*` | MVC Controller |
| `routes/*` | `backend/src/routes/*` | Routes |
| `middleware/*` | `backend/src/middleware/*` | Middleware |
| `views/*` | `frontend/src/components/*` (converted) | React Components |
| `public/*` | `frontend/public/` | Static files |

## 🔄 Converting EJS Templates to React

All EJS templates have been converted to React components:

- `login.ejs` → `Login.jsx`
- `register.ejs` → `Register.jsx`
- `quiz-list.ejs` → `QuizList.jsx`
- `take-quiz.ejs` → `TakeQuiz.jsx`
- `quiz-result.ejs` → `QuizResult.jsx`
- `my-quizzes.ejs` → `MyQuizzes.jsx`
- `my-results.ejs` → `MyResults.jsx`
- `create-quiz.ejs` → `CreateQuiz.jsx`

## 🔐 Authentication Changes

### Before (Session-based)
```javascript
req.session.userId = user._id;
// Session data stored server-side
// Automatic cookie handling
```

### After (JWT-based)
```javascript
const token = jwt.sign({ id, role }, JWT_SECRET);
// Token stored in localStorage
// Manual header management in API calls
```

### Frontend Authentication Flow
```
Register/Login → JWT Token → localStorage → API Headers → Context State
```

## 💾 Database

No database schema changes - same MongoDB collections used:
- Users
- Quizzes
- Results

## 🧪 Testing the Application

### 1. Register a User
- Role: `creator`
- Username: `testcreator`
- Email: `creator@test.com`
- Password: `password123`

### 2. Create a Quiz
- Go to "Create Quiz" page
- Add questions with options
- Set time duration
- Create quiz

### 3. Register Another User
- Role: `candidate`
- Take the created quiz

### 4. View Results
- As candidate: View your results
- As creator: View quiz performance

## 🎯 API Endpoints

All routes start with `/api`:

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /quizzes` - List quizzes
- `POST /quizzes` - Create quiz (creator)
- `GET /quizzes/:id` - Get quiz details
- `PUT /quizzes/:id` - Update quiz (creator)
- `DELETE /quizzes/:id` - Delete quiz (creator)
- `POST /results/submit` - Submit quiz (candidate)
- `GET /results/:id` - Get result details
- `GET /results/candidate/my-results` - My results (candidate)
- `GET /results/quiz/:quizId` - Quiz results (creator)

Full API docs: See [BACKEND_SETUP.md](./backend/BACKEND_SETUP.md)

## 🐛 Troubleshooting

### Issue: Cannot connect to API
**Solution:**
1. Ensure backend is running: `npm run dev` in backend folder
2. Check REACT_APP_API_URL in frontend `.env`
3. Verify MongoDB is running

### Issue: Login not working
**Solution:**
1. Clear browser localStorage
2. Check JWT_SECRET in backend `.env`
3. Verify user exists in database

### Issue: CORS errors
**Solution:**
1. Backend has CORS enabled
2. Check API URL has correct domain and port
3. Restart both frontend and backend

### Issue: Styles not loading
**Solution:**
1. Clear browser cache
2. Restart frontend: `npm start`
3. Check CSS file imports

## 📦 Dependencies

### New Backend Dependencies
- `jsonwebtoken` - JWT auth (new)
- `cors` - CORS support (new)
- Removed: `ejs`, `express-session`, `express-session`

### New Frontend Dependencies
- `react` - Core library
- `react-dom` - DOM rendering
- `react-router-dom` - Client-side routing
- `axios` - HTTP client

## 🚢 Deployment Ready

The new MERN structure is production-ready:

**Backend Deployment:**
- Deploy to Heroku, Railway, or AWS
- Use MongoDB Atlas for cloud DB
- Set production environment variables

**Frontend Deployment:**
- Deploy to Vercel, Netlify, or GitHub Pages
- Update API_URL to production backend
- Build: `npm run build`

## 📖 Documentation

- [Main README](./README.md) - Overview
- [Backend Setup](./backend/BACKEND_SETUP.md) - Backend API docs
- [Frontend Setup](./frontend/FRONTEND_SETUP.md) - Frontend component docs

## ✅ Checklist for Going Live

- [ ] Update MONGODB_URI to MongoDB Atlas
- [ ] Update JWT_SECRET to secure random string
- [ ] Update REACT_APP_API_URL to production domain
- [ ] Test all authentication flows
- [ ] Test quiz creation and taking
- [ ] Test results viewing
- [ ] Set up CI/CD pipeline
- [ ] Configure staging environment
- [ ] Run security audit
- [ ] Load testing
- [ ] Deploy backend first
- [ ] Deploy frontend after confirming backend

## 🎉 You're All Set!

Your Quiz App is now a modern, scalable MERN application with proper architecture separation. Follow the quick start guide above to get running!

For detailed documentation, see:
- Backend: [BACKEND_SETUP.md](./backend/BACKEND_SETUP.md)
- Frontend: [FRONTEND_SETUP.md](./frontend/FRONTEND_SETUP.md)
