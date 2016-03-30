var _ = require("underscore");
var bcrypt = require("bcrypt");
module.exports = function (sequelize, DataTypes) {
    return sequelize.define("users", {

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
        instanceMethods: {
            pickUserData: function () {

                var userdata = this.toJSON();

                return _.pick(userdata, "id", "email", "username", "createdAt", "updatedAt");

            }


        }


    })
};