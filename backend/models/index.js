require("dotenv").config();

const dbconfig = require('../config/dbConfig.js');

const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize(
    dbconfig.DATABASE,
    dbconfig.USER,
    dbconfig.PASSWORD, {
        host: dbconfig.HOST,
        dialect: dbconfig.DIALECT
    }
)

sequelize.authenticate()
.then(() => {
    console.log('connected..')
})
.catch(err => {
    console.log('Error'+ err)
})

const db = {}

db.sequelize = sequelize

db.users = require('./hungry.js')(sequelize, DataTypes)
db.food = require('./food.js')(sequelize, DataTypes)
db.categories = require('./category.js')(sequelize, DataTypes)
db.restaurants = require('./restaurants.js')(sequelize, DataTypes)
db.orders = require('./orders.js')(sequelize, DataTypes)
db.admins = require('./admins.js')(sequelize, DataTypes)

db.sequelize.sync({ force: false })
.then(() => {
    console.log('Sync done!')
})

module.exports = db