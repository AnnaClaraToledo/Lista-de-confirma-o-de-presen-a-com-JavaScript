const form = document.getElementById("rsvpForm");
const lista = document.getElementById("lista");
const resumo = document.getElementById("resumo");
const presencaSelect = document.getElementById("presenca");
const acompanhantesInput = document.getElementById("acompanhantes");

const STORAGE_KEY = "rsvp_entries_v1";

// Carregar e salvar
function loadEntries() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveEntries(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

let entries = loadEntries();

// Adicionar item na lista
function addItem(entry, index) {
  const li = document.createElement("li");
  li.textContent = `${entry.nome} — ${entry.presenca} — ${entry.acompanhantes} acompanhante(s) `;

  // Adiciona classes para estilização condicional (CSS)
  li.classList.add(entry.presenca === "Sim" ? "confirmado" : "negado");

  const btn = document.createElement("button");
  btn.textContent = "remover";
  btn.style.marginLeft = "8px";

  // Adiciona um rótulo de acessibilidade para leitores de tela
  btn.ariaLabel = `Remover a confirmação de ${entry.nome}`;

  btn.addEventListener("click", () => {
    entries.splice(index, 1);
    saveEntries(entries);
    renderAll();
  });

  li.appendChild(btn);
  lista.appendChild(li);
}

// Mostrar todos
function renderAll() {
  lista.innerHTML = "";
  entries.forEach((e, i) => addItem(e, i));
  updateResumo();
}

// Atualizar resumo
function updateResumo() {
  const sim = entries.filter(e => e.presenca === "Sim");
  const nao = entries.filter(e => e.presenca === "Não");
  const acomp = sim.reduce((acc, e) => acc + Number(e.acompanhantes || 0), 0);
  resumo.textContent = `Vão: ${sim.length} | Não vão: ${nao.length} | Acompanhantes: ${acomp}`;
}

// Evento de envio
form.addEventListener("submit", function(e) {
  e.preventDefault();
  const nome = document.getElementById("nome").value.trim();
  const presenca = document.getElementById("presenca").value;
  let acompanhantes = Number(document.getElementById("acompanhantes").value || 0);

  if (presenca === "Não") {
    acompanhantes = 0;
  }

  if (!nome) return alert("Informe o nome");

  const nomeJaExiste = entries.some(entry => entry.nome.toLowerCase() === nome.toLowerCase());
  if (nomeJaExiste) {
    return alert("Este nome já foi adicionado à lista.");
  }

  entries.push({ nome, presenca, acompanhantes });
  saveEntries(entries);
  renderAll();
  
  form.reset(); 

  if (presencaSelect.value === "Sim") {
     acompanhantesInput.style.display = "block";
  } else {
     acompanhantesInput.style.display = "none";
  }
});

// Esconde ou mostra o campo de acompanhantes
presencaSelect.addEventListener("change", () => {
  if (presencaSelect.value === "Não") {
    acompanhantesInput.style.display = "none";
    acompanhantesInput.value = 0;
  } else {
    acompanhantesInput.style.display = "block";
  }
});

function setInitialAcompanhantesVisibility() {
    if (presencaSelect.value === 'Não') {
        acompanhantesInput.style.display = 'none';
    } else {
        acompanhantesInput.style.display = 'block';
    }
}

// Inicializar
setInitialAcompanhantesVisibility();
renderAll();