# TODO - Authentication + Lawyer Application System

## Step 0: Repo understanding (done)

- Reviewed existing auth + lawyer apply flow (older simplified apply-lawyer).
- Identified gaps vs requested spec (LawyerApplication collection, OTP activation, forced password reset, admin endpoints).

## Step 1: Create new Mongoose model

- [x] Add `backend/models/LawyerApplication.js` with required fields + enums.

## Step 2: Update User model

- [ ] Add fields needed for activation + forced password reset on first login.

## Step 3: Fix normal user registration OTP flow

- [ ] Update `POST /api/auth/register` to remove role field requirement and default role="user".
- [ ] Ensure registration sets OTP + `isActivated=false` (or equivalent).
- [ ] Ensure `verifyOtp` sets activation flag.
- [ ] Ensure login blocks until activated.

## Step 4: Implement new lawyer application endpoints

- [ ] Create controller for `POST /api/lawyer/apply`:
  - [ ] Parse text fields + uploads (profilePhoto + documents)
  - [ ] Store in LawyerApplication collection with status="pending".
- [ ] Create routes for `/api/lawyer/apply`.

## Step 5: Implement admin lawyer application management endpoints

- [ ] Create controller functions:
  - [ ] GET all applications
  - [ ] GET application by id
  - [ ] PATCH approve (create User lawyer account, secure random password, hash, role="lawyer", isVerified=true/activated)
  - [ ] PATCH reject (set rejectionReason, send rejection email)
- [ ] Create routes under `/api/admin/lawyer-applications`.

## Step 6: Update server routing

- [ ] Mount new routers in `backend/server.js`.

## Step 7: Email templates + notifications

- [x] Refactor email system to Nodemailer-only (remove Resend).
- [ ] Add email sending logic for:
  - [ ] Lawyer application received
  - [ ] Lawyer approved (temporary password + login URL)
  - [ ] Lawyer rejected (reason + reapply instructions)

## Step 8: Upload system (Multer + Cloudinary)

- [ ] Add Multer+Cloudinary handling for profilePhoto and documents.
- [ ] Validate file types/sizes.

## Step 9: Frontend lawyer application UI

- [ ] Update `frontend/src/pages/auth/ApplyLawyer.jsx` to match multi-step form + uploads + validations + preview.

## Step 10: Frontend admin pages

- [ ] Create:
  - [ ] `frontend/src/pages/admin/LawyerApplicationsPage.tsx`
  - [ ] `frontend/src/pages/admin/LawyerApplicationDetailsPage.tsx`
- [ ] Wire into `frontend/src/App.jsx` admin routes.

## Step 11: Frontend auth/OTP correctness

- [ ] Ensure OTP verification page works with updated backend activation flag.
- [ ] Ensure lawyer/admin routing respects role checks and forced password reset.

## Step 12: Testing

- [ ] Run backend server and verify end-to-end flows:
  - [ ] User registration → OTP verify → activated → login works
  - [ ] Lawyer application submission → stored as pending
  - [ ] Admin approve → user created + email sent + lawyer first-login forces password reset
  - [ ] Admin reject → email sent + status updated
