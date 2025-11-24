const { DataTypes } = require('sequelize');
const sequelize = require('../db/db').sequelize;

const Projetos = sequelize.define('projetos', {
    ProjetosId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'ProjetosId'
    },
    ProjetosTitulo: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'ProjetosTitulo'
    },
    ProjetosTituloCard: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'ProjetosTituloCard'
    },
    CardResumo: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'CardResumo'
    },
    ProjetoDescricao: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'ProjetoDescricao'
    },
    ImagemCarrossel: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'ImagemCarrossel'
    },
    ImagemCard: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'ImagemCard'
    },
    Informacoes: {
        type: DataTypes.JSONB,
        allowNull: true,
        field: 'Informacoes'
    },
    Ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'Ativo'
    },
    OrdemdeExibicao: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'OrdemdeExibicao'
    },
    ProjetosIdioma: {
        type: DataTypes.STRING,
        allowNull: true
    },
    CriadoEm: {
        type: DataTypes.DATE,
        field: 'CriadoEm'
    },
    AtualizadoEm: {
        type: DataTypes.DATE,
        field: 'AtualizadoEm'
    }
}, {
    tableName: 'projetos',
    timestamps: true,
    createdAt: 'CriadoEm',
    updatedAt: 'AtualizadoEm',
    freezeTableName: true
});

module.exports = Projetos;