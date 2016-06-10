var express = require("express");
_ = require("underscore");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var app = express();
var db = require("./db.js");
var publicPort = process.env.PORT || 3000;
var bcrypt = require("bcrypt");
var logger = require("morgan");
var middleware = require("./middleware.js")(db);
var todoroutes = require("./routes/todos.js")(db, middleware);
var userroutes = require("./routes/users.js")(db, middleware);
var privateroutes = require("./routes/private.js")(db, middleware);
var publicroutes = require("./routes/public.js")(db, middleware);
var todoID = 1;
var todos = [
];
app.use(express.static(__dirname + "/public"));
app.locals.pretty = true;

//set up views engine and tells express where to find views
app.set("view engine", "pug");
app.set("views", "./views");

//set up middleware
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({extended:false}));
app.use(logger("dev"));

//set up routes
app.use("/todos", todoroutes);
app.use("/users", userroutes);
app.use("/public", publicroutes);
app.use("/todolist" , privateroutes);

app.get("/", function (req, res) {

res.render("index.pug");

});

db.sequelize.sync().then(function () {
    app.listen(publicPort, function () {

        console.log("Listening on " + publicPort);

    });
});