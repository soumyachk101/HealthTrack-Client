# Deployment Guide for HealthTrack+

This guide covers deploying the Django backend to **Vercel** and the React frontend to **Netlify**.

## Prerequisites

- GitHub Account (Repository pushed)
- Vercel Account
- Netlify Account
- PostgreSQL Database (e.g., Neon, Supabase, or Vercel Postgres) - **Required for Vercel**

---

## 1. Database Setup (PostgreSQL)

Vercel is serverless, so SQLite (the default `db.sqlite3`) **will not work** (data persists only for the duration of the function execution). You must use a hosted PostgreSQL database.

1.  **Create a database** on [Neon.tech](https://neon.tech/) (easiest free tier) or Supabase.
2.  **Get the Connection String**. It looks like:
    ```
    postgres://user:password@ep-host.region.aws.neon.tech/dbname?sslmode=require
    ```

---

## 2. Backend Deployment (Vercel)

### Project Configuration
The project is already configured with `vercel.json` and a WSGI entry point.

### Steps
1.  **Log in to Vercel** and click **"Add New..."** -> **"Project"**.
2.  **Import** your `HealthTrack` repository.
3.  **Root Directory**: Select `server` (since your backend is in the `server` folder).
4.  **Environment Variables**: Add the following:
    - `DJANGO_SETTINGS_MODULE`: `healthtracker.settings`
    - `SECRET_KEY`: Generate a random string (e.g., use an online generator).
    - `DEBUG`: `False`
    - `ALLOWED_HOSTS`: `.vercel.app`
    - `DATABASE_URL`: *Paste your PostgreSQL connection string here.*
    - `GOOGLE_API_KEY`: Your Google Gemini API Key.
    - `OPENAI_API_KEY`: Your OpenAI API Key (if used).
    - `EMAIL_HOST_USER` / `EMAIL_HOST_PASSWORD`: For email functionality (optional for now).

5.  **Deploy**. Vercel will install dependencies from `requirements.txt` and build the project.

### Post-Deployment
After a successful deploy, you might need to run migrations.
Since Vercel doesn't have a persistent shell, it's best to run migrations locally pointed at the production DB **once**, or use a custom build command (advanced).
**Easiest method:**
1.  From your local terminal:
    ```bash
    # Set the DATABASE_URL env var locally (temporary) to your production DB
    $env:DATABASE_URL="your-postgres-connection-string"
    
    # Run migrations
    python manage.py migrate
    ```

---

## 3. Frontend Deployment (Netlify)

### Steps
1.  **Log in to Netlify** and click **"Add new site"** -> **"Import an existing project"**.
2.  **Connect to GitHub** and select your `HealthTrack` repo.
3.  **Base directory**: `client`.
4.  **Build command**: `npm run build`.
5.  **Publish directory**: `dist`.
6.  **Environment Variables**:
    - click **"Show advanced"** -> **"New Variable"**.
    - Key: `VITE_API_URL`
    - Value: `https://your-project-name.vercel.app` (The URL of your deployed Backend from Step 2).
    - **Note:** Do NOT add a trailing slash `/` (e.g., use `...app`, not `...app/`).

7.  **Deploy Site**.

---

## 4. Final Verification

1.  Open your Netlify URL.
2.  Try to **Register** a new user.
3.  If successful, the backend database is connected and API calls are working!
