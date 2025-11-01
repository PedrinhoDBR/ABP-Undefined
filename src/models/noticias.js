const { DataTypes } = require('sequelize');
const sequelize = require('../db/db').sequelize;

const Noticias = sequelize.define('noticias' , {
    NoticiasID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    NoticiasImagens: {
        type: DataTypes.STRING,
        allowNull: true
    },
    NoticiasData: {
        type: DataTypes.DATE,
        allowNull: true
    },
    NoticiasTitulo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    NoticiasSubtitulo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    NoticiasConteudo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    NoticiasCardcitacao: {
        type: DataTypes.STRING,
        allowNull: true
    },
    NoticiasIdioma: {
        type: DataTypes.STRING,
        allowNull: true
    }, 
    NoticiasTipo: {
        type: DataTypes.STRING,
        allowNull: true
    }
},
  {
    tableName: 'noticias',
    timestamps: true,
    paranoid: true

 });

 module.exports = Noticias;