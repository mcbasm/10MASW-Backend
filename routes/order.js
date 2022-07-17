//#region IMPORTS
var express = require("express");
var router = express.Router();
var RecipePicked = require("../models/RecipePicked");
var Table = require("../models/Table");
var Order = require("../models/Order");
var Product = require("../models/Product");
var Movement = require("../models/Movement");
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
  Order.find((err, result) => {
    if (err) return next(err);
    else res.json(result);
  });
});
// Obtener un registro por ID
router.get("/:id", auth, (req, res, next) => {
  Order.findById(req.params.id)
    .populate({
      path: "recipes",
    })
    .exec((err, result) => {
      if (err) return next(err);
      else res.json(result);
    });
});
// Obtener la order asignada a una mesa
router.get("/byTable/:id", auth, (req, res, next) => {
  Order.findOne({ table: req.params.id, status: { $in: [1, 2, 3] } })
    .populate({
      path: "recipes",
      populate: {
        path: "recipe",
        model: "Recipe",
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

  filter.status = +filter.status;

  const items = await Order.find(functions.buildFilter(filter))
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate({
      path: "recipes",
      populate: {
        path: "recipe",
        model: "Recipe",
        populate: {
          path: "products",
          populate: {
            path: "product",
            model: "Product",
          },
        },
      },
    })
    .populate("table")
    .sort({ createdAt: -1 })
    .exec();
  const count = await Order.countDocuments(functions.buildFilter(filter));

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
  // Calcular el monto total de la orden
  req.body.total = calculateTotal(req.body.recipes);
  // Crear los registros de los Platos seleccionados a guardar
  req.body.recipes = await RecipePicked.create(req.body.recipes);

  Order.create(req.body, async (err, result) => {
    if (err) return next(err);
    else {
      await Table.findByIdAndUpdate(req.body.table, { availability: 3 });
      res.json(result);
    }
  });
});
// Editar un registro
router.put("/:id", auth, async (req, res, next) => {
  // Actualizar el listado de los Platos seleccionados a guardar
  const recipe = await Order.findById(req.params.id).populate({
    path: "recipes",
    populate: {
      path: "recipe",
      model: "Recipe",
    },
  });

  const currentRecipes = recipe.recipes;
  const sentRecipes = req.body.recipes;

  // Calcular el monto total de la orden
  req.body.total = calculateTotal(req.body.recipes);

  // Eliminar los Platos que ya no estan seleccionados
  const recipesToDelete = currentRecipes.filter((x) => {
    return !sentRecipes.find((y) => y._id === x._id.toString());
  });

  recipesToDelete.every(async (x) => {
    await RecipePicked.findByIdAndDelete(x._id);
  });

  // Crear los Platos faltantes
  const recipesToCreate = sentRecipes.filter((x) => {
    return !currentRecipes.find((y) => y._id.toString() === x._id);
  });

  // Actualizar los Platos restantes
  sentRecipes.every(async (x) => {
    if (x._id) await RecipePicked.findByIdAndUpdate(x._id, x);
  });

  if (recipesToCreate?.length > 0) {
    RecipePicked.create(recipesToCreate, (err, created) => {
      created.forEach((newRecipe) => {
        let currentRecipe = sentRecipes.find(
          (x) => x.recipe._id === newRecipe.recipe._id.toString()
        );
        currentRecipe._id = newRecipe._id;
      });

      req.body.recipes = sentRecipes;
      Order.findByIdAndUpdate(req.params.id, req.body, (err, result) => {
        if (err) return next(err);
        else res.json(result);
      });
    });
  } else {
    Order.findByIdAndUpdate(req.params.id, req.body, (err, result) => {
      if (err) return next(err);
      else res.json(result);
    });
  }
});
// Cambiar el estado de un registro
router.post("/updateStatus", auth, async (req, res, next) => {
  Order.findByIdAndUpdate(
    req.body._id,
    { status: req.body.status },
    async (err, result) => {
      if (err) return next(err);
      else {
        if ([4, 5].includes(req.body.status)) {
          await Table.findByIdAndUpdate(req.body.table, {
            availability: 1,
            waiter: null,
          });
        }
        // Crear los movimientos asociados para cada producto si la orden fue completada
        if (req.body.status == 4) {
          // Obtener los valores de la orden
          const order = await Order.findById(req.body._id)
            .populate({
              path: "recipes",
              populate: {
                path: "recipe",
                model: "Recipe",
                populate: {
                  path: "products",
                  populate: {
                    path: "product",
                    model: "Product",
                  },
                },
              },
            })
            .exec();

          console.log(order);

          if (!order) return next(err);

          // Obtener los productos Seleccionados
          const productsPicked = [];
          order.recipes.forEach((recipePicked) => {
            recipePicked.recipe.products.forEach((product) => {
              product.quantity = product.quantity * recipePicked.quantity;
              productsPicked.push(product);
            });
          });

          productsPicked.forEach((productPicked) => {
            const movement = {
              product: productPicked.product,
              quantity: productPicked.quantity,
              type: "Salida",
            };
            Movement.create(movement, async (err, result) => {
              if (err) return next(err);
              else {
                await Product.findByIdAndUpdate(productPicked.product._id, {
                  stock: productPicked.product.stock - movement.quantity,
                });
              }
            });
          });
        }
        res.json(result);
      }
    }
  );
});
//#endregion REQUESTS

function calculateTotal(recipes) {
  return recipes.reduce((p, c) => {
    return p + c.recipe.total * c.quantity;
  }, 0);
}

module.exports = router;
