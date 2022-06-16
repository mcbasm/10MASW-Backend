//#region IMPORTS
var express = require('express');
var router = express.Router();
var User = require('../models/User')
var encryption = require('../security/encryption')
//#endregion IMPORTS

//#region REQUESTS
// Obtener todos los registros
router.get('/', (req, res, next) => {
  User.find({
    status: true
  }).select({
    "name": 1,
    "lastName": 1,
    "email": 1,
    "phone": 1,
    "role": 1
  }).populate('role').exec((err, result) => {
    if (err) return next(err);
    else
      res.json(result)
  })
})
// Obtener un registro por ID
router.get('/:id', (req, res, next) => {
  User.findById(req.params.id).select({
    "name": 1,
    "lastName": 1,
    "email": 1,
    "phone": 1,
    "role": 1
  }).populate('role').exec((err, result) => {
    if (err) return next(err);
    else
      res.json(result)
  })
})
// Crear un registro
router.post('/', (req, res, next) => {
  User.create(req.body, (err, result) => {
    if (err) return next(err);
    else
      res.json(result)
  })
})
// Editar un registro
router.put('/:id', (req, res, next) => {
  User.findByIdAndUpdate(req.params.id, req.body, (err, result) => {
    if (err) return next(err);
    else
      res.json(result)
  })
})
// Eliminar un registro
router.delete('/:id', (req, res, next) => {
  User.findByIdAndDelete(req.params.id, {}, (err, result) => {
    if (err) return next(err);
    else
      res.json(result)
  })
})
//#endregion REQUESTS

module.exports = router;