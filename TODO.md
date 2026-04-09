# Fix EditProfile page failed to load profile

## Steps:

- [x] 1. Add getMyProfile to frontend/src/api/lawyerApi.js
- [x] 2. Fix backend/controllers/lawyerController.js getMyProfile: add populate('cityId stateId'), transform practiceAreas/services to [{_id: str}]
- [x] 3. Update frontend/src/pages/lawyer/EditProfile.jsx: use getMyProfile, safe .map for practiceAreas, better error handling
- [ ] 4. Test: restart backend/frontend, check /lawyer/profile loads data, EditProfile fills form
- [ ] 5. Update Dashboard.jsx if needed for real profile data
- [ ] 6. attempt_completion

Current: Starting step 1
