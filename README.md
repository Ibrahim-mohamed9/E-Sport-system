# ⚡ ZU E-Sports Tournament Management System

**Faculty of Computers & Informatics — Zagazig University**  
System Analysis & Design Project | Academic Year 2025/2026

---

## 📁 Project Structure

```
esports/
├── backend/                  ← Node.js + Express API
│   ├── config/
│   │   └── db.js             ← MySQL connection pool
│   ├── middleware/
│   │   └── auth.js           ← JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js           ← Login, Register, Profile
│   │   ├── tournaments.js    ← Tournament CRUD + Registration
│   │   ├── teams.js          ← Teams CRUD + Roster management
│   │   ├── matches.js        ← Match scheduling + Results
│   │   ├── notifications.js  ← User notifications
│   │   └── misc.js           ← Leaderboard, Admin, Support, Announcements
│   ├── server.js             ← Main server entry point
│   ├── package.json          ← Node.js dependencies
│   └── .env.example          ← Environment variable template
│
├── frontend/                 ← HTML + CSS + Vanilla JS
│   ├── css/
│   │   └── style.css         ← Complete dark gaming theme
│   ├── js/
│   │   └── app.js            ← API helpers, auth, toast, navbar
│   └── pages/
│       ├── index.html        ← Home / Landing page
│       ├── login.html        ← Login page
│       ├── register.html     ← Registration page
│       ├── dashboard.html    ← User dashboard (team, tournaments, profile)
│       ├── admin.html        ← Admin control panel
│       ├── tournaments.html  ← Browse all tournaments
│       ├── tournament-detail.html ← Single tournament (bracket, teams, schedule)
│       ├── teams.html        ← Browse all teams
│       ├── team-detail.html  ← Single team profile
│       ├── leaderboard.html  ← Global rankings + podium
│       └── help.html         ← FAQ + Support form
│
└── database/
    ├── schema.sql            ← All table definitions + foreign keys
    └── seed.sql              ← Example data to get started
```

---

## 🚀 Setup Instructions (Step by Step)

### Step 1: Install Prerequisites

Make sure you have:
- **Node.js** v16+ → https://nodejs.org
- **MySQL** v8+ → https://dev.mysql.com/downloads/

### Step 2: Set Up the Database

Open MySQL and run:

```sql
source /path/to/esports/database/schema.sql
source /path/to/esports/database/seed.sql
```

Or using the command line:
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

### Step 3: Configure Environment

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your values:
```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=esports_db
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=7d
```

### Step 4: Install Node.js Dependencies

```bash
cd backend
npm install
```

### Step 5: Start the Server

```bash
npm start
```

Or for auto-reload during development:
```bash
npm run dev
```

### Step 6: Open the App

Visit: **http://localhost:3000**

---

## 🔑 Default Login Accounts

| Role  | Email                  | Password    |
|-------|------------------------|-------------|
| Admin | admin@university.edu   | password123 |
| User  | ahmed@student.edu      | password123 |
| User  | ibrahim@student.edu    | password123 |

> **Important:** Change passwords after first login!

---

## 📋 Features Checklist

### User Features
- [x] Register & Login with JWT authentication
- [x] Create and manage a team (captain role)
- [x] Add/remove players by username
- [x] Browse all tournaments with search & filters
- [x] Register team for tournaments
- [x] View tournament bracket
- [x] View match schedule and scores
- [x] Team public profile page
- [x] Global leaderboard with podium
- [x] Real-time notification bell
- [x] Edit personal profile & gaming ID
- [x] Submit support tickets
- [x] FAQ / Help Center

### Admin Features
- [x] Admin dashboard with stats
- [x] Create tournaments (all fields)
- [x] Change tournament status
- [x] Review & approve/reject registrations
- [x] Auto-generate Round 1 bracket
- [x] Schedule individual matches
- [x] Update match results + scores
- [x] Auto-update team win/loss records
- [x] Broadcast notifications to all users
- [x] Post announcements
- [x] View & respond to support tickets
- [x] View all teams and users

---

## 🛠️ Tech Stack

| Layer    | Technology              |
|----------|-------------------------|
| Frontend | HTML5, CSS3, Vanilla JS |
| Backend  | Node.js + Express.js    |
| Database | MySQL                   |
| Auth     | JWT + bcryptjs          |
| Fonts    | Orbitron, Rajdhani, Inter (Google Fonts) |

---

## 🔌 API Endpoints Summary

```
POST   /api/auth/register          Register new user
POST   /api/auth/login             Login
GET    /api/auth/me                Get own profile
PUT    /api/auth/profile           Update profile

GET    /api/tournaments            List all tournaments
GET    /api/tournaments/:id        Tournament details + teams + matches
POST   /api/tournaments            Create tournament (Admin)
PUT    /api/tournaments/:id        Update tournament (Admin)
POST   /api/tournaments/:id/register   Register team
GET    /api/tournaments/:id/registrations  Get registrations (Admin)
PUT    /api/tournaments/:id/registrations/:regId  Approve/reject (Admin)

GET    /api/teams                  List all teams
GET    /api/teams/:id              Team details + members
POST   /api/teams                  Create team
PUT    /api/teams/:id              Update team
GET    /api/teams/my/team          Get my team
POST   /api/teams/:id/members      Add player
DELETE /api/teams/:id/members/:uid Remove player

GET    /api/matches                List matches
POST   /api/matches                Schedule match (Admin)
PUT    /api/matches/:id/result     Update result (Admin)
POST   /api/matches/generate/:tid  Auto-generate bracket (Admin)

GET    /api/notifications          My notifications
GET    /api/notifications/unread-count  Unread count
PUT    /api/notifications/:id/read Mark read
PUT    /api/notifications/read-all Mark all read
POST   /api/notifications/broadcast  Broadcast (Admin)

GET    /api/leaderboard            Global rankings
GET    /api/admin/stats            Dashboard stats (Admin)
GET    /api/admin/users            All users (Admin)
GET    /api/announcements          Public announcements
POST   /api/announcements          Post announcement (Admin)
GET    /api/support                Support tickets
POST   /api/support                Submit ticket
PUT    /api/support/:id            Admin respond to ticket
```

---

## 🐛 Common Issues & Fixes

**"Cannot connect to database"**  
→ Make sure MySQL is running and your `.env` credentials are correct.

**"Access denied" on API calls**  
→ You need to login first. The JWT token expires after 7 days.

**"Registration is closed"**  
→ The tournament status must be "registration" to accept teams. Admin can change the status.

**Port already in use**  
→ Change `PORT=3000` in your `.env` file to another number like `3001`.

---

## 👨‍💻 Team

| Name | Section |
|------|---------|
| ابانوب عزت عزت داود | 1 |
| ابراهيم عبد الحميد عبد المنعم | 1 |
| ابراهيم محمد ابراهيم احمد حسين | 1 |
| ابراهيم محمد امين محمد الربع | 1 |
| احمد ابراهيم الشبراوي احمد | 1 |
| احمد اشرف صابر مصطفي الشناوي | 1 |
| احمد حسين محمد السيد | 2 |

**Instructors:** Dr. Islam Samy | Eng. Riham Medhat
