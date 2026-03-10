import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { resultAPI } from '../../services/api';
import './Results.css';

const QuizResults = ({ quizId }) => {
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizResults = async () => {
      try {
        setLoading(true);
        const response = await resultAPI.getQuizResults(quizId);
        setResults(response.data.results || []);
        setStats(response.data.stats || null);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load quiz results');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizResults();
  }, [quizId]);

  if (loading) return <div className="loading">Loading quiz results...</div>;

  return (
    <div className="results-container">
      <h1>Quiz Results</h1>
      <Link to="/my-quizzes" className="btn-home">
        Back to My Quizzes
      </Link>
      {error && <div className="error-message">{error}</div>}

      {stats && (
        <div className="result-stats">
          <div className="stat">
            <span className="stat-label">Attempts</span>
            <span className="stat-value">{stats.totalAttempts}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Average Score</span>
            <span className="stat-value">{stats.averageScore}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Average Percentage</span>
            <span className="stat-value">{stats.averagePercentage}%</span>
          </div>
        </div>
      )}

      {results.length === 0 ? (
        <p className="no-results">No one has submitted this quiz yet.</p>
      ) : (
        <div className="results-table">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Score</th>
                <th>Percentage</th>
                <th>Time Taken</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result._id}>
                  <td>{result.username}</td>
                  <td>
                    {result.score}/{result.totalQuestions}
                  </td>
                  <td>{result.percentage}%</td>
                  <td>{result.timeTaken || 0}s</td>
                  <td>{new Date(result.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default QuizResults;
