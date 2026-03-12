import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; {currentYear} Quiz App. All rights reserved.</p>
        <p>Created with React + Node.js + MongoDB</p>
      </div>
    </footer>
  );
};

export default Footer;
