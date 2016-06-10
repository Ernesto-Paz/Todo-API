module.exports = function (db, middleware) {
    var express = require("express");
    var router = express.Router();
    
    router.get("/", middleware.requireAuth, function (req, res) {
        var todosArray = []
        var queryParams = _.pick(req.query, "completed", "q")
        var where = {
            userId: req.user.get("id")
        };
        if (queryParams.hasOwnProperty("completed")) {
            if (queryParams.completed === "true") {
                queryParams.completed = true;
            } else {
                queryParams.completed = false;
            }
            where.completed = queryParams.completed;
        }
        if (queryParams.hasOwnProperty("q") && _.isString(queryParams.q)) {
            where.description = {};
            where.description.$like = "%" + queryParams.q + "%";
        }
        db.todo.findAll({where:where}).then(function (todos) {
            todos.forEach(function (todo) {
                todosArray.push(todo);
            });
        }).then(function () {
            if (todosArray.length == 0) {
                res.status(404);
                res.send("No entries found for given query.");
                return
            }
            res.send(todosArray);
        })
    });

    router.get("/:id", middleware.requireAuth, function (req, res) {

        var reqId = parseInt(req.params.id, 10);
        var where = {
            where: {
                id: reqId,
                userId: req.user.get("id")
            }
        }
        db.todo.findOne(where).then(function (todo) {
            if (!!todo) {
                res.json(todo);
            } else {
                res.status(400);
                res.send("No todo with that Id found.");
            }
        })
    });

    router.post("/", middleware.requireAuth, function (req, res) {
        console.log("Posting todo");
        console.log("Before pick: ", req.body);
        var body = _.pick(req.body, "description", "completed");
        console.log("After pick: ", req.body);
        db.todo.create({
            description: body.description,
            completed: body.completed
        }).then(function (todo) {
            req.user.addTodo(todo).then(function () {
                return todo.reload();
            }).then(function (todo) {
                res.send(todo);
            })
        }).catch(function (e) {
                res.status(400);
                res.send("Whoops had an error! Contact the admin!");
                console.log(e);
            }

        );
    });

    router.delete("/:id", middleware.requireAuth, function (req, res) {
        var reqId = parseInt(req.params.id, 10);
        db.todo.findone({
            where: {
                id: reqId,
                userId: req.user.get("id")
            }
        }).then(function (foundtodo) {
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

    router.put("/:id", middleware.requireAuth, function (req, res) {

        var body = req.body;
        var reqId = parseInt(req.params.id, 10);
        db.todo.findOne({
            where: {
                id: reqId,
                userId: req.user.get("id")
            }
        }).then(function (foundtodo) {
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
    
    return router
}