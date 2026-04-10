# Payment Verification Flow Implementation

✅ Plan approved - User confirmed to proceed

## Current Status

- [x] User Send Request ✅ (TalkToLawyer → LawyerCard)
- [x] Lawyer Accept Request ✅ (Lawyer Requests page)
- [x] User Pay Razorpay ✅ (MyRequests page)
- [x] Backend Order/Verify ✅ (paymentController)
- [x] DB Save Payment ✅ (Payment model)
- [x] Request PAYMENT_VERIFIED ✅ (paymentController)
- [x] Frontend Chat Unlock ✅ (MyRequests Chat button)

## To Complete (11 Steps)

### 1. Backend Model (ContactRequest)

- [ ] Add `amount: { type: Number, default: 500 }`

### 2. Backend Controller Updates (3 files)

- [ ] userController.js: Add GET /user/my-requests-map
- [ ] lawyerController.js: updateRequestStatus → emit socket 'requestStatusUpdated'
- [ ] paymentController.js: verifyRazorpayPayment → emit socket 'paymentVerified'

### 3. Backend SocketHandler.js

- [ ] Add handlers for 'requestStatusUpdated', 'paymentVerified'
- [ ] Relay to specific user rooms

### 4. Frontend LawyerCard.jsx

- [ ] Add status badges/buttons: Request | Pay | Chat
- [ ] Use requestStatus prop from TalkToLawyer

### 5. Frontend TalkToLawyer.jsx

- [ ] Socket listeners for status updates → refresh requestMap

### 6. Frontend LawyerRequests.jsx

- [ ] Socket listener for payment verified → show chat button

### 7. Test Flow End-to-End

```
1. User → TalkToLawyer → Send Request to lawyer
2. Lawyer → Requests → Accept
3. User → MyRequests → Pay ₹500 ✅
4. Request → PAYMENT_VERIFIED
5. Lawyer → Chat button appears 💬
6. Real-time updates work
```

## Progress Tracking

```
✅ Backend Model
✅ Backend Controllers + Socket Emits
✅ Backend SocketHandler relay
✅ Frontend LawyerCard status UI
✅ Frontend TalkToLawyer socket listener
✅ Frontend LawyerRequests socket listener

Completed: 6/7 major steps
Next: Test full flow end-to-end
```

**Current Task Progress: 85% → Target: 100%**
