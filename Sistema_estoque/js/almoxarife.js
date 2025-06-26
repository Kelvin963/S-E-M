import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc, getDoc, query, where
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import {
  getAuth, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCGnam76YFSvlMWDJg3i7VoIGiXegKciTc",
  authDomain: "fir-e-m-4926f.firebaseapp.com",
  projectId: "fir-e-m-4926f",
  storageBucket: "fir-e-m-4926f.firebasestorage.app",
  messagingSenderId: "296773921591",
  appId: "1:296773921591:web:a6c39fb8ef30c18be848b2",
  measurementId: "G-HR35PY73YT"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let editandoId = null;

onAuthStateChanged(auth, (user) => {
  if (!user) {
    alert("Você precisa estar logado.");
    window.location.href = "login.html";
    return;
  }

  const tipo = JSON.parse(localStorage.getItem("usuarioLogado"))?.tipo;
  if (tipo !== "almoxarife") {
    alert("Acesso negado.");
    window.location.href = "login.html";
    return;
  }

  carregarMateriais();
  carregarOpcoesSelect();
  carregarHistorico();
  carregarRequisicoesPendentes();
});

async function carregarMateriais() {
  const tbody = document.querySelector("#tabelaMateriais tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  const snapshot = await getDocs(collection(db, "materiais"));
  snapshot.forEach((docSnap) => {
    const mat = docSnap.data();
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${mat.nome}</td>
      <td>${mat.categoria}</td>
      <td>${mat.quantidade}</td>
      <td>${mat.unidade}</td>
      <td>
        <button class="btn-editar" data-id="${docSnap.id}" data-mat='${JSON.stringify(mat)}'>Editar</button>
        <button onclick="remover('${docSnap.id}')">Remover</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.querySelectorAll('.btn-editar').forEach(btn => {
    btn.addEventListener('click', () => {
      const mat = JSON.parse(btn.dataset.mat);
      editar(btn.dataset.id, mat);
    });
  });
}

document.getElementById("formMaterial").addEventListener("submit", async (e) => {
  e.preventDefault();
  const material = {
    nome: document.getElementById("nome").value,
    categoria: document.getElementById("categoria").value,
    quantidade: parseInt(document.getElementById("quantidade").value),
    unidade: document.getElementById("unidade").value,
    minimo: parseInt(document.getElementById("estoqueMinimo").value)
  };

  if (editandoId) {
    await updateDoc(doc(db, "materiais", editandoId), material);
    await registrarHistoricoFirestore(material.nome, "edicao", 0);
    editandoId = null;
  } else {
    await addDoc(collection(db, "materiais"), material);
    await registrarHistoricoFirestore(material.nome, "cadastro", material.quantidade);
  }

  e.target.reset();
  carregarMateriais();
  carregarOpcoesSelect();
});

window.editar = (id, mat) => {
  editandoId = id;
  document.getElementById("nome").value = mat.nome;
  document.getElementById("categoria").value = mat.categoria;
  document.getElementById("quantidade").value = mat.quantidade;
  document.getElementById("unidade").value = mat.unidade;
  document.getElementById("estoqueMinimo").value = mat.minimo || "";
  document.getElementById("menuPrincipal").style.display = "none";
  document.querySelectorAll(".secao").forEach(secao => secao.style.display = "none");
  document.getElementById("secaoCadastro").style.display = "block";
};

window.remover = async (id) => {
  const ref = doc(db, "materiais", id);
  const snap = await getDoc(ref);
  const dados = snap.data();
  await deleteDoc(ref);
  await registrarHistoricoFirestore(dados.nome, "remocao", dados.quantidade);
  carregarMateriais();
  carregarOpcoesSelect();
};

async function registrarHistoricoFirestore(material, tipo, quantidade) {
  const data = new Date().toISOString().split("T")[0];
  await addDoc(collection(db, "historico"), {
    data,
    material,
    tipo,
    quantidade
  });
}

async function carregarOpcoesSelect() {
  const select = document.getElementById("materialSelect");
  if (!select) return;
  select.innerHTML = "";
  const snapshot = await getDocs(collection(db, "materiais"));
  snapshot.forEach((docSnap) => {
    const mat = docSnap.data();
    const option = document.createElement("option");
    option.value = docSnap.id;
    option.textContent = mat.nome;
    select.appendChild(option);
  });
}

// -------- Movimentação --------
document.getElementById("formMovimentacao")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("materialSelect").value;
  const qtd = parseInt(document.getElementById("qtdMovimentada").value);
  const tipo = document.getElementById("tipoMovimentacao").value;

  await movimentarMaterialFirebase(id, qtd, tipo);
  e.target.reset();
  carregarMateriais();
  carregarHistorico();
});

async function movimentarMaterialFirebase(id, qtd, tipo) {
  const ref = doc(db, "materiais", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return alert("Material não encontrado.");

  const dados = snap.data();
  const atual = parseInt(dados.quantidade);
  let novaQtd = tipo === "entrada" ? atual + qtd : atual - qtd;
  if (novaQtd < 0) novaQtd = 0;

  await updateDoc(ref, { quantidade: novaQtd });
  await registrarHistoricoFirestore(dados.nome, tipo, qtd);
}

// -------- Histórico --------
async function carregarHistorico() {
  const tabela = document.getElementById("tabelaHistorico");
  if (!tabela) return;
  const tbody = tabela.querySelector("tbody");
  tbody.innerHTML = "";
  const snapshot = await getDocs(collection(db, "historico"));
  snapshot.forEach((docSnap) => {
    const hist = docSnap.data();
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${hist.data}</td>
      <td>${hist.material}</td>
      <td>${hist.tipo}</td>
      <td>${hist.quantidade}</td>
    `;
    tbody.appendChild(tr);
  });
}

// -------- Requisições pendentes --------
async function carregarRequisicoesPendentes() {
  const tbody = document.querySelector("#tabelaRequisicoesPendentes tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const q = query(collection(db, "requisicoes"), where("status", "==", "pendente"));
  const snapshot = await getDocs(q);

  snapshot.forEach((docSnap) => {
    const req = docSnap.data();
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${req.data}</td>
      <td>${req.material}</td>
      <td>${req.quantidade}</td>
      <td>${req.justificativa}</td>
      <td>${req.usuario}</td>
      <td><input type="text" id="obs-${docSnap.id}" placeholder="Observação"></td>
      <td>
        <button onclick="responderRequisicao('${docSnap.id}', true)">Aprovar</button>
        <button onclick="responderRequisicao('${docSnap.id}', false)">Rejeitar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.responderRequisicao = async (id, aprovar) => {
  const ref = doc(db, "requisicoes", id);
  const obs = document.getElementById(`obs-${id}`).value;
  const snap = await getDoc(ref);
  const dados = snap.data();

  const matSnap = await getDoc(doc(db, "materiais", dados.materialId));
  const mat = matSnap.data();

  if (aprovar) {
    const novaQtd = Math.max(0, mat.quantidade - dados.quantidade);
    await updateDoc(doc(db, "materiais", dados.materialId), {
      quantidade: novaQtd
    });

    await registrarHistoricoFirestore(dados.material, "saida", dados.quantidade);
  }

  await updateDoc(ref, {
    status: aprovar ? "aprovado" : "rejeitado",
    observacao: obs || ""
  });

  carregarRequisicoesPendentes();
  carregarMateriais();
};
