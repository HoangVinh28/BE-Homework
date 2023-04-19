const JwtStrategy = require("passport-jwt").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const jwtSettings = require("../constants/jwtSettings");
const {  Category, Product, Supplier, Customer, Employee, Order} = require("../models/index");

const passportConfig = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken("Authorization"),
    secretOrKey: jwtSettings.SECRET,
  },
  async (payload, done) => {
    try {
      console.log("payload",payload.userId);
      const user = await Category.findById(payload.userId);

      if (!user) return done(null, false);

      return done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
);

const passportConfigLocal = new LocalStrategy(
  {
    usernameField: "email",
  },
  async (email, password, done) => {
    try {
      const user = await Employee.findOne({ email });

      if (!user) return done(null, false);

      const isCorrectPass = await user.isValidPass(password);

      if (!isCorrectPass) return done(null, false);

      return done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
);

module.exports = {
  passportConfig,
  passportConfigLocal,
};
