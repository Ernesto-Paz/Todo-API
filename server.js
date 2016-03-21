var express = require("express");
var _ = require("underscore");
var bodyParser = require("body-parser");
var app = express();

var publicPort = process.env.PORT || 3000 ;

var todoID = 1;

var todos = [
    
];

app.use(bodyParser.json());

app.get("/",function(req,res){

    res.send("Todo app root directory.");
    
});

app.get("/todos",function(req,res){

    res.json(todos);
    
});

app.get("/todos/:id",function(req,res){
    
var reqid = parseInt(req.params.id,10);
var matchingid = _.findWhere(todos,{id: reqid})

if(typeof matchingid !== "undefined")
{
 res.json (matchingid);
}
else{
 res.status(404).send();
}
});

app.post("/todos",function(req,res){
var body = _.pick(req.body,"description","completed");  
if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0 )
{
    res.status(400);
    res.send("Invalid data provided.");
}
else{   
body.id = todoID
todoID++
body.description = body.description.trim();
todos.push(body);
res.json(body);
}
});

app.delete("/todos/:id",function(req,res){
var reqid = parseInt(req.params.id,10);
var matchingid = _.findWhere(todos,{id: reqid});
if(typeof matchingid === "undefined"){
res.status(404);
res.send("Unable to delete, 404 not found.");
return
}
todos = _.without(todos,matchingid);
res.json(matchingid);
});
app.listen(publicPort, function(){

console.log("Listening on " + publicPort );

});
