import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resultAPI } from '../../services/api';
import './Results.css';

const MyResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await resultAPI.getMyResults();
        setResults(response.data.results);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load results');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) return <div className="loading">Loading your results...</div>;

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return '#51cf66';
    if (percentage >= 80) return '#ffa500';
    if (percentage >= 70) return '#4dabf7';
    if (percentage >= 60) return '#ff922b';
    return '#ff6b6b';
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  return (
    <div className="results-container">
      <h1>My Results</h1>
      {error && <div className="error-message">{error}</div>}
      {results.length === 0 ? (
        <p className="no-results">
          You haven't taken any quizzes yet. Start now!
        </p>
      ) : (
        <div className="results-table">
          <table>
            <thead>
              <tr>
                <th>Quiz Title</th>
                <th>Score</th>
                <th>Percentage</th>
                <th>Grade</th>
                <th>Taken At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result._id}>
                  <td>{result.quizTitle}</td>
                  <td>
                    {result.score}/{result.totalQuestions}
                  </td>
                  <td>{result.percentage}%</td>
                  <td style={{ color: getGradeColor(result.percentage), fontWeight: 'bold' }}>
                    {getGrade(result.percentage)}
                  </td>
                  <td>{new Date(result.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/quiz-result/${result._id}`} className="btn-view">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyResults;
