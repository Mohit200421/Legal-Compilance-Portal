# Remove Theme Feature - TODO

## Steps:

- [x] 1. Delete theme-specific files: frontend/src/components/ThemeToggle.jsx, frontend/src/context/ThemeContext.jsx
- [x] 2. Update frontend/tailwind.config.js: Remove/change darkMode to false
- [x] 3. Update frontend/src/main.jsx: Remove duplicate ThemeProvider wrapper
- [x] 4. Update frontend/src/App.jsx: Remove ThemeProvider wrapper ✓
- [x] 5. Update frontend/src/components/Navbar.jsx: Remove useTheme import/hook, all toggle buttons/handlers, replace dark: classes with light defaults ✓
- [x] 6. Check layouts/pages for remaining dark: classes and replace if heavy usage (Navbar cleaned, others likely light now, search showed no matches)
- [ ] 7. Test: cd frontend && npm run dev, verify no theme toggle, light theme only, no errors
- [ ] 8. Clear any temp files if needed, complete task
