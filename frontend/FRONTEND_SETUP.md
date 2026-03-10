# Frontend Setup & Component Documentation

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.jsx       # Login form component
│   │   │   ├── Register.jsx    # Registration form component
│   │   │   └── Auth.css        # Auth styles
│   │   ├── Layout/
│   │   │   ├── Header.jsx      # Main layout wrapper
│   │   │   ├── Navbar.jsx      # Navigation bar
│   │   │   ├── Footer.jsx      # Footer component
│   │   │   └── Navbar.css      # Layout styles
│   │   ├── Quiz/
│   │   │   ├── QuizList.jsx    # Browse quizzes
│   │   │   ├── CreateQuiz.jsx  # Create quiz form
│   │   │   ├── MyQuizzes.jsx   # Creator's quizzes
│   │   │   ├── TakeQuiz.jsx    # Take quiz interface
│   │   │   └── Quiz.css        # Quiz styles
│   │   └── Results/
│   │       ├── QuizResult.jsx  # Result detail page
│   │       ├── MyResults.jsx   # Results table
│   │       └── Results.css     # Result styles
│   ├── pages/
│   │   ├── Home.jsx            # Landing page
│   │   ├── NotFound.jsx        # 404 page
│   │   └── Pages.css           # Page styles
│   ├── context/
│   │   └── AuthContext.jsx     # Auth state management
│   ├── services/
│   │   └── api.js              # API service layer
│   ├── App.jsx                 # Main app component
│   ├── App.css                 # Global styles
│   └── index.jsx               # React entry point
├── public/
│   ├── index.html
│   └── manifest.json
├── package.json
├── .env
└── .gitignore
```

## Installation & Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment Variables
Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Start Development Server
```bash
npm start
```

Frontend runs on: `http://localhost:3000`

## Architecture

### State Management (Context API)

#### AuthContext
- Global authentication state
- User info
- Login/Register/Logout functions
- Token management

```javascript
const { user, token, login, register, logout, isAuthenticated } = useAuth();
```

### Services (API Layer)

All API calls are centralized in `services/api.js`:

```javascript
// Auth API
authAPI.register(data)
authAPI.login(data)
authAPI.getMe()

// Quiz API
quizAPI.getAllQuizzes()
quizAPI.getQuizById(id)
quizAPI.getMyQuizzes()
quizAPI.createQuiz(data)
quizAPI.updateQuiz(id, data)
quizAPI.deleteQuiz(id)

// Result API
resultAPI.submitQuiz(data)
resultAPI.getResultById(id)
resultAPI.getMyResults()
resultAPI.getQuizResults(quizId)
```

### Routing

Routes are defined in `App.jsx` using React Router v6:

- `/` - Home page (public)
- `/login` - Login page (public)
- `/register` - Register page (public)
- `/quiz-list` - Browse quizzes (protected, candidate)
- `/take-quiz/:id` - Take quiz (protected, candidate)
- `/quiz-result/:id` - View result (protected)
- `/my-results` - View my results (protected, candidate)
- `/create-quiz` - Create quiz (protected, creator)
- `/my-quizzes` - View my quizzes (protected, creator)

## Components Guide

### Authentication Components

#### Login
- Form with email and password
- Error handling
- Redirect after successful login
- Remember token in localStorage

#### Register
- Form with username, email, password, role selection
- Role-based registration (Creator/Candidate)
- Password validation
- Redirect after successful registration

### Quiz Components

#### QuizList
- Displays all available quizzes
- Shows quiz metadata (questions count, duration)
- "Take Quiz" button for each quiz
- Loading and error states

#### CreateQuiz
- Multi-step quiz creation
- Add/remove questions dynamically
- Set multiple choice options
- Select correct answer
- Set time duration
- Form validation

#### MyQuizzes (Creator)
- List of created quizzes
- Edit quiz button
- Delete quiz button
- View results button
- Create new quiz button

#### TakeQuiz
- Question display (one at a time)
- Multiple choice options
- Navigation between questions
- Question summary navigator
- Submit button
- Timer (if duration set)
- Answer tracking

### Results Components

#### QuizResult
- Score display with circular progress
- Grade (A-F) based on percentage
- Detailed answer review
- Show correct/incorrect for each question
- Time taken display
- "Take Another Quiz" button

#### MyResults
- Results table view
- Shows quiz title, score, percentage, grade
- Date of attempt
- View detailed result link
- Filter/sort options

### Layout Components

#### Navbar
- Logo/App name
- User info (if logged in)
- Role badge
- Logout button
- Login/Register links (if not logged in)

#### Footer
- Copyright info
- Tech stack info

#### Header (Layout wrapper)
- Combines Navbar + Content + Footer
- Ensures consistent layout

## Hooks & Utilities

### useAuth Hook
```javascript
const { 
  user, 
  token, 
  loading, 
  error, 
  register, 
  login, 
  logout, 
  isAuthenticated 
} = useAuth();
```

## Protected Routes

Routes are protected with role checking:

```javascript
<ProtectedRoute requiredRole="creator">
  <Layout>
    <CreateQuiz />
  </Layout>
</ProtectedRoute>
```

If user is not authenticated or doesn't have required role, they're redirected to login or home.

## Component Communication

```
App.jsx (Routes)
├── ProtectedRoute
├── Layout
│   ├── Navbar
│   ├── Main Content
│   └── Footer
├── AuthContext (Global State)
│   ├── Login
│   ├── Register
│   ├── QuizList
│   ├── TakeQuiz
│   ├── CreateQuiz
│   ├── MyQuizzes
│   ├── QuizResult
│   └── MyResults
└── API Service (api.js)
    └── Axios (HTTP Client)
```

## Development Workflow

### Creating a New Component

1. Create component file in appropriate folder
2. Create .css file for styling
3. Import useAuth if authentication required
4. Make API calls through services/api.js
5. Update routing in App.jsx if it's a page

Example component structure:
```javascript
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { quizAPI } from '../../services/api';
import './MyComponent.css';

const MyComponent = () => {
  const { user, isAuthenticated } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data
  }, []);

  return <div>{/* JSX */}</div>;
};

export default MyComponent;
```

## Styling

- CSS modules (component-scoped styles)
- Flexbox and Grid for layouts
- Consistent color scheme:
  - Primary: #61dafb (Cyan)
  - Secondary: #282c34 (Dark)
  - Success: #51cf66 (Green)
  - Error: #ff6b6b (Red)
  - Warning: #ffa500 (Orange)

## Performance Optimization

1. **Lazy Loading**: Images load on demand
2. **Code Splitting**: Route-based code splitting (React Router)
3. **Memoization**: useCallback for event handlers
4. **API Caching**: Service layer manages requests

## Error Handling

All API calls include error handling:

```javascript
try {
  // API call
} catch (error) {
  const message = error.response?.data?.message || 'Failed to...';
  setError(message);
}
```

## Build for Production

```bash
npm run build
```

Creates optimized production build in `build/` folder.

## Deployment

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`

### General Steps
1. Build: `npm run build`
2. Update `REACT_APP_API_URL` to production API
3. Deploy build folder to hosting service
4. Ensure CORS is enabled on backend

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### API Connection Issues
- Check if backend is running on port 5000
- Verify REACT_APP_API_URL in .env
- Check CORS settings on backend

### Authentication Issues
- Clear localStorage: `localStorage.clear()`
- Check JWT token format in requests
- Verify JWT_SECRET matches on backend

### Styling Issues
- Clear browser cache (Ctrl+Shift+Delete)
- Check CSS import paths
- Verify CSS files exist

### Build Errors
- Delete node_modules and package-lock.json
- Run `npm install` again
- Check Node version (14+)

## Technologies Used

- **React 18** - UI library
- **React Router 6** - Routing
- **Axios** - HTTP client
- **Context API** - State management
- **CSS3** - Styling
- **JavaScript ES6+** - Language

## Next Steps

1. Add form validation libraries (Formik, React Hook Form)
2. Add toast notifications (React Toastify)
3. Add TypeScript support
4. Add unit tests (Jest, React Testing Library)
5. Add E2E tests (Cypress, Playwright)
