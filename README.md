# To-Do (Mini Task Manager)

This repository contains a small collaborative task manager built with Laravel (API) and Vue 3 (SPA) using Inertia and Vite.

## Overview
- Laravel backend with Sanctum authentication.
- Vue 3 frontend (Vite, Inertia) and Pinia for state management.
- Pest for automated tests (feature + unit tests included).

## Local setup
1. Copy `.env.example` to `.env` and set DB credentials.
2. Install PHP dependencies:

   composer install

3. Install Node dependencies and build assets:

   npm install
   npm run dev

4. Run migrations and seed (if you want sample data):

   php artisan migrate
   php artisan db:seed

5. Serve the application:

   php artisan serve or npm run dev

   The SPA is served via Vite at `https://vite.to-do.test:5173/` (configured when using Vite dev server).

## Tests
Run Pest tests:

```
./vendor/bin/pest
```

Tests include feature tests for authorization, CRUD operations, validation and pagination.

## Notes and implementation details
- Authentication is handled with Laravel Sanctum and token-based API access. The frontend stores the token in `localStorage`.
- Pagination is implemented in the backend using Eloquent's `paginate(15)` and the API returns a paginated `TaskResource` collection.
- Pinia is used to store tasks and metadata (`resources/js/stores/tasks.ts`).
- Frontend components:
  - `resources/js/Components/TaskForm.vue` - reusable task creation form
  - `resources/js/Components/TaskItem.vue` - reusable task display and inline edit
