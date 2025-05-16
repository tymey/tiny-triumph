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
