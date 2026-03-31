# Eval Platform

A jury-based application evaluation system. Admins upload CSVs, auto-assign conflict-free reviewers, and jury members score applications. Conflict detection triggers a 3rd reviewer.

## Quick Start

### 1. Install dependencies

```bash
cd eval-platform
npm run setup
```

### 2. Create the first admin user

```bash
node server/seed.js admin@example.com "Admin Name"
```

Replace `admin@example.com` with your actual email.

### 3. Start the app

```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### 4. Log in and set up

1. Open http://localhost:3000 and log in with your admin email
2. Go to **Upload CSVs** tab → upload jury CSV, then applications CSV
3. Go to **Assign** tab → click **Assign Reviewers**
4. Jury members can now log in and review their assigned applications

---

## CSV Formats

### Jury CSV

```csv
reviewer_id,name,email,campus_name,role
J001,Alice Smith,alice@example.com,MIT,jury
J002,Bob Jones,bob@example.com,Stanford,jury
A001,Carol Admin,carol@example.com,HQ,admin
```

| Column | Required | Notes |
|--------|----------|-------|
| `reviewer_id` | Yes | Unique ID |
| `name` | Yes | Full name |
| `email` | Yes | Unique, used for login |
| `campus_name` | No | Used for conflict-free assignment |
| `role` | No | `jury` (default) or `admin` |

### Applications CSV

```csv
application_id,name,campus_name,institution_name,email,github,portfolio,linkedin,graduation_year,answers,video_link
APP001,John Doe,MIT,MIT University,john@mit.edu,https://github.com/john,,,2025,"Why I want to join...",
```

| Column | Required | Notes |
|--------|----------|-------|
| `application_id` | Yes | Unique ID |
| `name` | No | Applicant name |
| `campus_name` | No | Used to prevent same-campus reviewers |
| `institution_name` | No | |
| `email` | No | |
| `github` | No | URL |
| `portfolio` | No | URL |
| `linkedin` | No | URL |
| `graduation_year` | No | |
| `answers` | No | Free text or JSON |
| `video_link` | No | URL |

---

## How It Works

### Reviewer Assignment

- Each application gets 2 reviewers from different campuses
- Reviewers are selected randomly from eligible pool (campus mismatch)
- If < 2 eligible reviewers: flagged as `needs_manual_assignment`

### Conflict Detection

- If `|score1 - score2| >= 4`: conflict flag set, 3rd reviewer auto-assigned
- Average score = mean of all submitted scores (2 or 3)

### Access Control

| Role | Access |
|------|--------|
| `admin` | All applications, CSV upload, assignment, full scores |
| `jury` | Only their assigned applications |

---

## Tech Stack

- **Backend**: Node.js + Express + SQLite (better-sqlite3)
- **Frontend**: React 18 + Vite + React Router v6
- **CSV**: csv-parser + multer
- **Auth**: Token-based (random hex token in sessions table)

## Project Structure

```
eval-platform/
├── server/
│   ├── index.js    # All Express routes
│   ├── db.js       # SQLite schema
│   └── seed.js     # Bootstrap first admin
└── client/
    └── src/
        ├── pages/
        │   ├── Login.jsx
        │   ├── Admin.jsx
        │   ├── Jury.jsx
        │   └── ApplicationDetail.jsx
        ├── api.js          # API functions
        ├── App.jsx         # Router + auth context
        └── index.css       # All styles
```
