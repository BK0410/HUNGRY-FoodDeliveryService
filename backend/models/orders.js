module.exports = (sequelize, DataTypes) => {

    var Order = sequelize.define("orders", {

        userID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        OrderDetails: {
            type: DataTypes.JSON,
            allowNull: false
        }
        // ,
        // Total_Amount: {
        //     type: DataTypes.DECIMAL,
        //     allowNull: false
        // }
    }, {
      timestamps: false
    })
  
  
  
    return Order
  
  }