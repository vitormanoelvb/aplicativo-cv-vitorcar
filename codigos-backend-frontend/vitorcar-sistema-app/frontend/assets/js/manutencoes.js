let manutencaoEditandoId = null;

document.addEventListener("DOMContentLoaded", () => {
  carregarManutencoes();

  const btnRegistrar = document.getElementById("btn-registrar-manutencao");
  const btnAtualizar = document.getElementById("btn-atualizar-manutencao");
  const btnExcluir = document.getElementById("btn-excluir-manutencao");
  const tabela = document.getElementById("tabela-manutencoes");
  const formBusca = document.querySelector(".vc-search-form");

  if (btnRegistrar) {
    btnRegistrar.addEventListener("click", (e) => {
      e.preventDefault();
      salvarManutencao("create");
    });
  }

  if (btnAtualizar) {
    btnAtualizar.addEventListener("click", (e) => {
      e.preventDefault();
      salvarManutencao("update");
    });
  }

  if (btnExcluir) {
    btnExcluir.addEventListener("click", (e) => {
      e.preventDefault();
      excluirManutencaoPorFormulario();
    });
  }

  if (formBusca) {
    formBusca.addEventListener("submit", (e) => {
      e.preventDefault();
      const termo = document.getElementById("buscar-manutencao").value.trim();
      buscarManutencoes(termo);
    });
  }

  if (tabela) {
    tabela.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;

      const id = btn.getAttribute("data-id");
      const action = btn.getAttribute("data-action");

      if (action === "editar") {
        carregarManutencaoParaEdicao(id);
      } else if (action === "excluir") {
        excluirManutencao(id);
      }
    });
  }
});

function obterManutencaoDoFormulario() {
  const idVeiculo = Number(
    document.getElementById("manutencao-id-veiculo").value
  );

  const descricao = document
    .getElementById("manutencao-descricao")
    .value.trim();

  const dataValor = document.getElementById("manutencao-data").value;

  const custoTexto = document
    .getElementById("manutencao-custo")
    .value.replace(/\./g, "")
    .replace(",", ".");
  const custoNumero = custoTexto ? Number(custoTexto) : 0;

  return {
    id_veiculo: idVeiculo,
    descricao,
    data_manutencao: dataValor || null,
    custo: custoNumero, 
  };
}

async function salvarManutencao(tipo) {
  const m = obterManutencaoDoFormulario();

  if (!m.id_veiculo || !m.descricao) {
    showMessage("Informe o veículo e a descrição da manutenção.", "warning");
    return;
  }

  try {
    if (tipo === "create" || !manutencaoEditandoId) {
      await apiRequest("/api/manutencoes", {
        method: "POST",
        body: m,
      });
      showMessage("Manutenção registrada com sucesso!", "success");
    } else {
      await apiRequest(`/api/manutencoes/${manutencaoEditandoId}`, {
        method: "PUT",
        body: m,
      });
      showMessage("Manutenção atualizada com sucesso!", "success");
    }

    limparFormularioManutencao();
    carregarManutencoes();
  } catch (error) {}
}

async function carregarManutencoes() {
  try {
    const resposta = await apiRequest("/api/manutencoes");
    const dados = Array.isArray(resposta) ? resposta : resposta.dados || [];
    preencherTabelaManutencoes(dados);
  } catch (error) {}
}

async function buscarManutencoes(termo) {
  try {
    const query = termo ? `?busca=${encodeURIComponent(termo)}` : "";
    const resposta = await apiRequest(`/api/manutencoes${query}`);
    const dados = Array.isArray(resposta) ? resposta : resposta.dados || [];
    preencherTabelaManutencoes(dados);
  } catch (error) {}
}

function preencherTabelaManutencoes(lista) {
  const tbody = document
    .getElementById("tabela-manutencoes")
    .querySelector("tbody");
  tbody.innerHTML = "";

  if (!lista || lista.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td colspan="6" class="text-center text-muted">
        Nenhuma manutenção encontrada.
      </td>`;
    tbody.appendChild(tr);
    return;
  }

  lista.forEach((m) => {
    const custoEmReais = Number(m.custo || 0) / 100;
    const custoFormatado = custoEmReais.toFixed(2);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${m.id_manutencao}</td>
      <td>${m.id_veiculo}</td>
      <td>${m.descricao}</td>
      <td>${m.data_manutencao}</td>
      <td>${custoFormatado}</td>
      <td class="text-center">
        <button class="btn btn-sm btn-outline-warning me-2" data-action="editar" data-id="${m.id_manutencao}">
          <i class="bi bi-pencil-square"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" data-action="excluir" data-id="${m.id_manutencao}">
          <i class="bi bi-trash3"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function carregarManutencaoParaEdicao(id) {
  try {
    const resposta = await apiRequest(`/api/manutencoes/${id}`);
    const m =
      resposta.dados || (Array.isArray(resposta) ? resposta[0] : resposta);

    if (!m) {
      showMessage("Manutenção não encontrada.", "warning");
      return;
    }

    document.getElementById("manutencao-id").value = m.id_manutencao;
    document.getElementById("manutencao-id-veiculo").value = m.id_veiculo;
    document.getElementById("manutencao-descricao").value = m.descricao;

    if (m.data_manutencao) {
      let valorInput;

      if (m.data_manutencao.includes("T")) {
        valorInput = m.data_manutencao.slice(0, 16);
      } else {
        const soData = m.data_manutencao.slice(0, 10);
        const soHora =
          m.data_manutencao.length >= 16
            ? m.data_manutencao.slice(11, 16)
            : "00:00";
        valorInput = `${soData}T${soHora}`;
      }

      document.getElementById("manutencao-data").value = valorInput;
    }

    const custoEmReais = Number(m.custo || 0) / 100;
    document.getElementById("manutencao-custo").value = custoEmReais.toFixed(2);
 
    manutencaoEditandoId = m.id_manutencao;
    showMessage("Manutenção carregada para edição.", "info");
  } catch (error) {}
}

async function excluirManutencao(id) {
  if (!confirm("Tem certeza que deseja excluir esta manutenção?")) return;

  try {
    await apiRequest(`/api/manutencoes/${id}`, { method: "DELETE" });
    showMessage("Manutenção excluída com sucesso.", "success");
    carregarManutencoes();
  } catch (error) {}
}

async function excluirManutencaoPorFormulario() {
  const id = document.getElementById("excluir-id-manutencao")?.value.trim();
  const idVeiculo = document.getElementById("excluir-id-veiculo")?.value.trim();

  if (!id && !idVeiculo) {
    showMessage(
      "Informe o ID da manutenção ou o ID do veículo para excluir.",
      "warning"
    );
    return;
  }

  if (!confirm("Confirma a exclusão?")) return;

  try {
    if (id) {
      await apiRequest(`/api/manutencoes/${id}`, { method: "DELETE" });
    } else {
      const resposta = await apiRequest(
        `/api/manutencoes/veiculo/${idVeiculo}`
      );
      const lista = Array.isArray(resposta) ? resposta : resposta.dados || [];

      if (!lista || lista.length === 0) {
        showMessage("Nenhuma manutenção encontrada para este veículo.", "warning");
        return;
      }

      for (const m of lista) {
        await apiRequest(`/api/manutencoes/${m.id_manutencao}`, {
          method: "DELETE",
        });
      }
    }
    showMessage("Manutenções excluídas com sucesso.", "success");
    carregarManutencoes();
  } catch (error) {}
}

function limparFormularioManutencao() {
  const form = document.getElementById("form-manutencao");
  if (form) form.reset();
  document.getElementById("manutencao-id").value = "";
  manutencaoEditandoId = null;
}
