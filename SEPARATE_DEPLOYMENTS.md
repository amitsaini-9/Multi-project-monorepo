# Separate Vercel Projects Configuration

Each app is deployed as an **independent Vercel project** with its own subdomain.

---

## ✅ Deployed Projects (6 total)

| # | App | Domain | Project URL | Status |
|---|-----|--------|-------------|--------|
| 1 | **team-availability** | team.sainiamit.com | [View](https://vercel.com/amit-sainis-projects-f29e09a4/team-availability) | ✅ Ready |
| 2 | **youtube-duration** | yt-duration.sainiamit.com | [View](https://vercel.com/amit-sainis-projects-f29e09a4/youtube-duration) | ✅ Ready |
| 3 | **tech-stack-detector** | techstack.sainiamit.com | [View](https://vercel.com/amit-sainis-projects-f29e09a4/tech-stack-detector) | ✅ Ready |
| 4 | **dns-monitor** | dns.sainiamit.com | [View](https://vercel.com/amit-sainis-projects-f29e09a4/dns-monitor) | ✅ Ready |
| 5 | **kindle-sender** | kindle.sainiamit.com | [View](https://vercel.com/amit-sainis-projects-f29e09a4/kindle-sender) | ✅ Ready |
| 6 | **booking-widget** | booking.sainiamit.com | [View](https://vercel.com/amit-sainis-projects-f29e09a4/booking-widget) | ✅ Ready |

---

## Project Configuration

### GitHub Integration
- **Repository:** https://github.com/amitsaini-9/Multi-project-monorepo
- **Branch:** main
- **Automatic Deployments:** Enabled (on git push)

### Build Settings (per project)
- **Framework:** Next.js
- **Root Directory:** `apps/{app-name}`
- **Build Command:** `pnpm install && pnpm build`
- **Install Command:** `pnpm install`
- **Output Directory:** `.next`

---

## Environment Variables

All 24 environment variables are configured as **NON-SENSITIVE (plaintext)** in each project:

### Core Variables (5)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- `DIRECT_URL`

### External APIs (4)
- `YOUTUBE_API_KEY`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`

### SMTP Configuration (5)
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`

### App-Specific Emails (9)
- `CRM_EMAIL`
- `DNS_ALERTS_EMAIL`
- `API_ALERTS_EMAIL`
- `BOOKINGS_EMAIL`
- `TEAM_EMAIL`
- `BUDGET_EMAIL`
- `KINDLE_EMAIL`
- `NOTIFICATIONS_EMAIL`
- `SUPPORT_EMAIL`

### Admin (1)
- `ADMIN_BCC_EMAIL`

**Total:** 24 variables per project × 6 projects = 144 environment variable entries

---

## Project IDs

| App | Project ID |
|-----|------------|
| team-availability | `prj_8XhpAgKGSyECFsVvZY3fDFUh15lE` |
| youtube-duration | `prj_LpDvj1GccWSZpgWiILHu8aDuLkTY` |
| tech-stack-detector | `prj_sXQFvJHI4Rva2lXQ5XzckjJFbojd` |
| dns-monitor | `prj_nILWyq5tvK5RQFrl3YL82hwMFDeT` |
| kindle-sender | `prj_lIIGzUx4XHeE8hZuceYPYF8jz81r` |
| booking-widget | `prj_K1PQuQM5bnz3IOw3r7ibm0NxVQxX` |

---

## Deployment Commands

### Deploy a specific app
```bash
cd ~/mini-apps/apps/{app-name}
vercel --prod
```

### Deploy all apps (via git push)
```bash
cd ~/mini-apps
git push  # Triggers automatic deployment for all projects
```

### Check deployment status
```bash
# List all deployments
vercel ls --scope amit-sainis-projects-f29e09a4

# Check specific app
cd ~/mini-apps/apps/team-availability
vercel ls
```

### View logs
```bash
cd ~/mini-apps/apps/{app-name}
vercel logs [deployment-url]
```

---

## Adding New Apps

When new apps are completed by the workflow:

### 1. Create Vercel Project
```bash
# Set variables
APP_NAME="new-app-name"
DOMAIN="subdomain.sainiamit.com"
TEAM_ID="team_nEFtsxilThxrvL4xorscZ7ln"
TOKEN=$(cat ~/.local/share/com.vercel.cli/auth.json | jq -r '.token')

# Create project
curl -X POST "https://api.vercel.com/v9/projects?teamId=$TEAM_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"$APP_NAME\",
    \"framework\": \"nextjs\",
    \"gitRepository\": {
      \"type\": \"github\",
      \"repo\": \"amitsaini-9/Multi-project-monorepo\"
    },
    \"rootDirectory\": \"apps/$APP_NAME\",
    \"buildCommand\": \"pnpm install && pnpm build\",
    \"installCommand\": \"pnpm install\"
  }"
```

### 2. Add Domain
```bash
PROJECT_ID="[from-step-1]"

curl -X POST "https://api.vercel.com/v10/projects/$PROJECT_ID/domains?teamId=$TEAM_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"$DOMAIN\"}"
```

### 3. Add Environment Variables
Use the script at `/tmp/add-all-env-vars.sh` as reference

---

## Benefits of Separate Projects

✅ **Independent Deployments** - Each app deploys separately
✅ **Faster Builds** - Only changed app rebuilds
✅ **Easier Debugging** - Clear, isolated logs per app
✅ **Flexible Scaling** - Different settings per app
✅ **Progressive Rollout** - Deploy apps as they're completed
✅ **Clean Domains** - One domain per project, no routing complexity

---

## Next Steps

1. **Monitor Deployments** - Check Vercel dashboard for build status
2. **Test Each App** - Visit each subdomain once deployed
3. **Add Remaining Apps** - As workflow completes more apps, create their projects
4. **Configure DNS** - DNS is automatic via Vercel (domain already on Vercel nameservers)

---

## Remaining Apps to Deploy

These apps are still being built by the workflow:

- Personal CRM (`crm.sainiamit.com`)
- QR Code Generator (`qr.sainiamit.com`)
- Screenshot Beautifier (`screenshot.sainiamit.com`)
- Multi-Currency Budget Tracker (`budget.sainiamit.com`)
- API Response Time Monitor (`api-monitor.sainiamit.com`)
- Cookie Consent Auditor (`cookie.sainiamit.com`)

Once completed, repeat the project creation process for each.

---

*Last Updated: June 13, 2026*
