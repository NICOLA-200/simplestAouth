const express = require('express');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const session = require('express-session');

const app = express();

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));


app.use(passport.initialize());
app.use(passport.session());

passport.use(new GitHubStrategy({
  clientID: 'b2615433a0e6b5d90c51',
  clientSecret: '7786bd8452bc1b1c1c31368f41ed15709c16fca5',
  callbackURL: 'http://localhost:3000/auth/github/callback'
}, (accessToken, refreshToken, profile, done) => {
  // The user's GitHub profile is available in the "profile" parameter
  // You can create or fetch the user from your database here
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});


passport.deserializeUser((obj, done) => {
  done(null, obj);
});

app.get('/', (req, res) => {
  res.send('Home Page');
});

app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/profile'); // Redirect to profile page after successful authentication
  });


  app.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`Welcome, ${req.user.displayName}!`);
  } else {
    res.redirect('/');
  }
});~

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});