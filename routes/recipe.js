//#region IMPORTS
var express = require("express");
var router = express.Router();
var ProductPicked = require("../models/ProductPicked");
var Recipe = require("../models/Recipe");
var functions = require("../api/config/functions");
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
  Recipe.find((err, result) => {
    if (err) return next(err);
    else res.json(result);
  });
});
// Obtener un registro por ID
router.get("/:id", auth, (req, res, next) => {
  Recipe.findById(req.params.id)
    .populate({
      path: "products",
      populate: {
        path: "product",
        model: "Product",
      },
    })
    .exec((err, result) => {
      if (err) return next(err);
      else res.json(result);
    });
});
// Obtener el listado de los registros paginados
router.post("/paginated", auth, async (req, res, next) => {
  const { page = 1, limit = 10 } = req.body;
  const filter = req.body.filter;

  const items = await Recipe.find(functions.buildFilter(filter))
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
  const count = await Recipe.countDocuments(functions.buildFilter(filter));

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
  // Crear los registros de los productos seleccionados a guardar
  req.body.products = await ProductPicked.create(req.body.products);
  Recipe.create(req.body, (err, result) => {
    if (err) return next(err);
    else res.json(result);
  });
});
// Editar un registro
router.put("/:id", auth, (req, res, next) => {
  Recipe.findByIdAndUpdate(req.params.id, req.body, (err, result) => {
    if (err) return next(err);
    else res.json(result);
  });
});
// Eliminar un registro
router.delete("/:id", auth, (req, res, next) => {
  User.findByIdAndUpdate(req.params.id, { status: false }, (err, result) => {
    if (err) return next(err);
    else res.json(result);
  });
});
//#endregion REQUESTS

module.exports = router;
