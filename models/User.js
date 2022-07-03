//#region IMPORTS
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var encryption = require("../security/encryption");
var jwt = require("jsonwebtoken");
require("dotenv").config();
//#endregion IMPORTS

var UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
});

UserSchema.methods.validPassword = function (password) {
  var hash = encryption.encrypt(password);
  return this.password === hash;
};

UserSchema.methods.generateJwt = function () {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
      exp: parseInt(expiry.getTime() / 1000),
    },
    process.env.secret
  );
};

module.exports = mongoose.model("User", UserSchema);
