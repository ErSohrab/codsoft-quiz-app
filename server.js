require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const connectDB = require('./config/database');

const app = express();

// Connect to Database
connectDB();

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

// Make session data available to all views
app.use((req, res, next) => {
  res.locals.user = req.session.userId ? {
    id: req.session.userId,
    username: req.session.username,
    role: req.session.userRole
  } : null;
  next();
});

// Routes

app.get('/test', (req, res) => {
  res.render('test');
});

app.use('/', require('./routes/authRoutes'));
app.use('/', require('./routes/quizRoutes'));
app.use('/', require('./routes/resultRoutes'));

app.get('/', (req, res) => {
  res.render('home');
});
// 404 Handler
app.use((req, res) => {
  // res.status(404).send('Page not found');   //v 1.0
  res.render('404');
});

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});