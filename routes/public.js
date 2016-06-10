module.exports = function(db, middleware){
var express = require("express");
var router = express.Router();

router.get("/login",function(req, res){
res.render("loginagain.pug");
}) 


return router
}