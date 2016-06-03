module.exports = function (db, middleware) {
    var express = require("express");
    var router = express.Router();
router.use(middleware.requireAuth);
router.get("/", function(req, res){
console.log(req.user);
res.render("userhome.pug")

})    
    
    
return router
}