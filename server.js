const express = require('express');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'data', 'timeflow.db');

const db = new sqlite3.Database(DB_PATH);

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function initDb() {
  await run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    gender TEXT,
    birth_date TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  await run(`CREATE TABLE IF NOT EXISTS auth_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT NOT NULL UNIQUE,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  await run(`CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    duration_ms INTEGER NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
}

function generateToken() {
  return crypto.randomBytes(24).toString('hex');
}

function formatUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    gender: row.gender || '',
    birthDate: row.birth_date || ''
  };
}

async function authMiddleware(req, res, next) {
  try {
    const token = req.headers['x-auth-token'];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Необхідно увійти в систему.' });
    }

    const row = await get(
      `SELECT u.*
       FROM auth_tokens t
       JOIN users u ON u.id = t.user_id
       WHERE t.token = ?`,
      [token]
    );

    if (!row) {
      return res.status(401).json({ success: false, message: 'Сесія недійсна. Увійдіть ще раз.' });
    }

    req.user = formatUser(row);
    next();
  } catch (error) {
    next(error);
  }
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

app.post('/api/register', async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, gender, birthDate } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Заповніть усі обов’язкові поля.' });
    }

    const existingUser = await get('SELECT id FROM users WHERE email = ?', [email.trim().toLowerCase()]);
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Користувач з таким email вже існує.' });
    }

    const result = await run(
      `INSERT INTO users (first_name, last_name, email, password, gender, birth_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        firstName.trim(),
        lastName.trim(),
        email.trim().toLowerCase(),
        password,
        gender || '',
        birthDate || ''
      ]
    );

    const token = generateToken();
    await run('INSERT INTO auth_tokens (user_id, token) VALUES (?, ?)', [result.lastID, token]);

    const createdUser = await get('SELECT * FROM users WHERE id = ?', [result.lastID]);
    res.status(201).json({ success: true, token, user: formatUser(createdUser) });
  } catch (error) {
    next(error);
  }
});

app.post('/api/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Введіть email і пароль.' });
    }

    const user = await get('SELECT * FROM users WHERE email = ? AND password = ?', [email.trim().toLowerCase(), password]);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Неправильний email або пароль.' });
    }

    const token = generateToken();
    await run('INSERT INTO auth_tokens (user_id, token) VALUES (?, ?)', [user.id, token]);

    res.json({ success: true, token, user: formatUser(user) });
  } catch (error) {
    next(error);
  }
});

app.get('/api/me', authMiddleware, async (req, res) => {
  res.json({ success: true, user: req.user });
});

app.post('/api/logout', authMiddleware, async (req, res, next) => {
  try {
    const token = req.headers['x-auth-token'];
    await run('DELETE FROM auth_tokens WHERE token = ?', [token]);
    res.json({ success: true, message: 'Вихід виконано.' });
  } catch (error) {
    next(error);
  }
});

app.get('/api/sessions', authMiddleware, async (req, res, next) => {
  try {
    const rows = await all(
      `SELECT id, name, start_time, end_time, duration_ms
       FROM sessions
       WHERE user_id = ?
       ORDER BY id DESC`,
      [req.user.id]
    );

    res.json({ success: true, sessions: rows });
  } catch (error) {
    next(error);
  }
});

app.post('/api/sessions', authMiddleware, async (req, res, next) => {
  try {
    const { name, startTime, endTime, durationMs } = req.body;

    if (!name || !startTime || !endTime || !Number.isFinite(durationMs)) {
      return res.status(400).json({ success: false, message: 'Некоректні дані сесії.' });
    }

    await run(
      `INSERT INTO sessions (user_id, name, start_time, end_time, duration_ms)
       VALUES (?, ?, ?, ?, ?)`,
      [req.user.id, name.trim(), startTime, endTime, durationMs]
    );

    res.status(201).json({ success: true, message: 'Сесію збережено.' });
  } catch (error) {
    next(error);
  }
});

app.delete('/api/sessions', authMiddleware, async (req, res, next) => {
  try {
    await run('DELETE FROM sessions WHERE user_id = ?', [req.user.id]);
    res.json({ success: true, message: 'Історію очищено.' });
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Внутрішня помилка сервера.' });
});

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`TimeFlow server started on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database initialization failed:', error);
    process.exit(1);
  });
