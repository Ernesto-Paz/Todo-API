var cryptojs = require("crypto-js");
module.exports = function (db) {

    return {
        requireAuth: function (req, res, next) {
            console.log(req.cookies)
            var token = req.cookies.Authorization || "";
            console.log("Token Recieved");
            db.token.findOne({where:{
            tokenHash:cryptojs.MD5(token).toString()
            }}).then(function(foundToken){
            if(!foundToken){
            console.log("Token not found.")
            throw new Error("No token found.");
            }
            req.token = foundToken;
            return db.users.findByToken(token);   
            }).then(function (user) {
                console.log("Token found user authenticated.")
                req.user = user;
                next();
            }, function (e) {
                res.status(401);
                console.log(e.stack);
                res.send("No Token Found.");
            }).catch(function(){
            res.status(401);
            res.send("No Token Found.");
            })
        }
    };
}