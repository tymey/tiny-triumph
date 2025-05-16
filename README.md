# Tiny Triumph

## Backend

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
