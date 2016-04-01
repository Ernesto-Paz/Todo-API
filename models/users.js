var _ = require("underscore");
var bcrypt = require("bcrypt");
module.exports = function (sequelize, DataTypes) {
    var users = sequelize.define("users", {

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
                len: [4, 100]
            }
        },

        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                len: [3, 100]
            }
        },
        salt: {
            type: DataTypes.STRING

        },
        pwhash: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.VIRTUAL,
            allowNull: false,
            validate: {
                len: [7, 100]
            },
            set: function (pword) {
                //use async functions for production
                var salt = bcrypt.genSaltSync(10);
                var pwhash = bcrypt.hashSync(pword, salt);

                this.setDataValue("password", pword);
                this.setDataValue("pwhash", pwhash);
                this.setDataValue("salt", salt);
            }
        }
    }, {
        hooks: {
            beforeValidate: function (user, options) {
                if (typeof user.email !== "undefined" && _.isString(user.email)) {
                    user.email = user.email.toLowerCase();
                }
                if (typeof user.username !== "undefined" && _.isString(user.username)) {
                    user.username = user.username.toLowerCase();

                }

            }


        },

        classMethods: {
            authenticateUser: function (body) {
                return new Promise(function (resolve, reject) {
                        users.findOne({
                        where: {
                            username: body.username.toLowerCase()
                        }
                    }).then(function(useraccount) {
                        console.log(useraccount);
                        if (!useraccount) {
                            console.log("Account not found. " + body.username)
                            return reject();

                        }
                        if (bcrypt.compareSync(body.password, useraccount.get("pwhash"))) {

                            return resolve(useraccount.pickUserData());
                        } else {
                            console.log("Incorrect log in for " + body.username + " " + new Date().toString());
                            return reject();
                        }

                    }, function (e) {
                        return reject(e)
                    })


                })

            }

        },

        instanceMethods: {
            pickUserData: function () {

                var userdata = this.toJSON();

                return _.pick(userdata, "id", "email", "username", "createdAt", "updatedAt");

            }


        }


    })
    return users
};