const LocalStrategy = require('passport-local').Strategy;

const users = [
  {
    username: 'test',
    password: 'test',
  },
];

const strategy = new LocalStrategy((username, password, done) => {
  console.log(username, password);
  const finded = users.find((user) => user.username === username && user.password === password);

  if (finded === undefined) done(null, false);

  done(null, finded);
});

exports.strategy = strategy;
