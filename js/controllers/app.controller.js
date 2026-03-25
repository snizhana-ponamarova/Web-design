class AppController {
  constructor() {
    this.storage = new StorageModel();
    this.navbarView = new NavbarView();
  }

  init() {
    const currentUser = this.storage.getCurrentUser();
    this.navbarView.update(currentUser);

    const page = document.body.dataset.page;

    if (page === "login" || page === "register") {
      const authModel = new AuthModel(this.storage);
      const authView = new AuthView();
      const authController = new AuthController(authModel, authView);
      authController.init();
    }

    if (page === "profile") {
      const profileModel = new ProfileModel(this.storage);
      const profileView = new ProfileView();
      const profileController = new ProfileController(profileModel, profileView);
      profileController.init();
    }

    if (page === "tracker") {
      const trackerModel = new TrackerModel(this.storage);
      const trackerView = new TrackerView();
      const trackerController = new TrackerController(trackerModel, trackerView);
      trackerController.init();
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const app = new AppController();
  app.init();
});
