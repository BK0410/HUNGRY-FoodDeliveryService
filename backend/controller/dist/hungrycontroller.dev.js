"use strict";

var _require = require('../models'),
    sequelize = _require.sequelize,
    food = _require.food;

var db = require('../models');

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
var Food = db.food;
var Category = db.categories;
var Restaurant = db.restaurants;
var Order = db.orders;
var Admin = db.admins; // 1 . Register

var addUser = function addUser(req, res) {
  var info, user;
  return regeneratorRuntime.async(function addUser$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          info = {
            First_Name: req.body.First_Name,
            Last_Name: req.body.Last_Name,
            Email_ID: req.body.Email_ID,
            Password: req.body.Password
          };
          _context2.next = 3;
          return regeneratorRuntime.awrap(User.create(info));

        case 3:
          user = _context2.sent;
          res.status(200).send(user);
          console.log(user);

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
}; // 2 . Login


var login = function login(req, res) {
  var Email_ID, Password, user, payload, token, refreshToken, response, base64Payload, payload1;
  return regeneratorRuntime.async(function login$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          Email_ID = req.body.Email_ID;
          Password = req.body.Password;
          _context3.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            where: {
              Email_ID: Email_ID
            }
          }));

        case 4:
          user = _context3.sent;

          if (user) {
            if (Password === user.Password) {
              // res.status(200).send("User Logged in successfully");
              payload = {
                id: user.id,
                Email_ID: user.Email_ID,
                role: "USER"
              };
              token = jwt.sign(payload, jwtOptions.secretOrKey, {
                expiresIn: 43200
              });
              refreshToken = jwt.sign(payload, jwtOptions.refreshSecret, {
                expiresIn: 86400
              });
              response = {
                "status": "Logged in",
                "token": token,
                "refreshToken": refreshToken
              };
              tokenList[refreshToken] = response;
              res.status(200).json(response);
              console.log(token);
              base64Payload = token.split('.')[1];
              payload1 = Buffer.from(base64Payload, 'base64'); // console.log(JSON.parse(payload1.toString())) 

              loggedInID = JSON.parse(payload1).id;
              console.log(loggedInID);
            } else {
              res.status(400).send("Incorrect Password");
            }
          } else {
            res.status(401).send("User doesn't exist.");
          } // res.status(200).send(user);


        case 6:
        case "end":
          return _context3.stop();
      }
    }
  });
}; // 3 . Add Delivery Address


var address = function address(req, res) {
  var bearerHeader, token, base64Payload, payload1, info, condition, user;
  return regeneratorRuntime.async(function address$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          bearerHeader = req.headers["authorization"];
          console.log(bearerHeader.substring(7));
          token = bearerHeader.substring(7);
          base64Payload = token.split('.')[1];
          payload1 = Buffer.from(base64Payload, 'base64');
          loggedInID = JSON.parse(payload1).id;
          info = {
            Address_Line1: req.body.Address_Line1,
            Address_Line2: req.body.Address_Line2,
            Landmark: req.body.Landmark,
            City_Pincode: req.body.City_Pincode
          };
          console.log(loggedInID);
          condition = {
            where: {
              id: parseInt(loggedInID)
            }
          };
          options = {
            multi: true
          };
          _context4.next = 12;
          return regeneratorRuntime.awrap(User.update(info, condition, options).then(function (upresult) {}));

        case 12:
          user = _context4.sent;
          res.status(200).send(user); // console.log(user);

        case 14:
        case "end":
          return _context4.stop();
      }
    }
  });
}; // 4 . Get Users


var getUsers = function getUsers(req, res) {
  var users;
  return regeneratorRuntime.async(function getUsers$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(User.findAll({}));

        case 2:
          users = _context5.sent;
          res.status(200).send(users);

        case 4:
        case "end":
          return _context5.stop();
      }
    }
  });
}; // 5 . Add Cuisine
// const addCuisine = async (req, res) => {
//     let info = {
//        CuisineID: req.body.CuisineID,
//         Cuisine_Name: req.body.Cuisine_Name
//     }
//     const cuisine = await Cuisine.create(info)
//     res.status(200).send(cuisine)
//     console.log(cuisine);
// }
// 6 . Get Food Table


var getFoodTable = function getFoodTable(req, res) {
  var food;
  return regeneratorRuntime.async(function getFoodTable$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(Food.findAll());

        case 2:
          food = _context6.sent;
          res.status(200).send(food);

        case 4:
        case "end":
          return _context6.stop();
      }
    }
  });
}; // 7 . getCuisines


var getCuisines = function getCuisines(req, res) {
  var food, set, i;
  return regeneratorRuntime.async(function getCuisines$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return regeneratorRuntime.awrap(Food.findAll({
            attributes: ['CuisineName'],
            distinct: true
          }));

        case 2:
          food = _context7.sent;
          set = new Set();

          for (i = 0; i < food.length; i++) {
            set.add(food[i].CuisineName);
          }

          console.log(set);
          res.status(200).send(set);

        case 7:
        case "end":
          return _context7.stop();
      }
    }
  });
}; // 8 . Get Hotels


var getHotels = function getHotels(req, res) {
  var food, set, i;
  return regeneratorRuntime.async(function getHotels$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return regeneratorRuntime.awrap(Food.findAll({
            attributes: ['HotelName'],
            distinct: true
          }));

        case 2:
          food = _context8.sent;
          set = new Set();

          for (i = 0; i < food.length; i++) {
            set.add(food[i].HotelName);
          }

          console.log(set);
          res.status(200).send(set);

        case 7:
        case "end":
          return _context8.stop();
      }
    }
  });
}; // 9 . Get Dishes


var getDishes = function getDishes(req, res) {
  var food, set, i;
  return regeneratorRuntime.async(function getDishes$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.next = 2;
          return regeneratorRuntime.awrap(Food.findAll({
            attributes: ['Dishes', 'HotelName', 'Price']
          }));

        case 2:
          food = _context9.sent;
          set = new Set();

          for (i = 0; i < food.length; i++) {
            set.add(food[i].Dishes + " : " + food[i].HotelName + " : Rs. " + food[i].Price);
          }

          console.log(set);
          res.send(set);

        case 7:
        case "end":
          return _context9.stop();
      }
    }
  });
}; // 10 . Get Single User


var getSingleUser = function getSingleUser(req, res) {
  var bearerHeader, token, base64Payload, payload1, user;
  return regeneratorRuntime.async(function getSingleUser$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          bearerHeader = req.headers["authorization"];
          console.log(bearerHeader.substring(7));
          token = bearerHeader.substring(7);
          base64Payload = token.split('.')[1];
          payload1 = Buffer.from(base64Payload, 'base64');
          loggedInID = JSON.parse(payload1).id;
          _context10.next = 8;
          return regeneratorRuntime.awrap(User.findOne({
            where: {
              id: loggedInID
            }
          }));

        case 8:
          user = _context10.sent;
          res.status(200).send(user);

        case 10:
        case "end":
          return _context10.stop();
      }
    }
  });
}; // 11 . Get Categories


var getCategories = function getCategories(req, res) {
  var category;
  return regeneratorRuntime.async(function getCategories$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.next = 2;
          return regeneratorRuntime.awrap(Category.findAll());

        case 2:
          category = _context11.sent;
          res.status(200).send(category);

        case 4:
        case "end":
          return _context11.stop();
      }
    }
  });
}; // 12. Get Restaurants


var getRestaurants = function getRestaurants(req, res) {
  var restaurant;
  return regeneratorRuntime.async(function getRestaurants$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.next = 2;
          return regeneratorRuntime.awrap(Restaurant.findAll());

        case 2:
          restaurant = _context12.sent;
          res.status(200).send(restaurant);

        case 4:
        case "end":
          return _context12.stop();
      }
    }
  });
}; // 13 . Add Order Details


var addOrderDetails = function addOrderDetails(req, res) {
  var bearerHeader, token, base64Payload, payload1, info, condition, order;
  return regeneratorRuntime.async(function addOrderDetails$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          bearerHeader = req.headers["authorization"];
          console.log(bearerHeader.substring(7));
          token = bearerHeader.substring(7);
          base64Payload = token.split('.')[1];
          payload1 = Buffer.from(base64Payload, 'base64');
          loggedInID = JSON.parse(payload1).id;
          info = {
            userID: loggedInID,
            OrderDetails: req.body.cart
          };
          console.log(loggedInID);
          condition = {
            where: {
              id: parseInt(loggedInID)
            }
          };
          options = {
            multi: true
          };
          console.log("BK");
          _context13.next = 13;
          return regeneratorRuntime.awrap(Order.create(info, condition, options).then(function (upresult) {}));

        case 13:
          order = _context13.sent;
          res.status(200).send(order); // console.log(user);

        case 15:
        case "end":
          return _context13.stop();
      }
    }
  });
}; // 14 . Get Order Details


var getOrderDetails = function getOrderDetails(req, res) {
  var bearerHeader, token, base64Payload, payload1, orders, result, i, user, jsondetails, dish, food, dishString, restaurant, orderinfo;
  return regeneratorRuntime.async(function getOrderDetails$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          bearerHeader = req.headers["authorization"];
          console.log(bearerHeader.substring(7));
          token = bearerHeader.substring(7);
          base64Payload = token.split('.')[1];
          payload1 = Buffer.from(base64Payload, 'base64');
          loggedInID = JSON.parse(payload1).id;
          _context14.next = 8;
          return regeneratorRuntime.awrap(Order.findAll());

        case 8:
          orders = _context14.sent;
          result = [];
          i = 0;

        case 11:
          if (!(i < orders.length)) {
            _context14.next = 38;
            break;
          }

          _context14.next = 14;
          return regeneratorRuntime.awrap(User.findOne({
            where: {
              id: orders[i].userID
            }
          }));

        case 14:
          user = _context14.sent;
          jsondetails = orders[i].OrderDetails;
          dish = [];
          _context14.t0 = regeneratorRuntime.keys(jsondetails);

        case 18:
          if ((_context14.t1 = _context14.t0()).done) {
            _context14.next = 29;
            break;
          }

          x = _context14.t1.value;
          _context14.next = 22;
          return regeneratorRuntime.awrap(Food.findOne({
            where: {
              Dishes: x
            }
          }));

        case 22:
          food = _context14.sent;
          dishString = "";
          dishString = food.Dishes + " X " + jsondetails[x][0];
          dish.push(dishString);
          console.log(dish);
          _context14.next = 18;
          break;

        case 29:
          _context14.next = 31;
          return regeneratorRuntime.awrap(Restaurant.findOne({
            where: {
              RestaurantName: jsondetails[x][2]
            }
          }));

        case 31:
          restaurant = _context14.sent;
          console.log(restaurant);
          orderinfo = {
            OrderID: "HUNGRY_ORDER_ID_" + orders[i].id,
            Username: user.First_Name + " " + user.Last_Name,
            Delivery_Address: user.Address_Line1 + " " + user.Address_Line2 + " " + user.Landmark + " " + user.City_Pincode,
            Restaurant: restaurant.RestaurantName,
            Dishes: dish // TotalPrice: totalPrice

          };
          result.push(orderinfo);

        case 35:
          i++;
          _context14.next = 11;
          break;

        case 38:
          res.status(200).send(result);

        case 39:
        case "end":
          return _context14.stop();
      }
    }
  });
}; // 15 . Get User Order Details


var getUserOrderDetails = function getUserOrderDetails(req, res) {
  var bearerHeader, token, base64Payload, payload1, user, orders, result, i, dishes, quantity, price, restaurant, _x;

  return regeneratorRuntime.async(function getUserOrderDetails$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          bearerHeader = req.headers["authorization"];
          console.log(bearerHeader.substring(7));
          token = bearerHeader.substring(7);
          base64Payload = token.split('.')[1];
          payload1 = Buffer.from(base64Payload, 'base64');
          loggedInID = JSON.parse(payload1).id;

          if (!(JSON.parse(payload1).role === "USER")) {
            _context15.next = 18;
            break;
          }

          _context15.next = 9;
          return regeneratorRuntime.awrap(User.findOne({
            where: {
              id: loggedInID
            }
          }));

        case 9:
          user = _context15.sent;
          _context15.next = 12;
          return regeneratorRuntime.awrap(Order.findAll({
            where: {
              userID: loggedInID
            }
          }));

        case 12:
          orders = _context15.sent;
          result = [];

          for (i = 0; i < orders.length; i++) {
            dishes = [];
            quantity = [];
            price = [];

            for (_x in orders[i].OrderDetails) {
              dishes.push(_x);
              console.log(dishes);
              quantity.push(orders[i].OrderDetails[_x][0]);
              price.push(orders[i].OrderDetails[_x][1]);
              restaurant = orders[i].OrderDetails[_x][2];
            }

            result.push(["HUNGRY_ORDER_ID_" + orders[i].id, user.First_Name + " " + user.Last_Name, dishes, quantity, price, restaurant]);
          }

          res.send(result);
          _context15.next = 19;
          break;

        case 18:
          res.send(404);

        case 19:
        case "end":
          return _context15.stop();
      }
    }
  });
}; // 16. Add to Cart


var addToCart = function addToCart(req, res) {
  var bearerHeader, token, base64Payload, payload1, info, condition, user;
  return regeneratorRuntime.async(function addToCart$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          bearerHeader = req.headers["authorization"];
          console.log(bearerHeader.substring(7));
          token = bearerHeader.substring(7);
          base64Payload = token.split('.')[1];
          payload1 = Buffer.from(base64Payload, 'base64');
          loggedInID = JSON.parse(payload1).id;
          info = {
            cart: req.body.cart
          };
          console.log(loggedInID);
          condition = {
            where: {
              id: parseInt(loggedInID)
            }
          };
          options = {
            multi: true
          };
          console.log("BK");
          _context16.next = 13;
          return regeneratorRuntime.awrap(User.update(info, condition, options).then(function (upresult) {}));

        case 13:
          user = _context16.sent;
          res.status(200).send(user); // console.log(user);

        case 15:
        case "end":
          return _context16.stop();
      }
    }
  });
}; // 17. Get Cart Items


var getCart = function getCart(req, res) {
  var bearerHeader, token, base64Payload, payload1, user;
  return regeneratorRuntime.async(function getCart$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          bearerHeader = req.headers["authorization"];
          console.log(bearerHeader.substring(7));
          token = bearerHeader.substring(7);
          base64Payload = token.split('.')[1];
          payload1 = Buffer.from(base64Payload, 'base64');
          loggedInID = JSON.parse(payload1).id;
          _context17.next = 8;
          return regeneratorRuntime.awrap(User.findOne({
            where: {
              id: loggedInID
            }
          }));

        case 8:
          user = _context17.sent;
          res.status(200).send(user.cart);

        case 10:
        case "end":
          return _context17.stop();
      }
    }
  });
}; // 18 . Admin Login


var adminlogin = function adminlogin(req, res) {
  var Email_ID, Password, admin, payload, token, base64Payload, payload1;
  return regeneratorRuntime.async(function adminlogin$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          Email_ID = req.body.Email_ID;
          Password = req.body.Password;
          _context18.next = 4;
          return regeneratorRuntime.awrap(Admin.findOne({
            where: {
              Email_ID: Email_ID
            }
          }));

        case 4:
          admin = _context18.sent;

          if (admin) {
            if (Password === admin.Password) {
              // res.status(200).send("User Logged in successfully");
              payload = {
                id: admin.id,
                role: "ADMIN"
              };
              token = jwt.sign(payload, jwtOptions.secretOrKey);
              res.json({
                msg: 'User Logged in Successfully',
                token: token
              });
              console.log(token);
              base64Payload = token.split('.')[1];
              payload1 = Buffer.from(base64Payload, 'base64'); // console.log(JSON.parse(payload1.toString())) 

              loggedInID = JSON.parse(payload1).id;
              console.log(loggedInID);
            } else {
              res.status(400).send("Incorrect Password");
            }
          } else {
            res.status(401).send("Admin doesn't exist.");
          }

        case 6:
        case "end":
          return _context18.stop();
      }
    }
  });
}; // 19. Update Category


var updateCategory = function updateCategory(req, res) {
  var id, category, thisUser;
  return regeneratorRuntime.async(function updateCategory$(_context19) {
    while (1) {
      switch (_context19.prev = _context19.next) {
        case 0:
          id = req.params.id;
          _context19.next = 3;
          return regeneratorRuntime.awrap(Category.update(req.body, {
            where: {
              id: id
            }
          }));

        case 3:
          category = _context19.sent;
          _context19.next = 6;
          return regeneratorRuntime.awrap(Category.findOne({
            where: {
              id: id
            }
          }));

        case 6:
          thisUser = _context19.sent;
          res.status(200).send(thisUser);

        case 8:
        case "end":
          return _context19.stop();
      }
    }
  });
}; // 20. delete User by ID


var deleteCategory = function deleteCategory(req, res) {
  var id;
  return regeneratorRuntime.async(function deleteCategory$(_context20) {
    while (1) {
      switch (_context20.prev = _context20.next) {
        case 0:
          id = req.params.id;
          _context20.next = 3;
          return regeneratorRuntime.awrap(Category.destroy({
            where: {
              id: id
            }
          }));

        case 3:
          res.status(200).send('Category is deleted !');

        case 4:
        case "end":
          return _context20.stop();
      }
    }
  });
}; // 21 . Add New Category


var addCategory = function addCategory(req, res) {
  var info, category;
  return regeneratorRuntime.async(function addCategory$(_context21) {
    while (1) {
      switch (_context21.prev = _context21.next) {
        case 0:
          info = {
            CategoryName: req.body.CategoryName
          };
          _context21.next = 3;
          return regeneratorRuntime.awrap(Category.create(info));

        case 3:
          category = _context21.sent;
          res.status(200).send(category);

        case 5:
        case "end":
          return _context21.stop();
      }
    }
  });
}; // 22. Update Category


var updateRestaurant = function updateRestaurant(req, res) {
  var id, restaurant, thisUser;
  return regeneratorRuntime.async(function updateRestaurant$(_context22) {
    while (1) {
      switch (_context22.prev = _context22.next) {
        case 0:
          id = req.params.id;
          _context22.next = 3;
          return regeneratorRuntime.awrap(Restaurant.update(req.body, {
            where: {
              id: id
            }
          }));

        case 3:
          restaurant = _context22.sent;
          _context22.next = 6;
          return regeneratorRuntime.awrap(Restaurant.findOne({
            where: {
              id: id
            }
          }));

        case 6:
          thisUser = _context22.sent;
          res.status(200).send(thisUser);

        case 8:
        case "end":
          return _context22.stop();
      }
    }
  });
}; // 23 . delete Restaurant by ID


var deleteRestaurant = function deleteRestaurant(req, res) {
  var id;
  return regeneratorRuntime.async(function deleteRestaurant$(_context23) {
    while (1) {
      switch (_context23.prev = _context23.next) {
        case 0:
          id = req.params.id;
          _context23.next = 3;
          return regeneratorRuntime.awrap(Restaurant.destroy({
            where: {
              id: id
            }
          }));

        case 3:
          res.status(200).send('Restaurant is deleted !');

        case 4:
        case "end":
          return _context23.stop();
      }
    }
  });
}; // 24 . Add New Restaurant


var addRestaurant = function addRestaurant(req, res) {
  var info, restaurant;
  return regeneratorRuntime.async(function addRestaurant$(_context24) {
    while (1) {
      switch (_context24.prev = _context24.next) {
        case 0:
          info = {
            RestaurantName: req.body.RestaurantName,
            CuisineName: req.body.CuisineName
          };
          _context24.next = 3;
          return regeneratorRuntime.awrap(Restaurant.create(info));

        case 3:
          restaurant = _context24.sent;
          res.status(200).send(restaurant);

        case 5:
        case "end":
          return _context24.stop();
      }
    }
  });
}; // 25 . delete User by ID


var deleteUser = function deleteUser(req, res) {
  var id;
  return regeneratorRuntime.async(function deleteUser$(_context25) {
    while (1) {
      switch (_context25.prev = _context25.next) {
        case 0:
          id = req.params.id;
          _context25.next = 3;
          return regeneratorRuntime.awrap(User.destroy({
            where: {
              id: id
            }
          }));

        case 3:
          res.status(200).send('User is deleted !');

        case 4:
        case "end":
          return _context25.stop();
      }
    }
  });
}; // 26. Update dish


var updateDish = function updateDish(req, res) {
  var id, dish, thisUser;
  return regeneratorRuntime.async(function updateDish$(_context26) {
    while (1) {
      switch (_context26.prev = _context26.next) {
        case 0:
          id = req.params.id;
          _context26.next = 3;
          return regeneratorRuntime.awrap(Food.update(req.body, {
            where: {
              id: id
            }
          }));

        case 3:
          dish = _context26.sent;
          _context26.next = 6;
          return regeneratorRuntime.awrap(Food.findOne({
            where: {
              id: id
            }
          }));

        case 6:
          thisUser = _context26.sent;
          res.status(200).send(thisUser);

        case 8:
        case "end":
          return _context26.stop();
      }
    }
  });
}; // 27 . delete Dish by ID


var deleteDish = function deleteDish(req, res) {
  var id;
  return regeneratorRuntime.async(function deleteDish$(_context27) {
    while (1) {
      switch (_context27.prev = _context27.next) {
        case 0:
          id = req.params.id;
          _context27.next = 3;
          return regeneratorRuntime.awrap(Food.destroy({
            where: {
              id: id
            }
          }));

        case 3:
          res.status(200).send('Dish is deleted !');

        case 4:
        case "end":
          return _context27.stop();
      }
    }
  });
}; // 28 . Add New Dish


var addDish = function addDish(req, res) {
  var info, food;
  return regeneratorRuntime.async(function addDish$(_context28) {
    while (1) {
      switch (_context28.prev = _context28.next) {
        case 0:
          info = {
            Dishes: req.body.DishName,
            Price: req.body.Price,
            HotelName: req.body.RestaurantName,
            CuisineName: req.body.CuisineName
          };
          _context28.next = 3;
          return regeneratorRuntime.awrap(Food.create(info));

        case 3:
          food = _context28.sent;
          res.status(200).send(food);

        case 5:
        case "end":
          return _context28.stop();
      }
    }
  });
}; // 29. Referesh Token


var token = function token(req, res) {
  var Email_ID, user, postData, payload, _token, response;

  return regeneratorRuntime.async(function token$(_context29) {
    while (1) {
      switch (_context29.prev = _context29.next) {
        case 0:
          Email_ID = req.body.Email_ID;
          _context29.next = 3;
          return regeneratorRuntime.awrap(User.findOne({
            where: {
              Email_ID: Email_ID
            }
          }));

        case 3:
          user = _context29.sent;
          postData = req.body;

          if (postData.refreshToken && postData.refreshToken in tokenList) {
            payload = {
              id: user.id,
              Email_ID: postData.Email_ID,
              role: "USER"
            };
            _token = jwt.sign(payload, jwtOptions.secretOrKey, {
              expiresIn: 43200
            });
            response = {
              "token": _token
            };
            tokenList[postData.refreshToken].token = _token;
            res.status(200).json(response);
          } else {
            res.status(404).send('Invalid request');
          }

        case 6:
        case "end":
          return _context29.stop();
      }
    }
  });
};

module.exports = {
  addUser: addUser,
  login: login,
  address: address,
  getUsers: getUsers,
  getFoodTable: getFoodTable,
  getCuisines: getCuisines,
  getHotels: getHotels,
  getDishes: getDishes,
  getSingleUser: getSingleUser,
  getCategories: getCategories,
  getRestaurants: getRestaurants,
  addOrderDetails: addOrderDetails,
  getOrderDetails: getOrderDetails,
  getUserOrderDetails: getUserOrderDetails,
  addToCart: addToCart,
  getCart: getCart,
  adminlogin: adminlogin,
  updateCategory: updateCategory,
  deleteCategory: deleteCategory,
  addCategory: addCategory,
  updateRestaurant: updateRestaurant,
  deleteRestaurant: deleteRestaurant,
  addRestaurant: addRestaurant,
  deleteUser: deleteUser,
  addDish: addDish,
  updateDish: updateDish,
  deleteDish: deleteDish,
  token: token // addCuisine,
  // getCuisines

};