class TrackerController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.timerInterval = null;
    this.startTime = null;
    this.elapsedTime = 0;
    this.isRunning = false;
    this.isPaused = false;
    this.currentSessionName = "";
  }

  init() {
    const currentUser = this.model.getCurrentUser();

    if (!currentUser) {
      this.view.redirect("./login.html");
      return;
    }

    if (!this.view.isReady()) {
      return;
    }

    this.view.renderSessions(this.model.getUserSessions());
    this.updateTimerDisplay();

    this.view.bindStart(() => this.handleStart());
    this.view.bindPause(() => this.handlePause());
    this.view.bindResume(() => this.handleResume());
    this.view.bindStop(() => this.handleStop());
    this.view.bindClear(() => this.handleClear());
  }

  formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }

  getCurrentElapsed() {
    if (this.isRunning) {
      return Date.now() - this.startTime + this.elapsedTime;
    }

    return this.elapsedTime;
  }

  updateTimerDisplay() {
    this.view.renderTimer(this.formatTime(this.getCurrentElapsed()));
  }

  handleStart() {
    if (this.isRunning) return;

    this.currentSessionName = this.view.getSessionName();
    this.startTime = Date.now();
    this.elapsedTime = 0;
    this.isRunning = true;
    this.isPaused = false;

    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => this.updateTimerDisplay(), 1000);
    this.updateTimerDisplay();
  }

  handlePause() {
    if (!this.isRunning) return;

    this.elapsedTime += Date.now() - this.startTime;
    this.isRunning = false;
    this.isPaused = true;

    clearInterval(this.timerInterval);
    this.updateTimerDisplay();
  }

  handleResume() {
    if (!this.isPaused) return;

    this.startTime = Date.now();
    this.isRunning = true;
    this.isPaused = false;

    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => this.updateTimerDisplay(), 1000);
    this.updateTimerDisplay();
  }

  handleStop() {
    if (!this.isRunning && !this.isPaused) return;

    if (this.isRunning) {
      this.elapsedTime += Date.now() - this.startTime;
    }

    clearInterval(this.timerInterval);

    const currentUser = this.model.getCurrentUser();
    if (!currentUser) return;

    const now = new Date();

    const session = {
      userEmail: currentUser.email,
      name: this.currentSessionName || "Без назви",
      start: new Date(now.getTime() - this.elapsedTime).toLocaleString("uk-UA"),
      end: now.toLocaleString("uk-UA"),
      duration: this.formatTime(this.elapsedTime)
    };

    this.model.addSession(session);

    this.isRunning = false;
    this.isPaused = false;
    this.elapsedTime = 0;
    this.startTime = null;
    this.currentSessionName = "";

    this.view.clearSessionName();
    this.updateTimerDisplay();
    this.view.renderSessions(this.model.getUserSessions());
  }

  handleClear() {
    this.model.clearUserSessions();
    this.view.renderSessions(this.model.getUserSessions());
  }
}

window.TrackerController = TrackerController;