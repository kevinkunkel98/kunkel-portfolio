# Contact Form Setup

## ✅ Netlify Forms (Currently Implemented)

Your contact form is now configured to use **Netlify Forms** - the easiest solution since you're already deploying to Netlify!

### How it works:
1. Form submissions are automatically captured by Netlify
2. You'll receive email notifications for each submission
3. View all submissions in your Netlify dashboard

### Setup Steps:

1. **Deploy to Netlify** (if not already done)
   ```bash
   npm run build
   # Deploy the dist folder to Netlify
   ```

2. **Enable Form Notifications:**
   - Go to your Netlify dashboard
   - Navigate to: Site → Forms → Form notifications
   - Add your email to receive notifications
   - You can also integrate with Slack, webhooks, etc.

3. **View Submissions:**
   - Netlify Dashboard → Forms
   - See all form submissions with timestamps

### Features:
- ✅ No backend code needed
- ✅ Spam protection (honeypot field included)
- ✅ Email notifications
- ✅ Form data stored in Netlify dashboard
- ✅ Free tier: 100 submissions/month

---

## Alternative Options (If Needed)

### Option 2: Formspree
Free service with 50 submissions/month

1. Sign up at https://formspree.io
2. Get your form endpoint
3. Update ContactForm.tsx:
```tsx
const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
});
```

### Option 3: Email.js
Send emails directly from frontend

1. Sign up at https://www.emailjs.com/
2. Get service ID, template ID, and user ID
3. Install: `npm install @emailjs/browser`
4. Update form to use EmailJS SDK

### Option 4: Custom API (Advanced)
Build your own backend with:
- Node.js + Express + Nodemailer
- Serverless functions (Netlify/Vercel)
- Firebase Cloud Functions

---

## Testing Your Form

### Local Testing (Netlify CLI)
```bash
npm install -g netlify-cli
netlify dev
# Form will work at http://localhost:8888
```

### After Deployment
1. Go to your live site
2. Fill out the contact form
3. Submit
4. Check Netlify dashboard → Forms
5. Check your email for notification

---

## Troubleshooting

**Form not showing in Netlify dashboard?**
- Make sure you've deployed the site
- Netlify needs to detect the form on the first deploy
- Check that `data-netlify="true"` is in your form tag

**Not receiving emails?**
- Check spam folder
- Verify email in Netlify form notifications settings
- Test with a different email address

**Submissions not captured?**
- Verify the form has `name="contact"` attribute
- Check hidden input has `name="form-name" value="contact"`
- Make sure you're testing on the deployed site, not localhost (unless using `netlify dev`)

---

## Current Form Configuration

- **Form Name:** `contact`
- **Fields:** name, email, message
- **Spam Protection:** ✅ Honeypot field
- **Validation:** ✅ Required fields
- **Success Message:** ✅ Displayed on submit
- **Error Handling:** ✅ Catches and displays errors

Your form is ready to go! 🚀
