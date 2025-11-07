const { DataTypes } = require('sequelize');
const sequelize = require('../db/db').sequelize;

const Users = sequelize.define('user', {
    UserID:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    UserName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    UserPassword: {
        type: DataTypes.STRING,
        password: true,
        allowNull: true
    }
}, {
    tableName: 'user',
    timestamps: true,
    paranoid: true
});

module.exports = Users;