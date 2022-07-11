//#region IMPORTS
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//#endregion IMPORTS

var InvoiceSchema = new Schema(
  {
    billNumber: {
      type: String,
      required: true,
    },
    buyDate: {
      type: Date,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    deliveryDate: {
      type: Date,
      required: true,
    },
    products: [
      { type: Schema.Types.ObjectId, ref: "ProductInvoice", required: true },
    ],
    provider: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", InvoiceSchema);
