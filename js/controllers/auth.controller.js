class AuthController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  init() {
    this.view.bindRegisterSubmit(() => this.handleRegister());
    this.view.bindLoginSubmit(() => this.handleLogin());
  }

  handleRegister() {
    const data = this.view.getRegisterData();

    if (!data.firstName || !data.lastName || !data.email || !data.password) {
      this.view.showRegisterMessage("Заповніть усі обов’язкові поля.");
      return;
    }

    const result = this.model.registerUser(data);

    if (!result.success) {
      this.view.showRegisterMessage(result.message);
      return;
    }

    this.view.redirect("./profile.html");
  }

  handleLogin() {
    const data = this.view.getLoginData();

    if (!data.email || !data.password) {
      this.view.showLoginMessage("Введіть email і пароль.");
      return;
    }

    const result = this.model.loginUser(data.email, data.password);

    if (!result.success) {
      this.view.showLoginMessage(result.message);
      return;
    }

    this.view.redirect("./profile.html");
  }
}

window.AuthController = AuthController;