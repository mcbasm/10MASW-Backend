//#region IMPORTS
var express = require("express");
var router = express.Router();
var Role = require("../models/Role");
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
  Role.find((err, result) => {
    if (err) return next(err);
    else res.json(result);
  });
});
// Obtener un registro por ID
router.get("/:id", auth, (req, res, next) => {
  Role.findById(req.params.id, (err, result) => {
    if (err) return next(err);
    else res.json(result);
  });
});
// Crear un registro
router.post("/", auth, (req, res, next) => {
  Role.create(req.body, (err, result) => {
    if (err) return next(err);
    else res.json(result);
  });
});
// Editar un registro
router.put("/:id", auth, (req, res, next) => {
  Role.findByIdAndUpdate(req.params.id, req.body, (err, result) => {
    if (err) return next(err);
    else res.json(result);
  });
});
// Eliminar un registro
router.delete("/:id", auth, (req, res, next) => {
  Role.findByIdAndDelete(req.params.id, {}, (err, result) => {
    if (err) return next(err);
    else res.json(result);
  });
});
//#endregion REQUESTS

module.exports = router;
