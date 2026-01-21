const form = document.getElementById("loginForm");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

const togglePassword = document.getElementById("togglePassword");
const submitBtn = document.getElementById("submitBtn");
const toast = document.getElementById("toast");

// truque pro :placeholder-shown (sem mostrar texto)
emailInput.placeholder = " ";
passwordInput.placeholder = " ";

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

function isEmailValid(email) {
  // regex simples e honesta (não tenta validar o universo)
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  return re.test(email.trim());
}

function validateEmail() {
  const value = emailInput.value.trim();

  if (!value) {
    setFieldState(emailInput, emailError, "Informe seu e-mail.");
    return false;
  }
  if (!isEmailValid(value)) {
    setFieldState(emailInput, emailError, "E-mail inválido. Ex: nome@dominio.com");
    return false;
  }

  setFieldState(emailInput, emailError, "");
  return true;
}

function validatePassword() {
  const value = passwordInput.value;

  if (!value) {
    setFieldState(passwordInput, passwordError, "Informe sua senha.");
    return false;
  }
  if (value.length < 6) {
    setFieldState(passwordInput, passwordError, "A senha precisa ter pelo menos 6 caracteres.");
    return false;
  }

  setFieldState(passwordInput, passwordError, "");
  return true;
}

function setToast(message, type) {
  toast.textContent = message || "";
  toast.classList.remove("ok", "bad");
  if (type) toast.classList.add(type);
}

function shakeCard() {
  const card = document.querySelector(".card");
  card.classList.remove("shake");
  // força “reflow” pra reiniciar a animação
  void card.offsetWidth;
  card.classList.add("shake");
}

togglePassword.addEventListener("click", () => {
  const isHidden = passwordInput.type === "password";
  passwordInput.type = isHidden ? "text" : "password";
  togglePassword.textContent = isHidden ? "🙈" : "👁️";
});

emailInput.addEventListener("input", validateEmail);
passwordInput.addEventListener("input", validatePassword);

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  setToast("", null);

  const okEmail = validateEmail();
  const okPass = validatePassword();

  if (!okEmail || !okPass) {
    shakeCard();
    setToast("Corrige aí que eu te deixo passar 😄", "bad");
    return;
  }

  // Simula loading
  submitBtn.disabled = true;
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Entrando...";

  await new Promise((r) => setTimeout(r, 900));

  // Aqui você faria um fetch() pra sua API, etc.
  setToast("Login validado no front! Próximo passo: validar no servidor 🔐", "ok");

  submitBtn.disabled = false;
  submitBtn.textContent = originalText;

  // opcional: limpar
  // form.reset();
  // document.querySelectorAll(".field").forEach(f => f.classList.remove("valid"));
});