var Sequelize = require("sequelize");
var sequelize = new Sequelize(undefined, undefined, undefined, {
"dialect":"sqlite",
"storage":__dirname + "/basic-sqlite-database.sqlite"
});

var Todo = sequelize.define("todo",{
description:{ type: Sequelize.STRING
},
completed:{ type: Sequelize.BOOLEAN
}
});


sequelize.sync().then(function(){

    console.log("SQLite Synced.");

    Todo.create({
    description: "A valid description. Number 1.",
    completed: false
    
    }).then(function(Todo){
        console.log("Finished!");
        console.log(Todo);
    
    });
    
});