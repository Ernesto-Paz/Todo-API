express = require("express");
app = express();

publicPort = process.env.PORT || 3000 ;

app.get("/",function(req,res){

res.send("Todo app root directory.");
    
});

app.listen(publicPort);
