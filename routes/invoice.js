//#region IMPORTS
var express = require("express");
var router = express.Router();
var ProductPicked = require("../models/ProductPicked");
var Invoice = require("../models/Invoice");
var jwt = require("express-jwt");
var functions = require("../api/config/functions");
const { DateTime } = require("luxon");
//#endregion IMPORTS

//#region DATA
var auth = jwt({
  secret: process.env.secret,
  userProperty: "payload",
});
//#endregion DATA

//#region REQUESTS
// Obtener todos los registros
router.get("/", auth, (req, res, next) => {
  Invoice.find((err, result) => {
    if (err) return next(err);
    else res.json(result);
  });
});
// Obtener un registro por ID
router.get("/:id", auth, (req, res, next) => {
  Invoice.findById(req.params.id)
    .populate("products")
    .populate("products.product")
    .exec((err, result) => {
      if (err) return next(err);
      else res.json(result);
    });
});
// Obtener el listado de los registros paginados
router.post("/paginated", auth, async (req, res, next) => {
  const { page = 1, limit = 10 } = req.body;
  const filter = req.body.filter;

  const items = await Invoice.find(functions.buildFilter(filter))
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate({
      path: "products",
      populate: {
        path: "product",
        model: "Product",
      },
    })
    .exec();
  const count = await Invoice.countDocuments(functions.buildFilter(filter));

  res.json({
    items,
    pagination: {
      limit,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      page,
      filter,
    },
  });
});
// Crear un registro
router.post("/", auth, async (req, res, next) => {
  // Crear las fechas a partir de los strings enviados de front
  const dates = {
    buyDate: DateTime.fromFormat(req.body.buyDate, "dd/MM/yyyy HH:mm"),
    deliveryDate: DateTime.fromFormat(
      req.body.deliveryDate,
      "dd/MM/yyyy HH:mm"
    ),
  };
  req.body.buyDate = dates.buyDate;
  req.body.deliveryDate = dates.deliveryDate;

  // Crear los registros de los productos seleccionados a guardar
  req.body.products = await ProductPicked.create(req.body.products);

  Invoice.create(req.body, (err, result) => {
    if (err) return next(err);
    else res.json(result);
  });
});
//#endregion REQUESTS

module.exports = router;
