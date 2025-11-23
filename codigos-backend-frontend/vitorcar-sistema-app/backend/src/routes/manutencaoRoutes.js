const express = require('express');
const router = express.Router();
const ManutencaoController = require('../controllers/ManutencaoController');

router.post('/', ManutencaoController.criar);
router.get('/', ManutencaoController.listarTodas);
router.get('/veiculo/:id_veiculo', ManutencaoController.listarPorVeiculo);
router.get('/:id', ManutencaoController.buscarPorId);
router.put('/:id', ManutencaoController.atualizar);
router.delete('/:id', ManutencaoController.deletar);

module.exports = router;
