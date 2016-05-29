
module.exports = function (db, middleware) {
    var express = require("express");
    var router = express.Router();
    router.post("/", function (req, res) {

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
            var token = userdata.generateToken("Authentication");
            userInstance = userdata;
            return db.token.create({

                token: token

            })

        }).then(function (tokenInstance) {

            res.header("Authentication", tokenInstance.token)
            res.json(userInstance.pickUserData());

        }).catch(function (e) {
            if (e) {
                console.log("Error thrown in app.post /users/login")
                console.log(e);
            }
            res.status(401).send("Username or Password incorrect.");
        })
    });

    //app DELETE log out users by removing tokens from database

    router.delete("/login", middleware.requireAuth, function (req, res) {
        req.token.destroy().then(function () {
            res.status(204)
            res.send();
        }, function () {
            res.status(500);
            res.send();

        })

    })
    return router
}