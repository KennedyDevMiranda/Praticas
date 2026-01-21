const shell = document.querySelector(".shell");
const subtitle = document.getElementById("subtitle");

const switchModeBtn = document.getElementById("switchMode");
const goLogin = document.getElementById("goLogin");
const goRegister = document.getElementById("goRegister");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const loginToast = document.getElementById("loginToast");
const registerToast = document.getElementById("registerToast");

const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");

// ---------- utilidades ----------
function isEmailValid(email){
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  return re.test(email.trim());
}

function setToast(el, msg, type){
  el.textContent = msg || "";
  el.classList.remove("ok", "bad");
  if (type) el.classList.add(type);
}

function setFieldState(inputEl, errorEl, message){
  const field = inputEl.closest(".field");
  if (message){
    field.classList.add("invalid");
    field.classList.remove("valid");
    errorEl.textContent = message;
  } else {
    field.classList.remove("invalid");
    field.classList.add("valid");
    errorEl.textContent = "";
  }
}

function shakeCard(){
  const card = document.getElementById("card");
  card.classList.remove("shake");
  void card.offsetWidth; // reinicia animação
  card.classList.add("shake");
}

function setMode(mode){ // mode: "login" | "register"
  const isRegister = mode === "register";
  shell.classList.toggle("mode-register", isRegister);

  subtitle.textContent = isRegister ? "Crie sua conta rapidinho" : "Entre com seus dados";
  switchModeBtn.innerHTML = isRegister
    ? 'Já tem conta? <b>Fazer login</b>'
    : 'Não tem conta? <b>Cadastrar</b>';

  // limpa toasts ao trocar
  setToast(loginToast, "", null);
  setToast(registerToast, "", null);
}

// ---------- toggle de senha ----------
document.querySelectorAll("[data-toggle]").forEach(btn => {
  btn.addEventListener("click", () => {
    const inputId = btn.getAttribute("data-toggle");
    const input = document.getElementById(inputId);
    const hidden = input.type === "password";
    input.type = hidden ? "text" : "password";
    btn.textContent = hidden ? "🙈" : "👁️";
  });
});

// ---------- troca de modo ----------
switchModeBtn.addEventListener("click", () => {
  const isRegister = shell.classList.contains("mode-register");
  setMode(isRegister ? "login" : "register");
});

goLogin.addEventListener("click", () => setMode("login"));
goRegister.addEventListener("click", () => setMode("register"));

// começa em login
setMode("login");

// ---------- validações LOGIN ----------
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginEmailError = document.getElementById("loginEmailError");
const loginPasswordError = document.getElementById("loginPasswordError");

function validateLoginEmail(){
  const v = loginEmail.value.trim();
  if (!v) return setFieldState(loginEmail, loginEmailError, "Informe seu e-mail."), false;
  if (!isEmailValid(v)) return setFieldState(loginEmail, loginEmailError, "E-mail inválido."), false;
  setFieldState(loginEmail, loginEmailError, "");
  return true;
}

function validateLoginPassword(){
  const v = loginPassword.value;
  if (!v) return setFieldState(loginPassword, loginPasswordError, "Informe sua senha."), false;
  if (v.length < 6) return setFieldState(loginPassword, loginPasswordError, "Mínimo de 6 caracteres."), false;
  setFieldState(loginPassword, loginPasswordError, "");
  return true;
}

loginEmail.addEventListener("input", validateLoginEmail);
loginPassword.addEventListener("input", validateLoginPassword);

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  setToast(loginToast, "", null);

  const ok = validateLoginEmail() & validateLoginPassword();
  if (!ok){
    shakeCard();
    setToast(loginToast, "Ajusta os campos ali e tenta de novo 😄", "bad");
    return;
  }

  // simula login
  loginBtn.disabled = true;
  const old = loginBtn.textContent;
  loginBtn.textContent = "Entrando...";
  await new Promise(r => setTimeout(r, 900));

  setToast(loginToast, "Login validado no front. Próximo: validar no servidor 🔐", "ok");

  loginBtn.disabled = false;
  loginBtn.textContent = old;
});

// ---------- validações CADASTRO ----------
const regName = document.getElementById("regName");
const regEmail = document.getElementById("regEmail");
const regPassword = document.getElementById("regPassword");
const regConfirm = document.getElementById("regConfirm");

const regNameError = document.getElementById("regNameError");
const regEmailError = document.getElementById("regEmailError");
const regPasswordError = document.getElementById("regPasswordError");
const regConfirmError = document.getElementById("regConfirmError");

function validateName(){
  const v = regName.value.trim();
  if (!v) return setFieldState(regName, regNameError, "Informe seu nome."), false;
  if (v.length < 2) return setFieldState(regName, regNameError, "Nome muito curto."), false;
  setFieldState(regName, regNameError, "");
  return true;
}

function validateRegEmail(){
  const v = regEmail.value.trim();
  if (!v) return setFieldState(regEmail, regEmailError, "Informe seu e-mail."), false;
  if (!isEmailValid(v)) return setFieldState(regEmail, regEmailError, "E-mail inválido."), false;
  setFieldState(regEmail, regEmailError, "");
  return true;
}

function validateRegPassword(){
  const v = regPassword.value;
  if (!v) return setFieldState(regPassword, regPasswordError, "Crie uma senha."), false;
  if (v.length < 6) return setFieldState(regPassword, regPasswordError, "Mínimo de 6 caracteres."), false;

  // bônus: regra leve (opcional) — pelo menos 1 número
  if (!/\d/.test(v)) return setFieldState(regPassword, regPasswordError, "Inclua pelo menos 1 número."), false;

  setFieldState(regPassword, regPasswordError, "");
  return true;
}

function validateConfirm(){
  const v = regConfirm.value;
  if (!v) return setFieldState(regConfirm, regConfirmError, "Confirme sua senha."), false;
  if (v !== regPassword.value) return setFieldState(regConfirm, regConfirmError, "As senhas não batem."), false;
  setFieldState(regConfirm, regConfirmError, "");
  return true;
}

regName.addEventListener("input", validateName);
regEmail.addEventListener("input", validateRegEmail);
regPassword.addEventListener("input", () => { validateRegPassword(); validateConfirm(); });
regConfirm.addEventListener("input", validateConfirm);

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  setToast(registerToast, "", null);

  const ok =
    (validateName() & validateRegEmail() & validateRegPassword() & validateConfirm());

  if (!ok){
    shakeCard();
    setToast(registerToast, "Tem coisa pra ajustar aí 👀", "bad");
    return;
  }

  // simula cadastro
  registerBtn.disabled = true;
  const old = registerBtn.textContent;
  registerBtn.textContent = "Criando...";
  await new Promise(r => setTimeout(r, 900));

  setToast(registerToast, "Cadastro validado no front! Agora é mandar isso pro backend ✨", "ok");

  registerBtn.disabled = false;
  registerBtn.textContent = old;

  // opcional: após “cadastrar”, volta pro login
  // setMode("login");
});