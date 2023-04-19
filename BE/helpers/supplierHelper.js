const JWT = require("jsonwebtoken");
const express = require("express");
const router = express.Router();

const jwtSettings = require("../constants/jwtSettings");

const encodeToken = (userId, name, email, address) => {
  return JWT.sign(
    {
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1),
      audience: jwtSettings.AUDIENCE,
      issuer: jwtSettings.ISSUER,
      userId,
      name,
      email, 
      address,
      algorithm: "HS512",
    },
    jwtSettings.SECRET
  );
};

module.exports = encodeToken;
