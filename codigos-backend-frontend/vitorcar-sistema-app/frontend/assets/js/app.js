const API_BASE_URL = "http://localhost:3000";

async function apiRequest(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;

  const config = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
    }

    if (response.status === 204) return true;

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    showMessage("Ocorreu um erro ao comunicar com o servidor.", "danger");
    throw error;
  }
}

function showMessage(text, type = "info") {
  let container = document.getElementById("vc-messages");
  if (!container) {
    container = document.createElement("div");
    container.id = "vc-messages";
    container.className = "position-fixed top-0 start-50 translate-middle-x mt-3";
    container.style.zIndex = "9999";
    document.body.appendChild(container);
  }

  const alert = document.createElement("div");
  alert.className = `alert alert-${type} py-2 px-3 mb-2`;
  alert.textContent = text;

  container.appendChild(alert);

  setTimeout(() => {
    alert.remove();
  }, 4000);
}
