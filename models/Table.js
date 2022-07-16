//#region IMPORTS
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//#endregion IMPORTS

var TableSchema = new Schema(
  {
    availability: {
      type: Number,
      required: true,
      enum: [1, 2, 3],
      default: 1,
    },
    number: {
      type: Number,
      required: true,
    },
    reserveHour: {
      type: String,
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
    waiter: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Table", TableSchema);
