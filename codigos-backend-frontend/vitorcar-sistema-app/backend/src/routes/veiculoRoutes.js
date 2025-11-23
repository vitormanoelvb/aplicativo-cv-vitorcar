const express = require('express');
const router = express.Router();
const VeiculoController = require('../controllers/VeiculoController');

router.post('/', VeiculoController.criar);
router.get('/', VeiculoController.listarTodos);
router.get('/:id', VeiculoController.buscarPorId);
router.put('/:id', VeiculoController.atualizar);
router.delete('/:id', VeiculoController.deletar);

module.exports = router;
