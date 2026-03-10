import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quizAPI } from '../../services/api';
import './Quiz.css';

const MyQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyQuizzes = async () => {
      try {
        setLoading(true);
        const response = await quizAPI.getMyQuizzes();
        setQuizzes(response.data.quizzes);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load your quizzes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyQuizzes();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await quizAPI.deleteQuiz(id);
        setQuizzes((currentQuizzes) =>
          currentQuizzes.filter((quiz) => quiz._id !== id)
        );
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete quiz');
      }
    }
  };

  if (loading) return <div className="loading">Loading your quizzes...</div>;

  return (
    <div className="quiz-container">
      <h1>My Quizzes</h1>
      <Link to="/create-quiz" className="btn-create-quiz">
        + Create New Quiz
      </Link>
      {error && <div className="error-message">{error}</div>}
      {quizzes.length === 0 ? (
        <p className="no-quizzes">
          You haven't created any quizzes yet. Create one now!
        </p>
      ) : (
        <div className="quiz-grid">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="quiz-card">
              <h3>{quiz.title}</h3>
              {quiz.description && <p>{quiz.description}</p>}
              <div className="quiz-meta">
                <span>Questions: {quiz.questions.length}</span>
                {quiz.duration > 0 && <span>Duration: {quiz.duration}s</span>}
              </div>
              <div className="quiz-actions">
                <Link to={`/quiz-results/${quiz._id}`} className="btn-view-results">
                  View Results
                </Link>
                <button
                  onClick={() => handleDelete(quiz._id)}
                  className="btn-delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyQuizzes;
