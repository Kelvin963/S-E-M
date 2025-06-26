import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import {
  getFirestore,
  setDoc,
  getDoc,
  doc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

// REGISTRO
const formRegister = document.getElementById("registerForm");
if (formRegister) {
  formRegister.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("password").value;
    const tipo = document.getElementById("tipo").value;

    if (!email || !senha || !tipo) {
      alert("Preencha todos os campos.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const uid = userCredential.user.uid;

      // salva tipo no Firestore
      await setDoc(doc(db, "usuarios", uid), { tipo });

      alert("Registro realizado com sucesso!");
      window.location.href = "login.html";
    } catch (error) {
      alert("Erro ao registrar: " + error.message);
    }
  });
}

// LOGIN
const formLogin = document.getElementById("loginForm");
if (formLogin) {
  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("password").value;

    if (!email || !senha) {
      alert("Preencha todos os campos.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      const docRef = doc(db, "usuarios", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const dados = docSnap.data();
        const tipo = dados.tipo;

        localStorage.setItem("usuarioLogado", JSON.stringify({
          email,
          tipo,
          uid: user.uid
        }));

        switch (tipo) {
          case "almoxarife":
            window.location.href = "almoxarife.html";
            break;
          case "engenheiro":
            window.location.href = "engenheiro.html";
            break;
          case "gestor":
            window.location.href = "gestor.html";
            break;
          default:
            alert("Tipo de usuário inválido.");
        }
      } else {
        alert("Usuário não encontrado no banco de dados.");
      }

    } catch (error) {
      alert("Erro ao logar: " + error.message);
    }
  });
}
