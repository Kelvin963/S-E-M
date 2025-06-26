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
