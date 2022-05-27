"use strict";

module.exports = function (sequelize, DataTypes) {
  var Restaurant = sequelize.define("restaurants", {
    RestaurantName: {
      type: DataTypes.STRING
    },
    CuisineName: {
      type: DataTypes.STRING
    }
  }, {
    timestamps: false
  });
  return Restaurant;
};