module.exports = (sequelize, DataTypes) => {

    var Admin = sequelize.define("admins", {

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
        }
    }, {
        timestamps: false
      })
      
    return Admin

}
