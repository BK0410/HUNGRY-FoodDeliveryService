"use strict";

module.exports = function (sequelize, DataTypes) {
  var Category = sequelize.define("categories", {
    // CategoryID: {
    //   type: DataTypes.INTEGER,
    //   autoincrement:true
    // },
    CategoryName: {
      type: DataTypes.STRING
    }
  }, {
    timestamps: false
  });
  return Category;
};