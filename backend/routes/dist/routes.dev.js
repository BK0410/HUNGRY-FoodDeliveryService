"use strict";

var hungrycontroller = require('../controller/hungrycontroller.js'); // const CuisineController = require('../controller/CuisineController.js')


var _require = require('../models'),
    sequelize = _require.sequelize;

var db = require('../models'); // JWT


var jwt = require('jsonwebtoken');

var passport = require('passport');

var passportJWT = require('passport-jwt');

var tokenList = {};
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'JWT_SECRET';
jwtOptions.refreshSecret = 'REFRESH_SECRET';
var loggedInID;
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

var getUser = function getUser(obj) {
  return regeneratorRuntime.async(function getUser$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(User.findOne({
            where: obj
          }));

        case 2:
          return _context.abrupt("return", _context.sent);

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
};

passport.use(strategy);
var User = db.users;

var router = require('express').Router();

router.post('/signup', hungrycontroller.addUser);
router.post("/login", hungrycontroller.login);
router.post("/address", passport.authenticate('jwt', {
  session: false
}), hungrycontroller.address);
router.get("/getSingleUser", passport.authenticate('jwt', {
  session: false
}), hungrycontroller.getSingleUser);
router.get("/getUsers", passport.authenticate('jwt', {
  session: false
}), hungrycontroller.getUsers);
router.get("/getFoodTable", passport.authenticate('jwt', {
  session: false
}), hungrycontroller.getFoodTable);
router.get("/getCuisines", passport.authenticate('jwt', {
  session: false
}), hungrycontroller.getCuisines);
router.get("/getHotels", passport.authenticate('jwt', {
  session: false
}), hungrycontroller.getHotels);
router.get("/getDishes", passport.authenticate('jwt', {
  session: false
}), hungrycontroller.getDishes);
router.get("/getCategories", passport.authenticate('jwt', {
  session: false
}), hungrycontroller.getCategories);
router.get("/getRestaurants", passport.authenticate('jwt', {
  session: false
}), hungrycontroller.getRestaurants);
router.post("/addOrderDetails", passport.authenticate('jwt', {
  session: false
}), hungrycontroller.addOrderDetails);
router.get("/getOrderDetails", passport.authenticate('jwt', {
  session: false
}), hungrycontroller.getOrderDetails);
router.get("/getUserOrderDetails", passport.authenticate('jwt', {
  session: false
}), hungrycontroller.getUserOrderDetails);
router.post("/addToCart", passport.authenticate('jwt', {
  session: false
}), hungrycontroller.addToCart);
router.get("/getCart", passport.authenticate('jwt', {
  session: false
}), hungrycontroller.getCart);
router.post("/adminlogin", hungrycontroller.adminlogin);
router.put('/category/:id', hungrycontroller.updateCategory);
router["delete"]('/category/:id', hungrycontroller.deleteCategory);
router.post('/addCategory', hungrycontroller.addCategory);
router.put('/restaurant/:id', hungrycontroller.updateRestaurant);
router["delete"]('/restaurant/:id', hungrycontroller.deleteRestaurant);
router.post('/addRestaurant', hungrycontroller.addRestaurant);
router.put('/dish/:id', hungrycontroller.updateDish);
router["delete"]('/dish/:id', hungrycontroller.deleteDish);
router.post('/addDish', hungrycontroller.addDish);
router["delete"]('/user/:id', hungrycontroller.deleteUser);
router.post('/token', hungrycontroller.token);
router.use(require('./tokenChecker'));
router.get('/secure', function (req, res) {
  res.send('I am secured...');
});
module.exports = router;