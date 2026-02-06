![Codecov](https://img.shields.io/codecov/c/github/HiagoAC/kanli?flag=backend&label=backend%20coverage)
![Codecov](https://img.shields.io/codecov/c/github/HiagoAC/kanli?flag=frontend&label=frontend%20coverage)

[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=HiagoAC_kanli&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=HiagoAC_kanli)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=HiagoAC_kanli&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=HiagoAC_kanli)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=HiagoAC_kanli&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=HiagoAC_kanli)

# Kanli
A [kanban board](https://en.wikipedia.org/wiki/Kanban_board) application designed to help teams and individuals organize work efficiently. Users can create boards, define columns, and organize tasks as cards to reflect their workflow. Cards can be moved across columns to clearly visualize progress from start to completion.


## Key Features

* **Multiple Boards** - Create as many boards as needed to organize work by project, and star favorites for quick access
* **Flexible Workflows** - Add, rename, remove, and rearrange columns to match your workflow
* **Card Management** - Add task details, set priorities (low/medium/high), and move or reorder cards with drag-and-drop
* **Sign in with Google** - Sign in quickly using your Google account, no extra password required
* **Guest Mode** - Try the app without signing up; you can choose to keep or discard guest boards when you sign in
* **Pick Up Where You Left Off** - Automatically opens your most recently updated board when you return
* **Smooth Experience** - Changes appear immediately so you can stay in flow while everything saves in the background


## Tech Stack

### **Backend**
* **Language:** [Python](https://www.python.org) 3.13
* **Web Framework:** [Django](https://www.djangoproject.com) 5.2
* **REST API Framework:** [Django Ninja](https://django-ninja.dev) 1.4
* **Database:** [PostgreSQL](https://www.postgresql.org) 17
* **Authentication:** [Google OAuth2](https://developers.google.com/identity/protocols/oauth2), [Python Social Auth](https://pypi.org/project/social-auth-app-django/) 5.7
* **Application Server:** [Gunicorn](https://gunicorn.org) 23.0, [WhiteNoise](https://whitenoise.readthedocs.io) 6.11
* **Testing:** [Django test framework](https://docs.djangoproject.com/en/5.2/topics/testing/), [Coverage.py](https://coverage.readthedocs.io) 7.13
* **Linting & Formatting** [Flake8](https://flake8.pycqa.org) 7.3, [Bandit](https://bandit.readthedocs.io) 1.9

### **Frontend**
* **Language:** [TypeScript](https://www.typescriptlang.org) 5.9
* **Frontend Library:** [React](https://react.dev) 19
* **Build Tool:** [Vite](https://vite.dev) 7
* **UI Library:** [Material-UI](https://mui.com) 7
* **State Management:** [TanStack Query](https://tanstack.com/query) 5
* **Drag & Drop:** [dnd-kit](https://dndkit.com) 6.3
* **HTTP Client:** [Axios](https://axios-http.com) 1.12
* **Testing:** [Vitest](https://vitest.dev) 3.2
* **Linting & Formatting:** [Biome](https://biomejs.dev) 2

### **Infrastructure**
* **CI/CD:** [GitHub Actions](https://github.com/features/actions)
* **Containerization:** [Docker](https://www.docker.com), [Docker Compose](https://docs.docker.com/compose)
* **Deployment:** [Railway](https://railway.app) (backend), [Vercel](https://vercel.com) (frontend), [Supabase](https://supabase.com) (database)


## Future Improvements

* **Sharing** - Share boards with others via invite links or collaborators, with configurable permissions (view/comment/edit).
* **Task Assignment** - Assign one or more users to a card, display avatars on cards, and support “assigned to me” workflows.
* **WIP** - Set the maximum number of cards in specifics columns to prevent the accumulation of incomplete tasks.
* **Swimlanes** - Group cards into horizontal lanes (e.g., by assignee, priority, or label) to organize large boards.
* **Filtering** - Quickly narrow visible cards by text, labels, priority, assignee, or status.
* **Dark Mode** - Add a theme toggle (system / light / dark) and persist preference across sessions.
