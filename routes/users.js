
module.exports = function (db, middleware) {
    var express = require("express");
    var router = express.Router();
    // registers a new user
    router.post("/", function (req, res) {
        var body = _.pick(req.body, "username", "email", "password");
        if (_.isString(body.username) && _.isString(body.password) && _.isString(body.email)) {
            db.users.create({
                username: body.username,
                email: body.email,
                password: body.password
            }).then(function (userinfo) {
                
            //creates token using user info from freshly registered account.    
                
            db.users.authenticateUser(body).then(function (userdata) {
            var token = userdata.generateToken("Authorization");
            userInstance = userdata;
            return db.token.create({
                token: token
            })

        }).then(function (tokenInstance) {
                
            //sends cookie to the user.    
                
            res.cookie("Authorization", tokenInstance.token);
            res.redirect("/todolist");

        }).catch(function (e) {
            if (e) {
                console.log("Error thrown in app.post /users/login")
                console.log(e);
            }
            res.status(401).send("Username or Password incorrect.");
        })
            }).catch(function (e) {
                res.status(400);
                console.log(e);
                res.send("Database error, please contact the admin!");
            });
        } else {
            res.status(400);
            res.send("Invalid data recieved.");
        }
    });
    //logs in registered users
    router.post("/login", function (req, res) {
        var body = _.pick(req.body, "username", "password");
        var userInstance
        db.users.authenticateUser(body).then(function (userdata) {
            var token = userdata.generateToken("Authorization");
            userInstance = userdata;
            return db.token.create({

                token: token

            })

        }).then(function (tokenInstance) {
            res.cookie("Authorization", tokenInstance.token);
            res.redirect("/todolist");

        }).catch(function (e) {
            if (e) {
                console.log("Error thrown in app.post /users/login")
                console.log(e.stack);
            }
            res.redirect("/public/login");
        })
    });

    //app DELETE log out users by removing tokens from database

    router.delete("/login", middleware.requireAuth, function (req, res) {
        req.token.destroy().then(function () {
            res.status(204)
            res.clearCookie("Authorization");
            res.send();
        }, function () {
            res.status(500);
            res.send();

        })

    })
    return router
}