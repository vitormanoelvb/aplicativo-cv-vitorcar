const express = require('express');
const router = express.Router();

const veiculoRoutes = require('./veiculoRoutes');
const manutencaoRoutes = require('./manutencaoRoutes');

router.use('/veiculos', veiculoRoutes);
router.use('/manutencoes', manutencaoRoutes);

module.exports = router;
