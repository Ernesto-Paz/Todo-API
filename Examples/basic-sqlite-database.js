var Sequelize = require("sequelize");
var sequelize = new Sequelize(undefined, undefined, undefined, {
    "dialect": "sqlite",
    "storage": __dirname + "/basic-sqlite-database.sqlite"
});

var Todo = sequelize.define("todo", {
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [1, 256]
        }
    },
    completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

/* sequelize.sync returns a promise after it finishes .then runs which console logs that Sync is finished and runs a function to add an entry into the Todo database table. This returns a promise which logs that the insertion is finished and then logs the Todo database object that gets passed to it by the .create function. Finally, .catch catches any errors that occur in the chain. Any errors cause it to skip directly to the .catch and skip over code yet to be executed.
 */
sequelize.sync().then(function () {

    console.log("SQLite Synced.");
    return Todo.findAll({

        where: {
            description: {
                $like: "%valid%"
            }
        }
    });
    /*
       Todo.create({
       description:"A validated description."
       }).then(function(todo){
           console.log("Finished!");
           console.log(todo);
           return Todo.create({
               description:"Another awesome database entry."
           });
       }).then(function(todo){
       console.log("Finished second entry.");
       console.log(todo);
       
       }).then(function(){
           return Todo.findAll({
           where:{
               
           description:{
               $like: "%awesome%"
                  }
           }
       })
       
       }).then(function(todos){
       if(todos){
       todos.forEach(function(todo){
       console.log(todo.toJSON());  
       });
       }
       else{
       console.log("Nothing todo here!");
       }
       }).catch(function(err){
           console.log(err)
           console.log("Error with Todo insertion.")});*/
}).then(function (todo) {
    todo.forEach(function (todo) {
        console.log(todo.toJSON());
    })
});