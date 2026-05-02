# Email Setup Guide for Legal Portal

## Prerequisites

The following dependencies are already installed:

- ✅ nodemailer v7.0.12
- ✅ dotenv v17.4.1

## Environment Variables

Add the following to your `backend/.env` file:

```env
# ================= EMAIL CONFIG =================
# Gmail SMTP Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Optional: Custom SMTP (if not using Gmail)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
```

## IMPORTANT: How to Generate Gmail App Password

Gmail does not allow using your normal password for less secure apps. You must use an **App Password**:

### Steps to Generate App Password:

1. **Go to your Google Account**

   - Visit: https://myaccount.google.com/

2. **Enable 2-Factor Authentication** (if not already enabled)

   - Go to Security → How you sign in to Google
   - Enable 2-Step Verification

3. **Generate App Password**

   - Go to Security → How you sign in to Google
   - Search for "App Passwords" in the search bar
   - Select "Other (custom name)" and enter "Legal Portal"
   - Click Generate
   - **Copy the 16-character password** (format: `xxxx xxxx xxxx xxxx`)

4. **Use this App Password in your .env file**
   ```
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=abcd efgh ijkl mnop  ← Use this 16-char password (no spaces)
   ```

## Testing the Email System

### Option 1: Using Postman/cURL

```bash
# Test sending an email
curl -X POST http://localhost:5000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "type": "welcome"
  }'

# Verify email configuration
curl http://localhost:5000/api/test-email/config
```

### Option 2: Using the Browser

Visit: `http://localhost:5000/api/test-email`

### Expected Response

Success:

```json
{
  "success": true,
  "message": "Email sent successfully",
  "messageId": "<abc123@example.com>"
}
```

Error:

```json
{
  "success": false,
  "message": "Failed to send email",
  "error": "Invalid credentials"
}
```

## Common Issues & Solutions

### Error: "Invalid credentials"

- **Solution**: Generate a new App Password from Google Account security settings

### Error: "Less secure app access"

- **Solution**: You're using an old password. Use App Password instead

### Error: "ENOTFOUND - smtp.gmail.com"

- **Solution**: Check your internet connection

### Error: "Connection timed out"

- **Solution**: Port 587 might be blocked by firewall. Try port 465 with secure: true

### Email not arriving

- **Check**: Spam folder
- **Check**: Email address is correct
- **Note**: It may take a few minutes for first emails

## Production (Render) Deployment

For production, set environment variables in Render Dashboard:

1. Go to your Render Service → Environment
2. Add these variables:
   - `EMAIL_USER` = your_gmail@gmail.com
   - `EMAIL_PASS` = your_16_char_app_password
3. Redeploy the service

### Note for Gmail on Production:

- Gmail has sending limits (500/day for free accounts)
- Consider using services like SendGrid,Mailgun for high volume
- The current setup should work for moderate use

## Example Controller Usage

```javascript
const {
  sendEmail,
  getWelcomeEmailTemplate,
  getOTPEmailTemplate,
} = require("../utils/emailService");

// In your controller:
exports.register = async (req, res) => {
  try {
    // ... user creation logic ...

    // Send welcome email
    const welcomeHtml = getWelcomeEmailTemplate(user.name);
    await sendEmail(user.email, "Welcome to Legal Portal", welcomeHtml);

    res.status(201).json({ success: true, user });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
```

## API Routes

| Method | Endpoint                 | Description     | Body                  |
| ------ | ------------------------ | --------------- | --------------------- |
| POST   | `/api/test-email`        | Send test email | `{to, subject, type}` |
| GET    | `/api/test-email/config` | Verify config   | -                     |

## Type Parameter for test-email

- `welcome` - Welcome email template
- `otp` - OTP verification template
- `contact` - Contact support template
- `custom` - Custom HTML (use `subject` field)

---

**Setup complete!** 🎉
