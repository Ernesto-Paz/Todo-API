/* set up of sequelize database */
var Sequelize = require("sequelize");
var env = process.env.NODE_ENV || "development"
if (env === "production") {
var sequelize = new                               
    Sequelize(process.env.DATABASE_URL, {
        dialect: "postgres",
        logging:false
    });
} else {
    var sequelize = new Sequelize(undefined, undefined, undefined, {
        dialect: "sqlite",
        storage: __dirname + "/data/dev-todo-api.sqlite",
        logging:false
    });
}

var db = {};

db.todo = sequelize.import(__dirname + "/models/todo.js");
db.users = sequelize.import(__dirname + "/models/users.js");
db.token = sequelize.import(__dirname + "/models/token.js");
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.todo.belongsTo(db.users);
db.users.hasMany(db.todo);

module.exports = db;