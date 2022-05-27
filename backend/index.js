const express = require('express');

const jwt = require('jsonwebtoken')
const passport = require('passport');
const passportJWT = require('passport-jwt');

let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;
let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'JWT_SECRET';


let strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
    console.log('payload received', jwt_payload);
    let user = getUser({ id: jwt_payload.id });
    if (user) {
      next(null, user);
    } else {
      next(null, false);
    }
  });

  passport.use(strategy);

const app = express()
const cors = require('cors');

var corOptions = {
    origin: 'http://localhost:4200'
}

app.use(express.json())
app.use(cors(corOptions));
app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize());

const router = require('./routes/routes.js')

app.use('/api/users',router)

app.get('/protected', passport.authenticate('jwt', { session: false }), function(req, res) {
    res.json({ msg: 'Congrats! You are seeing this because you are authorized'});
})

app.listen(9000);
console.log("Server running on port 9000")
