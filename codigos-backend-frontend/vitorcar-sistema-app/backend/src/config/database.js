const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'VCSCVM',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'VitM@15045x20y',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3307,
    dialect: 'mysql',
    logging: false
  }
);

module.exports = { sequelize };
