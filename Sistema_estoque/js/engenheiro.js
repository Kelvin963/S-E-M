import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getFirestore, collection, addDoc, getDocs, query, where, doc, getDoc
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

let userUID = null;

onAuthStateChanged(auth, (user) => {
  if (!user) {
    alert("Acesso negado.");
    window.location.href = "login.html";
    return;
  }

  const tipo = JSON.parse(localStorage.getItem("usuarioLogado"))?.tipo;
  if (tipo !== "engenheiro") {
    alert("Acesso negado.");
    window.location.href = "login.html";
    return;
  }

  userUID = user.uid;
  carregarMateriaisSelect();
  carregarTabelaMateriais(); // nova função para consulta de materiais
  carregarRequisicoes();
});

async function carregarMateriaisSelect() {
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

async function carregarTabelaMateriais() {
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
    `;
    tbody.appendChild(tr);
  });
}

document.getElementById("formRequisicao").addEventListener("submit", async (e) => {
  e.preventDefault();
  const materialId = document.getElementById("materialSelect").value;
  const quantidade = parseInt(document.getElementById("quantidade").value);
  const justificativa = document.getElementById("justificativa").value;

  if (!materialId || !quantidade || !justificativa) {
    alert("Preencha todos os campos.");
    return;
  }

  const materialSnap = await getDoc(doc(db, "materiais", materialId));
  const material = materialSnap.data();

  await addDoc(collection(db, "requisicoes"), {
    material: material.nome,
    materialId,
    quantidade,
    justificativa,
    usuario: userUID,
    status: "pendente",
    observacao: "",
    data: new Date().toISOString().split("T")[0]
  });

  e.target.reset();
  carregarRequisicoes();
});

async function carregarRequisicoes() {
  const tbody = document.querySelector("#tabelaRequisicoes tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const q = query(collection(db, "requisicoes"), where("usuario", "==", userUID));
  const snapshot = await getDocs(q);

  snapshot.forEach((docSnap) => {
    const r = docSnap.data();
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.data}</td>
      <td>${r.material}</td>
      <td>${r.quantidade}</td>
      <td>${r.justificativa}</td>
      <td>${r.status}</td>
      <td>${r.observacao || "-"}</td>
    `;
    tbody.appendChild(tr);
  });
}
