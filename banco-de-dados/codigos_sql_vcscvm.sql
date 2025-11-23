CREATE DATABASE VCSCVM;

USE VCSCVM;

CREATE TABLE veiculo (
    id_veiculo INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    modelo VARCHAR(80) NOT NULL,
    marca VARCHAR(60) NOT NULL,
    ano SMALLINT UNSIGNED NOT NULL,
    placa VARCHAR(8) NOT NULL UNIQUE,
    dono VARCHAR(120) NOT NULL,
    data_cadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_ano_veiculo CHECK (ano >= 1900)
) ENGINE = InnoDB;

CREATE INDEX idx_veiculo_dono ON veiculo (dono);

CREATE TABLE manutencao (
    id_manutencao INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL,
    data_manutencao DATE NOT NULL,
    custo DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    id_veiculo INT UNSIGNED NOT NULL,
    data_cadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_manutencao_veiculo
        FOREIGN KEY (id_veiculo)
        REFERENCES veiculo (id_veiculo)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE INDEX idx_manutencao_id_veiculo ON manutencao (id_veiculo);

-- Codigos Uteis para Visualizar os Dados

SELECT * FROM veiculo;

SELECT * FROM manutencao;

SELECT 
  m.id_manutencao,
  m.descricao,
  m.data_manutencao,
  m.custo,
  v.id_veiculo,
  v.modelo,
  v.marca,
  v.placa,
  v.dono
FROM manutencao m
JOIN veiculo v ON m.id_veiculo = v.id_veiculo
ORDER BY m.id_manutencao;

SELECT 
  m.id_manutencao,
  m.descricao,
  m.data_manutencao,
  m.custo,
  v.modelo,
  v.placa
FROM manutencao m
JOIN veiculo v ON m.id_veiculo = v.id_veiculo
WHERE v.id_veiculo = 1
ORDER BY m.id_manutencao;

SELECT 
  v.id_veiculo,
  v.modelo,
  v.placa,
  SUM(m.custo) AS total_manutencoes
FROM veiculo v
LEFT JOIN manutencao m ON v.id_veiculo = m.id_veiculo
GROUP BY v.id_veiculo, v.modelo, v.placa
ORDER BY total_manutencoes DESC;


