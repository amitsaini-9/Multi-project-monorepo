# @mini-apps/email

Shared email package for all mini-apps. Provides SMTP configuration and pre-built email templates.

## Features

- ✅ Configured SMTP with nodemailer
- ✅ Pre-built email templates for all apps
- ✅ Automatic BCC to admin email for tracking
- ✅ App-specific sender addresses
- ✅ TypeScript support

## Installation

This package is already included in the monorepo workspace.

```bash
# In your app's package.json, add:
{
  "dependencies": {
    "@mini-apps/email": "workspace:*"
  }
}
```

## Usage

### Send a basic email

```typescript
import { sendEmail } from '@mini-apps/email'

await sendEmail({
  to: 'user@example.com',
  subject: 'Welcome!',
  html: '<h1>Welcome to our app</h1>',
  text: 'Welcome to our app',
})
```

### Use pre-built templates

```typescript
import { sendEmail, crmFollowUpReminder } from '@mini-apps/email'

const emailContent = crmFollowUpReminder('John Doe', 'Discuss Q2 proposal')

await sendEmail({
  to: 'user@example.com',
  ...emailContent,
  from: 'crm@sainiamit.com', // Optional: use app-specific sender
})
```

### Available Templates

#### CRM
```typescript
crmFollowUpReminder(contactName: string, notes?: string)
```

#### DNS Monitor
```typescript
dnsChangeAlert(domain: string, recordType: string, oldValues: string[], newValues: string[])
```

#### API Monitor
```typescript
apiDowntimeAlert(apiName: string, url: string, errorMessage?: string)
apiRecoveryAlert(apiName: string, url: string, downtimeDuration: string)
```

#### Booking Widget
```typescript
bookingConfirmation(
  customerName: string,
  serviceName: string,
  dateTime: string,
  duration: number,
  price: string
)
```

#### Team Availability
```typescript
teamStatusNotification(
  memberName: string,
  date: string,
  status: string,
  teamName: string
)
```

#### Budget Tracker
```typescript
budgetMonthlySummary(
  month: string,
  totalSpent: string,
  topCategories: Array<{ category: string; amount: string }>
)
```

#### Kindle Sender
```typescript
articleSentToKindle(title: string, author?: string)
```

## Email Senders

Use app-specific sender addresses from `emailSenders`:

```typescript
import { sendEmail, emailSenders } from '@mini-apps/email'

await sendEmail({
  to: 'user@example.com',
  from: emailSenders.crm, // crm@sainiamit.com
  subject: 'Follow-up reminder',
  html: '...',
})
```

Available senders:
- `emailSenders.crm` - crm@sainiamit.com
- `emailSenders.dnsAlerts` - dns-alerts@sainiamit.com
- `emailSenders.apiAlerts` - api-alerts@sainiamit.com
- `emailSenders.bookings` - bookings@sainiamit.com
- `emailSenders.team` - team@sainiamit.com
- `emailSenders.budget` - budget@sainiamit.com
- `emailSenders.kindle` - kindle@sainiamit.com
- `emailSenders.notifications` - notifications@sainiamit.com
- `emailSenders.support` - support@sainiamit.com
- `emailSenders.admin` - admin@sainiamit.com
- `emailSenders.noreply` - noreply@sainiamit.com

## Automatic BCC

**All emails are automatically BCC'd to `amitsainiwork9@gmail.com` for tracking.**

This ensures you have a copy of every email sent from the platform.

## Environment Variables

Required in `.env`:

```env
# SMTP Configuration
SMTP_HOST=smtp.sainiamit.com
SMTP_PORT=587
SMTP_USER=noreply@sainiamit.com
SMTP_PASS=a8075DBF@1
SMTP_FROM=noreply@sainiamit.com

# Admin tracking
ADMIN_BCC_EMAIL=amitsainiwork9@gmail.com
```

## Verify Connection

Test SMTP connection:

```typescript
import { verifyEmailConnection } from '@mini-apps/email'

const isConnected = await verifyEmailConnection()
console.log('SMTP connected:', isConnected)
```

## Example: API Route

```typescript
// app/api/send-reminder/route.ts
import { sendEmail, crmFollowUpReminder, emailSenders } from '@mini-apps/email'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { contactEmail, contactName, notes } = await request.json()

  const emailContent = crmFollowUpReminder(contactName, notes)

  try {
    await sendEmail({
      to: contactEmail,
      from: emailSenders.crm,
      ...emailContent,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email send failed:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
```

## Credentials

**All email accounts use the same password:** `a8075DBF@1`

Email accounts configured:
- noreply@sainiamit.com
- crm@sainiamit.com
- dns-alerts@sainiamit.com
- api-alerts@sainiamit.com
- bookings@sainiamit.com
- team@sainiamit.com
- budget@sainiamit.com
- kindle@sainiamit.com
- notifications@sainiamit.com
- support@sainiamit.com
- admin@sainiamit.com
- hello@sainiamit.com
