const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash'); // Required for displaying flash messages
require('dotenv').config();

const app = express();

// Define port variable here
const port = process.env.PORT || 3000;

// Middleware to parse incoming JSON
app.use(express.json()); // No need to use body-parser if you're using express.json()
app.use(express.urlencoded({ extended: true })); // For form data parsing

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', './views');

// Serve static files (CSS/JS/images)
app.use(express.static('public'));

// Middleware for flash messages
app.use(flash());  // This is where you enable flash messages

// ------------------------------------
// Session and Passport Configuration
// ------------------------------------
app.use(session({
    secret: 'your-secret-key', // Replace with a strong secret in production
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// User Model
const User = require('./models/User'); // Ensure you create User.js in the models folder

// Passport Local Strategy
passport.use(new LocalStrategy(
  { usernameField: 'email' }, // Use email instead of username
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) return done(null, false, { message: 'No user with that email' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return done(null, false, { message: 'Incorrect password' });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// ------------------------------------
// Routes
// ------------------------------------

// Song Model
const Song = require('./models/song');

// Basic route to render songs in the home page
app.get('/', (req, res) => {
  Song.find()  // Fetch all songs from the database
    .then(songs => {
      // Pass successMessage and errorMessage here to the view
      res.render('index', { 
        songs, 
        user: req.user, 
        successMessage: req.flash('success'),
        errorMessage: req.flash('error') // Pass errorMessage here as well
      });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

// Render Login Page
app.get('/login', (req, res) => {
  res.render('login', { 
    errorMessage: req.flash('error'), 
    successMessage: req.flash('success') 
  });
});

// Process Login Request
app.post('/login', passport.authenticate('local', {
  successRedirect: '/', // Redirect to homepage on successful login
  failureRedirect: '/login', // Redirect back to login page if authentication fails
  failureFlash: true, // Enable flash messages on failure
}), (req, res) => {
  req.flash('success', `Welcome back, ${req.user.name}!`);
  res.redirect('/'); // Redirect to homepage after successful login
});

// Render Sign-Up Page
app.get('/signup', (req, res) => {
  res.render('signup', { errorMessage: req.flash('error') });
});

// Process Sign-Up Request
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash('error', 'Email already exists');
      return res.redirect('/signup');
    }

    // Hash the password before saving the new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    req.flash('success', 'Account created successfully. Please login.');
    res.redirect('/login');
  } catch (err) {
    console.log(err);
    req.flash('error', 'Error creating user');
    res.redirect('/signup');
  }
});

// Logout Route
app.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return next(err);
    req.flash('success', 'You have been logged out.');
    res.redirect('/');
  });
});

// ------------------------------------
// Song CRUD Routes
// ------------------------------------

// Create a new song
app.post('/songs', (req, res) => {
  const newSong = new Song({
    title: req.body.title,
    artist: req.body.artist,
    genre: req.body.genre,
    filePath: req.body.filePath
  });

  newSong.save()
    .then(song => res.status(201).json(song))
    .catch(err => res.status(400).json({ error: err.message }));
});

// Get all songs
app.get('/songs', (req, res) => {
  Song.find()
    .then(songs => res.json(songs))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Get a specific song by ID
app.get('/songs/:id', (req, res) => {
  Song.findById(req.params.id)
    .then(song => {
      if (!song) {
        return res.status(404).json({ error: 'Song not found' });
      }
      res.json(song);
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

// Update a song
app.put('/songs/:id', (req, res) => {
  Song.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(song => res.json(song))
    .catch(err => res.status(400).json({ error: err.message }));
});

// Delete all songs
app.delete('/songs', (req, res) => {
  Song.deleteMany({})
    .then(() => res.status(200).json({ message: 'All songs have been deleted' }))
    .catch(err => res.status(500).json({ error: err.message }));
});

// ------------------------------------
// Start server
// ------------------------------------
app.listen(port, () => {
  console.log(`your Server is running on http://localhost:${port}`);
});
