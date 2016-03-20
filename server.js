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

 for(i=0;i<todos.length;i++){
    if(reqid === todos[i].id)
    {
        res.send( todos[i] );
    }
 }

    res.status(404).send();
    
});

app.post("/todos",function(req,res){
    
var body = req.body;
body.id = todoID
todoID++
todos.push(body);
res.json(body);

});

app.listen(publicPort, function(){

console.log("Listening on " + publicPort );

});
