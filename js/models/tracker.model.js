class TrackerModel {
  constructor(storage) {
    this.storage = storage;
  }

  getCurrentUser() {
    return this.storage.getCurrentUser();
  }

  getUserSessions() {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return [];
    }

    return this.storage.getSessions().filter(
      session => session.userEmail === currentUser.email
    );
  }

  addSession(session) {
    const sessions = this.storage.getSessions();
    sessions.push(session);
    this.storage.saveSessions(sessions);
  }

  clearUserSessions() {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return;
    }

    const filteredSessions = this.storage.getSessions().filter(
      session => session.userEmail !== currentUser.email
    );

    this.storage.saveSessions(filteredSessions);
  }
}

window.TrackerModel = TrackerModel;