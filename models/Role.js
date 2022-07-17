//#region IMPORTS
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//#endregion IMPORTS

var RoleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Role", RoleSchema);
