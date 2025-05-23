# Tiny Triumph

## Backend
- `source .venv/bin/activate`
- `python manage.py runserver`

### Dependencies
- `django`: Our main web framework.
- `djangorestframework` (DRF): Gives us serializers, viewsets, routers, and browsable API
- `django-cors-headers`: Let's our React dev server talk to Django without CORS errors
- `python-dotenv`: Helps us load sensitive settings (like SECRET_KEY) from a `.env` file
- `djangorestframework-simplyjwt`: Adds JWT-based authentication out of the box
- `psycopg2-binary`: To use PostgreSQL in production, we'll need a DB driver (SQLite fine for development)


### Scaffold the Django Project
In the backend directory, run the following script: `django-admin startproject backend .`
- Creates a `manage.py` at the current level
- Creates a subfolder `backend/` (inside the backend directory) containing:
  - `settings.py`
  - `urls.py`
  - `wsgi.py`
  - `asgi.py`

This gives us the full Django boilerplate -- project settings, URL routing, WSGI/ASGI entry points -- so we can start adding apps, middleware, and custom settings right away.


### Pulling Settings From the Environment
`SECRET_KEY = os.getenv('SECRET_KEY')`
- Django uses this to sign sessions and other security tokens
- By doing this, we keep it out of Git

`DEBUG      = os.getenv('DEBUG', 'False') == 'True'`
- When `DEBUG = True`, Django shows detailed error pages (not safe in production)
- We read it as a string (`'True'`/`'False'`) and convert to a Boolean

`ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '').split(',')`
- A list of domains the site can serve (Django will reject requests with unrecognized hosts)
- We store them comma-separated in `.env` (e.g. `ALLOWED_HOSTS=localhost,127.0.0.1`), then split into a Python list

`INSTALLED_APPS += ['corsheaders']`
- `django-cors-headers` lets the React app (running on, say `localhost:3000`) make AJAX calls to Django on `localhost:8000` without "CORS blocked" errors

`MIDDLEWARE.insert(0, 'corsheaders.middleware.CorsMiddleware')`
- We add the middleware first so it can attach the proper headers before any other processing

`CORS_ALLOWED_ORIGINS = os.getenv('ALLOWED_HOSTS', '').split(',')`
- We reuse our `ALLOWED_HOSTS` list for `CORS_ALLOWED_ORIGINS` so only known origins can call our API

`INSTALLED_APPS += ['rest_framework']`
- `rest_framework` provides serializers, viewsets, routers, and the browsable API interface

```py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
}
```
- We set up two auth methods:
  - **SessionAuthentication** for traditional Django session cookies (useful if you ever render server-side templates or use the DRF browsable API)
  - **JWTAuthentication** so React (or any client) can log in once, store a token, and send it with each request
- The default permission ("authenticated or read-only") means any user can `GET` lists or details, but only logged-in users can `POST`, `PUT`, or `DELETE`


### Creating a Django App
Splitting features into apps keeps our code modular, testable, and makes it easy to extract and reuse later.

Within the backend directory, we create an `app` directory (include `__init__.py`) to hold our separate modular apps.
- All custom apps live under `backend/apps/`, separate from Django's own code.

While in the backend directory, run: `python manage.py startapp users apps/[app-name]`
- Make sure to create the `[app-name]` directory in the apps directory before running.
- The following gets generated in the `apps/[app-name]` directory:
  - `__init__.py`
  - `admin.py`
  - `apps.py`
  - `migrations/`
  - `models.py`
  - `tests.py`
  - `views.py`

In `backend/backend/settings.py`, locate the `INSTALLED_APPS` list, and add the new app entry near the bottom of third-party apps:
```py
INSTALLED_APPS = [
    # Django defaults...
    'django.contrib.admin',
    'django.contrib.auth',
    # …

    # Third-party
    'rest_framework',
    'corsheaders',

    # Your apps
+   'apps.[app-name]',
]

```
- Django only discovers models, migrations, and other app components when the app is listed in `INSTALLED_APPS`. This registration hooks in your `models.py`, `admin.py`, and lets you create migrations.

#### When Creating Models or Making Changes
Tell Django to detect new models:

`python manage.py makemigrations users`:
- 1. Introspect your models:
  - Django looks at your `apps/users/models.py` (and any other models in that app) and compares the current model definitions to the last set of migrations you've generated.
- 2. Detect Changes:
  - It figures out what's new or altered:
    - New models (e.g. the Profile class) -> a **CreateModel** operation
    - Added/removed fields -> **AddField**/**RemoveField**
    - Changed field types or options -> **AlterField**
    - Deleted models -> **DeleteModel**
- 3. Generate a Migration File:
  - It writes a new Python file under `apps/users/migrations`, named something like `0001_initial.py` (or `0002_auto_...` if you've already got an initial).
  - That file contains a `Migration` class with an ordered list of those operations.
- 4. Keep it under version control:
  - You can inspect and commit this file -- because migrations are your schema's "source of truth" alongside your models.
- Why separate this step?
  - You get a chance to review exactly what SQL will run.
  - You can hand-edit complex migrations (e.g. data migrations or custom operations).
  - You avoid applying half-baked changes directly to the database.

`python manage.py migrate`:
- 1. Look at All Migrations:
  - Django scans every app in `INSTALLED_APPS` for a `migrations` directory, and reads the list of migration files.
- 2. Check What's Been Applied:
  - It consults the `django_migrations` table in your database to see which migrations have already run.
- 3. Compute the Plan:
  - It figures out which new migrations need to be applied, in dependency order.
  - This includes Django's own built-in migration (for `auth`, `contenttypes`, etc.) as well as any other apps.
- 4. Execute Operations:
  - For each outstanding migration it runs the Python code in that file, which under the hood issues SQL commands to:
    - Create or alter tables
    - Add or remove columns
    - Create indexes and constraints
    - (Optionally) Run data migrations or custom Python hooks
- 5. Record Success:
  - As each migration completes, Django writes a row into `django_migrations`, so it won't be re-applied on the next run.

