# Deployment Configuration

## Vercel Project

**Project Name:** mini-apps  
**Repository:** https://github.com/amitsaini-9/Multi-project-monorepo  
**Project ID:** prj_zCRYbNtphYabbCuyYRNr3eadPWeF  

---

## Environment Variables

All environment variables are configured as **NON-SENSITIVE** (plaintext/visible) in Vercel:

### Supabase
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Database
- `DATABASE_URL`
- `DIRECT_URL`

### External APIs
- `YOUTUBE_API_KEY`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`

### SMTP Email Configuration
- `SMTP_HOST` = smtp.sainiamit.com
- `SMTP_PORT` = 587
- `SMTP_USER` = noreply@sainiamit.com
- `SMTP_PASS` = a8075DBF@1
- `SMTP_FROM` = noreply@sainiamit.com

### App-Specific Emails
- `CRM_EMAIL` = crm@sainiamit.com
- `DNS_ALERTS_EMAIL` = dns-alerts@sainiamit.com
- `API_ALERTS_EMAIL` = api-alerts@sainiamit.com
- `BOOKINGS_EMAIL` = bookings@sainiamit.com
- `TEAM_EMAIL` = team@sainiamit.com
- `BUDGET_EMAIL` = budget@sainiamit.com
- `KINDLE_EMAIL` = kindle@sainiamit.com
- `NOTIFICATIONS_EMAIL` = notifications@sainiamit.com
- `SUPPORT_EMAIL` = support@sainiamit.com

### Admin
- `ADMIN_BCC_EMAIL` = amitsainiwork9@gmail.com

**Total:** 24 environment variables

---

## Configured Domains

All domains are verified and active:

| # | Domain | App | Status |
|---|--------|-----|--------|
| 1 | api-monitor.sainiamit.com | API Response Time Monitor | ✅ Verified |
| 2 | booking.sainiamit.com | Simple Booking Widget | ✅ Verified |
| 3 | budget.sainiamit.com | Multi-Currency Budget Tracker | ✅ Verified |
| 4 | cookie.sainiamit.com | Cookie Consent Auditor | ✅ Verified |
| 5 | crm.sainiamit.com | Personal CRM for Freelancers | ✅ Verified |
| 6 | dns.sainiamit.com | DNS Change Audit Trail | ✅ Verified |
| 7 | kindle.sainiamit.com | Send-to-Kindle Article Collector | ✅ Verified |
| 8 | screenshot.sainiamit.com | Screenshot Beautifier | ✅ Verified |
| 9 | team.sainiamit.com | Team Availability Dashboard | ✅ Verified |
| 10 | techstack.sainiamit.com | Tech Stack Detector | ✅ Verified |

**Note:** `yt-duration.sainiamit.com` and `qr.sainiamit.com` may be configured on other projects.

---

## DNS Configuration

Domain `sainiamit.com` uses **Vercel Nameservers**:
- ns1.vercel-dns.com
- ns2.vercel-dns.com

All subdomains are automatically resolved via Vercel's DNS.

---

## OAuth Configuration

### Supabase OAuth Redirect URLs

Configured in Supabase project for Google OAuth:

```
https://qr.sainiamit.com/auth/callback
https://team.sainiamit.com/auth/callback
https://crm.sainiamit.com/auth/callback
https://dns.sainiamit.com/auth/callback
https://budget.sainiamit.com/auth/callback
https://kindle.sainiamit.com/auth/callback
https://booking.sainiamit.com/auth/callback
https://api-monitor.sainiamit.com/auth/callback
```

Site URL: `https://sainiamit.com`

---

## Deployment Commands

### Deploy all apps
```bash
cd ~/mini-apps
git push  # Triggers automatic deployment
```

### Deploy specific app
```bash
cd ~/mini-apps
vercel --prod
```

### Check deployment status
```bash
vercel ls
```

### View environment variables
```bash
vercel env ls
```

### Pull environment variables locally
```bash
vercel env pull .env.vercel
```

---

## Managing Domains

### Add a new domain
```bash
# Via API
curl -X POST "https://api.vercel.com/v10/projects/prj_zCRYbNtphYabbCuyYRNr3eadPWeF/domains?teamId=team_nEFtsxilThxrvL4xorscZ7ln" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "newapp.sainiamit.com"}'
```

### List project domains
```bash
vercel domains ls
```

### Remove a domain
```bash
curl -X DELETE "https://api.vercel.com/v9/projects/prj_zCRYbNtphYabbCuyYRNr3eadPWeF/domains/domain-name?teamId=team_nEFtsxilThxrvL4xorscZ7ln" \
  -H "Authorization: Bearer $VERCEL_TOKEN"
```

---

## Email Accounts

All email accounts use password: `a8075DBF@1`

- noreply@sainiamit.com
- admin@sainiamit.com
- support@sainiamit.com
- crm@sainiamit.com
- dns-alerts@sainiamit.com
- api-alerts@sainiamit.com
- bookings@sainiamit.com
- team@sainiamit.com
- budget@sainiamit.com
- kindle@sainiamit.com
- notifications@sainiamit.com
- hello@sainiamit.com

**All emails are automatically BCC'd to:** amitsainiwork9@gmail.com

---

## Dashboard Links

- **Vercel Project:** https://vercel.com/amit-sainis-projects-f29e09a4/mini-apps
- **Supabase Project:** https://supabase.com/dashboard/project/tnrqhzgrprisqzabpbyp
- **GitHub Repository:** https://github.com/amitsaini-9/Multi-project-monorepo

---

*Last Updated: June 13, 2026*
