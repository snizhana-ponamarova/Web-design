class TrackerView {
  constructor() {
    this.sessionNameInput = document.getElementById("sessionName");
    this.startBtn = document.getElementById("startBtn");
    this.pauseBtn = document.getElementById("pauseBtn");
    this.resumeBtn = document.getElementById("resumeBtn");
    this.stopBtn = document.getElementById("stopBtn");
    this.clearBtn = document.getElementById("clearHistoryBtn");
    this.timerDisplay = document.getElementById("timerDisplay");
    this.sessionsBody = document.getElementById("sessionsBody");
  }

  isReady() {
    return !!(
      this.sessionNameInput &&
      this.startBtn &&
      this.pauseBtn &&
      this.resumeBtn &&
      this.stopBtn &&
      this.clearBtn &&
      this.timerDisplay &&
      this.sessionsBody
    );
  }

  getSessionName() {
    return this.sessionNameInput.value.trim() || "Без назви";
  }

  clearSessionName() {
    this.sessionNameInput.value = "";
  }

  renderTimer(value) {
    if (!this.timerDisplay) return;
    this.timerDisplay.textContent = value;
  }

  renderSessions(sessions) {
    if (!this.sessionsBody) return;

    this.sessionsBody.innerHTML = "";

    if (sessions.length === 0) {
      this.sessionsBody.innerHTML = `
        <tr>
          <td class="fw-semibold">Немає сесій</td>
          <td class="text-secondary">—</td>
          <td class="text-secondary">—</td>
          <td class="fw-semibold">00:00:00</td>
        </tr>
      `;
      return;
    }

    sessions.forEach(session => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="fw-semibold">${session.name}</td>
        <td class="text-secondary">${session.start}</td>
        <td class="text-secondary">${session.end}</td>
        <td class="fw-semibold">${session.duration}</td>
      `;
      this.sessionsBody.appendChild(row);
    });
  }

  bindStart(handler) {
    if (!this.startBtn) return;
    this.startBtn.addEventListener("click", handler);
  }

  bindPause(handler) {
    if (!this.pauseBtn) return;
    this.pauseBtn.addEventListener("click", handler);
  }

  bindResume(handler) {
    if (!this.resumeBtn) return;
    this.resumeBtn.addEventListener("click", handler);
  }

  bindStop(handler) {
    if (!this.stopBtn) return;
    this.stopBtn.addEventListener("click", handler);
  }

  bindClear(handler) {
    if (!this.clearBtn) return;
    this.clearBtn.addEventListener("click", handler);
  }

  redirect(url) {
    window.location.href = url;
  }
}

window.TrackerView = TrackerView;