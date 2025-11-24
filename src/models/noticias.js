const { DataTypes } = require('sequelize');
const sequelize = require('../db/db').sequelize;

const Noticias = sequelize.define('noticias', {
    NoticiasID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    NoticiasImagem: {
        type: DataTypes.STRING(1000),
        allowNull: true
    },
    NoticiasData: {
        type: DataTypes.DATE,
        allowNull: true
    },
    NoticiasTitulo: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    NoticiasSubtitulo: {
        type: DataTypes.STRING(1000),
        allowNull: true
    },
    NoticiasConteudo: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    NoticiasCardcitacao: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    NoticiasConteudoPosCitacao: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    NoticiasTituloCorpo: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    NoticiasConteudoTituloCorpo: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    NoticiasIdioma: {
        type: DataTypes.STRING(10),
        allowNull: true
    }
}, {
    tableName: 'noticias',
    timestamps: true,
    paranoid: true
});

module.exports = Noticias;