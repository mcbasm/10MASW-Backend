//#region IMPORTS
var express = require("express");
var router = express.Router();
var User = require("../models/User");
var encryption = require("../security/encryption");
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
  User.find({
    status: true,
  })
    .select({
      name: 1,
      lastName: 1,
      email: 1,
      phone: 1,
      role: 1,
    })
    .populate("role")
    .exec((err, result) => {
      if (err) return next(err);
      else res.json(result);
    });
});
// Obtener un registro por ID
router.get("/:id", auth, (req, res, next) => {
  User.findById(req.params.id)
    .select({
      name: 1,
      lastName: 1,
      email: 1,
      phone: 1,
      role: 1,
    })
    .populate("role")
    .exec((err, result) => {
      if (err) return next(err);
      else res.json(result);
    });
});
// Obtener el listado de los registros paginados
router.post("/paginated", auth, async (req, res, next) => {
  const { page = 1, limit = 10 } = req.body;

  const items = await User.find({
    status: true,
  })
    .select({
      name: 1,
      lastName: 1,
      email: 1,
      phone: 1,
      role: 1,
    })
    .populate("role")
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();
  const count = await User.countDocuments({
    status: true,
  });

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
  // Obtener el valor de la contraseña y desencriptarlo del frontend para encriptarlo de nuevo en el backend
  const passwordFEdecrypted = encryption.decryptFE(req.body.password);
  req.body.password = encryption.encrypt(passwordFEdecrypted);
  User.create(req.body, (err, result) => {
    if (err) return next(err);
    else res.json(result);
  });
});
// Editar un registro
router.put("/:id", auth, (req, res, next) => {
  // Obtener el valor de la contraseña y desencriptarlo del frontend para encriptarlo de nuevo en el backend
  if (req.body.password) {
    const passwordFEdecrypted = encryption.decryptFE(req.body.password);
    req.body.password = encryption.encrypt(passwordFEdecrypted);
    User.findByIdAndUpdate(req.params.id, req.body, (err, result) => {
      if (err) return next(err);
      else res.json(result);
    });
  } else {
    // Si no hay cambio de password, editar solo los campos basicos
    User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          lastName: req.body.lastName,
          email: req.body.email,
          phone: req.body.phone,
          role: req.body.role,
        },
      },
      (err, result) => {
        if (err) return next(err);
        else res.json(result);
      }
    );
  }
});
// Eliminar un registro
router.delete("/:id", auth, (req, res, next) => {
  User.findByIdAndDelete(req.params.id, {}, (err, result) => {
    if (err) return next(err);
    else res.json(result);
  });
});
//#endregion REQUESTS

module.exports = router;
