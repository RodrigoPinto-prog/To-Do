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

## Git & Repositório público

Requisitos:

- O repositório público deve ser criado no GitHub ou GitLab.
- Seguir boas práticas de Git: commits pequenos e descritivos, uso de branches para features/bugfixes e pull/merge requests para revisão.

Boas práticas sugeridas:

- Commits: escreva mensagens curtas e descritivas no imperativo (ex: "Add user registration endpoint"). Quebre mudanças grandes em commits menores e testáveis.
- Branching: use branches nominais como `feature/auth`, `feature/tasks-crud`, `fix/login-bug`.
- Pull requests: abra PRs a partir de branches de feature para `main` (ou `develop`) e inclua uma descrição do que foi feito e como testar.

Exemplos de mensagens de commit:

- "Init project: scaffold Laravel app"
- "Implement task model and migration"
- "Add API login and register endpoints"

Como criar um repositório público (manual):

1. No GitHub/GitLab, clique em "New repository".
2. Dê um nome (ex: to-do), marque como público e crie o repositório.

Usando GitHub CLI (`gh`) — opcional:

1. Autentique: `gh auth login`
2. Crie o repo público e faça push inicial:

```
gh repo create <username>/to-do --public --source=. --remote=origin --push
```

Adicionar remote manualmente e empurrar (exemplo):

```
git remote add origin https://github.com/<username>/to-do.git
git branch -M main
git push -u origin main
```

Criar e trabalhar com branches locais:

```
git checkout -b feature/auth
# depois de concluir trabalho local
git add .; git commit -m "Add auth endpoints"
git push -u origin feature/auth
```

Merge/pull request:

- Abra o PR na interface do GitHub/GitLab, selecione reviewers e descreva como testar.

## Resumo de execução local (detalhado)

1. Instalar requisitos (exemplo usando Windows):

```
# PHP + Composer (instale via instalador do Windows)
composer install

# Node.js + npm
npm install
```

2. Configurar env e chave de app:

```
copy .env.example .env
php artisan key:generate
```

3. Configurar base de dados no `.env` e rodar migrations:

```
php artisan migrate
```

4. Rodar servidor local:

```
php artisan serve
```

5. Rodar testes:

```
php artisan test
```

## Políticas de commit e revisão

- Mantenha PRs pequenos quando possível (< 300 linhas) para facilitar revisão.
- Inclua testes para funcionalidades novas ou correções relevantes.
- Documente endpoints e mudanças breaking no changelog ou no corpo do PR.

---

Se quiser, eu posso criar as branches locais recomendadas (`feature/auth` e `feature/tasks-crud`) e commitar essa atualização do `README.md` por você.
