import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout/Header';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import QuizList from './components/Quiz/QuizList';
import CreateQuiz from './components/Quiz/CreateQuiz';
import MyQuizzes from './components/Quiz/MyQuizzes';
import TakeQuiz from './components/Quiz/TakeQuiz';
import QuizResult from './components/Results/QuizResult';
import MyResults from './components/Results/MyResults';
import QuizResults from './components/Results/QuizResults';
import { canAccessRole, getDefaultRouteForRole } from './utils/access';
import './App.css';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, initializing } = useAuth();

  if (initializing) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && !canAccessRole(user?.role, requiredRole)) {
    return <Navigate to={getDefaultRouteForRole(user?.role)} replace />;
  }

  return children;
};

const QuizPage = () => {
  const { id } = useParams();

  if (!id) return <NotFound />;

  return (
    <Layout>
      <TakeQuiz quizId={id} />
    </Layout>
  );
};

const ResultPage = () => {
  const { id } = useParams();

  if (!id) return <NotFound />;

  return (
    <Layout>
      <QuizResult resultId={id} />
    </Layout>
  );
};

const CreatorQuizResultsPage = () => {
  const { id } = useParams();

  if (!id) return <NotFound />;

  return (
    <Layout>
      <QuizResults quizId={id} />
    </Layout>
  );
};

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredRole="admin">
            <Layout>
              <AdminDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/quiz-list"
        element={
          <ProtectedRoute requiredRole="candidate">
            <Layout>
              <QuizList />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/take-quiz/:id"
        element={
          <ProtectedRoute requiredRole="candidate">
            <QuizPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quiz-result/:id"
        element={
          <ProtectedRoute>
            <ResultPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-results"
        element={
          <ProtectedRoute requiredRole="candidate">
            <Layout>
              <MyResults />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-quiz"
        element={
          <ProtectedRoute requiredRole="creator">
            <Layout>
              <CreateQuiz />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-quizzes"
        element={
          <ProtectedRoute requiredRole="creator">
            <Layout>
              <MyQuizzes />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/quiz-results/:id"
        element={
          <ProtectedRoute requiredRole="creator">
            <CreatorQuizResultsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={
          <Layout>
            <NotFound />
          </Layout>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
