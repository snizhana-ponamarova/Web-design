class AuthView {
  getRegisterForm() {
    return document.getElementById("registerForm");
  }

  getLoginForm() {
    return document.getElementById("loginForm");
  }

  getRegisterData() {
    return {
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      email: document.getElementById("registerEmail").value.trim(),
      password: document.getElementById("registerPassword").value.trim(),
      gender: document.getElementById("gender").value,
      birthDate: document.getElementById("birthDate").value
    };
  }

  getLoginData() {
    return {
      email: document.getElementById("loginEmail").value.trim(),
      password: document.getElementById("loginPassword").value.trim()
    };
  }

  showRegisterMessage(text, isSuccess = false) {
    const message = document.getElementById("registerMessage");
    if (!message) return;

    message.textContent = text;
    message.className = isSuccess ? "mt-3 text-success" : "mt-3 text-danger";
  }

  showLoginMessage(text, isSuccess = false) {
    const message = document.getElementById("loginMessage");
    if (!message) return;

    message.textContent = text;
    message.className = isSuccess ? "mt-3 text-success" : "mt-3 text-danger";
  }

  redirect(url) {
    window.location.href = url;
  }

  bindRegisterSubmit(handler) {
    const form = this.getRegisterForm();
    if (!form) return;

    form.addEventListener("submit", event => {
      event.preventDefault();
      handler();
    });
  }

  bindLoginSubmit(handler) {
    const form = this.getLoginForm();
    if (!form) return;

    form.addEventListener("submit", event => {
      event.preventDefault();
      handler();
    });
  }
}

window.AuthView = AuthView;
