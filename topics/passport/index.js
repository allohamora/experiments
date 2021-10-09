const path = require('path');
const express = require('express');
const passport = require('passport');
const { strategy } = require('./strategy');

passport.use(strategy);

const port = 3000;
const indexHtmlPath = path.resolve('index.html');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

app.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  console.log(req.user);
  res.redirect('/');
});

app.get('/', (req, res) => {
  res.sendFile(indexHtmlPath);
});

app.listen(port, () => console.log(`server started on: http://localhost:${port}`));
