var passport = require("passport");
var mongoose = require("mongoose");
var User = mongoose.model("User");

module.exports.login = function (req, res) {
  passport.authenticate("local", function (err, user, info) {
    var token;

    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if (user) {
      token = user.generateJwt();
      res.status(200);
      res.json({
        role: user.role,
        token: token,
      });
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);
};

module.exports.userLoggedIn = function (req, res) {
  // If no user ID exists in the JWT return a 401
  if (!req.payload._id) {
    res.status(401).json({
      message: "UnauthorizedError: private profile",
    });
  } else {
    // Otherwise continue
    User.findById(req.payload._id).exec(function (err, user) {
      res.status(200).json(user);
    });
  }
};
