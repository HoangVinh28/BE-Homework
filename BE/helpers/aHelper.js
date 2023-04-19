const JWT = require("jsonwebtoken");
const express = require("express");
const router = express.Router();

const jwtSettings = require("../constants/jwtSettings");

const encodeToken = (userId, name, description) => {
  return JWT.sign(
    {
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1),
      audience: jwtSettings.AUDIENCE,
      issuer: jwtSettings.ISSUER,
      /*  subject: */ userId,
      name,
      description, // Thường dùng để kiểm tra JWT lần sau
      //description: "HS512",
    },
    jwtSettings.SECRET
  );
};

module.exports = encodeToken;
