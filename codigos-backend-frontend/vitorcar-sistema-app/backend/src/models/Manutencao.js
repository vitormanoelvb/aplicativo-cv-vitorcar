const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Manutencao = sequelize.define(
  'Manutencao',
  {
    id_manutencao: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    descricao: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    data_manutencao: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    custo: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0
    },
    id_veiculo: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    data_cadastro: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: 'manutencao',
    timestamps: false
  }
);

module.exports = Manutencao;
