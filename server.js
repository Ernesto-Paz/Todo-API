var express = require("express");
var _ = require("underscore");
var bodyParser = require("body-parser");
var app = express();

var publicPort = process.env.PORT || 3000;

var todoID = 1;

var todos = [

];

app.use(bodyParser.json());

app.get("/", function (req, res) {

    res.send("Todo app root directory.");

});

app.get("/todos", function (req, res) {
    var filteredTodos = todos
    var queryParams = _.pick(req.query, "completed", "q")
    if (queryParams.hasOwnProperty("completed") && queryParams.completed === "true") {
        queryParams.completed = true;
        filteredTodos = _.where(filteredTodos, {
            completed: queryParams.completed
        });
    } else if (queryParams.hasOwnProperty("completed") && queryParams.completed === "false") {
        queryParams.completed = false;
        filteredTodos = _.where(filteredTodos, {
            completed: queryParams.completed
        });
    } else if (queryParams.hasOwnProperty("completed")) {
        res.status(400).send("Error bad data.");
        return
    }

    if (queryParams.hasOwnProperty("q") && !_.isString(queryParams.q)) {
        res.status(400).send("Error bad data.");
        return

    } else if (queryParams.hasOwnProperty("q")) {
        filteredTodos = _.filter(filteredTodos, function (str) {
            return str.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) != -1
        });
        if (filteredTodos.length == 0) {
            res.status(404);
            res.send("No results found.");
        }
    }

    res.json(filteredTodos);
});



//app GET
app.get("/todos/:id", function (req, res) {

    var reqid = parseInt(req.params.id, 10);
    var matchingid = _.findWhere(todos, {
        id: reqid
    })

    if (typeof matchingid !== "undefined") {
        res.json(matchingid);
    } else {
        res.status(404).send();
    }
});



//app POST
app.post("/todos", function (req, res) {
    var body = _.pick(req.body, "description", "completed");
    if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
        res.status(400);
        res.send("Invalid data provided.");
    } else {
        body.id = todoID
        todoID++
        body.description = body.description.trim();
        todos.push(body);
        res.json(body);
    }
});


//app DELETE
app.delete("/todos/:id", function (req, res) {
    var reqid = parseInt(req.params.id, 10);
    var matchingid = _.findWhere(todos, {
        id: reqid
    });
    if (typeof matchingid === "undefined") {
        res.status(404);
        res.send("Unable to delete, 404 not found.");
        return
    }

    todos = _.without(todos, matchingid);
    res.json(matchingid);
});



//app PUT
app.put("/todos/:id", function (req, res) {

    var body = req.body;
    var reqid = parseInt(req.params.id, 10);
    var matchingid = _.findWhere(todos, {
        id: reqid
    });
    var validatedobj = {};

    if (body.hasOwnProperty("completed") && _.isBoolean(body.completed)) {
        validatedobj.completed = body.completed;
    } else if (body.hasOwnProperty(completed)) {
        return res.status(400).send("Recieved bad data in completed field.");
    }
    if (body.hasOwnProperty("description") && _.isString(body.description) && body.description.trim().length > 0) {
        validatedobj.description = body.description;
    } else if (body.hasOwnProperty(description)) {
        return res.status(400).send("Recieved bad data in description field.");
    }
    _.extend(matchingid, validatedobj);
    res.json(matchingid);

});



app.listen(publicPort, function () {

    console.log("Listening on " + publicPort);

});