const { DataTypes } = require('sequelize');
const sequelize = require('../db/db').sequelize;

const Users = sequelize.define('user', {
    UsersID:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    MembrosName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    UsersPassword: {
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