"use strict";

var jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  var token = req.body.token || req.query.token || req.headers['authorization'].substring(7); // decode token

  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, "JWT_SECRET", function (err, decoded) {
      if (err) {
        return res.status(401).json({
          "error": true,
          "message": 'Unauthorized access.'
        });
      }

      req.decoded = decoded;
      next();
    });
  } else {
    return res.status(403).send({
      "error": true,
      "message": 'No token provided.'
    });
  }
};