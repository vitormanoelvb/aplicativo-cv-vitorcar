const { Op } = require('sequelize');

const Veiculo = require('../models/Veiculo'); 

const VeiculoController = {
  async criar(req, res) {
    try {
      const { modelo, marca, ano, placa, dono } = req.body;

      if (!modelo || !marca || !ano || !placa || !dono) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Preencha todos os campos obrigatórios para cadastrar o veículo (modelo, marca, ano, placa, dono).'
        });
      }

      const placaExistente = await Veiculo.findOne({ where: { placa } });

      if (placaExistente) {
        return res.status(409).json({
          sucesso: false,
          mensagem: 'Já existe um veículo cadastrado com esta placa no sistema VitorCar.'
        });
      }

      const novoVeiculo = await Veiculo.create({ modelo, marca, ano, placa, dono });

      return res.status(201).json({
        sucesso: true,
        mensagem: 'Veículo cadastrado com sucesso no sistema VitorCar.',
        dados: novoVeiculo
      });
    } catch (error) {
      return res.status(500).json({
        sucesso: false,
        mensagem: 'Não foi possível cadastrar o veículo no momento.',
        erro: error.message
      });
    }
  },

  async listarTodos(req, res) {
    try {
      
      const { busca } = req.query;

      const filtros = {};
      if (busca) {
        const termo = `%${busca}%`;
        filtros[Op.or] = [
          { modelo: { [Op.like]: termo } },
          { marca:  { [Op.like]: termo } },
          { placa:  { [Op.like]: termo } },
          { dono:   { [Op.like]: termo } }
        ];
      }

      const veiculos = await Veiculo.findAll({
        where: filtros,         
        order: [['id_veiculo', 'ASC']]
      });

      let mensagem;

      if (!veiculos.length) {
        mensagem = 'Nenhum veículo cadastrado no sistema até o momento.';
      } else {
        const listaVeiculos = veiculos.map(
          (v) => `${v.modelo} (${v.placa})`
        );
        mensagem = `Veículos cadastrados no sistema VitorCar: ${listaVeiculos.join(', ')}.`;
      }

      return res.status(200).json({
        sucesso: true,
        mensagem,
        dados: veiculos
      });
    } catch (error) {
      return res.status(500).json({
        sucesso: false,
        mensagem: 'Não foi possível carregar a lista de veículos.',
        erro: error.message
      });
    }
  },

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;

      const veiculo = await Veiculo.findByPk(id);

      if (!veiculo) {
        return res.status(404).json({
          sucesso: false,
          mensagem: 'Veículo não localizado. Verifique o ID informado.'
        });
      }

      return res.status(200).json({
        sucesso: true,
        mensagem: 'Veículo encontrado com sucesso.',
        dados: veiculo
      });
    } catch (error) {
      return res.status(500).json({
        sucesso: false,
        mensagem: 'Não foi possível buscar o veículo solicitado.',
        erro: error.message
      });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { modelo, marca, ano, placa, dono } = req.body;

      const veiculo = await Veiculo.findByPk(id);

      if (!veiculo) {
        return res.status(404).json({
          sucesso: false,
          mensagem: 'Veículo não localizado para atualização.'
        });
      }

      if (placa && placa !== veiculo.placa) {
        const placaExistente = await Veiculo.findOne({ where: { placa } });
        if (placaExistente) {
          return res.status(409).json({
            sucesso: false,
            mensagem: 'Não foi possível atualizar. Já existe outro veículo com esta placa.'
          });
        }
      }

      await veiculo.update({ modelo, marca, ano, placa, dono });

      return res.status(200).json({
        sucesso: true,
        mensagem: 'Dados do veículo atualizados com sucesso.',
        dados: veiculo
      });
    } catch (error) {
      return res.status(500).json({
        sucesso: false,
        mensagem: 'Não foi possível atualizar os dados do veículo.',
        erro: error.message
      });
    }
  },

  async deletar(req, res) {
    try {
      const { id } = req.params;

      const veiculo = await Veiculo.findByPk(id);

      if (!veiculo) {
        return res.status(404).json({
          sucesso: false,
          mensagem: 'Veículo não localizado para remoção.'
        });
      }

      await veiculo.destroy();

      return res.status(200).json({
        sucesso: true,
        mensagem: 'Veículo removido com sucesso do sistema VitorCar.'
      });
    } catch (error) {
      return res.status(500).json({
        sucesso: false,
        mensagem: 'Não foi possível remover o veículo no momento.',
        erro: error.message
      });
    }
  }
};

module.exports = VeiculoController;
