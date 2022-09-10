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
router.put("/:id", auth, async (req, res, next) => {
  // Actualizar el listado de los productos seleccionados a guardar
  const recipe = await Recipe.findById(req.params.id).populate({
    path: "products",
    populate: {
      path: "product",
      model: "Product",
    },
  });

  const currentProducts = recipe.products;
  const sentProducts = req.body.products;
  // Eliminar los productos que ya no estan seleccionados
  const productsToDelete = currentProducts.filter((x) => {
    return !sentProducts.find((y) => y._id === x._id.toString());
  });

  productsToDelete.every(async (x) => {
    await ProductPicked.findByIdAndDelete(x._id);
  });

  // Crear los productos faltantes
  const productsToCreate = sentProducts.filter((x) => {
    return !currentProducts.find((y) => y._id.toString() === x._id);
  });

  // Actualizar los productos restantes
  sentProducts.every(async (x) => {
    if (x._id) await ProductPicked.findByIdAndUpdate(x._id, x);
  });

  if (productsToCreate?.length > 0) {
    ProductPicked.create(productsToCreate, (err, created) => {
      created.forEach((newProduct) => {
        let currentProduct = sentProducts.find(
          (x) => x.product._id === newProduct.product._id.toString()
        );
        currentProduct._id = newProduct._id;
      });

      req.body.products = sentProducts;
      Recipe.findByIdAndUpdate(req.params.id, req.body, (err, result) => {
        if (err) return next(err);
        else res.json(result);
      });
    });
  } else {
    Recipe.findByIdAndUpdate(req.params.id, req.body, (err, result) => {
      if (err) return next(err);
      else res.json(result);
    });
  }
});
// Eliminar un registro
router.delete("/:id", auth, (req, res, next) => {
  Recipe.findByIdAndUpdate(req.params.id, { status: false }, (err, result) => {
    if (err) return next(err);
    else res.json(result);
  });
});
//#endregion REQUESTS

module.exports = router;
