var express = require("express");
var _ = require("underscore");
var bodyParser = require("body-parser");
var app = express();
var db = require("./db.js");
var publicPort = process.env.PORT || 3000;
var bcrypt = require("bcrypt");
var middleware = require("./middleware.js")(db);
var todoID = 1;

var todos = [
];
app.use(bodyParser.json());

app.get("/", function (req, res) {

res.send("Todo app root directory.");

});

app.get("/todos", middleware.requireAuth, function (req, res) {
    var todosArray = []
    var queryParams = _.pick(req.query, "completed", "q")
    var where = {
        where: {}
    }
    if (queryParams.hasOwnProperty("completed")) {
        if (queryParams.completed === "true") {
            queryParams.completed = true
        } else {
            queryParams.completed = false;
        }
        where.where.completed = queryParams.completed
    }
    if (queryParams.hasOwnProperty("q") && _.isString(queryParams.q)) {
        where.where.description = {};
        where.where.description.$like = "%" + queryParams.q + "%"
    }
    db.todo.findAll(where).then(function (todos) {
        todos.forEach(function (todo) {
            console.log(todo)
            todosArray.push(todo);
        })
    }).then(function () {
        console.log(where);
        if (todosArray.length == 0) {
            res.status(404);
            res.send("No entries found for given query.");
            return
        }
        res.send(todosArray);
    })
});



//app GET
app.get("/todos/:id", middleware.requireAuth, function (req, res) {

    var reqId = parseInt(req.params.id, 10);
    db.todo.findById(reqId).then(function (todo) {
        if (!!todo) {
            res.json(todo);
        } else {
            res.status(400);
            res.send("No todo with that Id found.");
        }
    })
});



//app POST todos
app.post("/todos", middleware.requireAuth, function (req, res) {
    var body = _.pick(req.body, "description", "completed");
    db.todo.create({
        description: body.description,
        completed: body.completed
    }).then(function (todo) {
        res.send(todo);
    }).catch(function (e) {

            res.status(400);
            res.send(e);
        }

    );
});

// app POST users
app.post("/users", function (req, res) {
    var body = _.pick(req.body, "username", "email", "password");

    if (_.isString(body.username) && _.isString(body.password) && _.isString(body.email)) {
        db.users.create({
            username: body.username,
            email: body.email,
            password: body.password
        }).then(function (userinfo) {
            res.send(userinfo.pickUserData());
        }).catch(function (e) {

                res.status(400);
                res.send(e);
            }

        );
    } else {
        res.status(400);
        res.send("Invalid data recieved.");
    }
});

app.post("/users/login", function (req, res) {
    var body = _.pick(req.body, "username", "password");
    /*
    if (_.isString(body.username) && _.isString(body.password)) {
        res.send(body);
    } else {
        res.status(400);
        res.send("Unable to process request.");
        return
    }
*/
    db.users.authenticateUser(body).then(function(userdata){
    res.header("Authentication", userdata.generateToken("Authentication"))
    res.json(userdata.pickUserData());
    },function(e){
    if(e){
    res.send(e);
    }
    else{
    res.status(401).send("Username or Password incorrect.");
    }
    })
});


//app DELETE
app.delete("/todos/:id", middleware.requireAuth, function (req, res) {
    var reqid = parseInt(req.params.id, 10);
    db.todo.findById(reqid).then(function (foundtodo) {
        console.log(foundtodo);
        if (!foundtodo) {
            res.status = 400;
            res.send("Could not find record to delete.");
            return
        } else {
            foundtodo.destroy().then(function (todo) {
                res.send(todo);
            });
        }
    })

});



//app PUT
app.put("/todos/:id", middleware.requireAuth, function (req, res) {

    var body = req.body;
    var reqId = parseInt(req.params.id, 10);
    db.todo.findById(reqId).then(function (foundtodo) {
        if (!!foundtodo) {
            if (body.hasOwnProperty("description")) {
                foundtodo.description = body.description;
            }
            if (body.hasOwnProperty("completed")) {

                foundtodo.completed = body.completed;
            }
            foundtodo.save().then(function (savedtodo) {
                res.json(savedtodo);
            })
        } else {
            res.status = 400;
            res.send("No record found to modify.");
        }
    }).catch(function (err) {
        console.log(err)
    })
});

db.sequelize.sync({force:true}).then(function () {
    app.listen(publicPort, function () {

        console.log("Listening on " + publicPort);

    });
})