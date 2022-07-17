//#region IMPORTS
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//#endregion IMPORTS

var MovementSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    type: {
      type: String,
      required: true,
      enum: ["Entrada", "Salida"],
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movement", MovementSchema);
