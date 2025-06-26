let editandoIndex = null; // Usado para saber se estamos editando

function verificarLogin() {
  const usuario = localStorage.getItem('usuarioLogado');
  if (!usuario) {
    alert('Você precisa estar logado.');
    window.location.href = 'login.html';
  }
}

function logout() {
  localStorage.removeItem('usuarioLogado');
  window.location.href = 'login.html';
}

function salvarMaterial(material) {
  const materiais = JSON.parse(localStorage.getItem('materiais')) || [];
  materiais.push(material);
  localStorage.setItem('materiais', JSON.stringify(materiais));
}

function carregarMateriais() {
  const materiais = JSON.parse(localStorage.getItem('materiais')) || [];
  const tbody = document.querySelector('#tabelaMateriais tbody');
  tbody.innerHTML = '';

  materiais.forEach((mat, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${mat.nome}</td>
      <td>${mat.categoria}</td>
      <td>${mat.quantidade}</td>
      <td>${mat.unidade}</td>
      <td>
        <button onclick="prepararEdicao(${index})">Editar</button>
        <button onclick="removerMaterial(${index})">Remover</button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  atualizarSelectMateriais();
}


function removerMaterial(index) {
  const materiais = JSON.parse(localStorage.getItem('materiais')) || [];
  materiais.splice(index, 1);
  localStorage.setItem('materiais', JSON.stringify(materiais));
  carregarMateriais();
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formMaterial');
  if (form) {
    form.addEventListener('submit', (e) => {
			e.preventDefault();
			const material = {
				nome: document.getElementById('nome').value,
				categoria: document.getElementById('categoria').value,
				quantidade: document.getElementById('quantidade').value,
				unidade: document.getElementById('unidade').value
			};

			const materiais = JSON.parse(localStorage.getItem('materiais')) || [];

			if (editandoIndex !== null) {
				materiais[editandoIndex] = material;
				editandoIndex = null;
			} else {
				materiais.push(material);
			}

			localStorage.setItem('materiais', JSON.stringify(materiais));
			form.reset();
			carregarMateriais();
		});
  }
});

function atualizarSelectMateriais() {
  const materiais = JSON.parse(localStorage.getItem('materiais')) || [];
  const select = document.getElementById('materialSelect');
  if (!select) return;
  select.innerHTML = '';
  materiais.forEach((mat, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `${mat.nome} (${mat.quantidade} ${mat.unidade})`;
    select.appendChild(option);
  });
}

function movimentarMaterial(index, quantidade, tipo) {
  const materiais = JSON.parse(localStorage.getItem('materiais')) || [];
  if (!materiais[index]) return;

  let qtdAtual = parseInt(materiais[index].quantidade);
  quantidade = parseInt(quantidade);

  if (tipo === 'saida' && quantidade > qtdAtual) {
    alert('Quantidade insuficiente no estoque!');
    return;
  }

  materiais[index].quantidade = tipo === 'entrada'
    ? qtdAtual + quantidade
    : qtdAtual - quantidade;

  localStorage.setItem('materiais', JSON.stringify(materiais));

  // Registrar histórico
  registrarHistorico(materiais[index].nome, tipo, quantidade);

  carregarMateriais();
  atualizarSelectMateriais();
  carregarHistorico();
}


document.addEventListener('DOMContentLoaded', () => {
  const formMov = document.getElementById('formMovimentacao');
  
  if (formMov) {
    formMov.addEventListener('submit', (e) => {
      e.preventDefault();
      const index = document.getElementById('materialSelect').value;
      const quantidade = document.getElementById('qtdMovimentada').value;
      const tipo = document.getElementById('tipoMovimentacao').value;
      movimentarMaterial(index, quantidade, tipo);
      formMov.reset();
    });

    atualizarSelectMateriais();
  }

  carregarHistorico();
});


function prepararEdicao(index) {
  const materiais = JSON.parse(localStorage.getItem('materiais')) || [];
  const mat = materiais[index];
  document.getElementById('nome').value = mat.nome;
  document.getElementById('categoria').value = mat.categoria;
  document.getElementById('quantidade').value = mat.quantidade;
  document.getElementById('unidade').value = mat.unidade;
  editandoIndex = index;
}

function registrarHistorico(nome, tipo, quantidade) {
  const historico = JSON.parse(localStorage.getItem('historico')) || [];
  historico.unshift({
    data: new Date().toLocaleString(),
    nome,
    tipo,
    quantidade
  });
  localStorage.setItem('historico', JSON.stringify(historico));
  carregarHistorico();
}

function carregarHistorico() {
  const historico = JSON.parse(localStorage.getItem('historico')) || [];
  const tbody = document.querySelector('#tabelaHistorico tbody');
  tbody.innerHTML = '';
  historico.forEach(entry => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${entry.data}</td>
      <td>${entry.nome}</td>
      <td>${entry.tipo}</td>
      <td>${entry.quantidade}</td>
    `;
    tbody.appendChild(tr);
  });
}
