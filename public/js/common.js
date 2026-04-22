const api = {
  tokenKey: 'timeflow_token',

  getToken() {
    return localStorage.getItem(this.tokenKey) || '';
  },

  setToken(token) {
    localStorage.setItem(this.tokenKey, token);
  },

  clearToken() {
    localStorage.removeItem(this.tokenKey);
  },

  async request(url, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    const token = this.getToken();
    if (token) {
      headers['x-auth-token'] = token;
    }

    const response = await fetch(url, { ...options, headers });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || 'Помилка запиту до сервера.');
    }

    return data;
  },

  async register(payload) {
    return this.request('/api/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async login(payload) {
    return this.request('/api/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async me() {
    return this.request('/api/me', { method: 'GET' });
  },

  async logout() {
    return this.request('/api/logout', { method: 'POST' });
  },

  async getSessions() {
    return this.request('/api/sessions', { method: 'GET' });
  },

  async createSession(payload) {
    return this.request('/api/sessions', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async clearSessions() {
    return this.request('/api/sessions', { method: 'DELETE' });
  }
};

function formatDateTime(value) {
  return new Date(value).toLocaleString('uk-UA');
}

function formatDuration(durationMs) {
  const totalSeconds = Math.floor(durationMs / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

const NavbarMixin = {
  data() {
    return {
      currentUser: null,
      loadingUser: true
    };
  },
  async created() {
    try {
      const response = await api.me();
      this.currentUser = response.user;
    } catch (error) {
      api.clearToken();
      this.currentUser = null;
    } finally {
      this.loadingUser = false;
    }
  },
  methods: {
    go(path) {
      window.location.href = path;
    }
  }
};
