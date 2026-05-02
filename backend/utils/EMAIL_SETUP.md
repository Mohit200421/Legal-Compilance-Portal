# Email Setup Guide

## Quick Test

1. **Check Configuration:**

   - Local: http://localhost:5000/test-mail/config
   - Production: https://legal-compilance-portal.onrender.com/test-mail/config

2. **Send Test Email:**
   - Local: http://localhost:5000/test-mail
   - Production: https://legal-compilance-portal.onrender.com/test-mail

---

## Email Providers

### Option 1: Resend (Recommended - Easiest Setup)

1. Go to https://resend.com
2. Sign up (free tier: 100 emails/month)
3. Get your API key: `re_xxxxxxxxxxxxx`
4. Add to Render environment variables:

```
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Optional - Customize sender name and email
EMAIL_FROM_NAME=Legal Portal
EMAIL_FROM=yourverifiedemail@gmail.com  # Your verified email
```

No additional setup needed!

---

### Option 2: Gmail SMTP (Fallback)

If you prefer Gmail:

1. Enable 2-Step Verification on your Google Account:

   - https://myaccount.google.com/
   - Security → How you sign in to Google → 2-Step Verification

2. Create App Password:

   - Search "App Passwords" in Google Account settings
   - Create new → App: "Legal Portal", Device: "Other"
   - Copy the 16-character password

3. Add to Render environment variables:

```
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=xxxxxxxxxxxxxxxx  (16-char app password, no spaces)
```

---

## How It Works

The email service auto-detects which provider to use:

| Priority | Provider | Environment Variables       |
| -------- | -------- | --------------------------- |
| 1st      | Resend   | `RESEND_API_KEY`            |
| 2nd      | Gmail    | `EMAIL_USER` + `EMAIL_PASS` |
| None     | Error    | Neither set                 |

---

## Test Endpoints

| Method | URL                 | Purpose             |
| ------ | ------------------- | ------------------- |
| GET    | `/test-mail`        | Send test email     |
| GET    | `/test-mail/config` | Check config status |
| POST   | `/api/test-email`   | Send custom email   |

---

## Email Logs

Check Render Logs for:

- `✅ Email sent via Resend: {to, subject, id}`
- `✅ Email sent via Nodemailer: {to, subject, messageId}`
- `❌ Email failed: {error}`

---

## Troubleshooting

| Issue                          | Fix                                    |
| ------------------------------ | -------------------------------------- |
| "No email provider configured" | Add RESEND_API_KEY in Render env vars  |
| Email not sending              | Check Render logs for errors           |
| Resend not working             | Verify API key is correct              |
| Gmail not working              | Use App Password, not regular password |

---

## Current Status

The email system is configured to work with **either** Resend or Gmail. It will automatically detect which one you have set up in your Render environment variables.
