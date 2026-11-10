# MyTasks V2 — Cloud Task Manager with Supabase

> A mobile task manager built with **React Native**, **Expo** and **Supabase**. Tasks are stored in a cloud PostgreSQL database, so they are the same on every device.

![Expo](https://img.shields.io/badge/Expo-SDK%2058-000020?logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React%20Native-0.88-61DAFB?logo=react&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?logo=supabase&logoColor=white)
![Platforms](https://img.shields.io/badge/Platforms-Android%20%7C%20iOS%20%7C%20Web-informational)

This is the **second version** of the project:

| Version | Repository | Storage |
| --- | --- | --- |
| V1 | [ToDoList-obaidAllahBenAli](https://github.com/obaid-ba/ToDoList-obaidAllahBenAli) | On the device (AsyncStorage) |
| **V2 (this repo)** | [TP-ListeTaches-V2](https://github.com/obaid-ba/TP-ListeTaches-V2) | In the cloud (Supabase) |
| V3 | [TP-ListeTaches-V3](https://github.com/obaid-ba/TP-ListeTaches-V3) | Offline-first: SQLite on the device, synced with Supabase |

---

## What's new compared to V1

- **Cloud backend:** tasks move from AsyncStorage to a **Supabase PostgreSQL** table.
- **Service layer:** all database calls go through `src/services/tasks.js`.
- **Clear error messages:** technical errors are turned into messages users can understand.
- **Loading and error screens,** with a **Retry** button.
- **Form validation:** the title must be at least 3 characters.
- **Cleaner code:** reusable components, shared constants and theme, a separate navigation file and helper functions.

## Features

- **Full task management:** create, read, update and delete tasks stored in Supabase.
- **Rich tasks:** title, description, priority (Low / Medium / High) and status (To do / Done).
- **Search and filters:** search by title (accent-insensitive) and filter All / To do / Done.
- **Statistics:** total, completed and remaining tasks.
- **Pull to refresh** on the task list.
- **Safe deletion** with a confirmation dialog.
- **Friendly errors** for common problems:
  - missing `tasks` table
  - invalid API key
  - access denied by security rules
  - no internet connection
  - task already deleted

## Tech stack

| Area | Technology |
| --- | --- |
| Framework | [Expo](https://expo.dev) SDK 58, React Native 0.88, React 19 |
| Backend | [Supabase](https://supabase.com) (PostgreSQL + REST API) via `@supabase/supabase-js` |
| Navigation | React Navigation 7 (bottom tabs + native stack) |
| State | React Context (`TaskContext`) |
| Icons and fonts | `@expo/vector-icons`, `expo-font` |

## Architecture

```
 Screens  ──►  TaskContext  ──►  services/tasks.js  ──►  lib/supabase.js  ──►  Supabase (PostgreSQL)
 (UI)          (shared state)    (CRUD + errors)         (client)
```

## Project structure

```
.
├── App.js                       # Providers + navigation
├── scripts/start.js             # Starts Expo on the Wi-Fi network address
├── supabase/schema.sql          # Database table + security policy
├── .env.example                 # Environment variables template
└── src/
    ├── components/              # AppButton, Badge, OptionGroup, StatsRow, TaskCard
    ├── constants/               # theme.js, tasks.js (priorities, statuses, filters)
    ├── context/TaskContext.js   # Shared task state
    ├── lib/supabase.js          # Supabase client
    ├── navigation/AppNavigator.js
    ├── screens/                 # Home, TaskList, TaskDetails, TaskForm, Profile, Loading, Error
    ├── services/tasks.js        # fetchTasks, createTask, updateTask, deleteTask
    └── utils/                   # alerts.js, format.js
```

## Database schema

```sql
create table public.tasks (
  id          uuid primary key default gen_random_uuid(),
  title       text not null check (char_length(trim(title)) > 0),
  description text not null default '',
  priority    text not null default 'moyenne' check (priority in ('faible', 'moyenne', 'elevee')),
  status      text not null default 'a_faire' check (status in ('a_faire', 'terminee')),
  created_at  timestamptz not null default now()
);
```

Row Level Security is turned on. The full script is in [`supabase/schema.sql`](supabase/schema.sql).

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org) (LTS)
- A free [Supabase](https://supabase.com) project
- The **Expo Go** app on your phone, or an emulator

### 1. Install

```bash
git clone https://github.com/obaid-ba/TP-ListeTaches-V2.git
cd TP-ListeTaches-V2
npm install
```

### 2. Set up the database

In your Supabase project, open **SQL Editor → New query**, paste the contents of `supabase/schema.sql` and click **Run**.

### 3. Configure the environment

```bash
cp .env.example .env.local
```

Then fill in the values from **Project Settings → API Keys**:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

### 4. Run

```bash
npm start
```

Scan the QR code with Expo Go. `npm start` uses your Wi-Fi network address automatically, which helps on computers that also have VMware or VirtualBox network adapters.

### Available scripts

| Command | Description |
| --- | --- |
| `npm start` | Start Expo on the Wi-Fi network address |
| `npm run tunnel` | Start Expo with a tunnel (when the phone is on a different network) |
| `npm run android` / `ios` / `web` | Open on a specific platform |

## Security note

The policy in `schema.sql` allows anyone who has the public key to read and change tasks. The app has no login, so this is fine for a demo or school project. Add Supabase Auth and per-user policies before using it in production.

## Author

**Obaid Allah Ben Ali** — [@obaid-ba](https://github.com/obaid-ba)

## License

Released under the MIT License. See [LICENSE](LICENSE).
