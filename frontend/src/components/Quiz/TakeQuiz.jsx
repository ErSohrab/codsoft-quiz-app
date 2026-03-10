import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizAPI, resultAPI } from '../../services/api';
import './Quiz.css';

const TakeQuiz = ({ quizId }) => {
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const response = await quizAPI.getQuizById(quizId);
        setQuiz(response.data.quiz);

        const initialAnswers = {};
        response.data.quiz.questions.forEach((_, index) => {
          initialAnswers[index] = null;
        });
        setAnswers(initialAnswers);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load quiz');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  if (loading) return <div className="loading">Loading quiz...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!quiz) return <div className="error-message">Quiz not found</div>;

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;

  const handleSelectAnswer = (optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (
      window.confirm(
        'Are you sure you want to submit the quiz? You cannot change your answers after submission.'
      )
    ) {
      try {
        setSubmitting(true);
        const answersArray = Object.values(answers);
        const timeTaken = Math.floor((Date.now() - startTime) / 1000);

        const response = await resultAPI.submitQuiz({
          quizId,
          answers: answersArray,
          timeTaken,
        });

        navigate(`/quiz-result/${response.data.result.id}`);
      } catch (err) {
        alert(
          `Failed to submit quiz: ${
            err.response?.data?.message || err.message
          }`
        );
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="take-quiz-container">
      <div className="quiz-header">
        <h1>{quiz.title}</h1>
        <div className="quiz-progress">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </div>
      </div>

      <div className="quiz-content">
        <div className="question-section">
          <h2>{currentQuestion.question}</h2>
          <div className="options">
            {currentQuestion.options.map((option, index) => (
              <label key={index} className="option">
                <input
                  type="radio"
                  name="answer"
                  value={index}
                  checked={answers[currentQuestionIndex] === index}
                  onChange={() => handleSelectAnswer(index)}
                  disabled={submitting}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="question-navigator">
          {Array.from({ length: totalQuestions }, (_, index) => (
            <button
              key={index}
              className={`nav-button ${
                answers[index] !== null ? 'answered' : ''
              } ${index === currentQuestionIndex ? 'active' : ''}`}
              onClick={() => setCurrentQuestionIndex(index)}
              disabled={submitting}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <div className="quiz-actions">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0 || submitting}
            className="btn-previous"
          >
            Previous
          </button>
          {currentQuestionIndex === totalQuestions - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-submit"
            >
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={submitting}
              className="btn-next"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TakeQuiz;
