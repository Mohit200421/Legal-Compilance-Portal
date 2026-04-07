# Login Deploy Fix Progress

## ✅ Completed

- [x] Update backend/server.js: CORS origin to CLIENT_URL || https://legal-compilance-portal.vercel.app

## ⏳ Remaining

- [ ] Edit backend/controllers/authController.js: Dynamic secure cookie for production
- [ ] Create backend/.env.example: Env var templates
- [ ] Create frontend/.env.example: VITE_API_URL template
- [ ] Update frontend/src/api/axios.js: Add error logging for debugging
- [ ] Update README.md: Add deployment checklist
- [ ] Test login locally with production-like env
- [ ] Deploy backend with env vars (CLIENT_URL, JWT_SECRET, etc.)
- [ ] Frontend deploy with VITE_API_URL=backend-url

## Deploy Checklist

```
Backend Env Vars:
CLIENT_URL=https://legal-compilance-portal.vercel.app
JWT_SECRET=your-64-char-secret
MONGODB_URI=...
NODE_ENV=production

Frontend Env Vars:
VITE_API_URL=https://your-backend-url.onrender.com
```
