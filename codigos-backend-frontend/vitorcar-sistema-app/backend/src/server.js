require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./config/database');

const PORT = process.env.PORT || 3000;

function exibirAnimacaoInicial(port) {
  console.clear();

  const titulo = 'VitorCar - Sistema de Controle de Veículos e Manutenções';
  const barra = '='.repeat(titulo.length + 20);

  console.log(barra);
  console.log(`🚗  ${titulo}`);
  console.log(barra);
  console.log('');

  const passos = [
    'Iniciando servidor VitorCar...',
    'Carregando componentes principais da API...',
    'Preparando rotas de veículos...',
    'Preparando rotas de manutenções...',
    'Aplicando configurações e validações...',
    `Servidor ativo na porta ${port}.`,
    'VitorCar pronto para controlar veículos e manutenções. ✅'
  ];

  let index = 0;

  const interval = setInterval(() => {
    const prefixo = '============ ';
    if (index < passos.length) {
      console.log(prefixo + passos[index]);
      index++;
    } else {
      clearInterval(interval);
      console.log('');
      console.log(barra);
      console.log(`🔥 Endereço da porta do servidor: http://localhost:${port}/api 🌐`);
      console.log(barra);
      console.log('');
    }
  }, 200);
}

async function iniciarServidor() {
  try {
    await sequelize.authenticate();

    console.clear();
    console.log('===============================================');
    console.log('✅ Banco de dados conectado com sucesso (VCSCVM).');
    console.log('===============================================');

    setTimeout(() => {
      app.listen(PORT, () => {
        console.clear();
        exibirAnimacaoInicial(PORT);
      });
    }, 1000);
  } catch (error) {
    console.clear();
    console.log('❌ Banco de dados não conectado. Favor conectar para iniciar o servidor.');
    console.error('Detalhes:', error.message);
  }
}

iniciarServidor();
