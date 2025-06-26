import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged
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

onAuthStateChanged(auth, (user) => {
  if (!user) {
    alert("Acesso negado.");
    window.location.href = "login.html";
    return;
  }

  const tipo = JSON.parse(localStorage.getItem("usuarioLogado"))?.tipo;
  if (tipo !== "gestor") {
    alert("Acesso negado.");
    window.location.href = "login.html";
    return;
  }

  carregarMateriais();
  carregarHistorico();
});

async function carregarMateriais() {
  const tbody = document.querySelector("#tabelaMateriais tbody");
  tbody.innerHTML = "";

  const snapshot = await getDocs(collection(db, "materiais"));
  snapshot.forEach((docSnap) => {
    const mat = docSnap.data();
    const estoqueCritico = parseInt(mat.quantidade) <= parseInt(mat.minimo || 0);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${mat.nome}</td>
      <td>${mat.categoria}</td>
      <td>${mat.quantidade}</td>
      <td>${mat.unidade}</td>
      <td style="color: ${estoqueCritico ? '#c0392b' : 'green'}; font-weight: bold;">
        ${estoqueCritico ? 'Crítico' : 'Normal'}
      </td>
    `;

    if (estoqueCritico) {
      tr.style.backgroundColor = "#ffe6e6"; // vermelho claro
      tr.title = "Estoque abaixo do mínimo";
    }

    tbody.appendChild(tr);
  });
}

async function carregarHistorico() {
  const tbody = document.querySelector("#tabelaHistorico tbody");
  tbody.innerHTML = "";

  const filtroNome = document.getElementById("filtroNome").value.toLowerCase();
  const filtroTipo = document.getElementById("filtroTipo").value;

  const snapshot = await getDocs(collection(db, "historico"));
  snapshot.forEach((docSnap) => {
    const h = docSnap.data();

    const nomeMatch = h.material.toLowerCase().includes(filtroNome);
    const tipoMatch = filtroTipo === "" || h.tipo === filtroTipo;

    if (nomeMatch && tipoMatch) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${h.data}</td>
        <td>${h.material}</td>
        <td>${h.tipo}</td>
        <td>${h.quantidade}</td>
      `;
      tbody.appendChild(tr);
    }
  });
}

window.carregarHistorico = carregarHistorico;

window.exportarMateriaisCSV = async () => {
  const snapshot = await getDocs(collection(db, "materiais"));
  let csv = "Nome,Categoria,Quantidade,Unidade,Status\n";
  snapshot.forEach(docSnap => {
    const m = docSnap.data();
    const status = parseInt(m.quantidade) <= parseInt(m.minimo || 0) ? "Crítico" : "Normal";
    csv += `${m.nome},${m.categoria},${m.quantidade},${m.unidade},${status}\n`;
  });

  baixarCSV(csv, "estoque.csv");
};

window.exportarHistoricoCSV = async () => {
  const snapshot = await getDocs(collection(db, "historico"));
  let csv = "Data,Material,Tipo,Quantidade\n";
  snapshot.forEach(docSnap => {
    const h = docSnap.data();
    csv += `${h.data},${h.material},${h.tipo},${h.quantidade}\n`;
  });

  baixarCSV(csv, "historico.csv");
};

function baixarCSV(conteudo, nomeArquivo) {
  const blob = new Blob([conteudo], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", nomeArquivo);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
