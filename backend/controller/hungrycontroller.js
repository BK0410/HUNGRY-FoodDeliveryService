const {
    sequelize,
    food
} = require('../models');
const db = require('../models')

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
const Food = db.food
const Category = db.categories
const Restaurant = db.restaurants
const Order = db.orders
const Admin = db.admins


// 1 . Register

const addUser = async (req, res) => {

    let info = {
        First_Name: req.body.First_Name,
        Last_Name: req.body.Last_Name,
        Email_ID: req.body.Email_ID,
        Password: req.body.Password
    }
    const user = await User.create(info)
    res.status(200).send(user)
    console.log(user);

}

// 2 . Login

const login = async (req, res) => {
    const Email_ID = req.body.Email_ID;
    const Password = req.body.Password;
    let user = await User.findOne({
        where: {
            Email_ID: Email_ID
        }
    })
    if (user) {
        if (Password === user.Password) {
            // res.status(200).send("User Logged in successfully");
            let payload = {
                id: user.id,
                Email_ID: user.Email_ID,
                role: "USER"
            };
            var token = jwt.sign(payload, jwtOptions.secretOrKey, {
                expiresIn: 43200
            });
            const refreshToken = jwt.sign(payload, jwtOptions.refreshSecret, {
                expiresIn: 86400
            })
            const response = {
                "status": "Logged in",
                "token": token,
                "refreshToken": refreshToken,
            }
            tokenList[refreshToken] = response
            res.status(200).json(response);
            console.log(token)
            var base64Payload = token.split('.')[1];
            var payload1 = Buffer.from(base64Payload, 'base64');
            // console.log(JSON.parse(payload1.toString())) 
            loggedInID = JSON.parse(payload1).id
            console.log(loggedInID)
        } else {
            res.status(400).send("Incorrect Password");
        }
    } else {
        res.status(401).send("User doesn't exist.");
    }

    // res.status(200).send(user);
}


// 3 . Add Delivery Address

const address = async (req, res) => {
    const bearerHeader = req.headers["authorization"];
    console.log(bearerHeader.substring(7))
    var token = bearerHeader.substring(7)
    var base64Payload = token.split('.')[1];
    var payload1 = Buffer.from(base64Payload, 'base64');
    loggedInID = JSON.parse(payload1).id

    let info = {
        Address_Line1: req.body.Address_Line1,
        Address_Line2: req.body.Address_Line2,
        Landmark: req.body.Landmark,
        City_Pincode: req.body.City_Pincode
    }

    console.log(loggedInID)

    var condition = {
        where: {
            id: parseInt(loggedInID)
        }
    };
    options = {
        multi: true
    };

    const user = await User.update(info, condition, options).then(function (upresult) {})
    res.status(200).send(user)
    // console.log(user);

}

// 4 . Get Users

const getUsers = async (req, res) => {

    let users = await User.findAll({})
    res.status(200).send(users)
}

// 5 . Add Cuisine

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

const getFoodTable = async (req, res) => {

    let food = await Food.findAll()
    res.status(200).send(food)
}

// 7 . getCuisines

const getCuisines = async (req, res) => {

    let food = await Food.findAll({
        attributes: ['CuisineName'],
        distinct: true
    })
    var set = new Set();
    for (let i = 0; i < food.length; i++) {
        set.add(food[i].CuisineName)
    }
    console.log(set);
    res.status(200).send(set)
}

// 8 . Get Hotels

const getHotels = async (req, res) => {

    let food = await Food.findAll({
        attributes: ['HotelName'],
        distinct: true
    })
    var set = new Set();
    for (let i = 0; i < food.length; i++) {
        set.add(food[i].HotelName)
    }
    console.log(set);
    res.status(200).send(set)
}

// 9 . Get Dishes

const getDishes = async (req, res) => {

    let food = await Food.findAll({
        attributes: ['Dishes', 'HotelName', 'Price'],
    })
    var set = new Set();
    for (let i = 0; i < food.length; i++) {
        set.add(food[i].Dishes + " : " + food[i].HotelName + " : Rs. " + food[i].Price)
    }
    console.log(set);
    res.send(set)
}

// 10 . Get Single User

const getSingleUser = async (req, res) => {
    const bearerHeader = req.headers["authorization"];
    console.log(bearerHeader.substring(7))
    var token = bearerHeader.substring(7)
    var base64Payload = token.split('.')[1];
    var payload1 = Buffer.from(base64Payload, 'base64');
    loggedInID = JSON.parse(payload1).id
    let user = await User.findOne({
        where: {
            id: loggedInID
        }
    })
    res.status(200).send(user)
}

// 11 . Get Categories

const getCategories = async (req, res) => {

    let category = await Category.findAll()
    res.status(200).send(category)
}

// 12. Get Restaurants

const getRestaurants = async (req, res) => {

    let restaurant = await Restaurant.findAll()
    res.status(200).send(restaurant)
}

// 13 . Add Order Details

const addOrderDetails = async (req, res) => {
    const bearerHeader = req.headers["authorization"];
    console.log(bearerHeader.substring(7))
    var token = bearerHeader.substring(7)
    var base64Payload = token.split('.')[1];
    var payload1 = Buffer.from(base64Payload, 'base64');
    loggedInID = JSON.parse(payload1).id

    let info = {
        userID: loggedInID,
        OrderDetails: req.body.cart,
    }

    console.log(loggedInID)

    var condition = {
        where: {
            id: parseInt(loggedInID)
        }
    };
    options = {
        multi: true
    };

    console.log("BK")
    const order = await Order.create(info, condition, options).then(function (upresult) {})
    res.status(200).send(order)
    // console.log(user);

}


// 14 . Get Order Details

const getOrderDetails = async (req, res) => {
    const bearerHeader = req.headers["authorization"];
    console.log(bearerHeader.substring(7))
    var token = bearerHeader.substring(7)
    var base64Payload = token.split('.')[1];
    var payload1 = Buffer.from(base64Payload, 'base64');
    loggedInID = JSON.parse(payload1).id;
    var orders = await Order.findAll()
    let result = []
    for (var i = 0; i < orders.length; i++) {
        var user = await User.findOne({
            where: {
                id: orders[i].userID
            }
        })
        var jsondetails = orders[i].OrderDetails
        var dish = []

        for (x in jsondetails) {
            // var totalPrice = 0;
            // totalPrice = totalPrice + jsondetails[x][1]
            var food = await Food.findOne({
                where: {
                    Dishes: x
                }
            })
            var dishString = "";
            dishString = food.Dishes + " X " + jsondetails[x][0];

            dish.push(dishString)
            console.log(dish)
        }
        let restaurant = await Restaurant.findOne({
            where: {
                RestaurantName: jsondetails[x][2]
            }
        })
        console.log(restaurant)
        var orderinfo = {
            OrderID: "HUNGRY_ORDER_ID_" + orders[i].id,
            Username: user.First_Name + " " + user.Last_Name,
            Delivery_Address: user.Address_Line1 + " " + user.Address_Line2 + " " +
                user.Landmark + " " + user.City_Pincode,
            Restaurant: restaurant.RestaurantName,
            Dishes: dish
            // TotalPrice: totalPrice
        }
        result.push(orderinfo)
    }
    res.status(200).send(result)


}


// 15 . Get User Order Details

const getUserOrderDetails = async (req, res) => {
    const bearerHeader = req.headers["authorization"];
    console.log(bearerHeader.substring(7))
    var token = bearerHeader.substring(7)
    var base64Payload = token.split('.')[1];
    var payload1 = Buffer.from(base64Payload, 'base64');
    loggedInID = JSON.parse(payload1).id;
    if (JSON.parse(payload1).role === "USER") {
        var user = await User.findOne({
            where: {
                id: loggedInID
            }
        })
        var orders = await Order.findAll({
            where: {
                userID: loggedInID
            }
        })

        var result = []

        for (let i = 0; i < orders.length; i++) {
            var dishes = []
            var quantity = []
            var price = []
            var restaurant;
            for (let x in orders[i].OrderDetails) {
                dishes.push(x)
                console.log(dishes)
                quantity.push(orders[i].OrderDetails[x][0])
                price.push(orders[i].OrderDetails[x][1])
                restaurant = orders[i].OrderDetails[x][2]
            }
            result.push(["HUNGRY_ORDER_ID_" + orders[i].id, user.First_Name + " " + user.Last_Name, dishes, quantity, price, restaurant])

        }
        res.send(result)
    } else {
        res.send(404)
    }

}

// 16. Add to Cart

const addToCart = async (req, res) => {
    const bearerHeader = req.headers["authorization"];
    console.log(bearerHeader.substring(7))
    var token = bearerHeader.substring(7)
    var base64Payload = token.split('.')[1];
    var payload1 = Buffer.from(base64Payload, 'base64');
    loggedInID = JSON.parse(payload1).id

    let info = {
        cart: req.body.cart
    }

    console.log(loggedInID)

    var condition = {
        where: {
            id: parseInt(loggedInID)
        }
    };
    options = {
        multi: true
    };

    console.log("BK")
    const user = await User.update(info, condition, options).then(function (upresult) {})
    res.status(200).send(user)
    // console.log(user);

}

// 17. Get Cart Items

const getCart = async (req, res) => {
    const bearerHeader = req.headers["authorization"];
    console.log(bearerHeader.substring(7))
    var token = bearerHeader.substring(7)
    var base64Payload = token.split('.')[1];
    var payload1 = Buffer.from(base64Payload, 'base64');
    loggedInID = JSON.parse(payload1).id
    let user = await User.findOne({
        where: {
            id: loggedInID
        }
    })
    res.status(200).send(user.cart)
}


// 18 . Admin Login

const adminlogin = async (req, res) => {
    const Email_ID = req.body.Email_ID;
    const Password = req.body.Password;
    let admin = await Admin.findOne({
        where: {
            Email_ID: Email_ID
        }
    })
    if (admin) {
        if (Password === admin.Password) {
            // res.status(200).send("User Logged in successfully");
            let payload = {
                id: admin.id,
                role: "ADMIN"
            };
            var token = jwt.sign(payload, jwtOptions.secretOrKey);
            res.json({
                msg: 'User Logged in Successfully',
                token: token
            });
            console.log(token)
            var base64Payload = token.split('.')[1];
            var payload1 = Buffer.from(base64Payload, 'base64');
            // console.log(JSON.parse(payload1.toString())) 
            loggedInID = JSON.parse(payload1).id
            console.log(loggedInID)
        } else {
            res.status(400).send("Incorrect Password");
        }
    } else {
        res.status(401).send("Admin doesn't exist.");
    }
}

// 19. Update Category

const updateCategory = async (req, res) => {

    let id = req.params.id

    const category = await Category.update(req.body, {
        where: {
            id: id
        }
    })
    let thisUser = await Category.findOne({
        where: {
            id: id
        }
    })
    res.status(200).send(thisUser)


}

// 20. delete User by ID

const deleteCategory = async (req, res) => {

    let id = req.params.id

    await Category.destroy({
        where: {
            id: id
        }
    })

    res.status(200).send('Category is deleted !')

}

// 21 . Add New Category

const addCategory = async (req, res) => {

    let info = {
        CategoryName: req.body.CategoryName
    }
    const category = await Category.create(info)
    res.status(200).send(category)
}

// 22. Update Category

const updateRestaurant = async (req, res) => {

    let id = req.params.id

    const restaurant = await Restaurant.update(req.body, {
        where: {
            id: id
        }
    })
    let thisUser = await Restaurant.findOne({
        where: {
            id: id
        }
    })
    res.status(200).send(thisUser)

}

// 23 . delete Restaurant by ID

const deleteRestaurant = async (req, res) => {

    let id = req.params.id

    await Restaurant.destroy({
        where: {
            id: id
        }
    })

    res.status(200).send('Restaurant is deleted !')

}

// 24 . Add New Restaurant

const addRestaurant = async (req, res) => {

    let info = {
        RestaurantName: req.body.RestaurantName,
        CuisineName: req.body.CuisineName
    }
    const restaurant = await Restaurant.create(info)
    res.status(200).send(restaurant)
}


// 25 . delete User by ID

const deleteUser = async (req, res) => {

    let id = req.params.id

    await User.destroy({
        where: {
            id: id
        }
    })

    res.status(200).send('User is deleted !')

}

// 26. Update dish

const updateDish = async (req, res) => {

    let id = req.params.id

    const dish = await Food.update(req.body, {
        where: {
            id: id
        }
    })
    let thisUser = await Food.findOne({
        where: {
            id: id
        }
    })
    res.status(200).send(thisUser)

}

// 27 . delete Dish by ID

const deleteDish = async (req, res) => {

    let id = req.params.id

    await Food.destroy({
        where: {
            id: id
        }
    })

    res.status(200).send('Dish is deleted !')

}

// 28 . Add New Dish

const addDish = async (req, res) => {

    let info = {
        Dishes: req.body.DishName,
        Price: req.body.Price,
        HotelName: req.body.RestaurantName,
        CuisineName: req.body.CuisineName
    }
    const food = await Food.create(info)
    res.status(200).send(food)
}

// 29. Referesh Token

const token = async (req, res) => {

    const Email_ID = req.body.Email_ID;
    let user = await User.findOne({
        where: {
            Email_ID: Email_ID
        }
    })
    const postData = req.body
    if ((postData.refreshToken) && (postData.refreshToken in tokenList)) {
        let payload = {
            id: user.id,
            Email_ID: postData.Email_ID,
            role: "USER"
        };
        const token = jwt.sign(payload, jwtOptions.secretOrKey, {
            expiresIn: 43200
        })
        const response = {
            "token": token,
        }
        tokenList[postData.refreshToken].token = token
        res.status(200).json(response);
    } else {
        res.status(404).send('Invalid request')
    }
}


module.exports = {
    addUser,
    login,
    address,
    getUsers,
    getFoodTable,
    getCuisines,
    getHotels,
    getDishes,
    getSingleUser,
    getCategories,
    getRestaurants,
    addOrderDetails,
    getOrderDetails,
    getUserOrderDetails,
    addToCart,
    getCart,
    adminlogin,
    updateCategory,
    deleteCategory,
    addCategory,
    updateRestaurant,
    deleteRestaurant,
    addRestaurant,
    deleteUser,
    addDish,
    updateDish,
    deleteDish,
    token
    // addCuisine,
    // getCuisines
}