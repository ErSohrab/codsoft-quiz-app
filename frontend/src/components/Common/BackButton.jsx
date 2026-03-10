import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ fallback = '/', label = 'Back', className = '' }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(fallback, { replace: true });
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`back-button ${className}`.trim()}
    >
      {label}
    </button>
  );
};

export default BackButton;
