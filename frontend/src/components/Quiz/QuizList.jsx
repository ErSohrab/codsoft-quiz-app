import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quizAPI } from '../../services/api';
import './Quiz.css';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const response = await quizAPI.getAllQuizzes();
        setQuizzes(response.data.quizzes);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load quizzes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) return <div className="loading">Loading quizzes...</div>;

  return (
    <div className="quiz-container">
      <h1>Available Quizzes</h1>
      {error && <div className="error-message">{error}</div>}
      {quizzes.length === 0 ? (
        <p className="no-quizzes">No quizzes available at the moment.</p>
      ) : (
        <div className="quiz-grid">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="quiz-card">
              <h3>{quiz.title}</h3>
              <p className="creator">By: {quiz.creatorName || 'Unknown creator'}</p>
              {quiz.description && <p>{quiz.description}</p>}
              <div className="quiz-meta">
                {Array.isArray(quiz.questions) && (
                  <span>Questions: {quiz.questions.length}</span>
                )}
                {quiz.duration > 0 && <span>Duration: {quiz.duration}s</span>}
              </div>
              <Link to={`/take-quiz/${quiz._id}`} className="btn-take-quiz">
                Take Quiz
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizList;
