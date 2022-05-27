"use strict";

var express = require('express');

var jwt = require('jsonwebtoken');

var passport = require('passport');

var passportJWT = require('passport-jwt');

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'JWT_SECRET';
var strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  console.log('payload received', jwt_payload);
  var user = getUser({
    id: jwt_payload.id
  });

  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});
passport.use(strategy);
var app = express();

var cors = require('cors');

var corOptions = {
  origin: 'http://localhost:4200'
};
app.use(express.json());
app.use(cors(corOptions));
app.use(express.urlencoded({
  extended: true
}));
app.use(passport.initialize());

var router = require('./routes/routes.js');

app.use('/api/users', router);
app.get('/protected', passport.authenticate('jwt', {
  session: false
}), function (req, res) {
  res.json({
    msg: 'Congrats! You are seeing this because you are authorized'
  });
});
app.listen(9000);
console.log("Server running on port 9000");