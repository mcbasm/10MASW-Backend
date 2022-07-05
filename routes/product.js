//#region IMPORTS
var express = require("express");
var router = express.Router();
var Product = require("../models/Product");
var jwt = require("express-jwt");
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
  Product.find((err, result) => {
    if (err) return next(err);
    else res.json(result);
  });
});
// Obtener un registro por ID
router.get("/:id", auth, (req, res, next) => {
  Product.findById(req.params.id, (err, result) => {
    if (err) return next(err);
    else res.json(result);
  });
});
// Obtener el listado de los registros paginados
router.post("/paginated", auth, async (req, res, next) => {
  const { page = 1, limit = 10 } = req.body;

  const items = await Product.find()
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();
  const count = await Product.countDocuments();

  res.json({
    items,
    pagination: {
      limit,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      page,
    },
  });
});
// Crear un registro
router.post("/", auth, (req, res, next) => {
  Product.create(req.body, (err, result) => {
    if (err) return next(err);
    else res.json(result);
  });
});
// Editar un registro
router.put("/:id", auth, (req, res, next) => {
  Product.findByIdAndUpdate(req.params.id, req.body, (err, result) => {
    if (err) return next(err);
    else res.json(result);
  });
});
// Eliminar un registro
router.delete("/:id", auth, (req, res, next) => {
  Product.findByIdAndUpdate(req.params.id, { status: false }, (err, result) => {
    if (err) return next(err);
    else res.json(result);
  });
});
//#endregion REQUESTS

module.exports = router;
