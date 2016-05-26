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

//set up views engine and tells express where to find views
app.set("view engine", "pug");
app.set("views", "./views");

//set up bodyParser Middleware
app.use(bodyParser.json());

app.get("/", function (req, res) {

res.render("index.pug");

});
//GET all todos belonging to currently logged in user
app.get("/todos", middleware.requireAuth, function (req, res) {
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
    db.todo.findAll(where).then(function (todos) {
        todos.forEach(function (todo) {
            console.log(todo);
            todosArray.push(todo);
        });
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



//app GET gets todo of specific id belonging to user
app.get("/todos/:id", middleware.requireAuth, function (req, res) {

    var reqId = parseInt(req.params.id, 10);
    var where = {
    where:{
    id: reqId,
    userId:req.user.get("id")
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



//app POST todos creates new todos for users

app.post("/todos", middleware.requireAuth, function (req, res) {
    var body = _.pick(req.body, "description", "completed");
    db.todo.create({
        description: body.description,
        completed: body.completed
    }).then(function (todo) {
        req.user.addTodo(todo).then(function(){ 
        return todo.reload();
        }).then(function(todo){
        res.send(todo);
        })
    }).catch(function (e) {
            res.status(400);
            res.send(e);
        }

    );
});

// app POST users creates new user accounts
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
//logs in registered users
app.post("/users/login", function (req, res) {
    var body = _.pick(req.body, "username", "password");
    var userInstance
    db.users.authenticateUser(body).then(function(userdata){
    var token = userdata.generateToken("Authentication");
    userInstance = userdata;
    return db.token.create({
        
    token:token
        
    })
    
    }).then(function(tokenInstance){
        
    res.header("Authentication", tokenInstance)
    res.json(userInstance.pickUserData());
        
    }).catch(function(e){
    if(e){
    console.log(e);
    }
    res.status(401).send("Username or Password incorrect.");
    })
    });


//app DELETE deletes existing todos
app.delete("/todos/:id", middleware.requireAuth, function (req, res) {
    var reqId = parseInt(req.params.id, 10);
    db.todo.findone({where:{
    id: reqId,
    userId: req.user.get("id")
    }}).then(function (foundtodo) {
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

//app DELETE log out users by removing tokens from database

app.delete("/users/login", middleware.requireAuth, function(req,res){
req.token.destroy().then(function(){
res.status(204)
res.send();
},function(){
res.status(500);
res.send();
    
})

})


//app PUT updates existing todos
app.put("/todos/:id", middleware.requireAuth, function (req, res) {

    var body = req.body;
    var reqId = parseInt(req.params.id, 10);
    db.todo.findOne({where:{
    id:reqId,
    userId:req.user.get("id")
    }}).then(function (foundtodo) {
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
});