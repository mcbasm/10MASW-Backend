//#region IMPORTS
var express = require('express');
var router = express.Router();
var Role = require('../models/Role')
//#endregion IMPORTS

//#region REQUESTS
// Obtener todos los registros
router.get('/', (req, res, next) => {
    Role.find((err, result) => {
        if (err) return next(err);
        else
            res.json(result)
    })
})
// Obtener un registro por ID
router.get('/:id', (req, res, next) => {
    Role.findById(req.params.id, (err, result) => {
        if (err) return next(err);
        else
            res.json(result)
    })
})
// Crear un registro
router.post('/', (req, res, next) => {
    Role.create(req.body, (err, result) => {
        if (err) return next(err);
        else
            res.json(result)
    })
})
// Editar un registro
router.put('/:id', (req, res, next) => {
    Role.findByIdAndUpdate(req.params.id, req.body, (err, result) => {
        if (err) return next(err);
        else
            res.json(result)
    })
})
// Eliminar un registro
router.delete('/:id', (req, res, next) => {
    Role.findByIdAndDelete(req.params.id, {}, (err, result) => {
        if (err) return next(err);
        else
            res.json(result)
    })
})
//#endregion REQUESTS

module.exports = router;