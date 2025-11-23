const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Veiculo = sequelize.define(
  'Veiculo',
  {
    id_veiculo: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    modelo: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    marca: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    ano: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      validate: {
        min: 1900
      }
    },
    placa: {
      type: DataTypes.STRING(8),
      allowNull: false,
      unique: true
    },
    dono: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    data_cadastro: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: 'veiculo',
    timestamps: false
  }
);

module.exports = Veiculo;
