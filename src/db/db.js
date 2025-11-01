
const dotenv = require("dotenv");
const { Sequelize } = require('sequelize');

dotenv.config();
console.log(process.env)
const sequelize = new Sequelize(
  process.env.BDNOME,
  process.env.BDUSUARIO,
  process.env.BDSENHA,
  {
    host: process.env.BDHOST,
    port: process.env.BDPORTA,
    dialect: 'postgres',
    logging: false 
  }
);
console.log(sequelize)
module.exports = { sequelize };

// EXEMPLO PRO .ENV
// PORTA = 3030
// BDUSUARIO = postgres
// BDHOST = localhost
// BDNOME = bdabp
// BDSENHA = 321
// BDPORTA = 5432
