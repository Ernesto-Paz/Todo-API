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
var User = sequelize.define("user", {
email: Sequelize.STRING
});
Todo.belongsTo(User);
User.hasMany(Todo);

sequelize.sync({}).then(function () {
User.findById(1).then(function(user){
user.getTodos().then(function(todo){
todo.forEach(function(todo){
console.log(todo.toJSON());
})
    
})
})
}); 