# TaskFlow — Team Task Manager

A full-stack team task management web app with role-based access control, built with Node.js, Express, SQLite, and vanilla JS.

## 🚀 Features

- **Authentication** — JWT-based Signup / Login
- **Role-Based Access Control** — Global Admin & Member roles + per-project Admin/Member roles
- **Project Management** — Create, edit, delete projects with color tags and due dates
- **Task Tracking** — Kanban board (To Do / In Progress / Review / Done)
- **Task Assignment** — Assign tasks to project members
- **Priority Levels** — Urgent / High / Medium / Low
- **Team Management** — Add/remove members, manage roles per project
- **Dashboard** — Overview of stats, overdue tasks, recent activity
- **Comments** — Comment on tasks
- **Activity Log** — Track who did what

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js + Express.js |
| Database | SQLite (via better-sqlite3) |
| Auth | JWT + bcryptjs |
| Validation | express-validator |
| Frontend | Vanilla HTML/CSS/JS (SPA) |
| Deployment | Railway |

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- npm

### Steps

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd taskflow

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env if needed (defaults work out of the box)

# 4. Start the app (auto-seeds demo data on first run)
npm start
```

Open **http://localhost:3000** in your browser.

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@taskflow.com | password123 |
| Member | member@taskflow.com | password123 |
| Member | bob@taskflow.com | password123 |

---

## 📡 REST API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/auth/users` | List all users |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List my projects |
| POST | `/api/projects` | Create project |
| GET | `/api/projects/:id` | Project details + members |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |
| POST | `/api/projects/:id/members` | Add member |
| DELETE | `/api/projects/:id/members/:userId` | Remove member |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects/:id/tasks` | List tasks (filterable) |
| POST | `/api/projects/:id/tasks` | Create task |
| GET | `/api/projects/:id/tasks/:taskId` | Task detail + comments |
| PUT | `/api/projects/:id/tasks/:taskId` | Update task |
| DELETE | `/api/projects/:id/tasks/:taskId` | Delete task |
| POST | `/api/projects/:id/tasks/:taskId/comments` | Add comment |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Full dashboard data |
| GET | `/api/dashboard/my-tasks` | Tasks assigned to me |
| GET | `/api/dashboard/admin-stats` | Admin-only stats |

---

## 🌐 Deploy to Railway

### Method 1: GitHub (Recommended)

1. Push code to GitHub
2. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub**
3. Select your repo
4. Add environment variable:
   ```
   JWT_SECRET=your_super_secret_key_here
   NODE_ENV=production
   ```
5. Railway auto-detects Node.js and deploys

### Method 2: Railway CLI

```bash
npm install -g @railway/cli
railway login
railway init
railway up
railway variables set JWT_SECRET=your_secret_key NODE_ENV=production
```

---

## 📁 Project Structure

```
taskflow/
├── server.js                  # Entry point
├── package.json
├── railway.toml               # Railway config
├── .env                       # Environment vars
├── backend/
│   ├── models/
│   │   └── db.js              # SQLite setup + schema
│   ├── middleware/
│   │   └── auth.js            # JWT + RBAC middleware
│   └── routes/
│       ├── auth.js            # Auth endpoints
│       ├── projects.js        # Project endpoints
│       ├── tasks.js           # Task endpoints
│       └── dashboard.js       # Dashboard endpoints
├── frontend/
│   └── public/
│       └── index.html         # SPA frontend
└── scripts/
    └── seed.js                # Demo data seeder
```

---

## 🔒 Security Features

- Passwords hashed with bcrypt (12 salt rounds)
- JWT tokens expire in 7 days
- All routes require authentication except signup/login
- Project access validated per-request
- Role-based guards on admin operations
- Input validation on all endpoints
- SQL injection protected via parameterized queries

---

## 👤 Author

Built for the TaskFlow assignment — full-stack team task manager with RBAC.
>>>>>>> caa8ffb (Initial commit of TaskFlow app)
