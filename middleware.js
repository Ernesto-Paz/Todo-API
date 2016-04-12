var cryptojs = require("crypto-js");
module.exports = function (db) {

    return {
        requireAuth: function (req, res, next) {
            var token = req.get("Authentication") || "";
            
            
            console.log(db.users.authenticateUser);
            
            db.token.findOne({where:{
            tokenHash:cryptojs.MD5(token).toString()
            }}).then(function(foundToken){
            if(!foundToken){
            throw new Error("No token found.");
            }
            req.token = foundToken;
            return db.user.findByToken(token);   
            }).then(function (user) {
                req.user = user;
                next();
            }, function (e) {
                res.status(401);
                res.send();
            }).catch(function(){
            res.status(401);
            res.send();
            })
        }
    };
}