class StorageModel {
  constructor() {
    this.STORAGE_KEYS = {
      USERS: "timeflow_users",
      CURRENT_USER: "timeflow_current_user",
      SESSIONS: "timeflow_sessions"
    };
  }

  getUsers() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.USERS)) || [];
  }

  saveUsers(users) {
    localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.CURRENT_USER)) || null;
  }

  saveCurrentUser(user) {
    localStorage.setItem(this.STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  }

  logoutUser() {
    localStorage.removeItem(this.STORAGE_KEYS.CURRENT_USER);
  }

  getSessions() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.SESSIONS)) || [];
  }

  saveSessions(sessions) {
    localStorage.setItem(this.STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  }
}

window.StorageModel = StorageModel;