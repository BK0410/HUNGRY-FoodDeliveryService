const hungrycontroller = require('../controller/hungrycontroller.js')
// const CuisineController = require('../controller/CuisineController.js')
const { sequelize } = require('../models');
const db = require('../models')
// JWT

const jwt = require('jsonwebtoken')
const passport = require('passport');
const passportJWT = require('passport-jwt');
const tokenList = {}

let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;
let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'JWT_SECRET';
jwtOptions.refreshSecret = 'REFRESH_SECRET';
var loggedInID;
let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
    console.log('payload received', jwt_payload);


    let user = getUser({
        id: jwt_payload.id
    });
    if (user) {
        next(null, user);
    } else {
        next(null, false);
    }
});

const getUser = async obj => {
    return await User.findOne({
        where: obj,
    });
};

passport.use(strategy);

  const User = db.users;


const router = require('express').Router()

router.post('/signup', hungrycontroller.addUser)

router.post("/login", hungrycontroller.login);

router.post("/address",passport.authenticate('jwt', { session: false }),hungrycontroller.address);

router.get("/getSingleUser",passport.authenticate('jwt', { session: false }),hungrycontroller.getSingleUser)

router.get("/getUsers",passport.authenticate('jwt', { session: false }),hungrycontroller.getUsers)

router.get("/getFoodTable",passport.authenticate('jwt', { session: false }),hungrycontroller.getFoodTable)

router.get("/getCuisines",passport.authenticate('jwt', { session: false }),hungrycontroller.getCuisines)

router.get("/getHotels",passport.authenticate('jwt', { session: false }),hungrycontroller.getHotels)

router.get("/getDishes",passport.authenticate('jwt', { session: false }),hungrycontroller.getDishes)

router.get("/getCategories",passport.authenticate('jwt', { session: false }),hungrycontroller.getCategories)

router.get("/getRestaurants",passport.authenticate('jwt', { session: false }),hungrycontroller.getRestaurants)

router.post("/addOrderDetails",passport.authenticate('jwt', { session: false }),hungrycontroller.addOrderDetails)

router.get("/getOrderDetails",passport.authenticate('jwt', { session: false }),hungrycontroller.getOrderDetails)

router.get("/getUserOrderDetails",passport.authenticate('jwt', { session: false }),hungrycontroller.getUserOrderDetails)

router.post("/addToCart",passport.authenticate('jwt', { session: false }),hungrycontroller.addToCart);

router.get("/getCart",passport.authenticate('jwt', { session: false }),hungrycontroller.getCart)

router.post("/adminlogin", hungrycontroller.adminlogin);

router.put('/category/:id', hungrycontroller.updateCategory)

router.delete('/category/:id', hungrycontroller.deleteCategory)

router.post('/addCategory', hungrycontroller.addCategory)

router.put('/restaurant/:id', hungrycontroller.updateRestaurant)

router.delete('/restaurant/:id', hungrycontroller.deleteRestaurant)

router.post('/addRestaurant', hungrycontroller.addRestaurant)

router.put('/dish/:id', hungrycontroller.updateDish)

router.delete('/dish/:id', hungrycontroller.deleteDish)

router.post('/addDish', hungrycontroller.addDish)

router.delete('/user/:id', hungrycontroller.deleteUser)

router.post('/token',hungrycontroller.token)

router.use(require('./tokenChecker'))

router.get('/secure', (req,res) => {
  res.send('I am secured...')
})


module.exports = router