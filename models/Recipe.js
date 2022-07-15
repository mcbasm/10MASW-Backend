//#region IMPORTS
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//#endregion IMPORTS

var RecipeSchema = new Schema(
  {
    currency: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    products: [
      { type: Schema.Types.ObjectId, ref: "ProductPicked", required: true },
    ],
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
    total: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", RecipeSchema);
