# Chroniq API (Backend)

TypeScript Express API for records, workdays, projects, users, roles, and auth. Base path is `/api`.

## Setup

1. Create `.env` in `backend/`:
   ```
   MONGODB_CONNECTION_STRING=<your mongo uri>
   PORT=8080
   FIREBASE_API_KEY=<firebase web api key>
   FIREBASE_AUTH_DOMAIN=<firebase auth domain>
   FIREBASE_PROJECT_ID=<firebase project id>
   FIREBASE_STORAGE_BUCKET=<firebase storage bucket>
   FIREBASE_MESSAGING_SENDER_ID=<firebase messaging sender id>
   FIREBASE_APP_ID=<firebase app id>
   ```
2. Install deps: `pnpm install`
3. Start dev server: `pnpm dev` (prod: `pnpm start`)

## API Quickstart

- Health: `GET /api` -> `{ "message": "Chroniq API läuft" }`
- Auth:
  - `POST /api/auth/register` body: `{ email, password, firstName, lastName }`
  - `POST /api/auth/login` body: `{ email, password }`
  - `POST /api/auth/logout`
  - `POST /api/auth/change-password` body: `{ email, password, newPassword }`
- Resources (CRUD): `/api/records`, `/api/workdays`, `/api/projects`, `/api/users`, `/api/roles`

## API Reference

Base path: `/api`

### Auth

- `POST /auth/register` — Register a new user in Firebase + Mongo profile.
- `POST /auth/login` — Log in a user (Firebase Auth) and return stored profile.
- `POST /auth/logout` — Log out current Firebase user.
- `POST /auth/change-password` — Re-authenticate and update password.

### Records

- `GET /records` — List all time records.
- `POST /records` — Create a time record.
- `GET /records/user/:userId` — List records for a user.
- `GET /records/:id` — Get a single record by id.
- `PUT /records/:id` — Update a record by id.
- `DELETE /records/:id` — Delete a record by id.

### Workdays

- `GET /workdays` — List all workdays.
- `POST /workdays` — Create a workday entry.
- `GET /workdays/user/:userId/:date` — List workdays for a user on a date.
- `GET /workdays/user/:userId` — List all workdays for a user.
- `GET /workdays/:id` — Get a single workday by id.
- `PUT /workdays/:userId` — Update a workday for a user by date (payload includes date).
- `DELETE /workdays/:id` — Delete a workday by id.
- `GET /workdays/homeoffice/:userId/:date` — Get home office status for a user on a date.
- `GET /workdays/homeoffice/bulk/:userId?from=YYYY-MM-DD&to=YYYY-MM-DD` — Get home office status map for a date range.

### Workmonths

- `GET /workmonths/user/:userId` — Get monthly summary for a user (optional `?year=YYYY&month=MM`).

### Projects

- `GET /projects` — List all projects.
- `POST /projects` — Create a project.
- `GET /projects/user/:userId/count` — Count projects for a user.
- `GET /projects/user/:userId` — List projects for a user.
- `GET /projects/:id` — Get a project by id.
- `PUT /projects/:id` — Update a project by id.
- `DELETE /projects/:id` — Delete a project by id.

### Users

- `GET /users` — List all users.
- `GET /users/:id` — Get a user by id.
- `POST /users` — Create a user document.
- `PUT /users/:id` — Update a user by id.
- `PUT /users/:id/preferences` — Update user preferences.
- `DELETE /users/:id` — Delete the logged-in user + related data and Firebase account.

### Roles

- `GET /roles` — List all roles.
- `GET /roles/:id` — Get a role by id.
- `POST /roles` — Create a role.
- `PUT /roles/:id` — Update a role by id.
- `DELETE /roles/:id` — Delete a role by id.

## Delete User Behavior

- `DELETE /api/users/:id` removes the MongoDB user record and all related records with `userId`
  (`timeRecords`, `workdays`, `projects`) **and** deletes the Firebase Auth account.
- This only works for the currently logged-in user (the backend uses Firebase Client SDK and
  `auth.currentUser`).

## Notes
