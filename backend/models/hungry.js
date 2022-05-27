module.exports = (sequelize, DataTypes) => {

    var User = sequelize.define("users", {

        First_Name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Last_Name: {
            type: DataTypes.STRING
        },
        Email_ID: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        Password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        cart:{
            type:DataTypes.JSON,
            allowNull:true
        },
        Address_Line1:{
            type:DataTypes.STRING,
            allowNull:true
        },
        Address_Line2:{
            type:DataTypes.STRING,
            allowNull:true
        },
        Landmark:{
            type:DataTypes.STRING,
            allowNull:true
        },
        City_Pincode:{
            type:DataTypes.STRING,
            allowNull:true
        }

    }, {
        timestamps: false
      })



    return User

}

// module.exports = (sequelize, DataTypes) => {

//     var Cuisine = sequelize.define("cuisines", {

//        CuisineID: {
//             type: DataTypes.INTEGER,
//             allowNull: false
//         },
//        CuisineName: {
//             type: DataTypes.STRING
//         }},
//          {
//         timestamps: false
//       })



//     return Cuisine

// }

