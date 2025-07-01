#  S-E-M - Sistema de Estoque de Materiais

Sistema web desenvolvido como projeto da unidade curricular **Extensão – Programação para Web**, com o objetivo de facilitar o controle de materiais em instituições, utilizando autenticação e banco de dados em nuvem (Firebase).

---

##  Funcionalidades

 **Login e Registro de Usuários**  
- Três perfis disponíveis: **Almoxarife**, **Engenheiro** e **Gestor**
- Cada perfil tem permissões específicas

 **Gestão de Estoque (Almoxarife)**
- Cadastro, edição e remoção de materiais
- Entrada e saída de materiais
- Histórico de movimentações automático
- Aprovação ou rejeição de requisições feitas por engenheiros

 **Requisição de Materiais (Engenheiro)**
- Visualização dos materiais disponíveis
- Envio de requisição com justificativa
- Acompanhamento do status (pendente, aprovado, rejeitado)

 **Relatórios e Acompanhamento (Gestor)**
- Visualização geral do estoque
- Alerta de estoque crítico (abaixo do mínimo)
- Filtros de histórico por nome e tipo
- Exportação de materiais e histórico em `.csv`

---

##  Tecnologias Utilizadas

- **HTML, CSS, JavaScript**
- **Firebase Firestore** 
- **Firebase Authentication** 
- **GitHub** 

---

##  Estrutura de Arquivos

- `auth.js` – Registro e login de usuários com Firebase Authentication
- `almoxarife.js` – Funcionalidades do perfil **almoxarife**: cadastro, movimentação, histórico, requisições
- `engenheiro.js` – Funcionalidades do perfil **engenheiro**: envio de requisições e visualização de materiais
- `gestor.js` – Funcionalidades do perfil **gestor**: relatórios, alertas de estoque mínimo, exportações
- `estoque.js` – Versão alternativa offline com `localStorage` (sem Firebase)
- `utils.js` – Funções auxiliares (verificação de login e logout)

- `index.html` – Página inicial do sistema
- `login.html` – Tela de login
- `register.html` – Tela de cadastro de novos usuários
- `almoxarife.html` – Interface exclusiva para o almoxarife
- `engenheiro.html` – Interface exclusiva para o engenheiro
- `gestor.html` – Interface exclusiva para o gestor
- 
- `style.css` – Estilo visual das páginas
- 
---

##  Contribuição aos ODS

✅ **ODS 9 – Indústria, Inovação e Infraestrutura**  
✅ **ODS 12 – Consumo e Produção Responsáveis**

---

##  Licença

Este projeto foi desenvolvido para fins acadêmicos e está disponível para consulta, aprendizado e evolução.


![Screenshot_4](https://github.com/user-attachments/assets/0b82e4e4-3a78-4704-8ee7-999a6e10982a)
![Screenshot_3](https://github.com/user-attachments/assets/814e3618-882e-45fa-aca4-5de7e0db0cc8)
![Screenshot_2](https://github.com/user-attachments/assets/698465db-29a8-4406-b814-db86238f94e9)
![Screenshot_1](https://github.com/user-attachments/assets/84b49e88-21d1-4a4c-92be-c8973214f5db)
![Screenshot_5](https://github.com/user-attachments/assets/4232f374-af1e-43f2-af17-f0ecb64258a2)
