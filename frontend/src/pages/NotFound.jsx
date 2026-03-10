import React from 'react';
import BackButton from '../components/Common/BackButton';

const NotFound = () => {
  return (
    <div style={styles.container}>
      <BackButton fallback="/" />
      <h1 style={styles.heading}>404</h1>
      <h2 style={styles.subheading}>Page Not Found</h2>
      <p style={styles.message}>
        The page you're looking for doesn't exist.
      </p>
      <a href="/" style={styles.homeLink}>
        Go to Home
      </a>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
    textAlign: 'center',
  },
  heading: {
    fontSize: '4rem',
    color: '#ff6b6b',
    fontWeight: 'bold',
    margin: 0,
  },
  subheading: {
    fontSize: '2rem',
    color: '#282c34',
    marginBottom: '1rem',
  },
  message: {
    fontSize: '1.1rem',
    color: '#666',
    marginBottom: '2rem',
  },
  homeLink: {
    display: 'inline-block',
    padding: '0.75rem 2rem',
    backgroundColor: '#61dafb',
    color: '#282c34',
    textDecoration: 'none',
    borderRadius: '4px',
    fontWeight: 'bold',
    transition: 'all 0.3s',
  },
};

export default NotFound;
