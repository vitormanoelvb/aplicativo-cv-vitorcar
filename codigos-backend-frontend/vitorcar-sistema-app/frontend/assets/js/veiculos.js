let veiculoEditandoId = null;  

document.addEventListener("DOMContentLoaded", () => {
  carregarVeiculos();

  const formVeiculo = document.getElementById("form-veiculo");
  const btnCadastrar = document.getElementById("btn-cadastrar-veiculo");
  const btnAtualizar = document.getElementById("btn-atualizar-veiculo");
  const buscarForm = document.querySelector("form.vc-search-form");
  const tabela = document.getElementById("tabela-veiculos");
  const btnExcluirSection = document.getElementById("btn-excluir-veiculo");

  if (btnCadastrar) {
    btnCadastrar.addEventListener("click", (e) => {
      e.preventDefault();
      salvarVeiculo("create");
    });
  }

  if (btnAtualizar) {
    btnAtualizar.addEventListener("click", (e) => {
      e.preventDefault();
      salvarVeiculo("update");
    });
  }

  if (buscarForm) {
    buscarForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const termo = document.getElementById("buscar-veiculo").value.trim();
      buscarVeiculos(termo);
    });
  }

  if (tabela) {
    tabela.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;

      const id = btn.getAttribute("data-id");
      const action = btn.getAttribute("data-action");

      if (action === "editar") {
        carregarVeiculoParaEdicao(id);
      } else if (action === "excluir") {
        excluirVeiculo(id);
      }
    });
  }

  if (btnExcluirSection) {
    btnExcluirSection.addEventListener("click", (e) => {
      e.preventDefault();
      excluirViaFormulario();
    });
  }
});

function obterVeiculoDoFormulario() {
  return {
    modelo: document.getElementById("veiculo-modelo").value.trim(),
    marca: document.getElementById("veiculo-marca").value.trim(),
    ano: Number(document.getElementById("veiculo-ano").value),
    placa: document.getElementById("veiculo-placa").value.trim(),
    dono: document.getElementById("veiculo-dono").value.trim(),
    data_cadastro: document.getElementById("veiculo-data").value || null,
  };
}

async function salvarVeiculo(tipo) {
  const veiculo = obterVeiculoDoFormulario();

  if (!veiculo.modelo || !veiculo.marca || !veiculo.placa) {
    showMessage("Preencha pelo menos modelo, marca e placa.", "warning");
    return;
  }

  try {
    if (tipo === "create" || !veiculoEditandoId) {
      await apiRequest("/api/veiculos", {
        method: "POST",
        body: veiculo,
      });
      showMessage("Veículo cadastrado com sucesso!", "success");
    } else {
      await apiRequest(`/api/veiculos/${veiculoEditandoId}`, {
        method: "PUT",
        body: veiculo,
      });
      showMessage("Veículo atualizado com sucesso!", "success");
    }

    limparFormularioVeiculos();
    carregarVeiculos();
  } catch (error) {
    showMessage("Erro ao salvar veículo.", "danger");
  }
}

async function carregarVeiculos() {
  try {
    const resposta = await apiRequest("/api/veiculos");
    const dados = Array.isArray(resposta) ? resposta : (resposta.dados || []);
    preencherTabelaVeiculos(dados);
  } catch (error) {
    showMessage("Erro ao carregar veículos.", "danger");
  }
}

async function buscarVeiculos(termo) {
  try {
    const query = termo ? `?busca=${encodeURIComponent(termo)}` : "";
    const resposta = await apiRequest(`/api/veiculos${query}`);
    const dados = Array.isArray(resposta) ? resposta : (resposta.dados || []);
    preencherTabelaVeiculos(dados);
  } catch (error) {
    showMessage("Erro ao buscar veículos.", "danger");
  }
}

function preencherTabelaVeiculos(lista) {
  const tabela = document.getElementById("tabela-veiculos").querySelector("tbody");
  tabela.innerHTML = "";

  if (!lista || lista.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td colspan="7" class="text-center text-muted">
        Nenhum veículo encontrado.
      </td>`;
    tabela.appendChild(tr);
    return;
  }

  lista.forEach((v) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${v.id_veiculo}</td>
      <td>${v.modelo}</td>
      <td>${v.marca}</td>
      <td>${v.ano}</td>
      <td>${v.placa}</td>
      <td>${v.dono}</td>
      <td class="text-center">
        <button class="btn btn-sm btn-outline-warning me-2" data-action="editar" data-id="${v.id_veiculo}">
          <i class="bi bi-pencil-square"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" data-action="excluir" data-id="${v.id_veiculo}">
          <i class="bi bi-trash3"></i>
        </button>
      </td>
    `;
    tabela.appendChild(tr);
  });
}

async function carregarVeiculoParaEdicao(id) {
  try {
    const resposta = await apiRequest(`/api/veiculos/${id}`);
    const v = resposta.dados || (Array.isArray(resposta) ? resposta[0] : resposta);

    if (!v) {
      showMessage("Veículo não encontrado.", "warning");
      return;
    }

    document.getElementById("veiculo-id").value = v.id_veiculo;
    document.getElementById("veiculo-modelo").value = v.modelo;
    document.getElementById("veiculo-marca").value = v.marca;
    document.getElementById("veiculo-ano").value = v.ano;
    document.getElementById("veiculo-placa").value = v.placa;
    document.getElementById("veiculo-dono").value = v.dono;
    if (v.data_cadastro) {
      document.getElementById("veiculo-data").value = v.data_cadastro.slice(0, 16);
    }

    veiculoEditandoId = v.id_veiculo;
    showMessage("Veículo carregado para edição.", "info");
  } catch (error) {
    showMessage("Erro ao carregar veículo.", "danger");
  }
}

async function excluirVeiculo(id) {
  if (!confirm("Tem certeza que deseja excluir este veículo e suas manutenções?")) return;

  try {
    await apiRequest(`/api/veiculos/${id}`, { method: "DELETE" });
    showMessage("Veículo excluído com sucesso.", "success");
    carregarVeiculos();
  } catch (error) {
    showMessage("Erro ao excluir veículo.", "danger");
  }
}

async function excluirViaFormulario() {
  const id = document.getElementById("excluir-id-veiculo")?.value.trim();
  const placa = document.getElementById("excluir-placa-veiculo")?.value.trim();

  if (!id && !placa) {
    showMessage("Informe o ID ou a placa para excluir.", "warning");
    return;
  }

  if (!confirm("Confirma a exclusão do veículo informado?")) return;

  try {
    if (id) {
      await apiRequest(`/api/veiculos/${id}`, { method: "DELETE" });
    } else {
      const query = `?busca=${encodeURIComponent(placa)}`;
      const resposta = await apiRequest(`/api/veiculos${query}`);
      const lista = Array.isArray(resposta) ? resposta : (resposta.dados || []);
      const veiculo = lista.find(
        (v) => v.placa.toLowerCase() === placa.toLowerCase()
      );

      if (!veiculo) {
        showMessage("Nenhum veículo encontrado com essa placa.", "warning");
        return;
      }

      await apiRequest(`/api/veiculos/${veiculo.id_veiculo}`, { method: "DELETE" });
    }
    showMessage("Veículo excluído com sucesso.", "success");
    carregarVeiculos();
  } catch (error) {
    showMessage("Erro ao excluir veículo.", "danger");
  }
}

function limparFormularioVeiculos() { 
  const form = document.getElementById("form-veiculo");
  if (form) form.reset();
  document.getElementById("veiculo-id").value = "";
  veiculoEditandoId = null;
}
