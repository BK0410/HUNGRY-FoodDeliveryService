module.exports = (sequelize, DataTypes) => {

  var Food = sequelize.define("food", {

    CuisineName: {
      type: DataTypes.STRING
    },
    HotelName: {
      type: DataTypes.STRING
    },
    Dishes: {
      type: DataTypes.STRING
    },
    Price: {
      type: DataTypes.INTEGER
    }
  }, {
    timestamps: false
  })

  return Food

}