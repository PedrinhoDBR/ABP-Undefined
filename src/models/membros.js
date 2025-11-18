const { DataTypes } = require('sequelize');
const sequelize = require('../db/db').sequelize;

const Membros = sequelize.define('membros', {
    MembrosID:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    MembrosNome: {
        type: DataTypes.STRING,
        allowNull: true
    },
    MembrosCargo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    MembrosImagem: {
        type: DataTypes.STRING,
        allowNull: true
    },
    MembrosDescricao: {
        type: DataTypes.STRING (2000),
        allowNull: true
    },
    MembrosLattes: {
        type: DataTypes.STRING,
        allowNull: true
    },
    MembrosVisibilidade: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
    },
    MembrosIdioma: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'membros',
    timestamps: true,
    paranoid: true
});

module.exports = Membros;