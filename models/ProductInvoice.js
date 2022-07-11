//#region IMPORTS
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//#endregion IMPORTS

var ProductInvoiceSchema = new Schema(
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
    total: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductInvoice", ProductInvoiceSchema);
