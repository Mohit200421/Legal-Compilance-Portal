# CORS Fix TODO

## Step 1: Analysis & Planning ✅

## Step 2: Code edits ✅

- backend/server.js (removed trailing / from CORS origins)
- frontend/src/api/axios.js (fixed double slash - trim trailing / + "/api")

## Step 3: Deploy [PENDING]

- Push backend to Render
- Push frontend to Vercel

## Step 4: Environment Variables [PENDING]

**Render Environment Variables:**

```
CLIENT_URL=https://legal-compilance-portal.vercel.app
```

**Vercel Environment Variables:**

```
VITE_API_URL=https://legal-compilance-portal.onrender.com
```

## Step 5: Test [PENDING]

- Login from https://legal-compilance-portal.vercel.app
- Check no CORS/socket errors in console
