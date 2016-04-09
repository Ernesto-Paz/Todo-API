
module.exports = function (db) {

    return {
        requireAuth: function (req, res, next) {
            var token = req.get("Authentication");
            console.log(db.users.authenticateUser);
            db.users.findByToken(token).then(function (user) {
                req.user = user;
                next();
            }, function (e) {
                res.status(401);
                res.send();
            });
        }
    };
}