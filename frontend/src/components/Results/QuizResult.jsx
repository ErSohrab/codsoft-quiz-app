import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resultAPI } from '../../services/api';
import './Results.css';

const QuizResult = ({ resultId }) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        const response = await resultAPI.getResultById(resultId);
        setResult(response.data.result);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load result');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [resultId]);

  if (loading) return <div className="loading">Loading result...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!result) return <div className="error-message">Result not found</div>;

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return '#51cf66';
    if (percentage >= 80) return '#ffa500';
    if (percentage >= 70) return '#4dabf7';
    if (percentage >= 60) return '#ff922b';
    return '#ff6b6b';
  };

  return (
    <div className="result-container">
      <div className="result-header">
        <h1>{result.quizTitle}</h1>
        <div className="score-display">
          <div
            className="score-circle"
            style={{ borderColor: getGradeColor(result.percentage) }}
          >
            <div className="score-text">
              <span className="score-number">{result.score}</span>
              <span className="score-total">/{result.totalQuestions}</span>
            </div>
            <div className="percentage">{result.percentage}%</div>
            <div className="grade" style={{ color: getGradeColor(result.percentage) }}>
              Grade: {result.grade}
            </div>
          </div>
        </div>
      </div>

      <div className="result-stats">
        <div className="stat">
          <span className="stat-label">Correct Answers</span>
          <span className="stat-value">{result.score}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Wrong Answers</span>
          <span className="stat-value">{result.totalQuestions - result.score}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Accuracy</span>
          <span className="stat-value">{result.percentage}%</span>
        </div>
        {result.timeTaken > 0 && (
          <div className="stat">
            <span className="stat-label">Time Taken</span>
            <span className="stat-value">
              {Math.floor(result.timeTaken / 60)}:
              {String(result.timeTaken % 60).padStart(2, '0')}
            </span>
          </div>
        )}
      </div>

      <div className="detailed-answers">
        <h2>Detailed Answers</h2>
        {result.answers.map((answer, index) => (
          <div
            key={index}
            className={`answer-item ${answer.isCorrect ? 'correct' : 'incorrect'}`}
          >
            <div className="answer-header">
              <span className="question-number">Question {index + 1}</span>
              <span className={`answer-status ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
                {answer.isCorrect ? 'Correct' : 'Incorrect'}
              </span>
            </div>
            <p className="question-text">{answer.question}</p>
            {answer.selectedAnswer !== null && (
              <p className="answer-text">
                <strong>Your Answer:</strong> Option {answer.selectedAnswer + 1}
              </p>
            )}
            {!answer.isCorrect && (
              <p className="correct-answer">
                <strong>Correct Answer:</strong> Option {answer.correctAnswer + 1}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="result-actions">
        <Link to="/quiz-list" className="btn-retake">
          Take Another Quiz
        </Link>
        <Link to="/" className="btn-home">
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default QuizResult;
