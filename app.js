//#region IMPORTS
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
require("dotenv").config();
var passport = require("passport");
//#endregion IMPORTS

//#region ROUTE IMPORTS
var indexRouter = require("./routes/index");
var invoiceRouter = require("./routes/invoice");
var productRouter = require("./routes/product");
var recipeRouter = require("./routes/recipe");
var roleRouter = require("./routes/role");
var usersRouter = require("./routes/users");
var tableRouter = require("./routes/table");
var orderRouter = require("./routes/order");
var movementRouter = require("./routes/movement");
var authenticationRouter = require("./routes/authentication");
//#endregion ROUTE IMPORTS

//#region PASSPORT
require("./api/config/passport");
//#endregion PASSPORT

//#region MONGODB CONNECTION
var db = require("./db");
db.connectToDB();
db.getConnection()
  .asPromise()
  .then(() => {
    console.log("Conexión Exitosa a Cluster Mongo Atlas");
  })
  .catch((err) => console.error(err));
//#endregion MONGODB CONNECTION

//#region EXPRESS
var app = express();

app.use(cors());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//#region ROUTE USAGE
// Inicializar passport para su uso en las rutas
app.use(passport.initialize());
// Rutas
// Default Route
app.use("/", indexRouter);
// App Routes
app.use("/authentication", authenticationRouter);
app.use("/invoice", invoiceRouter);
app.use("/product", productRouter);
app.use("/recipe", recipeRouter);
app.use("/role", roleRouter);
app.use("/users", usersRouter);
app.use("/table", tableRouter);
app.use("/order", orderRouter);
app.use("/movement", movementRouter);
//#region ROUTE USAGE

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  if (err.name === "UnauthorizedError") {
    res.status(401);
    res.json({ message: err.name + ": " + err.message });
  }
  // render the error page
  else {
    res.status(err.status || 500);
    res.render("error");
  }
});
//#endregion EXPRESS

module.exports = app;
