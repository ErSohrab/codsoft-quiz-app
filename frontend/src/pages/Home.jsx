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
            {canManageQuizzes ? (
              <div className="action-buttons">
                <Link to="/create-quiz" className="btn-primary">
                  Create a New Quiz
                </Link>
                <Link to="/my-quizzes" className="btn-secondary">
                  View My Quizzes
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/quiz-list" className="btn-secondary">
                    Browse Candidate View
                  </Link>
                )}
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
              <p>Admin accounts can access both creator and candidate areas.</p>
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

      <div className="features-section">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">Create</div>
            <h3>Create Quizzes</h3>
            <p>As a creator, build engaging quizzes with multiple-choice questions</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">Play</div>
            <h3>Take Quizzes</h3>
            <p>Access quizzes created by others and test your knowledge</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">Track</div>
            <h3>View Results</h3>
            <p>Track your performance with detailed result reports</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">Safe</div>
            <h3>Secure</h3>
            <p>Your data is protected with secure authentication</p>
          </div>
        </div>
      </div>

      <div className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Register</h3>
            <p>Create an account as a Creator or Candidate</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Create or Find</h3>
            <p>Creators make quizzes, Candidates browse and take them</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Submit and Review</h3>
            <p>Get instant feedback with detailed result analysis</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
