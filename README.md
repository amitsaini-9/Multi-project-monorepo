# Mini Apps Collection

A monorepo containing 14+ fully functional micro-apps built with Next.js 15, Supabase, and Turborepo.

## 🚀 Apps

### Utilities
- **YouTube Duration Calculator** - Calculate total watch time for playlists
- **QR Code Generator** - Generate QR codes with analytics tracking
- **Screenshot Beautifier** - Add frames and backgrounds to screenshots
- **Tech Stack Detector** - Identify technologies used by websites

### Business Tools
- **Personal CRM** - Contact management for freelancers
- **Team Availability** - Track team member locations (WFH/Office/OOO)
- **Booking Widget** - Embeddable booking system with payments
- **Multi-Currency Budget** - Expense tracking across currencies

### Monitoring
- **DNS Monitor** - Track DNS changes with alerts
- **API Monitor** - Monitor endpoint response times
- **Cookie Auditor** - GDPR/CCPA compliance scanner

### Productivity
- **Send-to-Kindle** - Save articles for e-reader consumption

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma
- **Auth**: Supabase Auth (Google OAuth)
- **Styling**: Tailwind CSS
- **Payments**: Razorpay
- **Monorepo**: Turborepo with pnpm
- **Deployment**: Vercel

## 📦 Project Structure

```
mini-apps/
├── apps/
│   ├── youtube-duration/
│   ├── qr-generator/
│   ├── screenshot-beautifier/
│   ├── team-availability/
│   ├── personal-crm/
│   ├── tech-stack-detector/
│   ├── dns-monitor/
│   ├── budget-tracker/
│   ├── kindle-sender/
│   ├── booking-widget/
│   ├── api-monitor/
│   └── cookie-auditor/
├── packages/
│   ├── database/         # Shared Prisma schema
│   ├── ui/               # Shared components
│   ├── eslint-config/
│   └── typescript-config/
└── supabase/
    └── config.toml       # Supabase configuration
```

## 🏃 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9+
- Supabase account
- YouTube Data API key (for YouTube app)
- Razorpay account (for booking app)

### Installation

```bash
# Clone the repo
git clone https://github.com/amitsaini-9/mini-apps.git
cd mini-apps

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Generate Prisma client
cd packages/database
pnpm db:generate

# Run all apps in dev mode
pnpm dev
```

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database
DATABASE_URL=your_database_url
DIRECT_URL=your_direct_url

# YouTube Data API
YOUTUBE_API_KEY=your_youtube_api_key

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

## 🚀 Development

```bash
# Run all apps
pnpm dev

# Build all apps
pnpm build

# Lint all apps
pnpm lint

# Generate Prisma client
pnpm db:generate

# Push schema changes to database
pnpm db:push
```

## 📝 Individual App Ports

- YouTube Duration: `3001`
- QR Generator: `3002`
- Screenshot Beautifier: `3003`
- Team Availability: `3004`
- Personal CRM: `3005`
- Tech Stack Detector: `3006`
- DNS Monitor: `3007`
- Budget Tracker: `3008`
- Kindle Sender: `3009`
- Booking Widget: `3010`
- API Monitor: `3011`
- Cookie Auditor: `3012`

## 🌐 Live Deployments

All apps are deployed on Vercel with custom subdomains:

- https://yt-duration.sainiamit.com
- https://qr.sainiamit.com
- https://screenshot.sainiamit.com
- https://team.sainiamit.com
- https://crm.sainiamit.com
- https://techstack.sainiamit.com
- https://dns.sainiamit.com
- https://budget.sainiamit.com
- https://kindle.sainiamit.com
- https://booking.sainiamit.com
- https://api-monitor.sainiamit.com
- https://cookie.sainiamit.com

## 🤝 Contributing

Contributions welcome! Each app is self-contained and can be improved independently.

## 📄 License

MIT

## 👤 Author

**Amit Saini**
- Website: [sainiamit.com](https://sainiamit.com)
- GitHub: [@amitsaini-9](https://github.com/amitsaini-9)
# Trigger deployment
