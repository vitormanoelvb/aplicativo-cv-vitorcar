const { sequelize } = require('../config/database');
const Veiculo = require('./Veiculo');
const Manutencao = require('./Manutencao');

Veiculo.hasMany(Manutencao, {
  foreignKey: 'id_veiculo',
  as: 'manutencoes'
});

Manutencao.belongsTo(Veiculo, {
  foreignKey: 'id_veiculo',
  as: 'veiculo'
});

module.exports = {
  sequelize,
  Veiculo,
  Manutencao
};
