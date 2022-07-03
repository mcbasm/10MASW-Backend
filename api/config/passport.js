var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var mongoose = require("mongoose");
var User = mongoose.model("User");
var encryption = require("../../security/encryption");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    function (username, password, done) {
      // Desencrypt FE Password
      const passwordFEdecrypted = encryption.decryptFE(password);

      User.findOne({ email: username }, function (err, user) {
        if (err) {
          return done(err);
        }
        // Return if user not found in database
        if (!user) {
          return done(null, false, {
            message: "Usuario no existe",
          });
        }
        // Return if password is wrong
        if (!user.validPassword(passwordFEdecrypted)) {
          return done(null, false, {
            message: "La contraseña es incorrecta.",
          });
        }
        // If credentials are correct, return the user object
        return done(null, user);
      });
    }
  )
);
