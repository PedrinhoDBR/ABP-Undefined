const { DataTypes } = require('sequelize');
const sequelize = require('../db/db').sequelize;

const Publicacao = sequelize.define('publicacao', {
    PublicacaoID:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    PublicacaoImagem: {
        type: DataTypes.STRING(1000),
        allowNull: true
    },
    PublicacaoTitulo: {
        type: DataTypes.STRING(1000),
        allowNull: true
    },
    PublicacaoLinkExterno: {
        type: DataTypes.STRING(1000),
        allowNull: true
    },
    PublicacaoCitacao: {
        type: DataTypes.STRING(2000),
        allowNull: true
    },
    PublicacaoAno: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    PublicacaoIdioma: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'publicacao',
    timestamps: true,
    paranoid: true
});

module.exports = Publicacao;