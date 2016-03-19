express = require("express");
app = express();

var publicPort = process.env.PORT || 3000 ;

var todos = [{
id: 1,
description: " The first thing I need to do.",
completed: false
},
{
id: 2,
description: " The second thing I need to do.",
completed: false
},
{
id: 3,
description: "The third thing I need to do.",
completed: true
}
];

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

app.listen(publicPort, function(){

console.log("Listening on " + publicPort );

});
