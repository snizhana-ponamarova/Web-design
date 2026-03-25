class ProfileController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  init() {
    const currentUser = this.model.getCurrentUser();

    if (!currentUser) {
      this.view.redirect("./login.html");
      return;
    }

    this.view.render(currentUser);

    this.view.bindLogout(() => {
      this.model.logout();
      this.view.redirect("./login.html");
    });
  }
}

window.ProfileController = ProfileController;