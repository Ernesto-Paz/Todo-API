var express = require("express");
var _ = require("underscore");
var bodyParser = require("body-parser");
var app = express();
var db = require("./db.js");
var publicPort = process.env.PORT || 3000;

var todoID = 1;

var todos = [
];

app.use(bodyParser.json());

app.get("/", function (req, res) {

    res.send("Todo app root directory.");

});

app.get("/todos", function (req, res) {
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
            todosArray.push(todo);
        })
    }).then(function () {
        console.log(where);
        if (todosArray.length == 0) {
            res.status(404);
            res.send("No entries found for given query.");
        }
        res.send(todosArray);
    })
});



//app GET
app.get("/todos/:id", function (req, res) {

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
app.post("/todos", function (req, res) {
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
app.post("/users", function (req, res) {
    var body = _.pick(req.body, "username", "email", "password");
    db.users.create({
        username: body.username,
        email: body.email,
        password:body.password
    }).then(function (userinfo) {
        res.send(userinfo);
    }).catch(function (e) {

            res.status(400);
            res.send(e);
        }

    );

});


//app DELETE
app.delete("/todos/:id", function (req, res) {
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
app.put("/todos/:id", function (req, res) {

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

db.sequelize.sync().then(function () {
    app.listen(publicPort, function () {

        console.log("Listening on " + publicPort);

    });
})