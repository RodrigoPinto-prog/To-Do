# To-Do API (Laravel)

This project adds a simple Task API with authentication using Laravel Sanctum.

## Models
- User (existing)
- Task
  - title: string
  - description: text (nullable)
  - status: enum [pending, in_progress, done]

## Endpoints
- POST /api/register
  - body: { name?, email, password }
  - returns: { user, token }

- POST /api/login
  - body: { email, password }
  - returns: { user, token }

- POST /api/logout (auth)
  - header: Authorization: Bearer <token>
  - returns: { message }

- GET /api/tasks (auth)
  - returns paginated tasks belonging to the authenticated user

- POST /api/tasks (auth)
  - body: { title, description?, status }
  - returns created task

- GET /api/tasks/{id} (auth)
  - returns a single task (must belong to user)

- PUT/PATCH /api/tasks/{id} (auth)
  - body: { title?, description?, status? }
  - returns updated task

- DELETE /api/tasks/{id} (auth)
  - deletes the task

## Validation
- title: required, max 255
- status: one of pending, in_progress, done
- password: min 8

## Run locally
1. Install dependencies: `composer install` and `npm install` if needed.
2. Copy `.env.example` to `.env` and set DB config.
3. Run migrations: `php artisan migrate`
4. Run tests: `php artisan test`

## Notes
- Authentication uses Laravel Sanctum token API.
- JSON responses are returned via `TaskResource` for consistent formatting.
