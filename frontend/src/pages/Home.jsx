import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Pages.css';

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const canManageQuizzes =
    user?.role === 'creator' || user?.role === 'admin';
  const canTakeQuizzes =
    user?.role === 'candidate' || user?.role === 'admin';

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to Quiz App</h1>
        <p>Create, share, and take quizzes online</p>

        {isAuthenticated ? (
          <div className="hero-content">
            <h2>Welcome back, {user?.username}!</h2>
            {user?.role === 'admin' ? (
              <div className="action-buttons">
                <Link to="/admin/dashboard" className="btn-primary">
                  Open Admin Dashboard
                </Link>
                <Link to="/my-quizzes" className="btn-secondary">
                  Manage All Quizzes
                </Link>
                <Link to="/my-results" className="btn-secondary">
                  Review Results
                </Link>
                <Link to="/quiz-list" className="btn-secondary">
                  Browse Candidate View
                </Link>
              </div>
            ) : canManageQuizzes ? (
              <div className="action-buttons">
                <Link to="/create-quiz" className="btn-primary">
                  Create a New Quiz
                </Link>
                <Link to="/my-quizzes" className="btn-secondary">
                  View My Quizzes
                </Link>
              </div>
            ) : canTakeQuizzes ? (
              <div className="action-buttons">
                <Link to="/quiz-list" className="btn-primary">
                  Take a Quiz
                </Link>
                <Link to="/my-results" className="btn-secondary">
                  View My Results
                </Link>
              </div>
            ) : null}
            {user?.role === 'admin' && (
              <p>
                Admin accounts can access both creator and candidate areas, plus
                the dedicated admin dashboard.
              </p>
            )}
          </div>
        ) : (
          <div className="hero-content">
            <p>Get started by logging in or creating an account</p>
            <div className="action-buttons">
              <Link to="/login" className="btn-primary">
                Login
              </Link>
              <Link to="/register" className="btn-secondary">
                Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
