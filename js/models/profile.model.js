class ProfileModel {
  constructor(storage) {
    this.storage = storage;
  }

  getCurrentUser() {
    return this.storage.getCurrentUser();
  }

  logout() {
    this.storage.logoutUser();
  }
}

window.ProfileModel = ProfileModel;