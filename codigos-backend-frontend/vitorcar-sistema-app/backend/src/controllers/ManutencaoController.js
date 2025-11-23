const { Op } = require('sequelize');
const Manutencao = require('../models/Manutencao');
const Veiculo = require('../models/Veiculo');

const ManutencaoController = {
  async criar(req, res) {
    try {
      const { descricao, data_manutencao, custo, id_veiculo } = req.body;

      if (!descricao || !data_manutencao || custo === undefined || !id_veiculo) {
        return res.status(400).json({
          sucesso: false,
          mensagem:
            'Preencha todos os campos obrigatórios para registrar a manutenção (descricao, data_manutencao, custo, id_veiculo).'
        });
      }

      const veiculo = await Veiculo.findByPk(id_veiculo);

      if (!veiculo) {
        return res.status(404).json({
          sucesso: false,
          mensagem:
            'Veículo informado não foi localizado. Cadastre o veículo antes de registrar a manutenção.'
        });
      }

      const novaManutencao = await Manutencao.create({
        descricao,
        data_manutencao,
        custo,
        id_veiculo
      });

      return res.status(201).json({
        sucesso: true,
        mensagem: 'Manutenção registrada com sucesso para o veículo selecionado.',
        dados: novaManutencao
      });
    } catch (error) {
      return res.status(500).json({
        sucesso: false,
        mensagem: 'Não foi possível registrar a manutenção no momento.',
        erro: error.message
      });
    }
  },

  async listarTodas(req, res) {
    try {
      const { busca } = req.query;

      const filtros = {};

      if (busca) {
        const termo = `%${busca}%`;
        filtros[Op.or] = [
          { descricao:       { [Op.like]: termo } },
          { data_manutencao: { [Op.like]: termo } },
          { custo:           { [Op.like]: termo } }
        ];
      }

      const manutencoes = await Manutencao.findAll({
        where: filtros,
        order: [['id_manutencao', 'ASC']]
      });

      if (!manutencoes.length) {
        return res.status(200).json({
          sucesso: true,
          mensagem: 'Nenhuma manutenção registrada no sistema até o momento.',
          dados: []
        });
      }

      const idsVeiculos = [...new Set(manutencoes.map((m) => m.id_veiculo))];

      const veiculos = await Veiculo.findAll({
        where: {
          id_veiculo: {
            [Op.in]: idsVeiculos
          }
        }
      });

      const carrosConsertados = veiculos.map(
        (v) => `${v.modelo} (${v.placa})`
      );

      return res.status(200).json({
        sucesso: true,
        mensagem: `Carros consertados até o momento: ${carrosConsertados.join(', ')}.`,
        dados: manutencoes
      });
    } catch (error) {
      return res.status(500).json({
        sucesso: false,
        mensagem: 'Não foi possível carregar a lista de manutenções.',
        erro: error.message
      });
    }
  },

  async listarPorVeiculo(req, res) {
    try {
      const { id_veiculo } = req.params;

      const veiculo = await Veiculo.findByPk(id_veiculo);

      if (!veiculo) {
        return res.status(404).json({
          sucesso: false,
          mensagem: 'Veículo não localizado. Verifique o ID informado.'
        });
      }

      const manutencoes = await Manutencao.findAll({
        where: { id_veiculo },
        order: [['id_manutencao', 'ASC']]
      });

      return res.status(200).json({
        sucesso: true,
        mensagem: manutencoes.length
          ? `Histórico de manutenções para o veículo ${veiculo.modelo} (${veiculo.placa}) carregado com sucesso.`
          : `Nenhuma manutenção registrada para o veículo ${veiculo.modelo} (${veiculo.placa}) até o momento.`,
        dados: manutencoes
      });
    } catch (error) {
      return res.status(500).json({
        sucesso: false,
        mensagem:
          'Não foi possível carregar o histórico de manutenções para o veículo selecionado.',
        erro: error.message
      });
    }
  },

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;

      const manutencao = await Manutencao.findByPk(id);

      if (!manutencao) {
        return res.status(404).json({
          sucesso: false,
          mensagem: 'Manutenção não localizada. Verifique o ID informado.'
        });
      }

      return res.status(200).json({
        sucesso: true,
        mensagem: 'Manutenção encontrada com sucesso.',
        dados: manutencao
      });
    } catch (error) {
      return res.status(500).json({
        sucesso: false,
        mensagem: 'Não foi possível buscar a manutenção solicitada.',
        erro: error.message
      });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { descricao, data_manutencao, custo, id_veiculo } = req.body;

      const manutencao = await Manutencao.findByPk(id);

      if (!manutencao) {
        return res.status(404).json({
          sucesso: false,
          mensagem: 'Manutenção não localizada para atualização.'
        });
      }

      if (id_veiculo) {
        const veiculo = await Veiculo.findByPk(id_veiculo);
        if (!veiculo) {
          return res.status(404).json({
            sucesso: false,
            mensagem:
              'Veículo informado para vincular a manutenção não foi localizado.'
          });
        }
      }

      await manutencao.update({
        descricao,
        data_manutencao,
        custo,
        id_veiculo: id_veiculo || manutencao.id_veiculo
      });

      return res.status(200).json({
        sucesso: true,
        mensagem: 'Registro de manutenção atualizado com sucesso.',
        dados: manutencao
      });
    } catch (error) {
      return res.status(500).json({
        sucesso: false,
        mensagem: 'Não foi possível atualizar os dados da manutenção.',
        erro: error.message
      });
    }
  },

  async deletar(req, res) {
    try {
      const { id } = req.params;

      const manutencao = await Manutencao.findByPk(id);

      if (!manutencao) {
        return res.status(404).json({
          sucesso: false,
          mensagem: 'Manutenção não localizada para remoção.'
        });
      }

      await manutencao.destroy();

      return res.status(200).json({
        sucesso: true,
        mensagem: 'Manutenção removida com sucesso do sistema VitorCar.'
      });
    } catch (error) {
      return res.status(500).json({
        sucesso: false,
        mensagem: 'Não foi possível remover a manutenção no momento.',
        erro: error.message
      });
    }
  }
};

module.exports = ManutencaoController;
