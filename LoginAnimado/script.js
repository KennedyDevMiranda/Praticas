const shell = document.querySelector(".shell");
const subtitle = document.getElementById("subtitle");

const switchModeBtn = document.getElementById("switchMode");
const goLogin = document.getElementById("goLogin");
const goRegister = document.getElementById("goRegister");

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

// =====================
// 1) MOTOR DE REGRAS
// =====================

// Helpers de regras (regras são funções que retornam null (ok) ou string (erro))
const Rules = {
  required: (msg = "Campo obrigatório.") => (value) =>
    value?.trim() ? null : msg,

  minLen: (n, msg = `Mínimo de ${n} caracteres.`) => (value) =>
    (value ?? "").length >= n ? null : msg,

  email: (msg = "E-mail inválido.") => (value) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    return re.test((value ?? "").trim()) ? null : msg;
  },

  hasNumber: (msg = "Inclua pelo menos 1 número.") => (value) =>
    /\d/.test(value ?? "") ? null : msg,

  sameAs: (otherFieldId, msg = "Os valores não conferem.") => (value, ctx) => {
    const other = ctx.getValue(otherFieldId);
    return value === other ? null : msg;
  },
};

// Função que aplica regras em ordem e devolve o primeiro erro
function runRules(value, rules, ctx) {
  for (const rule of rules) {
    const error = rule(value, ctx);
    if (error) return error;
  }
  return null;
}

// UI helpers (usam seu CSS .valid/.invalid e <small class="error">)
function setFieldState(inputEl, errorEl, message) {
  const field = inputEl.closest(".field");
  if (message) {
    field.classList.add("invalid");
    field.classList.remove("valid");
    errorEl.textContent = message;
  } else {
    field.classList.remove("invalid");
    field.classList.add("valid");
    errorEl.textContent = "";
  }
}

// Contexto para regras que precisam ler outros campos do form
function makeCtx(form) {
  return {
    getValue: (id) => form.querySelector(`#${id}`)?.value ?? "",
    form,
  };
}

// Cria um validador elegante a partir de um "mapa" de campos
function makeValidator(form, schema) {
  const ctx = makeCtx(form);

  function validateField(fieldKey) {
    const cfg = schema[fieldKey];
    const value = cfg.input.value;
    const error = runRules(value, cfg.rules, ctx);
    setFieldState(cfg.input, cfg.errorEl, error);
    return !error;
  }

  function validateAll() {
    let ok = true;
    for (const key of Object.keys(schema)) {
      ok = validateField(key) && ok;
    }
    return ok;
  }

  // valida em tempo real (input) — opcional, mas gostoso demais
  function wireLiveValidation() {
    for (const key of Object.keys(schema)) {
      const cfg = schema[key];
      cfg.input.addEventListener("input", () => {
        validateField(key);

        // Se for campo "pai" de confirmação (senha), revalidar confirmação também
        // (ajusta o nome das chaves se você usar diferente)
        if (key === "regPassword" && schema.regConfirm) validateField("regConfirm");
      });
    }
  }

  return { validateField, validateAll, wireLiveValidation };
}

// =====================
// 2) LOGIN COM SCHEMA
// =====================
const loginForm = document.getElementById("loginForm");
const loginToast = document.getElementById("loginToast");
const loginBtn = document.getElementById("loginBtn");

const loginSchema = {
  loginEmail: {
    input: document.getElementById("loginEmail"),
    errorEl: document.getElementById("loginEmailError"),
    rules: [
      Rules.required("Informe seu e-mail."),
      Rules.email("E-mail inválido. Ex: nome@dominio.com"),
    ],
  },
  loginPassword: {
    input: document.getElementById("loginPassword"),
    errorEl: document.getElementById("loginPasswordError"),
    rules: [
      Rules.required("Informe sua senha."),
      Rules.minLen(6, "A senha precisa ter pelo menos 6 caracteres."),
    ],
  },
};

const loginValidator = makeValidator(loginForm, loginSchema);
loginValidator.wireLiveValidation();

function setToast(el, msg, type) {
  el.textContent = msg || "";
  el.classList.remove("ok", "bad");
  if (type) el.classList.add(type);
}

function shakeCard() {
  const card = document.getElementById("card");
  card.classList.remove("shake");
  void card.offsetWidth;
  card.classList.add("shake");
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  setToast(loginToast, "", null);

  const ok = loginValidator.validateAll();
  if (!ok) {
    shakeCard();
    setToast(loginToast, "Corrige os campos ali e tenta de novo 😄", "bad");
    return;
  }

  loginBtn.disabled = true;
  const old = loginBtn.textContent;
  loginBtn.textContent = "Entrando...";
  await new Promise((r) => setTimeout(r, 900));

  setToast(loginToast, "Login validado no front. Próximo: backend 🔐", "ok");

  loginBtn.disabled = false;
  loginBtn.textContent = old;
});

// =====================
// 3) CADASTRO COM SCHEMA
// =====================
const registerForm = document.getElementById("registerForm");
const registerToast = document.getElementById("registerToast");
const registerBtn = document.getElementById("registerBtn");

const registerSchema = {
  regName: {
    input: document.getElementById("regName"),
    errorEl: document.getElementById("regNameError"),
    rules: [
      Rules.required("Informe seu nome."),
      Rules.minLen(2, "Nome muito curto."),
    ],
  },
  regEmail: {
    input: document.getElementById("regEmail"),
    errorEl: document.getElementById("regEmailError"),
    rules: [
      Rules.required("Informe seu e-mail."),
      Rules.email("E-mail inválido."),
    ],
  },
  regPassword: {
    input: document.getElementById("regPassword"),
    errorEl: document.getElementById("regPasswordError"),
    rules: [
      Rules.required("Crie uma senha."),
      Rules.minLen(6, "Mínimo de 6 caracteres."),
      Rules.hasNumber("Inclua pelo menos 1 número."),
    ],
  },
  regConfirm: {
    input: document.getElementById("regConfirm"),
    errorEl: document.getElementById("regConfirmError"),
    rules: [
      Rules.required("Confirme sua senha."),
      Rules.sameAs("regPassword", "As senhas não batem."),
    ],
  },
};

const registerValidator = makeValidator(registerForm, registerSchema);
registerValidator.wireLiveValidation();

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  setToast(registerToast, "", null);

  const ok = registerValidator.validateAll();
  if (!ok) {
    shakeCard();
    setToast(registerToast, "Tem coisa pra ajustar aí 👀", "bad");
    return;
  }

  registerBtn.disabled = true;
  const old = registerBtn.textContent;
  registerBtn.textContent = "Criando...";
  await new Promise((r) => setTimeout(r, 900));

  setToast(registerToast, "Cadastro validado no front! Próximo: salvar no servidor ✨", "ok");

  registerBtn.disabled = false;
  registerBtn.textContent = old;
});
