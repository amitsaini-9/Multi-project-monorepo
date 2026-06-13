# Vercel Projects Cleanup

## Removed Projects

The following 6 individual Vercel projects have been **deleted**:

1. ❌ team-availability (prj_8XhpAgKGSyECFsVvZY3fDFUh15lE)
2. ❌ youtube-duration (prj_LpDvj1GccWSZpgWiILHu8aDuLkTY)
3. ❌ tech-stack-detector (prj_sXQFvJHI4Rva2lXQ5XzckjJFbojd)
4. ❌ dns-monitor (prj_nILWyq5tvK5RQFrl3YL82hwMFDeT)
5. ❌ kindle-sender (prj_lIIGzUx4XHeE8hZuceYPYF8jz81r)
6. ❌ booking-widget (prj_K1PQuQM5bnz3IOw3r7ibm0NxVQxX)

**Reason:** Monorepo deployments on Vercel require special configuration that's difficult to automate. All deployments were failing due to workspace package dependencies.

---

## Remaining Project

Only the **main monorepo project** remains:
- **Project:** mini-apps
- **ID:** prj_zCRYbNtphYabbCuyYRNr3eadPWeF
- **Dashboard:** https://vercel.com/amit-sainis-projects-f29e09a4/mini-apps

---

## Next Steps Options

### Option 1: Deploy Apps Manually via CLI

Deploy each app individually using Vercel CLI:

```bash
# Deploy team-availability
cd ~/mini-apps/apps/team-availability
vercel --prod

# Deploy youtube-duration
cd ~/mini-apps/apps/youtube-duration
vercel --prod

# Repeat for other apps...
```

Each CLI deployment will:
- Create a new Vercel project automatically
- Use the correct build context
- Work properly with workspace packages

### Option 2: Use Vercel Turborepo Integration

Configure the monorepo project with Turborepo Remote Cache:
- Enable Turborepo in project settings
- Configure proper paths for each app
- Use Vercel's native monorepo support

### Option 3: Deploy to Alternative Platform

Consider deploying to platforms with better monorepo support:
- **Render** - Native monorepo support
- **Railway** - Good for monorepos
- **Fly.io** - Dockerfile-based deployment
- **Self-hosted** - Full control

---

## Domain Configuration

All domains are still configured on the monorepo project:
- team.sainiamit.com
- yt-duration.sainiamit.com
- techstack.sainiamit.com
- dns.sainiamit.com
- kindle.sainiamit.com
- booking.sainiamit.com

These need to be removed or reconfigured once you decide on deployment strategy.

---

*Cleanup performed: June 13, 2026*
