class AuthModel {
  constructor(storage) {
    this.storage = storage;
  }

  registerUser(userData) {
    const users = this.storage.getUsers();

    const existingUser = users.find(user => user.email === userData.email);
    if (existingUser) {
      return {
        success: false,
        message: "Користувач з таким email вже існує."
      };
    }

    users.push(userData);
    this.storage.saveUsers(users);
    this.storage.saveCurrentUser(userData);

    return { success: true };
  }

  loginUser(email, password) {
    const users = this.storage.getUsers();

    const user = users.find(
      item => item.email === email && item.password === password
    );

    if (!user) {
      return {
        success: false,
        message: "Неправильний email або пароль."
      };
    }

    this.storage.saveCurrentUser(user);
    return { success: true };
  }

  getCurrentUser() {
    return this.storage.getCurrentUser();
  }

  requireAuth() {
    return !!this.storage.getCurrentUser();
  }

  logout() {
    this.storage.logoutUser();
  }
}

window.AuthModel = AuthModel;
