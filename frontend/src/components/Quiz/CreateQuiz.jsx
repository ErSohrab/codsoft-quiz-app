import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizAPI } from '../../services/api';
import './Quiz.css';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 0,
  });
  const [questions, setQuestions] = useState([
    { question: '', options: ['', '', '', ''], correctAnswer: 0 },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'duration' ? Number(value) : value,
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    if (field === 'question') {
      newQuestions[index].question = value;
    } else if (field.startsWith('option')) {
      const optionIndex = Number(field.split('-')[1]);
      newQuestions[index].options[optionIndex] = value;
    } else if (field === 'correctAnswer') {
      newQuestions[index].correctAnswer = Number(value);
    }
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: '', options: ['', '', '', ''], correctAnswer: 0 },
    ]);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.title || questions.length === 0) {
      setError('Please fill in all required fields');
      return;
    }

    const allQuestionsValid = questions.every(
      (question) => question.question && question.options.every((option) => option)
    );

    if (!allQuestionsValid) {
      setError('Please fill in all questions and options');
      return;
    }

    try {
      setLoading(true);
      await quizAPI.createQuiz({
        ...formData,
        questions,
      });
      setSuccess('Quiz created successfully!');
      setFormData({ title: '', description: '', duration: 0 });
      setQuestions([{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
      setTimeout(() => {
        navigate('/my-quizzes');
      }, 600);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-quiz-container">
      <h1>Create a New Quiz</h1>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="create-quiz-form">
        <div className="form-section">
          <h2>Quiz Details</h2>
          <div className="form-group">
            <label htmlFor="title">Quiz Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              placeholder="Enter quiz title"
              disabled={loading}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              placeholder="Enter quiz description (optional)"
              disabled={loading}
              rows="3"
            />
          </div>
          <div className="form-group">
            <label htmlFor="duration">Duration (seconds)</label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleFormChange}
              placeholder="0 for no limit"
              disabled={loading}
              min="0"
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Questions</h2>
          {questions.map((question, index) => (
            <div key={index} className="question-box">
              <h3>Question {index + 1}</h3>
              <div className="form-group">
                <label htmlFor={`question-${index}`}>Question Text *</label>
                <textarea
                  id={`question-${index}`}
                  value={question.question}
                  onChange={(e) =>
                    handleQuestionChange(index, 'question', e.target.value)
                  }
                  placeholder="Enter your question"
                  disabled={loading}
                  rows="2"
                  required
                />
              </div>

              <div className="options-grid">
                {question.options.map((option, optIndex) => (
                  <div key={optIndex} className="form-group">
                    <label htmlFor={`option-${index}-${optIndex}`}>
                      Option {optIndex + 1} *
                    </label>
                    <input
                      type="text"
                      id={`option-${index}-${optIndex}`}
                      value={option}
                      onChange={(e) =>
                        handleQuestionChange(index, `option-${optIndex}`, e.target.value)
                      }
                      placeholder="Enter option"
                      disabled={loading}
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="form-group">
                <label htmlFor={`correct-${index}`}>Correct Answer *</label>
                <select
                  id={`correct-${index}`}
                  value={question.correctAnswer}
                  onChange={(e) =>
                    handleQuestionChange(index, 'correctAnswer', e.target.value)
                  }
                  disabled={loading}
                  required
                >
                  {question.options.map((_, optionIndex) => (
                    <option key={optionIndex} value={optionIndex}>
                      Option {optionIndex + 1}
                    </option>
                  ))}
                </select>
              </div>

              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(index)}
                  className="btn-remove-question"
                  disabled={loading}
                >
                  Remove Question
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            className="btn-add-question"
            disabled={loading}
          >
            + Add Another Question
          </button>
        </div>

        <button type="submit" className="btn-submit-quiz" disabled={loading}>
          {loading ? 'Creating Quiz...' : 'Create Quiz'}
        </button>
      </form>
    </div>
  );
};

export default CreateQuiz;
