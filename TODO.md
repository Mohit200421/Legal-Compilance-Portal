# TODO - Remove AI assistance/features

## Step 1: Frontend cleanup

- [x] Remove `/ai-assistant` route and `<AiFab />` from `frontend/src/App.jsx`
- [x] Remove AI link from `frontend/src/components/Navbar.jsx`
- [x] Disable AI frontend client: `frontend/src/api/ai.js`
- [x] Delete AI UI/API files:
  - [x] `frontend/src/pages/common/AiChatPage.jsx`
  - [x] `frontend/src/components/AiAssistant.jsx`
  - [x] `frontend/src/components/AiFab.jsx`
  - [x] `frontend/src/api/ai.js`

## Step 2: Backend cleanup

- [x] Stop exposing `/api/ai-chat` (runtime wiring removed)
- [x] Delete `backend/routes/aiChatRoutes.js`
- [x] Remove AI dependency from `backend/package.json` (if present)

## Step 3: Verification

- [x] Run frontend build
- [ ] Run backend start/test/build
- [x] Search repo for remaining AI identifiers to ensure removal
