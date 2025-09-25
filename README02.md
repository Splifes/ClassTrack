# Semillero Digital Dashboard - Nerdearla Vibeathon

A comprehensive web dashboard that integrates with Google Classroom API to track student progress, improve communication, and generate metrics for educational programs.

> Nota importante: Este repositorio ahora contiene documentación y código ejecutable. Las referencias a comandos, archivos o configuraciones (Vite/React/Flask/OAuth) se implementan con un scaffold mínimo bajo `frontend/` (Vite + React + TS + Bootstrap 5) y `backend/` (Flask con OAuth server-side). Para ejecutar por partes, ver `prompts/INDEX_BY_CATEGORY.md` y los batches `prompts/90–97_batch_*.md`.

## 🎯 Features

- **Google Classroom Integration**: Direct connection to Google Classroom API
- **Student Progress Tracking**: Monitor assignment completion, late submissions, and overall progress
- **Role-based Views**: Different interfaces for students, teachers, and coordinators
- **Advanced Filtering**: Filter by course, assignment status, and late deliveries
- **Analytics & Reports**: Graphical charts and exportable CSV reports
- **Automated Notifications**: Email, WhatsApp, and Telegram notifications (configurable)
- **Responsive Design**: Modern UI with Bootstrap 5

## 🧱 Architecture (Option A)

- **Frontend**: React 18 + Vite + TypeScript + Bootstrap 5
  - Dev server: `http://localhost:5173`
  - OAuth flow initiated via backend endpoints
- **Backend**: Flask (Python) on `http://localhost:5001`
  - OAuth 2.0 Authorization Code (server-side) with Google
  - API proxy to Google Classroom
  - CORS allowing frontend origin
- **Database**: Future integration (e.g., Supabase/PostgreSQL) optional for persistence beyond Google data

Prompts relevantes:
- `prompts/23_frontend_bootstrap_scaffold.md`
- `prompts/24_backend_flask_setup.md`
- `prompts/25_backend_oauth_google.md`
- `prompts/26_backend_api_endpoints.md`
- `prompts/27_backend_env_template.md`

## 🚀 Setup Guide

### Step 1: Google Cloud Console Setup

This is the most critical part. Follow these steps carefully:

#### 1.1 Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. Enter project name: `semillero-digital-dashboard`
4. Click **"Create"**
5. Wait for project creation and select it

#### 1.2 Enable Required APIs

1. Go to **APIs & Services** → **Library**
2. Search and enable these APIs:
   - **Google Classroom API** ⚠️ **CRITICAL**
   - **Google People API** (for user profiles)
3. Click **"Enable"** for each API

#### 1.3 Configure OAuth Consent Screen

⚠️ **This step is essential to avoid 403 access_denied errors**

1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **"External"** user type (unless you have Google Workspace)
3. Fill in **App Information**:
   - **App name**: `Semillero Digital Dashboard`
   - **User support email**: Your email address
   - **App logo**: Optional
   - **App domain**: Leave blank for development
   - **Developer contact information**: Your email address
4. Click **"Save and Continue"**

5. **Add Scopes** (Click "Add or Remove Scopes"):
   - `https://www.googleapis.com/auth/classroom.courses.readonly`
   - `https://www.googleapis.com/auth/classroom.rosters.readonly`
   - `https://www.googleapis.com/auth/classroom.student-submissions.students.readonly`
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`
   - `openid`
6. Click **"Update"** → **"Save and Continue"**

7. **Add Test Users** (for development):
   - Add your email address
   - Add any other users who need access during development
   - Click **"Save and Continue"**

8. **Review** and click **"Back to Dashboard"**

#### 1.4 Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **"+ Create Credentials"** → **"OAuth 2.0 Client IDs"**
3. Choose **"Web application"**
4. **Name**: `Semillero Digital Dashboard`
5. **Authorized redirect URIs** - Add the EXACT URIs, for example:
  ```
  http://localhost:5001/oauth/callback
  http://127.0.0.1:5001/oauth/callback
  ```
6. Click **"Create"**
7. **IMPORTANT**: Copy the **Client ID** and **Client Secret** immediately


#### 1.5 Environment Configuration

1. Create backend `.env` based on `prompts/27_backend_env_template.md`:
   ```bash
   # Server
   FLASK_ENV=development
   PORT=5001
   BASE_URL=http://localhost:5001
   FRONTEND_URL=http://localhost:5173
   SECRET_KEY=change-this-in-production

   # Google OAuth (from Step 1.4)
   GOOGLE_CLIENT_ID=856042286573-your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-your-client-secret
   GOOGLE_REDIRECT_URI=http://localhost:5001/oauth/callback
   ```
2. Do not commit real secrets. Keep `.env` local.

### Step 2: Local Development (Frontend + Backend)

1. Backend (Flask)
   - Requirements: Python >= 3.10
   - Follow `prompts/24_backend_flask_setup.md`
   - Run: `python -m flask run -p 5001`
   - Healthcheck: `GET http://localhost:5001/health`
2. Frontend (Vite)
   - Requirements: Node >= 18, pnpm >= 8
   - Follow `prompts/23_frontend_bootstrap_scaffold.md`
   - Run: `pnpm install && pnpm dev` → `http://localhost:5173/`
3. OAuth Flow
   - Frontend calls `GET /api/auth/login` (backend), which redirects to Google
   - Google redirects back to `http://localhost:5001/oauth/callback`
   - Backend stores session and redirects the browser to frontend `/auth/callback`

## 🚨 Common Issues & Solutions

### Issue: `AttributeError: 'Config' object has no attribute 'GOOGLE_CLIENT_ID'`

**Solution**: Environment variables not loading properly
```bash
# Check .env file format (no quotes, no spaces around =)
cat .env
```

### Issue: `Error 403: access_denied`

**Causes & Solutions**:
1. **OAuth consent screen not configured**
   - Complete Step 1.3 above
   - Add your email as a test user

2. **Wrong redirect URI**
   - Ensure exact match, i.e.: `http://localhost:5001/oauth/callback`
   - Check port number (5001)

3. **APIs not enabled**
   - Enable Google Classroom API in Google Cloud Console

### Issue: `localhost redirected you too many times`

**Solution**: Clear browser data
```bash
# Chrome/Safari: Cmd + Shift + Delete
# Or use incognito/private window
# Restart the app
```

### Issue: `The credentials do not contain the necessary fields`

**Solution**: Re-authenticate to get refresh token
1. Clear browser cookies completely
2. Restart app
3. Go through OAuth flow again
4. The app now forces consent to get proper credentials

### Issue: Scope mismatch errors

**Solution**: Already fixed in the code
- The app uses consistent OAuth flow
- Simplified scopes to avoid conflicts
- Clear browser cache if you still see this

## 🔒 Security Notes

- Never commit `.env` file to version control
- Use strong `SECRET_KEY` in production
- Configure proper OAuth redirect URIs for your domain

- Your environment (OS, Python version)
- Whether you completed all Google Cloud Console steps
