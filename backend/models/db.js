require('dotenv').config();
const path = require('path');
const os = require('os');
const fs = require('fs');

// In-memory data store for Netlify Functions compatibility
let DATA = {
  users: [],
  projects: [],
  project_members: [],
  tasks: [],
  comments: [],
  activity_log: [],
};

const DB_PATH = process.env.DB_PATH || path.join(os.tmpdir(), 'taskflow.json');
let db;

const getDb = () => {
  // Return a wrapper object that mimics better-sqlite3 API using in-memory data
  return {
    prepare: (sql) => {
      return {
        run: (...params) => {
          execute(sql, params);
          return { changes: 1 };
        },
        get: (...params) => executeOne(sql, params),
        all: (...params) => executeAll(sql, params),
      };
    },
    exec: (sql) => {
      // Schema creation is managed in memory, no need to execute
    },
    pragma: () => {},
  };
};

const loadData = () => {
  try {
    if (fs.existsSync(DB_PATH)) {
      const content = fs.readFileSync(DB_PATH, 'utf8');
      DATA = JSON.parse(content);
    }
  } catch (err) {
    console.warn('Could not load persisted data:', err.message);
  }
};

const saveData = () => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(DATA, null, 2));
  } catch (err) {
    console.warn('Could not save data:', err.message);
  }
};

// Load data on first call
if (!global.__taskflow_data_loaded) {
  loadData();
  global.__taskflow_data_loaded = true;
}

const execute = (sql, params) => {
  if (sql.includes('INSERT INTO users')) {
    const [id, name, email, password, role, avatar] = params;
    DATA.users.push({
      id, name, email, password,
      role: role || 'member',
      avatar,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  } else if (sql.includes('INSERT INTO projects')) {
    const [id, name, description, owner_id, color, status, due_date] = params;
    DATA.projects.push({
      id, name, description, owner_id,
      color: color || '#6366f1',
      status: status || 'active',
      due_date,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  } else if (sql.includes('INSERT INTO project_members')) {
    const [id, project_id, user_id, role] = params;
    DATA.project_members.push({
      id, project_id, user_id,
      role: role || 'member',
      joined_at: new Date().toISOString(),
    });
  } else if (sql.includes('INSERT INTO tasks')) {
    const [id, title, description, status, priority, project_id, assignee_id, reporter_id, due_date] = params;
    DATA.tasks.push({
      id, title, description,
      status: status || 'todo',
      priority: priority || 'medium',
      project_id, assignee_id, reporter_id, due_date,
      tags: '[]',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  } else if (sql.includes('INSERT INTO comments')) {
    const [id, task_id, user_id, content] = params;
    DATA.comments.push({
      id, task_id, user_id, content,
      created_at: new Date().toISOString(),
    });
  } else if (sql.includes('INSERT INTO activity_log')) {
    const [id, user_id, project_id, task_id, action, details] = params;
    DATA.activity_log.push({
      id, user_id, project_id, task_id, action, details,
      created_at: new Date().toISOString(),
    });
  } else if (sql.includes('UPDATE users SET name')) {
    const [name, avatar, id] = params;
    const user = DATA.users.find(u => u.id === id);
    if (user) {
      user.name = name;
      user.avatar = avatar;
      user.updated_at = new Date().toISOString();
    }
  } else if (sql.includes('DELETE FROM project_members')) {
    const [id] = params;
    const idx = DATA.project_members.findIndex(m => m.id === id);
    if (idx > -1) DATA.project_members.splice(idx, 1);
  }
  saveData();
};

const executeOne = (sql, params) => {
  if (sql.includes('SELECT COUNT')) {
    return { count: DATA.users.length };
  }
  if (sql.includes('FROM users WHERE email')) {
    return DATA.users.find(u => u.email === params[0]);
  }
  if (sql.includes('FROM users WHERE id')) {
    return DATA.users.find(u => u.id === params[0]);
  }
  if (sql.includes('FROM projects WHERE id')) {
    return DATA.projects.find(p => p.id === params[0]);
  }
  return null;
};

const executeAll = (sql, params) => {
  if (sql.includes('FROM users ORDER BY name')) {
    return [...DATA.users].sort((a, b) => a.name.localeCompare(b.name));
  }
  if (sql.includes('FROM users')) {
    return DATA.users;
  }
  if (sql.includes('FROM projects WHERE owner_id')) {
    return DATA.projects.filter(p => p.owner_id === params[0]);
  }
  if (sql.includes('FROM projects')) {
    return DATA.projects;
  }
  if (sql.includes('FROM tasks WHERE project_id')) {
    return DATA.tasks.filter(t => t.project_id === params[0]);
  }
  if (sql.includes('FROM tasks')) {
    return DATA.tasks;
  }
  if (sql.includes('FROM project_members WHERE project_id')) {
    return DATA.project_members.filter(m => m.project_id === params[0]);
  }
  if (sql.includes('FROM project_members')) {
    return DATA.project_members;
  }
  if (sql.includes('FROM activity_log')) {
    return DATA.activity_log;
  }
  if (sql.includes('FROM comments')) {
    return DATA.comments;
  }
  return [];
};

const initSchema = () => {
  // Schema is implicitly defined by the in-memory data structure
};

module.exports = { getDb };
