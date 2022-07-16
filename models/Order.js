//#region IMPORTS
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//#endregion IMPORTS

var OrderSchema = new Schema(
  {
    table: {
      type: Schema.Types.ObjectId,
      ref: "Table",
      required: true,
    },
    recipes: [
      { type: Schema.Types.ObjectId, ref: "RecipePicked", required: true },
    ],
    status: {
      type: Number,
      required: true,
      default: 1,
      enum: [1, 2, 3, 4, 5],
    },
    total: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
