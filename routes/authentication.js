//#region IMPORTS
var express = require("express");
var router = express.Router();
var authentication = require("../security/authentication.js");
//#endregion IMPORTS

//#region ROUTES
router.post("/", authentication.login);
//#endregion ROUTES

module.exports = router;
