# Prompt 24 — Backend Flask Setup (API en :5001)

Objetivo: crear un backend mínimo en Flask que sirva como servidor OAuth y API proxy para Google Classroom, corriendo en `http://localhost:5001`.

## Estructura propuesta
```
backend/
  app.py
  config.py
  requirements.txt
  .env.example
  routes/
    __init__.py
    auth.py
    api.py
  services/
    __init__.py
    classroom.py
  utils/
    __init__.py
    http.py
```

## Requisitos
- Python >= 3.10
- Flask >= 3
- python-dotenv
- requests (o httpx)
- Flask-Cors

## Pasos
1) Crear `requirements.txt` con dependencias mínimas.
2) Implementar `config.py` que lea `.env` (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SECRET_KEY, BASE_URL, FRONTEND_URL).
3) Crear `app.py` con registro de Blueprints (`routes/auth.py`, `routes/api.py`) y CORS permitiendo `http://localhost:5173`.
4) Exponer healthcheck `GET /health`.
5) Variables de entorno en `.env.example` (ver `27_backend_env_template.md`).

## Criterios de aceptación
- `python -m flask run -p 5001` levanta en `http://localhost:5001`.
- `GET /health` devuelve 200 y `{status: 'ok'}`.
- CORS habilitado para el frontend local.
