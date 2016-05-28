var express = require("express");
_ = require("underscore");
var bodyParser = require("body-parser");
var app = express();
var db = require("./db.js");
var publicPort = process.env.PORT || 3000;
var bcrypt = require("bcrypt");
var logger = require("morgan");
var middleware = require("./middleware.js")(db);
var todoroutes = require("./routes/todos.js")(db, middleware);
var userroutes = require("./routes/users.js")(db, middleware);
var todoID = 1;
var todos = [
];

//set up views engine and tells express where to find views
app.set("view engine", "pug");
app.set("views", "./views");

//set up middleware
app.use(bodyParser.json());
app.use(logger("dev"));

//set up routes
app.use("/todos", todoroutes);

app.use("/users", userroutes);

app.get("/", function (req, res) {

res.render("index.pug");

});

db.sequelize.sync({force:true}).then(function () {
    app.listen(publicPort, function () {

        console.log("Listening on " + publicPort);

    });
});