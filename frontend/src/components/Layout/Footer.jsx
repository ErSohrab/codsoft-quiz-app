import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <p>&copy; {currentYear} Quiz App. All rights reserved.</p>
        <p>Created with React + Node.js + MongoDB</p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#282c34',
    color: '#61dafb',
    textAlign: 'center',
    padding: '2rem',
    marginTop: 'auto',
    borderTop: '1px solid #444',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
};

export default Footer;
