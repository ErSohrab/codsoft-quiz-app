const User = require('../models/User');

exports.getRegister = (req, res) => {
  res.render('register', { error: null, success: null });
};

exports.postRegister = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.render('register', { 
        error: 'Username or email already exists', 
        success: null 
      });
    }

    const user = new User({ username, email, password, role });
    await user.save();

    res.render('register', { 
      error: null, 
      success: 'Registration successful! Please login.' 
    });
  } catch (error) {
    res.render('register', { 
      error: 'Registration failed. Please try again.', 
      success: null 
    });
  }
};

exports.getLogin = (req, res) => {
  res.render('login', { error: null });
};

exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.render('login', { error: 'Invalid email or password' });
    }

    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.userRole = user.role;

    const redirectTo = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectTo);
  } catch (error) {
    res.render('login', { error: 'Login failed. Please try again.' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};